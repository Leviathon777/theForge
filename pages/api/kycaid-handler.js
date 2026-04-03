export const config = { runtime: "edge" };

// --- Rate Limiting ---
const rateLimit = new Map();
const WINDOW_MS = 60000;
const MAX_REQUESTS = 5;

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimit.get(ip);
  if (!record || now - record.timestamp > WINDOW_MS) {
    rateLimit.set(ip, { timestamp: now, count: 1 });
    return true;
  }
  if (record.count >= MAX_REQUESTS) return false;
  record.count++;
  return true;
}

// --- Input Validation ---
const FORM_ID_REGEX = /^[a-zA-Z0-9\-]{1,128}$/;
const WALLET_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

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

  // Origin check
  const origin = req.headers.get("origin") || req.headers.get("referer") || "";
  const allowedOrigins = ["medalsofhonor.io", "www.medalsofhonor.io", "localhost:3000", "localhost"];
  const isAllowedOrigin = allowedOrigins.some((allowed) => origin.includes(allowed));
  if (origin && !isAllowedOrigin) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { form_id, external_applicant_id } = body;

  if (!form_id || !FORM_ID_REGEX.test(form_id)) {
    return new Response(JSON.stringify({ error: "Invalid form_id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (!external_applicant_id || !WALLET_ADDRESS_REGEX.test(external_applicant_id)) {
    return new Response(JSON.stringify({ error: "Invalid external_applicant_id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const API_TOKEN = process.env.KYCAID_PRODUCTION_API_KEY;

  try {
    const response = await fetch(`https://api.kycaid.com/forms/${form_id}/urls`, {
      method: "POST",
      headers: {
        Authorization: `Token ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ external_applicant_id }),
    });

    if (!response.ok) {
      console.error("[KYC Handler] KYCAID API error:", response.status);
      return new Response(JSON.stringify({ error: "KYC service error" }), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[KYC Handler] Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
