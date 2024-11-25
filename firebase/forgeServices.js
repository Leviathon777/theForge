import { getFirestore, collection, query, where, addDoc, getDocs, getDoc, deleteDoc, doc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { arrayUnion } from 'firebase/firestore';
import { firestore, db } from "./config";

/************************************************************************************
                   ADD NEW FORGER TO FIREBASE AND SEND EMAIL
************************************************************************************/
export const addForger = async (
  walletAddress,
  email,
  name,
  agreed,
  dateOfJoin,
  kycStatus = 'pending',
  refId = null,         
  kycSubmittedAt = null,
  kycApprovedAt = null
) => {
  const firestore = getFirestore();
  const forgerRef = collection(firestore, "forgers");
  const mailRef = collection(firestore, "mail");
  try {
    const forgerDocData = {
      walletAddress,
      email,
      name,
      agreed,
      dateOfJoin,
      kycStatus,
      refId, 
      kycSubmittedAt,
      kycApprovedAt,
    };

    await setDoc(doc(forgerRef, walletAddress), forgerDocData);
    console.log("Forger created successfully:", forgerDocData);
    const emailDocData = {
      to: [email],
      message: {
        subject: "Welcome to The Forge!",
        text: `Hi ${name},\n\nWelcome to The Forge! Your journey has begun.`,
        html: `
          <p>Hi <strong>${name}</strong>,</p>
          <p>Welcome to <strong>The Forge</strong>! We're thrilled to have you on this journey.</p>
          <p>Start forging your legacy today.</p>
          <p>Best regards,</p>
          <p><strong>The XDRIP Digital Management Team</strong></p>
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
            <div style="font-family: Arial, sans-serif; text-align: left;">
              <h1>Congratulations on forging your ${medalType} MEDAL OF HONOR!</h1>
              <p><strong>Here are your transaction details:</strong></p>
              <ul>
                <li><strong>Medal Type:</strong> ${medalType}</li>
                <li><strong>Price:</strong> ${price} BNB</li>
                <li><strong>Transaction ID:</strong> ${transactionHash}</li>
              </ul>
              <p>We appreciate your support and hope you enjoy your new medal.</p>
              <p>Best regards,</p>
              <p><strong>The Forge Team</strong></p>
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