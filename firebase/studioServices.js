import { getFirestore, collection, query, where, addDoc, getDocs, getDoc, deleteDoc, doc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { firestore, db } from "./config";

const storage = getStorage();







/*****************************************************************************************************************************************************************************************
                                                                                
                                                                                 ADD STUDIO X USER FUNCTION 

******************************************************************************************************************************************************************************************/


export const addStudioXUser = async (connectedWalletAddress, studioXUser, artistPhoto) => {
  const firestore = getFirestore();
  const userRef = collection(firestore, "studioXusers");

  try {
    console.log("Adding user to Firestore:", studioXUser);

    const storage = getStorage();
    const profilePictureRef = ref(storage, `studioXusers/${connectedWalletAddress}/artistImages/${artistPhoto.name}`);
    await uploadBytes(profilePictureRef, artistPhoto);

    // Get download URL for the uploaded image
    const artistPhotoUrl = await getDownloadURL(profilePictureRef);
    console.log("Artist photo uploaded. URL:", artistPhotoUrl);


    const docRef = await addDoc(userRef, {
      walletAddress: connectedWalletAddress,
      username: studioXUser.username,
      email: studioXUser.email,
      genres: studioXUser.genres || [],
      walletAddress: studioXUser.walletAddress,
      socialMedia: studioXUser.socialMedia || {
        website: "",
        twitter: "",
        facebook: "",
        instagram: "",
        tiktok: "",
        discord: "",
        youTube: "",
      },
      realName: studioXUser.realName || "",
      origin: studioXUser.origin || "",
      artistBackground: studioXUser.artistBackground || "",
      musicalInfluences: studioXUser.musicalInfluences || "",
      careerHighlights: studioXUser.careerHighlights || "",
      discography: studioXUser.discography || "",
      collaborations: studioXUser.collaborations || "",
      performances: studioXUser.performances || "",
      songwritingProcess: studioXUser.songwritingProcess || "",
      charitableWork: studioXUser.charitableWork || "",
      upcomingProjects: studioXUser.upcomingProjects || "",
      personalAnecdotes: studioXUser.personalAnecdotes || "",
      quotes: studioXUser.quotes || "",
      securityPin: studioXUser.securityPin || "",
      artistPhoto: artistPhotoUrl,
      membership: studioXUser.membership ||{
        membershipTier: "",
        renewalDate: "",
        creationDate: "",
        description: "",
        price: "",
      },
    });
    console.log("User added to Firestore with ID:", docRef.id);

    const usersCollection = collection(firestore, 'users');
    const usersQuery = query(usersCollection, where('walletAddress', '==', connectedWalletAddress));
    const usersSnapshot = await getDocs(usersQuery);

    usersSnapshot.forEach(async (userDoc) => {
      const userDocRef = doc(usersCollection, userDoc.id);
      await updateDoc(userDocRef, { isAudioCreator: true });
      console.log(`Updated isAudioCreator for user with ID ${userDoc.id}`);
    });

    console.log("User added to Firestore with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding user: ", error);
  }
};











export const getAllStudioXUsers = async () => {
  const firestore = getFirestore();
  const q = collection(firestore, "studioXusers");

  const querySnapshot = await getDocs(q);
  const studioXusers = [];

  querySnapshot.forEach((doc) => {
    studioXusers.push({ id: doc.id, ...doc.data() });
  });

  return studioXusers;
};




/*****************************************************************************************************************************************************************************************
                                                                                
                                                                               UPDATE STUDIO X USER FUNCTION 

******************************************************************************************************************************************************************************************/

export const updateStudioXUser = async (walletAddress, updatedData) => {
  const firestore = getFirestore();
  const userCollection = collection(firestore, 'studioXusers');

  try {
    console.log("Updating user in Firestore:", walletAddress);

    const userQuery = query(userCollection, where('walletAddress', '==', walletAddress));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.docs.length > 0) {
      const userDoc = userSnapshot.docs[0];
      const storage = getStorage();

      if (updatedData.membership && updatedData.membership.artistPhoto) {
        const profilePictureRef = ref(storage, `studioXusers/${walletAddress}/artistImages/${updatedData.membership.artistPhoto.name}`);
        await uploadBytes(profilePictureRef, updatedData.membership.artistPhoto);
        const artistPhotoUrl = await getDownloadURL(profilePictureRef);
        console.log("Artist photo updated. URL:", artistPhotoUrl);

        // Add or update the artistPhoto field
        await updateDoc(userDoc.ref, { artistPhoto: artistPhotoUrl });
      }

      // Use the update function to add or update fields based on updatedData
      await updateDoc(userDoc.ref, {
        membership: {
          ...userDoc.data().membership, // Preserve existing membership data
          ...updatedData.membership, // Update with new membership data
        },
      });

      console.log("User updated in Firestore:", walletAddress);
    } else {
      console.log("User not found in Firestore:", walletAddress);
    }
  } catch (error) {
    console.error("Error updating user: ", error);
  }
};











