import { getFirestore, collection, query, where, addDoc, getDocs, getDoc, deleteDoc, doc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { arrayUnion } from 'firebase/firestore';
import { firestore, db } from "./config";

/************************************************************************************
                   ADD NEW FORGER TO FIREBASE AND SEND EMAIL
************************************************************************************/
export const addForger = async (  
  agreed = false, 
  dateOfJoin,
  email,
  kycStatus = 'pending',
  kycSubmittedAt = null,
  kycApprovedAt = null,
  name,
  refId,
  walletAddress,
) => {
  const firestore = getFirestore();
  const forgerRef = collection(firestore, "forgers");
  const mailRef = collection(firestore, "mail");

  // Input Validation
  if (!walletAddress) {
    console.error("Error: walletAddress is required but was not provided.");
    throw new Error("walletAddress cannot be empty.");
  }
  if (!email) {
    console.error("Error: email is required but was not provided.");
    throw new Error("email cannot be empty.");
  }
  if (!name) {
    console.error("Error: name is required but was not provided.");
    throw new Error("name cannot be empty.");
  }

  try {
    // Store user data in Firestore
    const forgerDocData = {
      walletAddress,
      email,
      name,
      agreed,
      dateOfJoin: dateOfJoin || new Date().toISOString(),
      kycStatus,
      refId,
      kycSubmittedAt,
      kycApprovedAt,
    };

    await setDoc(doc(forgerRef, walletAddress), forgerDocData);
    console.log("Forger created successfully:", forgerDocData);

    // Prepare Welcome Email
    const emailDocData = {
      to: [email],
      message: {
        subject: "🔥 Welcome to The Forge! Your Journey Begins 🔥",
        text: `Hi ${name},\n\nWelcome to The Forge! Your journey has begun. Get started now at https://moh.xdrip.io.\n\nThank you for joining us!\n\nThe XDRIP Digital Management Team.`,
        html: `
          <div style="font-family: Arial, sans-serif; margin: 0; padding: 0; background: #f8f9fa;">
            <div style="background: #2c3e50; text-align: center; padding: 20px;">
              <img src="https://moh.xdrip.io/public/favicon.ico" alt="The Forge Logo" style="height: 60px;" />
              <h1 style="color: #ffffff;">Welcome to <strong>The Forge</strong>!</h1>
            </div>
            <div style="padding: 20px; background: #ffffff; max-width: 600px; margin: 20px auto; border-radius: 8px;">
              <p style="font-size: 18px; color: #444;">Hi <strong>${name}</strong>,</p>
              <p>🎉 Congratulations on joining <strong>The Forge</strong> – your gateway to forging greatness!</p>
              <div style="text-align: center; margin: 30px;">
                <a href="https://moh.xdrip.io" style="background: #27ae60; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px;">🚀 Start Forging Now</a>
              </div>
              <p style="font-size: 16px;">Welcome aboard, and let’s forge something amazing together!</p>
              <p>Best regards,<br><strong>The XDRIP Digital Management Team</strong></p>
            </div>
          </div>
        `,
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

      console.log(`User with email ${email} status updated to ${status}`);
    } else {
      console.log(`No user found with email ${email}`);
    }
  } catch (error) {
    console.error(`Error updating user status for email ${email}:`, error.message);
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
        lastRampKey = `ramp${nextRampNumber}`;
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
        [`${lastRampKey}`]: arrayUnion(purchaseData),
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
        text: `Hi ${name},\n\nCongratulations on forging your ${medalType} Medal of Honor. Here are the details:\n\nMedal Type: ${medalType}\nPrice: ${price} BNB\nTransaction ID: ${transactionHash}\n\nThank you for your continued support!\n\nThe Forge Team`,
        html: `
          <div style="font-family: Arial, sans-serif; margin: 0; padding: 0; background: #f8f9fa;">
            <!-- Header with Logo -->
            <div style="background-color: #2c3e50; padding: 20px; text-align: center; color: #ffffff;">
              <img src="https://moh.xdrip.io/public/favicon.ico" alt="The Forge Logo" style="height: 50px;" />
              <h1 style="margin: 10px 0;">Your Receipt: Medal of Honor</h1>
            </div>

            <!-- Content Container -->
            <div style="margin: 20px auto; padding: 20px; max-width: 600px; background: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
              <p style="font-size: 18px; color: #333333;">
                Congratulations <strong>${name}</strong>,<br /> 
                You’ve successfully forged your <strong>${medalType}</strong> Medal of Honor!
              </p>

              <!-- Transaction Details Table -->
              <table style="width: 100%; margin-top: 20px; border-collapse: collapse; font-size: 16px;">
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: #f8f9fa;">Medal Type:</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${medalType}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: #f8f9fa;">Price:</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${price} BNB</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: #f8f9fa;">Transaction ID:</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">
                    ${transactionHash}
                    <br />
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${transactionHash}" 
                         alt="QR Code" style="margin-top: 10px;" />
                  </td>
                </tr>
              </table>

              <!-- Additional Info -->
              <p style="margin-top: 20px; font-size: 16px; color: #555555;">
                Thank you for supporting <strong>The Forge</strong>. Share your achievement with others and track your medals anytime.
              </p>

              <!-- Buttons -->
              <div style="text-align: center; margin-top: 30px;">
                <a href="https://moh.xdrip.io" style="text-decoration: none; background: #27ae60; color: #ffffff; padding: 12px 24px; border-radius: 5px; font-size: 16px; display: inline-block;">
                  View Your Dashboard
                </a>
              </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; padding: 20px; background: #2c3e50; color: #ffffff; font-size: 14px;">
              <p style="margin: 0;">© 2024 The Forge | Visit us at 
                <a href="https://moh.xdrip.io" style="color: #ffffff; text-decoration: underline;">moh.xdrip.io</a>
              </p>
            </div>
          </div>
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