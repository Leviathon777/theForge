import { supabase } from "./config";

/************************************************************************************
                   ADD NEW FORGER TO SUPABASE AND QUEUE EMAIL
************************************************************************************/
export const addForger = async (profileData) => {
  const {
    agreed = false,
    dateOfJoin,
    email,
    kyc: { kycStatus, kycCompletedAt, kycSubmittedAt, kycVerified },
    fullName,
    walletAddress,
    phone = null,
    mailingAddress: { streetAddress, apartment, city, state, zipCode },
    territory = null,
    dob = null,
    ukFCAAgreed = null,
    euAgreed = null,
    drip: { dripCount, dripPercent, DateLastLogged, qualifiesForBonus },
  } = profileData;

  if (!walletAddress) throw new Error("walletAddress cannot be empty.");
  if (!email) throw new Error("email cannot be empty.");
  if (!fullName) throw new Error("fullName cannot be empty.");

  // Get the authenticated user's ID for RLS linkage
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to create a profile.");

  // Check wallet uniqueness via RPC (bypasses RLS safely — returns boolean only)
  const { data: walletExists } = await supabase.rpc("check_wallet_exists", { wallet: walletAddress });
  if (walletExists) {
    throw new Error("This wallet address is already registered.");
  }

  // Check email uniqueness via RPC
  const { data: emailExists } = await supabase.rpc("check_email_exists", { check_email: email });
  if (emailExists) {
    throw new Error("This email is already registered.");
  }

  // Insert forger account with auth_user_id for RLS
  const { error: insertError } = await supabase.from("forger_accounts").insert({
    wallet_address: walletAddress,
    auth_user_id: user.id,
    email_verified: true,
    email,
    full_name: fullName,
    phone,
    territory,
    street_address: streetAddress,
    apartment,
    city,
    state,
    zip_code: zipCode,
    dob,
    agreed,
    uk_fca_agreed: ukFCAAgreed,
    eu_agreed: euAgreed,
    date_of_join: dateOfJoin || new Date().toISOString(),
    kyc_status: kycStatus,
    kyc_completed_at: kycCompletedAt,
    kyc_submitted_at: kycSubmittedAt,
    kyc_verified: kycVerified,
    drip_count: dripCount,
    drip_percent: dripPercent,
    date_last_logged: DateLastLogged,
    qualifies_for_bonus: qualifiesForBonus,
    ramps: {},
  });

  if (insertError) {
    console.error("Error adding forger:", insertError.message);
    throw new Error(insertError.message);
  }

  // Queue welcome email
  const emailHTML = buildWelcomeEmailHTML(fullName);
  const { error: emailError } = await supabase.from("forger_emails").insert({
    wallet_address: walletAddress,
    recipients: [email],
    subject: "Welcome to The Forge! Your Journey Begins",
    html_body: emailHTML,
    email_type: "welcome",
  });

  if (emailError) {
    console.error("Error adding email document:", emailError.message);
    throw emailError;
  }
};

/************************************************************************************
                                 UPDATING THE USER
*************************************************************************************/
export const updateForger = async (walletAddress, updateData) => {
  if (!walletAddress) throw new Error("walletAddress cannot be empty.");

  // Check user exists
  const { data: existing } = await supabase
    .from("forger_accounts")
    .select("wallet_address")
    .eq("wallet_address", walletAddress)
    .single();

  if (!existing) {
    throw new Error(`User with wallet address ${walletAddress} not found.`);
  }

  // Map nested Firebase fields to flat Supabase columns
  const mapped = mapUpdateData(updateData);

  const { error } = await supabase
    .from("forger_accounts")
    .update(mapped)
    .eq("wallet_address", walletAddress);

  if (error) {
    console.error("Error updating forger profile:", error.message);
    throw new Error(`Failed to update user profile: ${error.message}`);
  }

  return { success: true, message: "User profile updated successfully." };
};

