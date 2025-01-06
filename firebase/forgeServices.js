import { getFirestore, collection, query, where, addDoc, getDocs, getDoc, deleteDoc, doc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { arrayUnion } from 'firebase/firestore';
import { firestore, db } from "./config";

/************************************************************************************
                   ADD NEW FORGER TO FIREBASE AND SEND EMAIL
************************************************************************************/
export const addForger = async (profileData) => {
  const {
    agreed = false,
    dateOfJoin,
    email,
    kycStatus = "not yet submitted",
    kycSubmittedAt = null,
    kycApprovedAt = null,
    fullName,
    walletAddress,
    phone = null,
    mailingAddress: { streetAddress, apartment, city, state, zipCode },
    territory = null,
    dob = null,
    ukFCAAgreed = null,
    drip: { dripHeld, supplyPercent, dateLastLogged },
  } = profileData;

  const firestore = getFirestore();
  const forgerRef = collection(firestore, "forgers");
  const mailRef = collection(firestore, "mail");

  console.log("Incoming profileData to addForger:", profileData);

  // Validate inputs
  if (!walletAddress) {
    console.error("Error: walletAddress is required but was not provided.");
    throw new Error("walletAddress cannot be empty.");
  }
  if (!email) {
    console.error("Error: email is required but was not provided.");
    throw new Error("email cannot be empty.");
  }
  if (!fullName) {
    console.error("Error: fullName is required but was not provided.");
    throw new Error("fullName cannot be empty.");
  }

  try {
    // Check if wallet address already exists
    const walletQuery = query(forgerRef, where("walletAddress", "==", walletAddress));
    const walletSnapshot = await getDocs(walletQuery);
    if (!walletSnapshot.empty) {
      console.error(`Error: Wallet address ${walletAddress} already exists.`);
      throw new Error("This wallet address is already registered.");
    }

    // Check if email already exists
    const emailQuery = query(forgerRef, where("email", "==", email));
    const emailSnapshot = await getDocs(emailQuery);
    if (!emailSnapshot.empty) {
      console.error(`Error: Email ${email} already exists.`);
      throw new Error("This email is already registered.");
    }

    // Proceed to create the forger
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
      kycStatus,
      kycSubmittedAt,
      kycApprovedAt,
      drip: {
        dripHeld,
        supplyPercent,
        dateLastLogged,
      },
    };
    await setDoc(doc(forgerRef, walletAddress), forgerDocData);
    console.log("Forger created successfully:", forgerDocData);
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

.email-section-content-row {}

.email-section-icon-container {
  width: 90px;
  text-align: center;
}

.email-section-icon-link {}

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
    await addDoc(mailRef, emailDocData);
    console.log("Welcome email queued successfully:", emailDocData);
  } catch (error) {
    console.error("Error adding forger or sending email:", error.message);
    throw error;
  }
};
/************************************************************************************
                                 UPDATING THE USER 
*************************************************************************************/
export const updateForger = async (walletAddress, updateData) => {
  const firestore = getFirestore();
  const forgerRef = collection(firestore, "forgers");

  console.log("Updating forger profile for wallet address:", walletAddress);

  // Validate inputs
  if (!walletAddress) {
    console.error("Error: walletAddress is required but was not provided.");
    throw new Error("walletAddress cannot be empty.");
  }

  try {
    // Reference the user's document in the "forgers" collection
    const forgerDocRef = doc(forgerRef, walletAddress);

    // Check if the document exists
    const forgerDoc = await getDoc(forgerDocRef);
    if (!forgerDoc.exists()) {
      throw new Error(`User with wallet address ${walletAddress} not found.`);
    }

    // Update the document with the provided fields
    await updateDoc(forgerDocRef, updateData);

    console.log(`Forger profile updated successfully for wallet address: ${walletAddress}`);
    return { success: true, message: "User profile updated successfully." };
  } catch (error) {
    console.error("Error updating forger profile:", error.message);
    throw new Error(`Failed to update user profile: ${error.message}`);
  }
};

