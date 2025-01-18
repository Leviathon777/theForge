import { getFirestore, collection, query, where, addDoc, getDocs, getDoc, deleteDoc, doc, updateDoc, setDoc, } from "firebase/firestore";
import { arrayUnion } from 'firebase/firestore';
import { firestore, db } from "./config";

import path from 'path';

/************************************************************************************
                   ADD NEW FORGER TO FIREBASE AND SEND EMAIL
************************************************************************************/
export const addForger = async (profileData) => {
  const {
    agreed = false,
    dateOfJoin,
    email,
    kyc: {
      kycStatus,
      kycCompletedAt,
      kycSubmittedAt,
      kycVerified,
    },
    fullName,
    walletAddress,
    phone = null,
    mailingAddress: {
      streetAddress,
      apartment,
      city,
      state,
      zipCode
    },
    territory = null,
    dob = null,
    ukFCAAgreed = null,
    drip: { dripCount, dripPercent,  DateLastLogged, qualifiesForBonus},
  } = profileData;
  const firestore = getFirestore();
  const forgerRef = collection(firestore, "forgerAccount");
  const mailRef = collection(firestore, "forgerEmails");
  if (!walletAddress) {
    throw new Error("walletAddress cannot be empty.");
  }
  if (!email) {
    throw new Error("email cannot be empty.");
  }
  if (!fullName) {
    throw new Error("fullName cannot be empty.");
  }
  try {
    const walletQuery = query(forgerRef, where("walletAddress", "==", walletAddress));
    const walletSnapshot = await getDocs(walletQuery);
    if (!walletSnapshot.empty) {
      throw new Error("This wallet address is already registered.");
    }
    const emailQuery = query(forgerRef, where("email", "==", email));
    const emailDocRef = doc(mailRef, walletAddress);
    const emailSnapshot = await getDocs(emailQuery);
    if (!emailSnapshot.empty) {
      throw new Error("This email is already registered.");
    }
    const forgerDocData = {
      walletAddress,
      email,
      fullName,
      phone,
      territory,
      mailingAddress: {
        streetAddress,
        apartment,
        city,
        state,
        zipCode,
      },
      dob,
      agreed,
      ukFCAAgreed,
      dateOfJoin: dateOfJoin || new Date().toISOString(),
      kyc: {
        kycStatus,
        kycCompletedAt,
        kycSubmittedAt,
        kycVerified,
      },
      drip: {
        dripCount,
        dripPercent,
        DateLastLogged,
        qualifiesForBonus,
      },
    };
    await setDoc(doc(forgerRef, walletAddress), forgerDocData);
    const emailHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
:root {
  --font-size-base: 18px;
  --font-size-small: 14px;
  --font-size-medium: 16px;
  --font-size-large: 28px;
  --font-size-extra-large: 42px;
}
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background: rgb(43, 40, 40);
  font-size: var(--font-size-base);
}
.email-body {
  background: rgb(0, 0, 0);
}
.email-outer-table {
  width: 100%;
}
.email-inner-table {
  background-color: #000000;
  padding: 2rem;
}
.email-logo-image {
  width: 450px;
}
.email-title-container {
  color: #fbf8f9;
  padding: 20px;
}
.email-title {
  font-size: var(--font-size-extra-large);
  color: #fbf8f9;
}
.email-subtitle {
  font-size: var(--font-size-medium);
  color: #fbf8f9;
}
.email-heading {
  font-size: var(--font-size-large);
  color: #ffffff;
}
.email-paragraph {
  font-size: var(--font-size-base);
   color: #e8e6e3;
  line-height: 1.6;
}
.email-cta-link {
  background-image: linear-gradient(145deg, rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0.5));
  color: #e8e6e3;
  padding: 5px 20px;
  border-radius: 5px;
  display: inline-block;
  text-decoration: none;
  font-size: var(--font-size-medium);
  margin: 2.5rem;
}
.email-image-row {
 margin: 2.5rem;
}
.email-image-container {
 margin: 2.5rem;
}
.email-quickstart-title {
  font-size: 35px;
  color: #f8f6f7;
}
.email-quickstart-image {
  width: 600px;
  border-radius: 10px;
}
.email-section {
padding: 1rem; 
margin: 1rem;
background-color: #333333; 
border-radius: 8px;   
}
.email-section-table {
  width: 100%;
}
.email-section-icon-container {
  width: 90px;
  text-align: center;
}
.email-section-icon-image {
  width: 90px;
}
.email-section-heading {
  font-size: 25px;
  color: #ffffff;
  margin-bottom: 10px;
}
.email-section-paragraph {
  font-size: var(--font-size-base);
  margin-top: 10px;
  color: #ffffff;
}
.email-follow-container {
  color: #ffffff;
  padding: 20px;
}
.email-follow-title {
  font-size: var(--font-size-large);
}
.email-follow-image {
  height: 24px;
  margin: 0 5px;
}
.email-footer {
  text-align: center;
  background:rgb(0, 0, 0);
  color: #ffffff;
  padding: 20px;
  font-size: var(--font-size-small);
}
.email-footer-link {
  color: #27ae60;
  text-decoration: none;
}
@media only screen and (max-width: 600px) {
  :root {
    --font-size-base: 14px;
    --font-size-small: 12px;
    --font-size-medium: 16px;
    --font-size-large: 18px;
    --font-size-extra-large: 22px;
  }
  body {
    font-size: var(--font-size-base);
  }
  .content {
    padding: 10px;
  }
  .section {
    padding: 20px;
  }
}
</style>
    </head>