/************************************************************************************
                        UPDATE KYC STATUS (APPLICANT STATUS)
*************************************************************************************/
export const updateApplicantStatus = async (walletAddress, updateData) => {
  if (!walletAddress) throw new Error("walletAddress cannot be empty.");

  // This runs from API routes (server-side) so use service role to bypass RLS
  const { getServiceSupabase } = require("./config");
  const serviceClient = getServiceSupabase();

  const { data: existing, error: fetchError } = await serviceClient
    .from("forger_accounts")
    .select("*")
    .eq("wallet_address", walletAddress)
    .single();

  if (fetchError || !existing) {
    throw new Error(`Forger with wallet address ${walletAddress} not found.`);
  }

  // Merge KYC fields
  const kycUpdate = {};
  if (updateData.kyc) {
    if (updateData.kyc.kycStatus !== undefined) kycUpdate.kyc_status = updateData.kyc.kycStatus;
    if (updateData.kyc.kycCompletedAt !== undefined) kycUpdate.kyc_completed_at = updateData.kyc.kycCompletedAt;
    if (updateData.kyc.kycSubmittedAt !== undefined) kycUpdate.kyc_submitted_at = updateData.kyc.kycSubmittedAt;
    if (updateData.kyc.kycVerified !== undefined) kycUpdate.kyc_verified = updateData.kyc.kycVerified;
  }

  const { error } = await serviceClient
    .from("forger_accounts")
    .update(kycUpdate)
    .eq("wallet_address", walletAddress);

  if (error) {
    console.error("Error updating KYC fields:", error.message);
    throw new Error(`Failed to update KYC fields: ${error.message}`);
  }

  return { success: true, message: "KYC fields updated successfully." };
};

/************************************************************************************
                        GET USER INFO WHEN WALLET CONNECTS
*************************************************************************************/
export const getForger = async (walletAddress) => {
  try {
    const { data, error } = await supabase
      .from("forger_accounts")
      .select("*")
      .eq("wallet_address", walletAddress)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned, which is a valid "not found"
      console.error("Error retrieving user:", error.message);
      throw error;
    }

    if (!data) return null;

    // Return in the same shape as Firebase for backward compatibility
    return {
      walletAddress: data.wallet_address,
      email: data.email,
      fullName: data.full_name,
      phone: data.phone,
      territory: data.territory,
      mailingAddress: {
        streetAddress: data.street_address,
        apartment: data.apartment,
        city: data.city,
        state: data.state,
        zipCode: data.zip_code,
      },
      dob: data.dob,
      agreed: data.agreed,
      ukFCAAgreed: data.uk_fca_agreed,
      euAgreed: data.eu_agreed,
      dateOfJoin: data.date_of_join,
      kyc: {
        kycStatus: data.kyc_status,
        kycCompletedAt: data.kyc_completed_at,
        kycSubmittedAt: data.kyc_submitted_at,
        kycVerified: data.kyc_verified,
      },
      drip: {
        dripCount: data.drip_count,
        dripPercent: data.drip_percent,
        DateLastLogged: data.date_last_logged,
        qualifiesForBonus: data.qualifies_for_bonus,
      },
      // Include ramps
      ...Object.fromEntries(
        Object.entries(data.ramps || {}).map(([key, val]) => [key, val])
      ),
    };
  } catch (error) {
    console.error("Error retrieving user:", error.message);
    throw error;
  }
};

/************************************************************************************
                  LOGGING MEDAL PURCHASE AND RAMP PROGRESSION
*************************************************************************************/
export const logMedalPurchase = async (
  walletAddress,
  medalType,
  price,
  transactionHash,
  revenuePercent,
  xdripBonusPercent
) => {
  try {
    const { data: userDoc, error: fetchError } = await supabase
      .from("forger_accounts")
      .select("ramps")
      .eq("wallet_address", walletAddress)
      .single();

    if (fetchError && fetchError.code === "PGRST116") {
      // User doesn't exist yet, create with empty ramp
      await supabase.from("forger_accounts").upsert({
        wallet_address: walletAddress,
        email: "pending@setup.com",
        full_name: "Pending",
        ramps: { ramp1: [] },
      });
    }

    // Re-fetch
    const { data: current } = await supabase
      .from("forger_accounts")
      .select("ramps")
      .eq("wallet_address", walletAddress)
      .single();

    const ramps = current?.ramps || {};
    const orderedMedals = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY"];

    // Find last ramp
    let lastRampKey =
      Object.keys(ramps)
        .filter((k) => k.startsWith("ramp"))
        .sort((a, b) => parseInt(a.replace("ramp", "")) - parseInt(b.replace("ramp", "")))
        .pop() || "ramp1";

    let lastRamp = ramps[lastRampKey] || [];

    const existingMedalIndex = lastRamp.findIndex((m) => m.medalType === medalType);

    if (existingMedalIndex !== -1 || lastRamp.length >= orderedMedals.length) {
      const nextRampNumber = parseInt(lastRampKey.replace("ramp", ""), 10) + 1;
      lastRampKey = `ramp${nextRampNumber}`;
      lastRamp = ramps[lastRampKey] || [];
    }

    const purchaseData = {
      medalType,
      price,
      transactionHash,
      revenuePercent,
      xdripBonusPercent,
      timestamp: new Date().toISOString(),
    };

    lastRamp.push(purchaseData);
    lastRamp.sort(
      (a, b) => orderedMedals.indexOf(a.medalType) - orderedMedals.indexOf(b.medalType)
    );

    ramps[lastRampKey] = lastRamp;

    const { error } = await supabase
      .from("forger_accounts")
      .update({ ramps })
      .eq("wallet_address", walletAddress);

    if (error) throw error;

    console.log(`Logged purchase to ${lastRampKey}:`, purchaseData);
  } catch (error) {
    console.error("Error logging purchase:", error.message);
    throw error;
  }
};