/************************************************************************************
                        UPDATING THE KYC STATUS OF THE USER 
*************************************************************************************/
export const updateUserStatusInFirebase = async (email, status, refId = null, kycApprovedAt = null) => {
  const firestore = getFirestore();
  const userRef = collection(firestore, "forgers");

  try {
    const userQuery = query(userRef, where("email", "==", email));
    const userSnapshot = await getDocs(userQuery);

    if (!userSnapshot.empty) {
      const userDoc = userSnapshot.docs[0];
      const userDocRef = doc(firestore, "forgers", userDoc.id);

      const updateData = {
        kycStatus: status,
      };

      if (refId) updateData.refId = refId;
      if (kycApprovedAt) updateData.kycApprovedAt = kycApprovedAt;

      await updateDoc(userDocRef, updateData);

      console.log(`User with email ${email} status updated to ${status} `);
    } else {
      console.log(`No user found with email ${email} `);
    }
  } catch (error) {
    console.error(`Error updating user status for email ${email}: `, error.message);
    throw error;
  }
};


/************************************************************************************
                        GET USER INFO WHEN WALLET CONNECTS
*************************************************************************************/
export const getForger = async (walletAddress) => {
  const firestore = getFirestore();
  const userRef = collection(firestore, "forgers");
  try {
    const existingUserQuery = query(userRef, where("walletAddress", "==", walletAddress));
    const existingUserSnapshot = await getDocs(existingUserQuery);
    if (!existingUserSnapshot.empty) {
      const userData = existingUserSnapshot.docs[0].data();
      console.log("User found:", userData);
      return userData;
    } else {
      console.log("No user found for this wallet address.");
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
export const logMedalPurchase = async (walletAddress, medalType, price, transactionHash, revenuePrecent, xdripBonusPercent) => {
  const firestore = getFirestore();
  const userRef = doc(firestore, "forgers", walletAddress);
  try {
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      console.log("User document does not exist. Creating new user document with ramp1.");
      await setDoc(userRef, { ramp1: [] });
    }
    const updatedUserDoc = await getDoc(userRef);
    let ramps = updatedUserDoc.data();
    let lastRampKey = Object.keys(ramps)
      .filter((ramp) => ramp.startsWith("ramp"))
      .sort((a, b) => parseInt(a.replace("ramp", "")) - parseInt(b.replace("ramp", "")))
      .pop() || "ramp1";
    let lastRamp = ramps[lastRampKey] || [];
    const orderedMedals = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY"];
    if (lastRamp.length >= orderedMedals.length) {
      const nextRampNumber = parseInt(lastRampKey.replace("ramp", ""), 10) + 1;
      lastRampKey = `ramp${nextRampNumber} `;
      lastRamp = [];
    }
    const purchaseData = {
      medalType,
      price,
      transactionHash,
      revenuePrecent,
      xdripBonusPercent,
      timestamp: new Date(),
    };
    await updateDoc(userRef, {
      [`${lastRampKey} `]: arrayUnion(purchaseData),
    });
    console.log("Purchase logged successfully in", lastRampKey);
  } catch (error) {
    console.error("Error logging purchase:", error.message);
    throw error;
  }
};

/************************************************************************************
                          SEND RECIEPT EMAIL TO THE FORGER
*************************************************************************************/
export const sendReceiptEmail = async (email, name, medalType, price, transactionHash) => {
  const firestore = getFirestore();
  const mailRef = collection(firestore, "mail");

  try {
    const emailDocData = {
      to: [email],
      message: {
        subject: "Your Medal of Honor Receipt",
        text: `Hi ${name}, \n\nCongratulations on forging your ${medalType} Medal of Honor. Here are the details: \n\nMedal Type: ${medalType} \nPrice: ${price} BNB\n\nThank you for your continued support!\n\nThe Forge Team`,
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Receipt Email</title>
  <style>
    @media (max-width: 600px) {
      table {
        width: 100% !important;
        font-size: 14px !important;
      }
      td {
        word-break: break-word !important;
        white-space: normal !important;
      }
      .container {
        padding: 10px !important;
      }
      .header {
        font-size: 24px !important;
      }
      .button {
        font-size: 14px !important;
        padding: 10px 15px !important;
      }
    }
  </style>
</head>
<body style="padding: 0; margin: 0; font-family: Arial, sans-serif;">
  <div style="width: 100%; background-color: rgb(43, 40, 40);">
    <div class="container" style="max-width: 600px; margin: 20px auto; padding: 20px; background: rgb(54, 54, 54); border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <div class="header" style="background-color: rgb(0, 0, 0); color: #ffffff; padding: 20px; text-align: center;">
        <img src="https://files.elfsightcdn.com/eafe4a4d-3436-495d-b748-5bdce62d911d/3f1b449b-f38b-42d4-bd7c-2d46bcf846b8/MetalsOfHonor.webp" alt="The Forge Logo" style="height: 75px; margin-bottom: 10px;">
        <h1 style="margin: 0; font-size: 36px;">Your Receipt</h1>
        <h2 style="margin: 0; font-size: 24px;">Medal of Honor</h2>
      </div>

      <div style="padding: 20px; background-color: rgb(0, 0, 0); border-radius: 8px; color: #ffffff;">
        <p style="font-size: 18px;">Congratulations, <strong>${name}</strong>!</p>
        <p>You’ve successfully forged your <strong>${medalType}</strong> Medal of Honor.</p>

        <div style="overflow-x: auto;">
          <table style="width: 100%; margin-top: 20px; border-collapse: collapse; font-size: 16px;">
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: rgb(0, 0, 0);">Medal Type:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${medalType}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: rgb(0, 0, 0);">Price:</td>
              <td style="padding: 10px; border: 1px solid #ddd;">${price} BNB</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: rgb(0, 0, 0);">Transaction ID:</td>
              <td style="
                padding: 10px; 
                border: 1px solid #ddd; 
                overflow: hidden; 
                text-overflow: ellipsis; 
                white-space: nowrap;">
                <span title="${transactionHash}">${transactionHash}</span>
                <br>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${transactionHash}" alt="QR Code" style="margin-top: 10px;">
              </td>
            </tr>
          </table>
        </div>

        <p style="margin-top: 20px; font-size: 14px; color: #bbbbbb;">Thank you for supporting <strong>The Forge</strong>. Share your achievement and track your medals anytime.</p>

        <div style="text-align: center; margin-top: 30px;">
          <a href="https://moh.xdrip.io" class="button" style="text-decoration: none; background-color: #170cce; color: #ffffff; padding: 10px 20px; border-radius: 5px; font-size: 16px;">View Your Dashboard</a>
        </div>
      </div>

      <div style="text-align: center; padding: 10px; background-color: rgb(0, 0, 0); color: #ffffff; font-size: 12px;">
        <p style="margin: 0;">&copy; 2024 XDRIP Digital Management LLC | Visit us at <a href="https://xdrip.io" style="color: #170cce; text-decoration: underline;">www.xdrip.io</a></p>
      </div>
    </div>
  </div>
</body>
</html>


        `,
      },
    };

    await addDoc(mailRef, emailDocData);
    console.log("Receipt email queued successfully:", emailDocData);
  } catch (error) {
    console.error("Error sending receipt email:", error.message);
    throw error;
  }
};



/************************************************************************************
                  TRACKING TRANSACTIONS FOR FULL LOGGING
*************************************************************************************/
export const trackDetailedTransaction = async (address, medalType, transactionData) => {
  const firestore = getFirestore();
  const transactionsRef = collection(firestore, "transactions");
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
    inputData,
  } = transactionData;

  const documentData = {
    purchaser: address,
    purchasedMedal: medalType,
    transactionDetails: {
      transactionHash,
      status,
      blockNumber,
      timestamp,
      action,
      from,
      to,
      valueBNB,
      gasDetails: {
        gasUsed,
      },
      inputData,
    },
  };

  try {
    await setDoc(doc(transactionsRef, transactionHash), documentData);
    console.log("Transaction tracked successfully:", transactionHash);
  } catch (error) {
    console.error("Error tracking transaction:", error.message);
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
      console.log("No matching transaction found.");
      return null;
    }
    console.log("Matching transactions:", results);
    return results;
  } catch (error) {
    console.error("Error finding transaction:", error.message);
    throw error;
  }
};