<body class="email-body">
<table class="email-outer-table" align="center" cellpadding="0" cellspacing="0" width="100%">
  <tr class="email-row">
    <td class="email-container" align="center">
      <table class="email-inner-table" bgcolor="#000000" align="center" cellpadding="0" cellspacing="0" width="600" style="padding: 2rem;">
        <tr class="email-logo-row">
          <td class="email-logo-container" align="center">
            <a class="email-logo-link" target="_blank" href="https://www.moh.xdrip.io">
              <img class="email-logo-image" src="https://files.elfsightcdn.com/eafe4a4d-3436-495d-b748-5bdce62d911d/3f1b449b-f38b-42d4-bd7c-2d46bcf846b8/MetalsOfHonor.webp" alt="Logo" title="Logo" width="450">
            </a>
          </td>
        </tr>
        <tr class="email-title-row">
          <td class="email-title-container" align="center" style="color: #fbf8f9; padding: 20px;">
            <h1 class="email-title">Welcome to <strong>The Forge</strong></h1>
            <p class="email-subtitle">"Leading the Way with Innovative Investments"</p>
          </td>
        </tr>
        <tr class="email-content-row">
          <td class="email-content-container" align="center" style="padding: 20px; color: #e9dadf;">
            <h2 class="email-heading">Hi ${fullName},</h2>
            <p class="email-paragraph">We're thrilled to welcome you to <strong>The Forge</strong> &ndash; your gateway to the exciting world of DeFi investing.</p>
            <p class="email-paragraph">Now that your investors account has been created, feel free to sign in to your account and continue your investing journey. Or, dig deeper into the world of XDRIP Digital Management with the links and images below.</p>
            <a class="email-cta-link" href="https://moh.xdrip.io" style="background-color: #170cce; color: #e8e6e3; padding: 5px 20px; border-radius: 5px; display: inline-block;">Head Back To The Forge</a>
          </td>
        </tr>
        <tr class="email-image-row" >
          <td class="email-image-container" align="center">
            <h1 class="email-quickstart-title">For A Quick Start</h1>
            <a class="email-quickstart-link" target="_blank" href="https://moh.xdrip.io">
    <img class="email-quickstart-image" 
         src="https://xdrip.io/wp-content/uploads/2024/12/TheForge_noredirect-4.webp" 
         alt="" 
         width="600" 
         style="margin-top: 1rem; margin-bottom: 4rem; border-radius: 10px;">
  </a>
          </td>
        </tr>