/************************************************************************************
                          SEND RECEIPT EMAIL TO THE FORGER
*************************************************************************************/
export const sendReceiptEmail = async (
  address,
  email,
  fullName,
  medalType,
  price,
  transactionHash
) => {
  const transactionNumber = `X-${transactionHash.slice(0, 6)}-${transactionHash.slice(-6)}`;
  const emailHTML = buildReceiptEmailHTML(fullName, medalType, price, transactionNumber, transactionHash);

  try {
    const { error } = await supabase.from("forger_emails").insert({
      wallet_address: address,
      recipients: [email],
      subject: "XDRIP Digital Management RECEIPT",
      text_body: `Hi ${fullName}, \n\nCongratulations on forging your ${medalType} Medal of Honor. Here are the details: \n\nMedal Type: ${medalType} \nPrice: ${price} BNB\n\nThank you for your continued support!\n\nThe Forge Team`,
      html_body: emailHTML,
      email_type: "receipt",
    });

    if (error) throw error;
    console.log("Receipt email document successfully created for:", address);
  } catch (error) {
    console.error("Error sending receipt email:", error.message);
    throw error;
  }
};

/************************************************************************************
                          EMAIL FROM FORGER TO US
*************************************************************************************/
export const sendContactUsEmail = async (senderEmail, message, address, name) => {
  address = address || "123456789123456789123456789123456789123456";

  try {
    const { error } = await supabase.from("forger_emails").insert({
      wallet_address: address,
      recipients: ["contact@moh.xdrip.io"],
      subject: "New Contact Us Submission",
      text_body: `You have received a new message from: ${senderEmail}\n\nMessage:\n${message}`,
      html_body: buildContactUsEmailHTML(senderEmail, message, name),
      email_type: "contact",
    });

    if (error) throw error;
    console.log("Contact Us email document successfully added.");
  } catch (error) {
    console.error("Error sending Contact Us email:", error.message);
    throw error;
  }
};

/************************************************************************************
                  TRACKING TRANSACTIONS FOR FULL LOGGING
*************************************************************************************/
export const trackDetailedTransaction = async (address, medalType, transactionData) => {
  const {
    transactionHash,
    status,
    blockNumber,
    timestamp,
    action,
    from,
    to,
    valueBNB,
    gasUsed,
  } = transactionData;

  const transactionNumber = `X-${transactionHash.slice(0, 6)}-${transactionHash.slice(-6)}`;

  try {
    const { error } = await supabase.from("transactions").insert({
      wallet_address: address.toLowerCase(),
      transaction_number: transactionNumber,
      purchaser: address,
      purchased_medal: medalType,
      transaction_hash: transactionHash,
      status,
      block_number: blockNumber?.toString(),
      timestamp,
      action,
      from_address: from,
      to_address: to,
      value_bnb: valueBNB,
      gas_used: gasUsed?.toString(),
    });

    if (error) throw error;
  } catch (error) {
    console.error("Error tracking transaction:", error.message);
    throw error;
  }
};

/************************************************************************************
                  KYC FOR FULL LOGGING
*************************************************************************************/
const sanitizeData = (data) => {
  if (typeof data !== "object" || data === null) return data;
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      value === undefined || value === null ? "" : sanitizeData(value),
    ])
  );
};

export const createKYCFolder = async (external_applicant_id, kycData) => {
  // Server-side only — uses service role to bypass RLS on forger_kyc
  const { getServiceSupabase } = require("./config");
  const serviceClient = getServiceSupabase();

  const sanitizedKYCData = sanitizeData({
    ...kycData,
    external_applicant_id,
    timestamp: new Date().toISOString(),
  });

  try {
    const { error } = await serviceClient.from("forger_kyc").upsert({
      external_applicant_id,
      request_id: sanitizedKYCData.request_id || "",
      type: sanitizedKYCData.type || "",
      form_id: sanitizedKYCData.form_id || "",
      form_token: sanitizedKYCData.form_token || "",
      verification_id: sanitizedKYCData.verification_id || "",
      applicant_id: sanitizedKYCData.applicant_id || "",
      verification_status: sanitizedKYCData.verification_status || "",
      verification_attempts_left: sanitizedKYCData.verification_attempts_left || 0,
      raw_data: sanitizedKYCData,
    });

    if (error) throw error;
    console.log("[Supabase] KYC data logged successfully:", external_applicant_id);
  } catch (error) {
    console.error("[Supabase] Error logging KYC data:", error.message);
    throw error;
  }
};