/*****************************************************************************************************************************************************************************************
                                                                              
                                                                               GET DATA FOR STUDIO X USER FUNCTION 

******************************************************************************************************************************************************************************************/

export const getStudioXUserProfile = async (walletAddress) => {
  console.log('User Address:', walletAddress);
  const firestore = getFirestore();
  const q = query(collection(firestore, "studioXusers"),
    where("walletAddress", "==", walletAddress));
  console.log('User Address:', walletAddress);
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    let userProfile = null;
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      userProfile = { id: doc.id, ...doc.data() };
    });
    return userProfile;
  } else {
    console.error("No user found with the given wallet address");
    return null;
  }
};





/*****************************************************************************************************************************************************************************************
                                                                              
                                                          ADD  AUDIO NFT TO FIREBASE FUNCTION DONE AT INITIAL NFT CREATION IN MO CONTEXT 

******************************************************************************************************************************************************************************************/

export async function addAudioNFT(
  albumName,
  walletAddress,
  createXechoData,
  tokenId,
  price,
  tokenURI,
  currentTimestamp,) {
  try {

    const firestore = getFirestore();
    const nftDataRef = collection(firestore, "nfts");
    const newNFT = {
      albumName,
      walletAddress,
      ...createXechoData,
      tokenId,
      price: price.toString(),
      tokenURI,
      timestamp: currentTimestamp,
      contract: "0x0Ba25060d827FFb7c51E620c2115E0cD0b3500D8",
      type: "AUDIO ASSET",

    };


    console.log("Created newNFT:", newNFT);

    const docRef = await addDoc(nftDataRef, newNFT);
    const docId = docRef.id;

    const usersRef = collection(firestore, "users");
    const userQuerySnapshot = await getDocs(query(usersRef, where("walletAddress", "==", walletAddress)));

    if (!userQuerySnapshot.empty) {
      const userDoc = userQuerySnapshot.docs[0];
      const userRef = doc(firestore, "users", userDoc.id);

      await updateDoc(userRef, {
        nftsCreated: [...userDoc.data().nftsCreated, docId],
        nftsListed: [...userDoc.data().nftsListed, docId],
      });

      if (albumName) {
        const userCollectionsRef = collection(db, "userCollections");
        const q = query(
          userCollectionsRef,
          where("walletAddress", "==", walletAddress),
          where("albumName", "==", albumName)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          throw new Error("Collection does not exist");
        }

        const collectionDoc = querySnapshot.docs[0];
        const collectionRef = doc(db, "userCollections", collectionDoc.id);

        await updateDoc(collectionRef, {
          tokenIds: [docId, ...collectionDoc.data().tokenIds],
        });

        console.log("Token ID updated successfully in collection document");
        console.log("Updated Collection Doc ID:", collectionDoc.id);
        console.log("Updated Token IDs:", [tokenId, ...collectionDoc.data().tokenIds]);

        const followerIds = userDoc.data().followers;

        const creatorWalletAddress = walletAddress;
        console.log("Creator Wallet Address:", creatorWalletAddress);

        followerIds.forEach(async (followerId) => {
          const followerDocSnapshot = await getDoc(doc(firestore, "users", followerId));
          if (followerDocSnapshot.exists()) {
            const followerData = followerDocSnapshot.data();

            console.log("Follower Data:", followerData);


            await triggerAddAudioNFTNotification(
              albumName,
              creatorWalletAddress,
              createXechoData,
              tokenId,
              [followerData.walletAddress],
              price,


            );
          }
        });

        return collectionDoc.id;
      }
    }

    console.log("NFT data added successfully");
  } catch (error) {
    console.error("Error adding NFT data to Firebase:", error);
    throw error;
  }
}





