import { getFirestore, collection, query, where, addDoc, getDocs, getDoc, deleteDoc, doc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { arrayUnion } from 'firebase/firestore';
import { firestore, db } from "./config";

/************************************************************************************
                   ADD NEW USER TO FIREBASE WHEN WALLET CONNECTS
*************************************************************************************/
export const addWalletUser = async (walletAddress) => {
  const firestore = getFirestore();
  const userRef = collection(firestore, "forgeUsers");  
  try {
    const userDocData = {
      walletAddress: walletAddress,
      createdAt: new Date(),
    };
    await setDoc(doc(userRef, walletAddress), userDocData);
    console.log('User created successfully');
  } catch (error) {
    console.error("Error adding user: ", error.message);
    throw error;
  }
};

/************************************************************************************
                        GET USER INFO WHEN WALLET CONNECTS
*************************************************************************************/
export const getWalletUser = async (walletAddress) => {
    const firestore = getFirestore();
    const userRef = collection(firestore, "forgeUsers");  
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
  export const logMedalPurchase = async (walletAddress, medalType, price, transactionHash) => {
    const firestore = getFirestore();
    const userRef = doc(firestore, "forgeUsers", walletAddress);  
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