/************************************************************************************
                OWNER FUNCTION FINDING TRANSACTIONS FOR FULL LOGGING
*************************************************************************************/
export const findTransaction = async ({ tokenId, transactionHash, purchasedMedal }) => {
  try {
    let query = supabase.from("transactions").select("*");

    if (transactionHash) {
      query = query.eq("transaction_hash", transactionHash);
    } else if (tokenId) {
      // tokenId search across raw data
      query = query.ilike("transaction_number", `%${tokenId}%`);
    } else if (purchasedMedal) {
      query = query.eq("purchased_medal", purchasedMedal);
    } else {
      throw new Error("Please provide either tokenId, transactionHash, or purchasedMedal to search.");
    }

    const { data, error } = await query;

    if (error) throw error;
    if (!data || data.length === 0) return null;
    return data;
  } catch (error) {
    console.error("Error finding transaction:", error.message);
    throw error;
  }
};

/************************************************************************************
                              HELPER: Map update data
*************************************************************************************/
function mapUpdateData(updateData) {
  const mapped = {};
  if (updateData.email !== undefined) mapped.email = updateData.email;
  if (updateData.fullName !== undefined) mapped.full_name = updateData.fullName;
  if (updateData.phone !== undefined) mapped.phone = updateData.phone;
  if (updateData.territory !== undefined) mapped.territory = updateData.territory;
  if (updateData.dob !== undefined) mapped.dob = updateData.dob;
  if (updateData.agreed !== undefined) mapped.agreed = updateData.agreed;
  if (updateData.ukFCAAgreed !== undefined) mapped.uk_fca_agreed = updateData.ukFCAAgreed;
  if (updateData.euAgreed !== undefined) mapped.eu_agreed = updateData.euAgreed;

  if (updateData.mailingAddress) {
    const ma = updateData.mailingAddress;
    if (ma.streetAddress !== undefined) mapped.street_address = ma.streetAddress;
    if (ma.apartment !== undefined) mapped.apartment = ma.apartment;
    if (ma.city !== undefined) mapped.city = ma.city;
    if (ma.state !== undefined) mapped.state = ma.state;
    if (ma.zipCode !== undefined) mapped.zip_code = ma.zipCode;
  }

  if (updateData.kyc) {
    const kyc = updateData.kyc;
    if (kyc.kycStatus !== undefined) mapped.kyc_status = kyc.kycStatus;
    if (kyc.kycCompletedAt !== undefined) mapped.kyc_completed_at = kyc.kycCompletedAt;
    if (kyc.kycSubmittedAt !== undefined) mapped.kyc_submitted_at = kyc.kycSubmittedAt;
    if (kyc.kycVerified !== undefined) mapped.kyc_verified = kyc.kycVerified;
  }

  if (updateData.drip) {
    const drip = updateData.drip;
    if (drip.dripCount !== undefined) mapped.drip_count = drip.dripCount;
    if (drip.dripPercent !== undefined) mapped.drip_percent = drip.dripPercent;
    if (drip.DateLastLogged !== undefined) mapped.date_last_logged = drip.DateLastLogged;
    if (drip.qualifiesForBonus !== undefined) mapped.qualifies_for_bonus = drip.qualifiesForBonus;
  }

  return mapped;
}