/*****************************************************************************************************************************************************************************************
                                                                              
                                                        FUNTION TO ADD A CREATE FOR SALE TRANSACTION TO TRANSACTIONS COLLECTION IN FIREBASE

******************************************************************************************************************************************************************************************/

export async function addCreateAudioTransactionToFirebase(
  txHash,
  tokenId,
  albumName,
  walletAddress,
  createXechoData,
  formattedPriceString,
  blockHash,
  blockNumber,
  from,
  to,
  gasUsed,
  tokenURI,
  currentTimestamp
) {

  try {
    const firestore = getFirestore();
    const transactionsRef = collection(firestore, 'transactions');
    const timestamp = serverTimestamp();
    const newTransaction = {
      txHash: txHash,
      tokenId: tokenId,
      albumName: albumName,
      walletAddress: walletAddress,
      createXechoData: createXechoData,
      formattedPriceString,
      blockHash: blockHash.toString(),
      blockNumber: blockNumber.toString(),
      from: from,
      to: to,
      gasUsed: gasUsed,
      tokenURI: tokenURI,
      timestamp: currentTimestamp,
      type: "CREATE AUDIO ASSET FOR SALE",

    };


    await addDoc(transactionsRef, newTransaction);

    console.log('Transaction added to Firestore:', newTransaction);
  } catch (error) {
    console.error('Error adding transaction to Firestore:', error);
    throw error;
  }
}





/*****************************************************************************************************************************************************************************************
                                                                              
                                                                      TRIGGERING NOTIFICATIONS FOR NFT MINTING FUNCTION

******************************************************************************************************************************************************************************************/

export const triggerAddAudioNFTNotification = async (albumName, walletAddress, createXechoData, tokenId, followerIds) => {
  try {
    console.log('Triggering add NFT notification...');
    console.log('Album Name:', albumName);
    console.log('Wallet Address:', walletAddress);
    console.log('Create NFT Data:', createXechoData);
    console.log('Token ID:', tokenId);
    console.log('Follower IDs:', followerIds);

    const firestore = getFirestore();
    const notificationsRef = collection(firestore, 'notifications');

    console.log('NFT Token ID:', tokenId);
    console.log('NFT Collection Name:', albumName);

    const usersRef = collection(firestore, 'users');
    const sellerQuery = query(usersRef, where('walletAddress', '==', walletAddress));
    const sellerSnapshot = await getDocs(sellerQuery);

    let sellerUsername = 'Unknown User';
    if (!sellerSnapshot.empty) {
      sellerUsername = sellerSnapshot.docs[0].data().username;
    }

    const recipient = followerIds;

    let message;
    if (albumName) {
      message = `${sellerUsername} Has minted ${createXechoData.name} #${tokenId} into ${albumName}`;
    } else {
      message = `${sellerUsername} Has minted ${createXechoData.name} #${tokenId}`;
    }

    const notificationData = {
      type: 'AUDIO NFT MINTED',
      seller: sellerUsername,
      tokenId: tokenId.toString(),
      nftName: createXechoData.name,
      recipient: recipient,
      timestamp: Date.now(),
      Message: message,
      read: false,
    };

    console.log('Notification Data:', notificationData);

    await addDoc(notificationsRef, notificationData);
    console.log('Notification added.');

    console.log('Add NFT notification triggered successfully!');
  } catch (error) {
    console.error('Error triggering add NFT notification:', error);
    throw error;
  }
};





/*****************************************************************************************************************************************************************************************
                                                                                
                                                              CREATE VIDEO ALBUM FUNCTION CALLED FROM CREATE COLLECTION PAGE

******************************************************************************************************************************************************************************************/