<tr  style="margin-top: 2rem; margin-bottom: 2rem;">
<td class="email-section" align="center" style="margin-top: 2rem; margin-bottom: 2rem; padding: 1rem; background-color: #333333; border-radius: 8px;">
  <table class="email-section-table" width="100%">
              <tr class="email-section-content-row">
                <td class="email-section-icon-container" width="90" align="center">
                  <a class="email-section-icon-link" target="_blank" href="https://moh.xdrip.io">
                    <img class="email-section-icon-image" src="https://fpdtaan.stripocdn.email/content/guids/CABINET_6306d45fd9ea3b681ebe3a603101f0275312c7c136d6957f7ed43fa4b22490f7/images/discussion.png" alt="" width="90">
                  </a>
                </td>
                <td class="email-section-text-container">
                  <h2 class="email-section-heading" style="margin-left: 3rem;">Peice Of Mind</h2>
                  <p class="email-section-paragraph" class="email-section-paragraph" style="margin-left: 3rem;">Tools to manage and track your investments efficiently.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
<tr class="spacer-row">
<td style="height: 16px; line-height: 16px; font-size: 0;">&nbsp;</td>
</tr>
<tr style="margin-top: 2rem; margin-bottom: 2rem;">
<td class="email-section" align="center" style="margin-top: 2rem; margin-bottom: 2rem; padding: 1rem; background-color: #333333; border-radius: 8px;">
  <table class="email-section-table" width="100%">
    <tr class="email-section-content-row">
      <td class="email-section-icon-container" width="90" align="center">
        <a class="email-section-icon-link" target="_blank" href="https://moh.xdrip.io">
          <img class="email-section-icon-image" src="https://fpdtaan.stripocdn.email/content/guids/CABINET_6306d45fd9ea3b681ebe3a603101f0275312c7c136d6957f7ed43fa4b22490f7/images/videoplayer.png" alt="" width="90">
        </a>
      </td>
      <td class="email-section-text-container">
        <h2 class="email-section-heading" style="margin-left: 3rem;">Tokenization Insights</h2>
        <p class="email-section-paragraph" style="margin-left: 3rem;">Expert insights into the DeFi ecosystem.</p>
      </td>
    </tr>
  </table>
</td>
</tr>
<tr class="spacer-row">
<td style="height: 16px; line-height: 16px; font-size: 0;">&nbsp;</td>
</tr>
<tr style="margin-top: 2rem; margin-bottom: 2rem;">
<td class="email-section" align="center" style="margin-top: 2rem; margin-bottom: 2rem; padding: 1rem; background-color: #333333; border-radius: 8px;">
  <table class="email-section-table" width="100%">
    <tr class="email-section-content-row">
      <td class="email-section-icon-container" width="90" align="center">
        <a class="email-section-icon-link" target="_blank" href="https://moh.xdrip.io">
          <img class="email-section-icon-image" src="https://fpdtaan.stripocdn.email/content/guids/CABINET_6306d45fd9ea3b681ebe3a603101f0275312c7c136d6957f7ed43fa4b22490f7/images/help.png" alt="" width="90">
        </a>
      </td>
      <td class="email-section-text-container" >
        <h2 class="email-section-heading" style="margin-left: 3rem;">Help & Support</h2>
        <p class="email-section-paragraph" style="margin-left: 3rem;">A community of like-minded individuals striving for financial freedom.</p>
      </td>
    </tr>
  </table>
</td>
</tr>
<tr class="spacer-row">
<td style="height: 16px; line-height: 16px; font-size: 0;">&nbsp;</td>
</tr>
<tr class="email-follow-row">
<td class="email-follow-container" align="center" style="color: #ffffff; padding: 20px;">
  <h2 class="email-follow-title" style="margin-bottom: 10px; font-size: 20px;">Follow us!</h2>
  <table align="center" style="margin: 0 auto;">
    <tr>
      <td style="padding: 0 5px;">
        <a class="email-follow-link" href="https://x.com/XDRIP">
          <img class="email-follow-image" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/X_logo_2023_%28white%29.png/240px-X_logo_2023_%28white%29.png" alt="X" height="24" style="display: block;">
        </a>
      </td>
      <td style="padding: 0 5px;">
        <a class="email-follow-link" href="https://www.instagram.com/thexdripofficial/">
          <img class="email-follow-image" src="https://fpdtaan.stripocdn.email/content/assets/img/social-icons/logo-colored/instagram-logo-colored.png" alt="Instagram" height="24" style="display: block;">
        </a>
      </td>
      <td style="padding: 0 5px;">
        <a class="email-follow-link" href="https://www.facebook.com/TheXdripOfficial/">
          <img class="email-follow-image" src="https://fpdtaan.stripocdn.email/content/assets/img/social-icons/logo-colored/facebook-logo-colored.png" alt="Facebook" height="24" style="display: block;">
        </a>
      </td>
      <td style="padding: 0 5px;">
        <a class="email-follow-link" href="https://www.youtube.com/channel/UCql_clMpK5GYxXUREIGfnRw">
          <img class="email-follow-image" src="https://fpdtaan.stripocdn.email/content/assets/img/social-icons/logo-colored/youtube-logo-colored.png" alt="YouTube" height="24" style="display: block;">
        </a>
      </td>
      <td style="padding: 0 5px;">
        <a class="email-follow-link" href="mailto:contact@moh.xdrip.io">
          <img class="email-follow-image" src="https://fpdtaan.stripocdn.email/content/assets/img/other-icons/logo-colored/mail-logo-colored.png" alt="Email" height="24" style="display: block;">
        </a>
      </td>
    </tr>
  </table>