/************************************************************************************
                    EMAIL TEMPLATES (moved inline for portability)
*************************************************************************************/
function buildWelcomeEmailHTML(fullName) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>body{font-family:Arial,sans-serif;margin:0;padding:0;background:#0a0a0a;color:#fff}
.container{max-width:600px;margin:0 auto;background:#000;padding:2rem}
.logo{text-align:center;margin-bottom:1rem}
.logo img{width:450px;max-width:100%}
h1{text-align:center;font-size:2rem}
.subtitle{text-align:center;font-size:1rem;color:#ccc}
.content{padding:20px;text-align:center;line-height:1.6}
.cta{display:inline-block;background:#170cce;color:#fff;padding:10px 24px;border-radius:5px;text-decoration:none;margin:1.5rem 0}
.section{background:#333;border-radius:8px;padding:1rem;margin:1rem 0}
.footer{text-align:center;padding:20px;font-size:12px;color:#888}
.footer a{color:#27ae60}</style></head>
<body>
<div class="container">
  <div class="logo"><a href="https://medalsofhonor.io"><img src="https://files.elfsightcdn.com/eafe4a4d-3436-495d-b748-5bdce62d911d/3f1b449b-f38b-42d4-bd7c-2d46bcf846b8/MetalsOfHonor.webp" alt="Logo"></a></div>
  <h1>Welcome to <strong>The Forge</strong></h1>
  <p class="subtitle">"Leading the Way with Innovative Investments"</p>
  <div class="content">
    <h2>Hi ${fullName},</h2>
    <p>We're thrilled to welcome you to <strong>The Forge</strong> &ndash; your gateway to the exciting world of DeFi investing.</p>
    <p>Now that your investors account has been created, feel free to sign in and continue your investing journey.</p>
    <a class="cta" href="https://medalsofhonor.io">Head Back To The Forge</a>
  </div>
  <div class="footer">&copy; 2025 XDRIP Digital Management LLC. All rights reserved.<br>Visit us at <a href="https://medalsofhonor.io">medalsofhonor.io</a></div>
</div>
</body></html>`;
}

function buildReceiptEmailHTML(fullName, medalType, price, transactionNumber, transactionHash) {
  const medalImages = {
    COMMON: "https://xdrip.io/wp-content/uploads/2025/01/Common_MOH_transparent.webp",
    UNCOMMON: "https://xdrip.io/wp-content/uploads/2025/01/Uncommon_MOH_transparent.webp",
    RARE: "https://xdrip.io/wp-content/uploads/2025/01/Rare_MOH_transparent.webp",
    EPIC: "https://xdrip.io/wp-content/uploads/2025/01/Epic_MOH_transparent.webp",
    LEGENDARY: "https://xdrip.io/wp-content/uploads/2025/01/Legendary_MOH_transparent.webp",
    ETERNAL: "https://xdrip.io/wp-content/uploads/2025/01/Eternal_MOH_transparent.webp",
  };
  const medalImageURL = medalImages[medalType] || medalImages.COMMON;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>body{font-family:Arial,sans-serif;margin:0;padding:0;background:#0a0a0a;color:#fff}
.container{max-width:600px;margin:0 auto;background:#000;padding:2rem}
.logo{text-align:center;margin-bottom:1rem}
.logo img{width:450px;max-width:100%}
h1{text-align:center}
.content{padding:20px;text-align:center;line-height:1.6}
table.receipt{width:100%;border-collapse:collapse;margin-top:20px}
table.receipt td{padding:10px;border:1px solid #333}
table.receipt td:first-child{font-weight:bold;background:#111}
.footer{text-align:center;padding:20px;font-size:12px;color:#888}
.footer a{color:#27ae60}</style></head>
<body>
<div class="container">
  <div class="logo"><a href="https://medalsofhonor.io"><img src="${medalImageURL}" alt="${medalType}" style="width:450px;max-width:100%"></a></div>
  <h1>CONGRATULATIONS</h1>
  <h1>And Thank You</h1>
  <p style="text-align:center;color:#ccc">"Your Support Is Greatly Appreciated, And Your Trust Is Valued"</p>
  <div class="content">
    <h2>Hi ${fullName},</h2>
    <p>Below is a receipt for your <strong>${medalType}</strong> Medal of Honor.</p>
    <table class="receipt">
      <tr><td>Medal Type:</td><td>${medalType}</td></tr>
      <tr><td>Price:</td><td>${price} BNB</td></tr>
      <tr><td>Transaction Number:</td><td>${transactionNumber}</td></tr>
      <tr><td>Blockchain Link:</td><td><a href="https://bscscan.com/tx/${transactionHash}" style="color:#27ae60" target="_blank">View Transaction</a></td></tr>
    </table>
  </div>
  <div class="footer">&copy; 2025 XDRIP Digital Management LLC. All rights reserved.<br>Visit us at <a href="https://medalsofhonor.io">medalsofhonor.io</a></div>
</div>
</body></html>`;
}

function buildContactUsEmailHTML(senderEmail, message, name) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><style>body{font-family:Arial,sans-serif;background:#f4f4f4;color:#333;margin:0;padding:0}.container{max-width:600px;margin:20px auto;padding:20px;background:#fff;border-radius:8px;box-shadow:0 4px 6px rgba(0,0,0,0.1)}h1{font-size:24px;color:#007bff}p{font-size:16px;line-height:1.6}</style></head>
<body><div class="container">
  <h1>New Contact Us Message</h1>
  <p><strong>From:</strong> ${name}</p>
  <p><strong>Email:</strong> ${senderEmail}</p>
  <p><strong>Message:</strong></p>
  <p>${message}</p>
</div></body></html>`;
}