export const createAudioAlbum = async (audioAlbumData, albumImage, bannerImage, featuredImage) => {
  const firestore = getFirestore();
  const userCollectionsRef = collection(firestore, "userCollections");
  const timestamp = new Date();
  const newCollection = {
    albumName: audioAlbumData.albumName,
    website: audioAlbumData.website,
    walletAddress: audioAlbumData.walletAddress,
    albumImageUrl: "",
    bannerImageUrl: "",
    featuredImageUrl: "",
    socials: audioAlbumData.socials || {
      twitter: "",
      facebook: "",
      instagram: "",
      tiktok: "",
      discord: "",
    },
    tokenIds: [],
    description: audioAlbumData.description,
    artists: audioAlbumData.artists,
    credits: audioAlbumData.credits,
    genres: audioAlbumData.genres,
    type: "AUDIO ALBUM",
    timestamp: timestamp,
  };
  console.log("Created newCollection:", newCollection);

  try {
    const docRef = await addDoc(userCollectionsRef, newCollection);
    const docId = docRef.id;

    if (albumImage) {
      const storage = getStorage();
      const albumImageRef = ref(storage, `collectionImages/${docId}/logoImages`);


      await uploadBytes(albumImageRef, albumImage);
      console.log("Image uploaded successfully.");

      const albumImageUrl = await getDownloadURL(albumImageRef);
      console.log("collectionImageUrl:", albumImageUrl);

      await updateDoc(doc(firestore, "userCollections", docId), {
        albumImageUrl: albumImageUrl,
      });
      console.log("Collection image updated successfully.");
    }

    if (bannerImage) {
      const storage = getStorage();
      const bannerImageRef = ref(storage, `collectionImages/${docId}/bannerImages`);
      console.log("bannerImageRef:", bannerImageRef);

      await uploadBytes(bannerImageRef, bannerImage);
      console.log("Banner image uploaded successfully.");

      const bannerImageUrl = await getDownloadURL(bannerImageRef);
      console.log("bannerImageUrl:", bannerImageUrl);

      await updateDoc(doc(firestore, "userCollections", docId), {
        bannerImageUrl: bannerImageUrl,
      });
      console.log("Banner image updated successfully.");
    }

    if (featuredImage) {
      const storage = getStorage();
      const featuredImageRef = ref(storage, `collectionImages/${docId}/featuredImages`);
      console.log("featuredImageRef:", featuredImageRef);

      await uploadBytes(featuredImageRef, featuredImage);
      console.log("Featured image uploaded successfully.");

      const featuredImageUrl = await getDownloadURL(featuredImageRef);
      console.log("featuredImageUrl:", featuredImageUrl);

      await updateDoc(doc(firestore, "userCollections", docId), {
        featuredImageUrl: featuredImageUrl,
      });
      console.log("Featured image updated successfully.");
    }

    console.log("Collection added successfully!");
    const usersRef = collection(firestore, "users");
    const userQuerySnapshot = await getDocs(query(usersRef, where("walletAddress", "==", audioAlbumData.walletAddress)));

    if (!userQuerySnapshot.empty) {
      const userDoc = userQuerySnapshot.docs[0];
      const userRef = doc(firestore, "users", userDoc.id);

      await updateDoc(userRef, {
        collectionsCreated: [...userDoc.data().collectionsCreated, docId],
      });

      console.log("Updated 'users' collection with the new docId");

      const followerIds = userDoc.data().followers;
      const creatorWalletAddress = audioAlbumData.walletAddress;

      followerIds.forEach(async (followerId) => {
        const followerDocSnapshot = await getDoc(doc(firestore, "users", followerId));
        if (followerDocSnapshot.exists()) {
          const followerData = followerDocSnapshot.data();


          await triggerCreateAlbumNotification(
            creatorWalletAddress,
            audioAlbumData,
            [followerData.walletAddress]
          );
        } else {
          console.error("User does not exist");
        }
      });
    } else {
      console.error("User does not exist");
    }

    return docId; // Return the docId
  } catch (error) {
    console.error("Error adding collection: ", error);
    throw error;
  }
};





