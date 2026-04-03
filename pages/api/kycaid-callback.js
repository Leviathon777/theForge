import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

// --- Inline Supabase client (keeps API route isolated from page bundle) ---
const getServiceSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase env vars not configured");
  return createClient(url, key);
};

// --- Rate Limiting ---
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

setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimit) {
    if (now - record.timestamp > RATE_LIMIT_WINDOW) rateLimit.delete(ip);
  }
}, 5 * 60 * 1000);

// --- Webhook Signature Verification ---
function verifyWebhookSignature(req) {
  const webhookSecret = process.env.KYCAID_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[Security] KYCAID_WEBHOOK_SECRET not configured");
    return false;
  }
  const signature = req.headers["x-kycaid-signature"] || "";
  const payload = JSON.stringify(req.body);
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(payload)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, "utf8"),
      Buffer.from(expectedSignature, "utf8")
    );
  } catch {
    return false;
  }
}

// --- Input Validation ---
const VALID_CALLBACK_TYPES = ["VERIFICATION_STATUS_CHANGED", "VERIFICATION_COMPLETED"];
const WALLET_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

function validateCallbackInput(body) {
  if (!body || typeof body !== "object") return "Invalid request body";
  if (!VALID_CALLBACK_TYPES.includes(body.type)) return "Invalid callback type";
  const externalId = body.external_applicant_id ||
    (body.applicant ? body.applicant.external_applicant_id : null);
  if (externalId && !WALLET_ADDRESS_REGEX.test(externalId)) {
    return "Invalid external_applicant_id format";
  }
  if (!body.applicant_id && !externalId) {
    return "Missing required identifier (applicant_id or external_applicant_id)";
  }
  return null;
}

// --- Inline DB operations ---
async function updateApplicantStatus(walletAddress, updateData) {
  if (!walletAddress) throw new Error("walletAddress cannot be empty.");
  const supabase = getServiceSupabase();
  const mapped = {};
  if (updateData.kyc) {
    if (updateData.kyc.kycStatus !== undefined) mapped.kyc_status = updateData.kyc.kycStatus;
    if (updateData.kyc.kycVerified !== undefined) mapped.kyc_verified = updateData.kyc.kycVerified;
    if (updateData.kyc.kycCompletedAt !== undefined) mapped.kyc_completed_at = updateData.kyc.kycCompletedAt;
    if (updateData.kyc.kycSubmittedAt !== undefined) mapped.kyc_submitted_at = updateData.kyc.kycSubmittedAt;
  }
  mapped.updated_at = new Date().toISOString();
  const { error } = await supabase
    .from("forger_accounts")
    .update(mapped)
    .eq("wallet_address", walletAddress);
  if (error) throw new Error(`Failed to update: ${error.message}`);
}

async function createKYCFolder(externalApplicantId, kycData) {
  if (!externalApplicantId) throw new Error("externalApplicantId required");
  const supabase = getServiceSupabase();
  const { error } = await supabase.from("forger_kyc").upsert({
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
  }, { onConflict: "external_applicant_id" });
  if (error) throw new Error(`Failed to create KYC folder: ${error.message}`);
}

// --- Handler ---
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const clientIp = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown";
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ error: "Too many requests" });
  }

  if (process.env.KYCAID_WEBHOOK_SECRET) {
    if (!verifyWebhookSignature(req)) {
      console.error("[Security] Invalid webhook signature from IP:", clientIp);
      return res.status(401).json({ error: "Unauthorized" });
    }
  } else {
    console.warn("[Security] KYCAID_WEBHOOK_SECRET not set — skipping signature verification.");
  }

  const validationError = validateCallbackInput(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const {
    type, request_id, verification_id, applicant_id, form_id, form_token,
    status, verified, comment, verifications, applicant, external_applicant_id,
    verification_status, verification_statuses, verification_attempts_left,
  } = req.body;

  const resolvedExternalApplicantId =
    external_applicant_id || (applicant ? applicant.external_applicant_id : null);

  try {
    if (type === "VERIFICATION_STATUS_CHANGED") {
      const updateData = {
        kyc: {
          kycStatus: verification_status || "unknown",
          kycSubmittedAt: new Date().toISOString(),
        },
      };
      await updateApplicantStatus(external_applicant_id || applicant_id, updateData);
      return res.status(200).json({ message: "Callback processed successfully." });
    }

    if (type === "VERIFICATION_COMPLETED") {
      const kycData = {
        request_id, type, form_id, form_token, verification_id, applicant_id,
        status, comment, verified, verifications, applicant,
        external_applicant_id: resolvedExternalApplicantId,
        verification_statuses, verification_attempts_left,
      };
      await createKYCFolder(resolvedExternalApplicantId, kycData);
      const updateData = {
        kyc: {
          kycStatus: status,
          kycVerified: verified,
          kycCompletedAt: status === "completed" ? new Date().toISOString() : null,
        },
      };
      await updateApplicantStatus(resolvedExternalApplicantId || applicant_id, updateData);
      return res.status(200).json({ message: "Callback processed successfully." });
    }

    console.warn("[Callback] Unhandled callback type:", type);
    return res.status(400).json({ error: "Unsupported callback type." });
  } catch (error) {
    console.error("[Callback] Error processing callback:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