</td>
</tr>
        <tr class="email-footer-row">
          <td class="email-footer" align="center">
            &copy; 2024 XDRIP Digital Management LLC. All rights reserved.<br>
            Visit us at <a class="email-footer-link" href="https://xdrip.io">moh.xdrip.io</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
    </html>
  `;
    const emailDocData = {
      to: [email],
      message: {
        subject: "🔥 Welcome to The Forge! Your Journey Begins 🔥",
        html: emailHTML,
      },
    };
    await setDoc(emailDocRef, emailDocData, { merge: true });
  } catch (error) {
    console.error("Error adding email document:", error.message);
    throw error;
  }
};

/************************************************************************************
                                 UPDATING THE USER 
*************************************************************************************/
export const updateForger = async (walletAddress, updateData) => {
  const firestore = getFirestore();
  const forgerRef = collection(firestore, "forgerAccount");
  if (!walletAddress) {
    console.error("Error: walletAddress is required but was not provided.");
    throw new Error("walletAddress cannot be empty.");
  }
  try {
    const forgerDocRef = doc(forgerRef, walletAddress);
    const forgerDoc = await getDoc(forgerDocRef);
    if (!forgerDoc.exists()) {
      throw new Error(`User with wallet address ${walletAddress} not found.`);
    }
    await updateDoc(forgerDocRef, updateData);
    return { success: true, message: "User profile updated successfully." };
  } catch (error) {
    console.error("Error updating forger profile:", error.message);
    throw new Error(`Failed to update user profile: ${error.message}`);
  }
};
/************************************************************************************
                                 UPDATING THE USER 
*************************************************************************************/
export const updateApplicantStatusInFirebase = async (walletAddress, updateData) => {
  const firestore = getFirestore();
  const forgerRef = collection(firestore, "forgerAccount");
  if (!walletAddress) {
    console.error("Error: walletAddress is required.");
    throw new Error("walletAddress cannot be empty.");
  }
  try {
    const forgerDocRef = doc(forgerRef, walletAddress);
    const forgerDoc = await getDoc(forgerDocRef);
    if (!forgerDoc.exists()) {
      console.error(`Forger with wallet address ${walletAddress} does not exist.`);
      throw new Error(`Forger with wallet address ${walletAddress} not found.`);
    }
    const existingData = forgerDoc.data();
    const mergedData = {
      ...existingData,
      kyc: {
        ...existingData.kyc,
        ...updateData.kyc,
      },
    };
    await updateDoc(forgerDocRef, mergedData);
    return { success: true, message: "KYC fields updated successfully." };

  } catch (error) {
    console.error("Error updating KYC fields:", error.message);
    throw new Error(`Failed to update KYC fields: ${error.message}`);
  }
};
/************************************************************************************
                        GET USER INFO WHEN WALLET CONNECTS
*************************************************************************************/
export const getForger = async (walletAddress) => {
  const firestore = getFirestore();
  const userRef = doc(firestore, "forgerAccount", walletAddress);
  try {
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      return userData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error retrieving user:", error.message);
    throw error;
  }
};
/************************************************************************************
                  LOGGING MEDAL PURCHASE AND RAMP PROGRESSION
*************************************************************************************/
export const logMedalPurchase = async (walletAddress, medalType, price, transactionHash, revenuePercent, xdripBonusPercent) => {
  const firestore = getFirestore();
  const userRef = doc(firestore, "forgerAccount", walletAddress);

  try {
    // Get or initialize the user document
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      await setDoc(userRef, { ramp1: [] });
    }

    // Retrieve updated document
    const updatedUserDoc = await getDoc(userRef);
    let ramps = updatedUserDoc.data();
    const orderedMedals = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY"];

    // Determine the last ramp and its completeness
    let lastRampKey = Object.keys(ramps)
      .filter((ramp) => ramp.startsWith("ramp"))
      .sort((a, b) => parseInt(a.replace("ramp", "")) - parseInt(b.replace("ramp", "")))
      .pop() || "ramp1";

    let lastRamp = ramps[lastRampKey] || [];


    const existingMedalIndex = lastRamp.findIndex((medal) => medal.medalType === medalType);

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
      timestamp: new Date(),
    };

    lastRamp.push(purchaseData);
    lastRamp.sort(
      (a, b) => orderedMedals.indexOf(a.medalType) - orderedMedals.indexOf(b.medalType)
    );
    await updateDoc(userRef, {
      [lastRampKey]: lastRamp,
    });

    console.log(`Logged purchase to ${lastRampKey}:`, purchaseData);

  } catch (error) {
    console.error("Error logging purchase:", error.message);
    throw error;
  }
};


/************************************************************************************
                          SEND RECIEPT EMAIL TO THE FORGER
*************************************************************************************/
export const sendReceiptEmail = async (address, email, fullName, medalType, price, transactionHash) => {
  const firestore = getFirestore();
  const mailRef = collection(firestore, "forgerEmails");
  const transactionNumber = `X-${transactionHash.slice(0, 6)}-${transactionHash.slice(-6)}`;
  const medalImages = {
    "COMMON": "https://xdrip.io/wp-content/uploads/2025/01/Common_MOH_transparent.webp",
    "UNCOMMON": "https://xdrip.io/wp-content/uploads/2025/01/Uncommon_MOH_transparent.webp",
    "RARE": "https://xdrip.io/wp-content/uploads/2025/01/Rare_MOH_transparent.webp",
    "EPIC": "https://xdrip.io/wp-content/uploads/2025/01/Epic_MOH_transparent.webp",
    "LEGENDARY": "https://xdrip.io/wp-content/uploads/2025/01/Legendary_MOH_transparent.webp",
    "ETERNAL": "https://xdrip.io/wp-content/uploads/2025/01/Eternal_MOH_transparent.webp",
  };
  const medalImageURL = medalImages[medalType] || "https://files.elfsightcdn.com/eafe4a4d-3436-495d-b748-5bdce62d911d/3f1b449b-f38b-42d4-bd7c-2d46bcf846b8/MetalsOfHonor.webp";
  try {
    const emailDocData = {
      to: [email],
      message: {
        subject: "XDRIP Digital Management RECEIPT",
        text: `Hi ${fullName}, \n\nCongratulations on forging your ${medalType} Medal of Honor. Here are the details: \n\nMedal Type: ${medalType} \nPrice: ${price} BNB\n\nThank you for your continued support!\n\nThe Forge Team`,
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        :root {
            --font-size-base: 18px;
            --font-size-small: 14px;
            --font-size-medium: 16px;
            --font-size-large: 28px;
            --font-size-extra-large: 42px;
        }
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: rgb(43, 40, 40);
            font-size: var(--font-size-base);
        }
        .email-body {
            background: rgb(0, 0, 0);
        }
        .email-outer-table {
            width: 100%;
        }
        .email-inner-table {
            background-color: #000000;
            padding: 2rem;
        }
        .email-logo-image {
            color:rgb(255, 255, 255);
        }
        .email-title-container {
          color:rgb(255, 255, 255);
            padding: 20px;
        }
        .email-title {
            font-size: var(--font-size-extra-large);
         color:rgb(255, 255, 255);
        }
        .email-subtitle {
            font-size: var(--font-size-medium);
          color:rgb(255, 255, 255);
        }
        .email-heading {
            font-size: var(--font-size-large);
              color:rgb(255, 255, 255);
        }
        .email-paragraph {
            font-size: var(--font-size-base);
            color:rgb(255, 255, 255);
            line-height: 1.6;
        }
        .email-cta-link {
            background-image: linear-gradient(145deg, rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0.5));
            color:rgb(255, 255, 255);
            padding: 5px 20px;
            border-radius: 5px;
            display: inline-block;
            text-decoration: none;
            font-size: var(--font-size-medium);
            margin: 2.5rem;
        }
        .email-image-row {
            margin: 2.5rem;
        }
        .email-image-container {
            margin: 2.5rem;
        }
        .email-quickstart-title {
            font-size: 35px;
            color:rgb(255, 255, 255);
        }
        .email-quickstart-image {
            width: 600px;
            border-radius: 10px;
        }
        .email-section {
            padding: 1rem;
            margin: 1rem;
            background-color: #333333;
            border-radius: 8px;
        }
        .email-section-table {
            width: 100%;
        }
        .email-section-icon-container {
            width: 90px;
            text-align: center;
        }
        .email-section-icon-image {
            width: 90px;
        }
        .email-section-heading {
            font-size: 25px;
            color: #ffffff;
            margin-bottom: 10px;
        }
        .email-section-paragraph {
            font-size: var(--font-size-base);
            margin-top: 10px;
            color: #ffffff;
        }
        .email-follow-container {
            color: #ffffff;
            padding: 20px;
        }
        .email-follow-title {
            font-size: var(--font-size-large);
        }
        .email-follow-image {
            height: 24px;
            margin: 0 5px;
        }
        .email-footer {
            text-align: center;
            background: rgb(0, 0, 0);
            color: #ffffff;
            padding: 20px;
            font-size: var(--font-size-small);
        }
        .email-footer-link {
            color: #27ae60;
            text-decoration: none;
        }
        @media only screen and (max-width: 600px) {
            :root {
                --font-size-base: 14px;
                --font-size-small: 12px;
                --font-size-medium: 16px;
                --font-size-large: 18px;
                --font-size-extra-large: 22px;
            }
            body {
                font-size: var(--font-size-base);
            }
            .content {
                padding: 10px;
            }
            .section {
                padding: 20px;
            }
        }
    </style>
</head>
<body class="email-body">
    <table class="email-outer-table" align="center" cellpadding="0" cellspacing="0" width="100%">
        <tr class="email-row">
            <td class="email-container" align="center">
                <table class="email-inner-table" bgcolor="#000000" align="center" cellpadding="0" cellspacing="0"
                    width="600" style="padding: 2rem;">
                    <tr class="email-logo-row">
                        <td class="email-logo-container" align="center">
                            <a class="email-logo-link" target="_blank" href="https://www.moh.xdrip.io">
                                <img class="email-logo-image"
                                    src="${medalImageURL}"
                                    title="Logo"
                                    style="width: 450px; max-width: 100%; height: auto; display: block;">
                            </a>
                        </td>
                    </tr>
                    <tr class="email-title-row">
                        <td class="email-title-container" align="center" style="color:rgb(255, 255, 255); padding: 20px;">
                            <h1 class="email-title"><strong>CONGRATULATIONS</strong></h1>
                            <h1 class="email-title"><strong>And</strong></h1>
                            <h1 class="email-title"><strong>Thank You</strong></h1>
                            <p class="email-subtitle">"Your Support Is Greatly Appreciated, And Your Trust Is Valued"</p>
                            <p class="email-subtitle">XDRIP Digital Management Ownership</p>
                        </td>
                    </tr>
                    <tr class="email-content-row">
                        <td class="email-content-container" align="center" style="padding: 20px; color:rgb(255, 255, 255);">
                            <h2 class="email-heading">Hi ${fullName},</h2>
                            <p class="email-paragraph">We're Xcited to be a part of your journey here on <strong>The
                                    Forge</strong> &ndash; your gateway to the exciting world of DeFi investing.</p>
                            <p class="email-paragraph">Below we have attached a receipt detailing your most recent
                                investment in the <strong>${medalType}</strong> Medal of Honor </p>

                            <div style="overflow-x: auto;">
                                <table
                                    style="width: 100%; margin-top: 20px; border-collapse: collapse; font-size: 16px;">
                                    <tr>
                                        <td
                                            style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: rgb(0, 0, 0);">
                                            Medal Type:</td>
                                        <td style="padding: 10px; border: 1px solid #ddd;">${medalType}</td>
                                    </tr>
                                    <tr>
                                        <td
                                            style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: rgb(0, 0, 0);">
                                            Price:</td>
                                        <td style="padding: 10px; border: 1px solid #ddd;">${price} BNB</td>
                                    </tr>
                                    <tr>
                                        <td
                                            style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: rgb(0, 0, 0);">
                                            Transaction Number:</td>
                                        <td style="padding: 10px; border: 1px solid #ddd;">${transactionNumber}</td>
                                    </tr>
                                    <tr>
                                     <td
                                        style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: rgb(0, 0, 0);">
                                         BlockChain Link:
                                        </td>
                                              <td style="padding: 10px; border: 1px solid #ddd;">
                                        <a href="https://testnet.bscscan.com/tx/${transactionHash}" 
                                        style=" text-decoration: none; font-weight: bold;" 
                                        target="_blank">
                                         View Transaction
                                                 </a>
                                           </td>
                                                      </tr>

                                </table>
                            </div>
                        </td>
                    </tr>
                    <tr class="email-image-row">
                        <td class="email-image-container" align="center">
                            <h1 class="email-quickstart-title">Continue Your Journey</h1>
                            <a class="email-quickstart-link" target="_blank" href="https://moh.xdrip.io">
                                <img class="email-quickstart-image"
                                    src="https://xdrip.io/wp-content/uploads/2024/12/TheForge_noredirect-4.webp" alt=""
                                    width="600" style="margin-top: 1rem; margin-bottom: 4rem; border-radius: 10px;">
                            </a>
                        </td>
                    </tr>
                    <tr class="email-follow-row">
                        <td class="email-follow-container" align="center" style="color:rgb(255, 255, 255); padding: 20px;">
                            <h2 class="email-follow-title" style="margin-bottom: 10px; font-size: 20px;">Follow us!</h2>
                            <table align="center" style="margin: 0 auto;">
                                <tr>
                                    <td style="padding: 0 5px;">
                                        <a class="email-follow-link" href="https://x.com/XDRIP">
                                            <img class="email-follow-image"
                                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/X_logo_2023_%28white%29.png/240px-X_logo_2023_%28white%29.png"
                                                alt="X" height="24" style="display: block;">
                                        </a>
                                    </td>
                                    <td style="padding: 0 5px;">
                                        <a class="email-follow-link" href="https://www.instagram.com/thexdripofficial/">
                                            <img class="email-follow-image"
                                                src="https://fpdtaan.stripocdn.email/content/assets/img/social-icons/logo-colored/instagram-logo-colored.png"
                                                alt="Instagram" height="24" style="display: block;">
                                        </a>
                                    </td>
                                    <td style="padding: 0 5px;">
                                        <a class="email-follow-link" href="https://www.facebook.com/TheXdripOfficial/">
                                            <img class="email-follow-image"
                                                src="https://fpdtaan.stripocdn.email/content/assets/img/social-icons/logo-colored/facebook-logo-colored.png"
                                                alt="Facebook" height="24" style="display: block;">
                                        </a>
                                    </td>
                                    <td style="padding: 0 5px;">
                                        <a class="email-follow-link"
                                            href="https://www.youtube.com/channel/UCql_clMpK5GYxXUREIGfnRw">
                                            <img class="email-follow-image"
                                                src="https://fpdtaan.stripocdn.email/content/assets/img/social-icons/logo-colored/youtube-logo-colored.png"
                                                alt="YouTube" height="24" style="display: block;">
                                        </a>
                                    </td>
                                    <td style="padding: 0 5px;">
                                        <a class="email-follow-link" href="mailto:contact@moh.xdrip.io">
                                            <img class="email-follow-image"
                                                src="https://fpdtaan.stripocdn.email/content/assets/img/other-icons/logo-colored/mail-logo-colored.png"
                                                alt="Email" height="24" style="display: block;">
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr class="email-footer-row">
                        <td class="email-footer" align="center">
                            &copy; 2024 XDRIP Digital Management LLC. All rights reserved.<br>
                            Visit us at <a class="email-footer-link" href="https://xdrip.io">moh.xdrip.io</a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`,
      },
    };
    const emailDocRef = doc(mailRef, address);
    await setDoc(emailDocRef, emailDocData);

    console.log("Receipt email document successfully created with ID:", address);
  } catch (error) {
    console.error("Error sending receipt email:", error.message);
    throw error;
  }
};
/************************************************************************************
                          EMAIL FROM FORGER TO US 
*************************************************************************************/
export const sendContactUsEmail = async (senderEmail, message, address) => {
  const firestore = getFirestore();
  const mailRef = collection(firestore, "forgerEmails");
  address = address || "123456789123456789123456789123456789123456";

  try {
    const emailDocData = {
      to: ["contact@moh.xdrip.io"],
      message: {
        subject: "New Contact Us Submission",
        text: `You have received a new message from: ${senderEmail}\n\nMessage:\n${message}`,
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        h1 {
            font-size: 24px;
            color: #007bff;
            margin-bottom: 20px;
        }
        p {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 10px;
        }
        .footer {
            font-size: 14px;
            color: #888;
            margin-top: 20px;
        }
        .footer a {
            color: #007bff;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>New Contact Us Message</h1>
        <p><strong>From:</strong> ${senderEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <div class="footer">
            
        </div>
    </div>
</body>
</html>
        `,
      },
    };
    const emailDocRef = doc(mailRef, address);
    await setDoc(emailDocRef, emailDocData);
    console.log("Contact Us email document successfully added to Firebase.");
  } catch (error) {
    console.error("Error sending Contact Us email:", error.message);
    throw error;
  }
};
/************************************************************************************
                  TRACKING TRANSACTIONS FOR FULL LOGGING
*************************************************************************************/
export const trackDetailedTransaction = async (address, medalType, transactionData) => {
  const firestore = getFirestore();
  const transactionsCollection = collection(firestore, "transactions");
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

  const walletDocRef = doc(transactionsCollection, address.toLowerCase());
  const transactionNumber = `X-${transactionHash.slice(0, 6)}-${transactionHash.slice(-6)}`;
  const transactionLog = {
    purchaser: address,
    purchasedMedal: medalType,
    transactionHash,
    status,
    blockNumber,
    timestamp,
    action,
    from,
    to,
    valueBNB,
    gasUsed,
  };
  try {
    await setDoc(walletDocRef, { [transactionNumber]: transactionLog }, { merge: true });
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
  const firestore = getFirestore();
  const kycCollection = collection(firestore, "forgerKYC");
  const currentDate = new Date().toISOString();

  // Sanitize kycData to remove undefined or null fields
  const sanitizedKYCData = sanitizeData({
    ...kycData,
    external_applicant_id,
    timestamp: currentDate,
  });

  try {
    const kycDocRef = doc(kycCollection, external_applicant_id);
    await setDoc(kycDocRef, sanitizedKYCData, { merge: true });
    console.log("[Firebase] KYC data logged successfully:", external_applicant_id);
  } catch (error) {
    console.error("[Firebase] Error logging KYC data:", error.message);
    throw error;
  }
};
/************************************************************************************
                OWNER FUNCTION FINDING TRANSACTIONS FOR FULL LOGGING
*************************************************************************************/
export const findTransaction = async ({ tokenId, transactionHash, purchasedMedal }) => {
  const firestore = getFirestore();
  const transactionsRef = collection(firestore, "transactions");
  try {
    let q;
    if (transactionHash) {
      q = query(transactionsRef, where("transactionDetails.transactionHash", "==", transactionHash));
    } else if (tokenId) {
      q = query(transactionsRef, where("transactionDetails.tokenId", "==", tokenId));
    } else if (purchasedMedal) {
      q = query(transactionsRef, where("purchase.medalType", "==", purchasedMedal));
    } else {
      throw new Error("Please provide either tokenId, transactionHash, or purchasedMedal to search.");
    }
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    if (results.length === 0) {
      return null;
    }
    return results;
  } catch (error) {
    console.error("Error finding transaction:", error.message);
    throw error;
  }
};