/*****************************************************************************************************************************************************************************************
                                                                                
                                                                 UPDATE AUDIO ALBUM FUNCTION CALLED WHEN COLLECTION CREATED

******************************************************************************************************************************************************************************************/

export const updateAudioAlbum = async (
  walletAddress,
  updates,
  bannerImage,
  featuredImage,
  docId
) => {
  try {
    const userCollectionsRef = collection(db, 'userCollections');
    const q = query(userCollectionsRef, where('walletAddress', '==', walletAddress));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const collectionDoc = querySnapshot.docs[0];
      const collectionRef = doc(db, 'userCollections', collectionDoc.id);

      if (bannerImage) {
        const storage = getStorage();
        const bannerImageRef = ref(
          storage,
          `collectionImages/${collectionDoc.id}/bannerImages`
        );

        await uploadBytes(bannerImageRef, bannerImage);
        const bannerImageUrl = await getDownloadURL(bannerImageRef);

        updates.bannerImageUrl = bannerImageUrl;
      }

      if (featuredImage) {
        const storage = getStorage();
        const featuredImageRef = ref(
          storage,
          `collectionImages/${collectionDoc.id}/featuredImages`
        );

        await uploadBytes(featuredImageRef, featuredImage);
        const featuredImageUrl = await getDownloadURL(featuredImageRef);

        updates.featuredImageUrl = featuredImageUrl;
      }

      // Add a timestamp for the last update
      updates.lastUpdated = serverTimestamp(); // Include the current timestamp for the last update

      await updateDoc(collectionRef, updates);
      console.log('Collection document updated successfully');

      const usersRef = collection(db, 'users');
      const userQuerySnapshot = await getDocs(
        query(usersRef, where('walletAddress', '==', walletAddress))
      );

      if (!userQuerySnapshot.empty) {
        const userDoc = userQuerySnapshot.docs[0];
        const userRef = doc(db, 'users', userDoc.id);

        await updateDoc(userRef, {
          collectionsCreated: [...userDoc.data().collectionsCreated, docId],
        });

        console.log("Updated 'users' collection with the new docId");
      }
    } else {
      console.error('Collection does not exist');
      throw new Error('Collection does not exist');
    }
  } catch (error) {
    console.error('Error updating collection: ', error);
    throw error;
  }
};





/*****************************************************************************************************************************************************************************************
                                                                                
                                                                    TRIGGERING NOTIFICATIONS FOR COLLECTION CREATED FUNCTION

******************************************************************************************************************************************************************************************/

export const triggerCreateAlbumNotification = async (creatorWalletAddress, audioAlbumData, followerIds) => {
  try {
    console.log('Triggering add NFT notification...');
    console.log('Wallet Address:', creatorWalletAddress);
    console.log('Create Collection Data:', audioAlbumData);
    console.log('Follower IDs:', followerIds);

    const firestore = getFirestore();
    const notificationsRef = collection(firestore, 'notifications');

    console.log('Asset Album Name:', audioAlbumData.albumName);

    const usersRef = collection(firestore, 'users');
    const creatorQuery = query(usersRef, where('walletAddress', '==', creatorWalletAddress));
    const creatorSnapshot = await getDocs(creatorQuery);

    let creatorUsername = 'Unknown User';
    if (!creatorSnapshot.empty) {
      creatorUsername = creatorSnapshot.docs[0].data().username;
    }

    const recipient = followerIds;
    const albumName = audioAlbumData.albumName;

    const notificationData = {
      type: 'ALBUM CREATED',
      creator: creatorUsername,
      albumName: albumName,
      recipient: recipient,
      timestamp: Date.now(),
      Message: `${creatorUsername} has created a new collection: ${albumName}`,
      read: false,
    };

    console.log('Notification Data:', notificationData);

    await addDoc(notificationsRef, notificationData);
    console.log('Notification added.');

    console.log('Create collection notification triggered successfully!');
  } catch (error) {
    console.error('Error triggering create collection notification:', error);
    throw error;
  }
};