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

// --- Handler ---
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Rate limiting
  const clientIp = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown";
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ error: "Too many requests" });
  }

  // Origin check
  const origin = req.headers.origin || req.headers.referer || "";
  const allowedOrigins = ["medalsofhonor.io", "www.medalsofhonor.io", "localhost:3000", "localhost"];
  const isAllowedOrigin = allowedOrigins.some(
    (allowed) => origin.includes(allowed)
  );
  if (origin && !isAllowedOrigin) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const API_TOKEN = process.env.KYCAID_PRODUCTION_API_KEY;
  const { form_id, external_applicant_id } = req.body;

  // Input validation
  if (!form_id || !FORM_ID_REGEX.test(form_id)) {
    return res.status(400).json({ error: "Invalid form_id" });
  }
  if (!external_applicant_id || !WALLET_ADDRESS_REGEX.test(external_applicant_id)) {
    return res.status(400).json({ error: "Invalid external_applicant_id" });
  }

  try {
    const response = await fetch(`https://api.kycaid.com/forms/${form_id}/urls`, {
      method: "POST",
      headers: {
        Authorization: `Token ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        external_applicant_id,
      }),
    });

    if (!response.ok) {
      console.error("[KYC Handler] KYCAID API error:", response.status);
      return res.status(response.status).json({ error: "KYC service error" });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("[KYC Handler] Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
