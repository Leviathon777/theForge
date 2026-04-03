export const config = { runtime: "edge" };

// --- Rate Limiting (in-memory, per-isolate) ---
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 60000;
const MAX_REQUESTS = 10;

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimit.get(ip);
  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimit.set(ip, { timestamp: now, count: 1 });
    return true;
  }
  if (record.count >= MAX_REQUESTS) return false;
  record.count++;
  return true;
}

// --- Webhook Signature Verification (Web Crypto API) ---
async function verifyWebhookSignature(body, signatureHeader, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const expected = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  // Constant-time comparison
  if (expected.length !== signatureHeader.length) return false;
  let result = 0;
  for (let i = 0; i < expected.length; i++) {
    result |= expected.charCodeAt(i) ^ signatureHeader.charCodeAt(i);
  }
  return result === 0;
}

// --- Input Validation ---
const VALID_CALLBACK_TYPES = ["VERIFICATION_STATUS_CHANGED", "VERIFICATION_COMPLETED"];
const WALLET_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

function validateCallbackInput(body) {
  if (!body || typeof body !== "object") return "Invalid request body";
  if (!VALID_CALLBACK_TYPES.includes(body.type)) return "Invalid callback type";
  const externalId =
    body.external_applicant_id ||
    (body.applicant ? body.applicant.external_applicant_id : null);
  if (externalId && !WALLET_ADDRESS_REGEX.test(externalId)) {
    return "Invalid external_applicant_id format";
  }
  if (!body.applicant_id && !externalId) {
    return "Missing required identifier";
  }
  return null;
}

// --- Supabase helper (inline, no shared imports) ---
async function supabaseRequest(path, method, body) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const res = await fetch(`${url}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: method === "POST" ? "resolution=merge-duplicates" : undefined,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase ${method} ${path} failed: ${err}`);
  }
  return res;
}

async function updateApplicantStatus(walletAddress, updateData) {
  const mapped = { updated_at: new Date().toISOString() };
  if (updateData.kyc) {
    if (updateData.kyc.kycStatus !== undefined) mapped.kyc_status = updateData.kyc.kycStatus;
    if (updateData.kyc.kycVerified !== undefined) mapped.kyc_verified = updateData.kyc.kycVerified;
    if (updateData.kyc.kycCompletedAt !== undefined) mapped.kyc_completed_at = updateData.kyc.kycCompletedAt;
    if (updateData.kyc.kycSubmittedAt !== undefined) mapped.kyc_submitted_at = updateData.kyc.kycSubmittedAt;
  }
  await supabaseRequest(
    `forger_accounts?wallet_address=eq.${walletAddress}`,
    "PATCH",
    mapped
  );
}

async function createKYCFolder(externalApplicantId, kycData) {
  await supabaseRequest("forger_kyc", "POST", {
    external_applicant_id: externalApplicantId,
    request_id: kycData.request_id,
    type: kycData.type,
    form_id: kycData.form_id,
    form_token: kycData.form_token,
    verification_id: kycData.verification_id,
    applicant_id: kycData.applicant_id,
    verification_status: kycData.verification_status || kycData.status,
    verification_attempts_left: kycData.verification_attempts_left,
    raw_data: kycData,
    timestamp: new Date().toISOString(),
  });
}

// --- Edge Handler ---
export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const clientIp = req.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(clientIp)) {
    return new Response(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }

  const rawBody = await req.text();
  let body;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Webhook signature verification
  const webhookSecret = process.env.KYCAID_WEBHOOK_SECRET;
  if (webhookSecret) {
    const signature = req.headers.get("x-kycaid-signature") || "";
    const valid = await verifyWebhookSignature(rawBody, signature, webhookSecret);
    if (!valid) {
      console.error("[Security] Invalid webhook signature from IP:", clientIp);
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  } else {
    console.warn("[Security] KYCAID_WEBHOOK_SECRET not set — skipping verification.");
  }

  const validationError = validateCallbackInput(body);
  if (validationError) {
    return new Response(JSON.stringify({ error: validationError }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const {
    type, request_id, verification_id, applicant_id, form_id, form_token,
    status, verified, comment, verifications, applicant, external_applicant_id,
    verification_status, verification_statuses, verification_attempts_left,
  } = body;

  const resolvedExternalApplicantId =
    external_applicant_id || (applicant ? applicant.external_applicant_id : null);

  try {
    if (type === "VERIFICATION_STATUS_CHANGED") {
      await updateApplicantStatus(external_applicant_id || applicant_id, {
        kyc: { kycStatus: verification_status || "unknown", kycSubmittedAt: new Date().toISOString() },
      });
      return new Response(JSON.stringify({ message: "Callback processed successfully." }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (type === "VERIFICATION_COMPLETED") {
      const kycData = {
        request_id, type, form_id, form_token, verification_id, applicant_id,
        status, comment, verified, verifications, applicant,
        external_applicant_id: resolvedExternalApplicantId,
        verification_statuses, verification_attempts_left,
      };
      await createKYCFolder(resolvedExternalApplicantId, kycData);
      await updateApplicantStatus(resolvedExternalApplicantId || applicant_id, {
        kyc: {
          kycStatus: status,
          kycVerified: verified,
          kycCompletedAt: status === "completed" ? new Date().toISOString() : null,
        },
      });
      return new Response(JSON.stringify({ message: "Callback processed successfully." }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unsupported callback type." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[Callback] Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
