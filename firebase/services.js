import { getFirestore, collection, query, where, addDoc, getDocs, getDoc, deleteDoc, doc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { arrayUnion } from 'firebase/firestore';
import { firestore, db } from "./config";


/*****************************************************************************************************************************************************************************************
                                                                                
                                                                                 ADD USER FUNCTION 

******************************************************************************************************************************************************************************************/

const storage = getStorage();
export const addUser = async (username, email, website, walletAddress, profilePicture, isArtCreator, isAudioCreator, isVideoCreator, creatorPage, socials) => {
  const userRef = collection(firestore, "users");
  const newUser = {
    email,
    username,
    website,
    walletAddress,
    profilePictureUrl: "",
    isArtCreator: isArtCreator || false,
    isAudioCreator: isAudioCreator || false,
    isVideoCreator: isVideoCreator || false,
    creatorPage: creatorPage || "",
    nftsCreated: [],
    nftsListed: [],
    nftsSold: [],
    nftsOwned: [],
    socials: socials || {
      twitter: "",
      facebook: "",
      instagram: "",
      tiktok: "",
      discord: "",
    },
    collectionsCreated: [],
    nftsOwned: [],
    followers: [],
    following: [],
    kyc: "NOT APPLIED",
  };

  try {
    const docRef = await addDoc(userRef, newUser);

    if (profilePicture) {
      // Upload the profile image to Firebase Storage
      const storage = getStorage();
      const profilePictureRef = ref(storage, `users/${docRef.id}/profileImages`);
      await uploadBytes(profilePictureRef, profilePicture);
      const profilePictureUrl = await getDownloadURL(profilePictureRef);

      // Update the user's profile picture in the Firebase Firestore database
      await updateDoc(doc(firestore, "users", docRef.id), {
        profilePictureUrl: profilePictureUrl,
      });
    }

  } catch (error) {
    console.error("Error adding user: ", error);
  }
};





/*****************************************************************************************************************************************************************************************
                                                                                
                                                                              GET UPDATE USER FUNCTION 

******************************************************************************************************************************************************************************************/

export const updateUser = async (walletAddress, updates) => {

  try {
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("walletAddress", "==", walletAddress));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userRef = doc(db, "users", userDoc.id);
      await updateDoc(userRef, updates);
      console.log("User document updated successfully");
    } else {
      console.error("User does not exist");
      throw new Error("User does not exist"); // Throw an error to handle the case where the user does not exist
    }
  } catch (error) {
    console.error("Error updating user: ", error);
    throw error; // Throw the error to handle it in the calling code
  }
};





/*****************************************************************************************************************************************************************************************
                                                                                
                                                                        UPDATE USERS PROFILE PICTURE FUNCTION

******************************************************************************************************************************************************************************************/

export const updateUserProfilePicture = async (walletAddress, profilePicture) => {
  const db = getFirestore();
  const storage = getStorage();
  try {
    if (profilePicture) {
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("walletAddress", "==", walletAddress));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userRef = doc(db, "users", userDoc.id);
        const userData = userDoc.data();

        const profilePictureRef = ref(storage, `users/${userDoc.id}/profilePicture.jpg`);

        await uploadBytes(profilePictureRef, profilePicture);
        const profilePictureUrl = await getDownloadURL(profilePictureRef);

        await updateDoc(userRef, { profilePictureUrl });
        console.log("User document updated successfully");
      } else {
        console.error("User does not exist");
        throw new Error("User does not exist");
      }
    } else {
      console.error("Profile picture is missing");
      throw new Error("Profile picture is missing"); // Throw an error to handle the case where the profile picture is missing
    }
  } catch (error) {
    console.error("Error updating user profile picture: ", error);
    throw error; // Throw the error to handle it in the calling code
  }
};





/*****************************************************************************************************************************************************************************************
                                                                                
                                                                   GET USER USING THE LOGGED IN USER FUNCTION

******************************************************************************************************************************************************************************************/

const userCache = {};

export const getUser = async (userId) => {
  if (userCache[userId]) {
    console.log("Result fetched from cache for userId:", userId);
    return userCache[userId];
  }

  const userRef = doc(firestore, "users", userId);

  try {
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      const { username, email, walletAddress, profilePictureUrl, isArtCreator, isVideoCreator, isAudioCreator } = userData;

      const user = { id: userSnapshot.id, username, email, walletAddress, profilePictureUrl, isArtCreator, isVideoCreator, isAudioCreator };
      userCache[userId] = user;
      return user;
    } else {
      console.error("User does not exist");
    }
  } catch (error) {
    console.error("Error getting user: ", error);
  }
};






/*****************************************************************************************************************************************************************************************
                                                                                
                                                                   GET USER PROFILE FUNCTION CALLED FOR PROFILE DATA 

******************************************************************************************************************************************************************************************/

export const getUserProfile = async (walletAddress) => {
  const firestore = getFirestore();
  const q = query(collection(firestore, "users"),
    where("walletAddress", "==", walletAddress));

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    let userProfile = null;
    querySnapshot.forEach((doc) => {
      userProfile = { id: doc.id, ...doc.data() };
    });
    return userProfile;
  } else {
    console.error("No user found with the given wallet address");
    return null;
  }
};






export const getUserProfileByUsername = async (username) => {
  const firestore = getFirestore();
  const q = query(collection(firestore, "users"), where("username", "==", username));

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    let userProfile = null;
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      userProfile = { id: doc.id, ...doc.data() };
    });
    return userProfile;
  } else {
    console.error("No user found with the given username");
    return null;
  }
};




/*****************************************************************************************************************************************************************************************
                                                                                
                                                                   ADD A FOLLOWER TO THE USER FOLLOWERS AND FOLLOWERS FOLLOWING FIELDS

******************************************************************************************************************************************************************************************/

export const addFollower = async (userAddress, followerAddress) => {
  try {
    console.log('Adding follower...');
    console.log('User Address:', userAddress);
    console.log('Follower Address:', followerAddress);

    const firestore = getFirestore();
    const usersCollection = collection(firestore, "users");

    // Get the user document based on user address
    const userQuery = query(usersCollection, where('walletAddress', '==', userAddress));
    const userQuerySnapshot = await getDocs(userQuery);
    const userDocs = userQuerySnapshot.docs;
    const userDoc = userDocs[0];
    const userId = userDoc.id;
    console.log('User ID:', userId);

    // Get the follower document based on follower address
    const followerQuery = query(usersCollection, where('walletAddress', '==', followerAddress));
    const followerQuerySnapshot = await getDocs(followerQuery);
    const followerDocs = followerQuerySnapshot.docs;
    const followerDoc = followerDocs[0];
    const followerId = followerDoc.id;
    console.log('Follower ID:', followerId);

    // Check if the user is already following the follower
    if (userDoc.data().following.includes(userId)) {
      console.log('User is already following the follower.');
      toast.error('You are already following this user.');
      return;
    }

    // Get the current following and followers arrays
    const userFollowing = userDoc.data().following || [];
    const userFollowers = userDoc.data().followers || [];
    const followerFollowing = followerDoc.data().following || [];
    const followerFollowers = followerDoc.data().followers || [];

    // Update the arrays with the new IDs
    const updatedUserFollowers = [...userFollowers, followerId];
    const updatedFollowerFollowing = [...followerFollowing, userId];

    // Add follower to the user's followers field
    await updateDoc(doc(firestore, "users", userId), {
      followers: updatedUserFollowers,
    });
    console.log('Follower added to user followers field.');

    // Add the user to the follower's following field
    await updateDoc(doc(firestore, "users", followerId), {
      following: updatedFollowerFollowing,
    });
    console.log('User added to follower following field.');

    await triggerFollowedNotification(userAddress, followerAddress);

    console.log('Follower added successfully!');
  } catch (error) {
    console.error('Error adding follower:', error);
    toast.error('Error adding follower. Please try again.');
  }
};







/*****************************************************************************************************************************************************************************************
                                                                                
                                                                                 IS FOLLOWING USER FUNCTION

******************************************************************************************************************************************************************************************/
// Create a cache object to store the results
const isFollowingCache = {};
export const isFollowingUser = async (userAddress, followerAddress) => {
  // Generate a unique cache key for this combination of userAddress and followerAddress
  const cacheKey = `${userAddress}_${followerAddress}`;
  // Check if the result is already cached for the given cache key
  if (isFollowingCache[cacheKey] !== undefined) {
    console.log("Result fetched from cache for userAddress:", userAddress, "and followerAddress:", followerAddress);
    return isFollowingCache[cacheKey];
  }
  try {
    console.log('Checking following status...');
    console.log('User Address:', userAddress);
    console.log('Follower Address:', followerAddress);
    const firestore = getFirestore();
    const usersCollection = collection(firestore, "users");
    // Get the user document based on user address
    const userQuery = query(usersCollection, where('walletAddress', '==', userAddress));
    const userQuerySnapshot = await getDocs(userQuery);
    const userDocs = userQuerySnapshot.docs;
    const userDoc = userDocs[0];
    const userId = userDoc.id;
    console.log('User ID:', userId);
    // Get the follower document based on follower address
    const followerQuery = query(usersCollection, where('walletAddress', '==', followerAddress));
    const followerQuerySnapshot = await getDocs(followerQuery);
    const followerDocs = followerQuerySnapshot.docs;
    const followerDoc = followerDocs[0];
    const followerId = followerDoc.id;
    console.log('Follower ID:', followerId);
    // Check if the user's followers array includes the followerId
    const isFollowing = userDoc.data().followers.includes(followerId);
    console.log('Following status:', isFollowing);


    isFollowingCache[cacheKey] = isFollowing;
    return isFollowing;
  } catch (error) {
    console.error('Error checking following status:', error);
    throw error;
  }
};





/*****************************************************************************************************************************************************************************************
                                                                                
                                                                   GET THE CONNECTED WALLETS FOLLOWING AND FOLLOWERS DATA

******************************************************************************************************************************************************************************************/
const cacheFollowers = {};

export const getFollowingAndFollowers = async (currentAccount) => {
  try {
    if (cacheFollowers[currentAccount]) {

      console.log('Retrieving following and followers from cache:', currentAccount);
      return cacheFollowers[currentAccount];
    }

    const firestore = getFirestore();
    const usersCollection = collection(firestore, "users");
    console.log('Wallet Address Coming In From MyProfile:', currentAccount);

    // Get the user document based on wallet address
    const userQuery = query(usersCollection, where('walletAddress', '==', currentAccount));
    const userQuerySnapshot = await getDocs(userQuery);
    const userDocs = userQuerySnapshot.docs;
    const userDoc = userDocs[0];
    const userId = userDoc.id;

    // Retrieve the user's following and followers arrays
    const userData = userDoc.data();
    const followingIds = userData.following;
    const followerIds = userData.followers;

    console.log('Following IDs FB FUNCTION:', followingIds);
    console.log('Follower IDs FB FUNCTION:', followerIds);

    // Get the following users' documents
    const followingDocsPromises = followingIds.map(async (followingId) => {
      const followingDocRef = doc(usersCollection, followingId);
      const followingDocSnapshot = await getDoc(followingDocRef);
      const followingUser = followingDocSnapshot.data();
      return followingUser;
    });

    const followingUsers = await Promise.all(followingDocsPromises);

    console.log('Following Users FB FUNCTION:', followingUsers);

    // Get the follower users' documents
    const followerDocsPromises = followerIds.map(async (followerId) => {
      const followerDocRef = doc(usersCollection, followerId);
      const followerDocSnapshot = await getDoc(followerDocRef);
      const followerUser = followerDocSnapshot.data();
      return followerUser;
    });

    const followerUsers = await Promise.all(followerDocsPromises);

    console.log('Follower Users FB FUNCTION:', followerUsers);

    const result = {
      myFollowing: followingUsers.filter((user) => user !== null),
      myFollowers: followerUsers.filter((user) => user !== null),
    };

    // store the session hopeflly
    cacheFollowers[currentAccount] = result;

    return result;
  } catch (error) {
    console.error('Error retrieving following and followers:', error);
    throw error;
  }
};



/*****************************************************************************************************************************************************************************************
                                                                                
                                                                   REMOVE A FOLLOWER FROM THE USER FOLLOWERS AND FOLLOWERS FOLLOWING FIELDS

******************************************************************************************************************************************************************************************/

export const removeFollower = async (userAddress, followerAddress) => {
  try {
    console.log('Removing follower...');
    console.log('User Address:', userAddress);
    console.log('Follower Address:', followerAddress);

    const firestore = getFirestore();
    const usersCollection = collection(firestore, "users");

    // Get the user document based on user address
    const userQuery = query(usersCollection, where('walletAddress', '==', userAddress));
    const userQuerySnapshot = await getDocs(userQuery);
    const userDocs = userQuerySnapshot.docs;
    const userDoc = userDocs[0];
    const userId = userDoc.id;
    console.log('User ID:', userId);

    // Get the follower document based on follower address
    const followerQuery = query(usersCollection, where('walletAddress', '==', followerAddress));
    const followerQuerySnapshot = await getDocs(followerQuery);
    const followerDocs = followerQuerySnapshot.docs;
    const followerDoc = followerDocs[0];
    const followerId = followerDoc.id;
    console.log('Follower ID:', followerId);

    // Remove follower from the user's followers field
    await updateDoc(doc(firestore, "users", userId), {
      followers: userDoc.data().followers.filter(id => id !== followerId),
    });
    console.log('Follower removed from user followers field.');

    // Remove the user from the follower's following field
    await updateDoc(doc(firestore, "users", followerId), {
      following: followerDoc.data().following.filter(id => id !== userId),
    });
    console.log('User removed from follower following field.');

    console.log('Follower removed successfully!');
  } catch (error) {
    console.error('Error removing follower:', error);
  }
};
/*****************************************************************************************************************************************************************************************
                                                                                
                                                              CREATE COLLECTION FUNCTION CALLED FROM CREATE COLLECTION PAGE

******************************************************************************************************************************************************************************************/
export const createCollection = async (collectionData, collectionImage, bannerImage, featuredImage) => {
  const firestore = getFirestore();
  const userCollectionsRef = collection(firestore, "userCollections");
  const newCollection = {
    collectionName: collectionData.collectionName,
    website: collectionData.website,
    walletAddress: collectionData.walletAddress,
    collectionImageUrl: "",
    bannerImageUrl: "",
    featuredImageUrl: "",
    socials: collectionData.socials || {
      twitter: "",
      facebook: "",
      instagram: "",
      tiktok: "",
      discord: "",
    },
    tokenIds: [],
    description: collectionData.description,
    type: "IMAGE COLLECTION"
  };
  console.log("Created newCollection:", newCollection);
  try {
    const docRef = await addDoc(userCollectionsRef, newCollection);
    const docId = docRef.id;
    if (collectionImage) {
      const storage = getStorage();
      const collectionImageRef = ref(storage, `collectionImages/${docId}/logoImages`);
      console.log("collectionImageRef:", collectionImageRef);

      await uploadBytes(collectionImageRef, collectionImage);
      console.log("Image uploaded successfully.");

      const collectionImageUrl = await getDownloadURL(collectionImageRef);
      console.log("collectionImageUrl:", collectionImageUrl);

      await updateDoc(doc(firestore, "userCollections", docId), {
        collectionImageUrl: collectionImageUrl,
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
    const userQuerySnapshot = await getDocs(query(usersRef, where("walletAddress", "==", collectionData.walletAddress)));

    if (!userQuerySnapshot.empty) {
      const userDoc = userQuerySnapshot.docs[0];
      const userRef = doc(firestore, "users", userDoc.id);

      await updateDoc(userRef, {
        collectionsCreated: [...userDoc.data().collectionsCreated, docId],
      });

      console.log("Updated 'users' collection with the new docId");

      const followerIds = userDoc.data().followers;
      const creatorWalletAddress = collectionData.walletAddress;

      followerIds.forEach(async (followerId) => {
        const followerDocSnapshot = await getDoc(doc(firestore, "users", followerId));
        if (followerDocSnapshot.exists()) {
          const followerData = followerDocSnapshot.data();


          await triggerCreateCollectionNotification(
            creatorWalletAddress,
            collectionData,
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
                                                                                
                                                                 UPDATE COLLECTION FUNCTION CALLED WHEN COLLECTION CREATED

******************************************************************************************************************************************************************************************/

export const updateCollection = async (walletAddress, updates, bannerImage, featuredImage, docId) => {
  try {
    const userCollectionsRef = collection(db, "userCollections");
    const q = query(userCollectionsRef, where("walletAddress", "==", walletAddress));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const collectionDoc = querySnapshot.docs[0];
      const collectionRef = doc(db, "userCollections", collectionDoc.id);

      if (bannerImage) {
        const storage = getStorage();
        const bannerImageRef = ref(storage, `collectionImages/${collectionDoc.id}/bannerImages`);
        console.log("bannerImageRef:", bannerImageRef);

        await uploadBytes(bannerImageRef, bannerImage);
        console.log("Banner image uploaded successfully.");

        const bannerImageUrl = await getDownloadURL(bannerImageRef);
        console.log("bannerImageUrl:", bannerImageUrl);

        updates.bannerImageUrl = bannerImageUrl;
      }

      if (featuredImage) {
        const storage = getStorage();
        const featuredImageRef = ref(storage, `collectionImages/${collectionDoc.id}/featuredImages`);
        console.log("featuredImageRef:", featuredImageRef);

        await uploadBytes(featuredImageRef, featuredImage);
        console.log("Featured image uploaded successfully.");

        const featuredImageUrl = await getDownloadURL(featuredImageRef);
        console.log("featuredImageUrl:", featuredImageUrl);

        updates.featuredImageUrl = featuredImageUrl;
      }

      await updateDoc(collectionRef, updates);
      console.log("Collection document updated successfully");

      // Check if the 'users' collection document exists
      const usersRef = collection(db, "users");
      const userQuerySnapshot = await getDocs(query(usersRef, where("walletAddress", "==", walletAddress)));

      if (!userQuerySnapshot.empty) {
        // If the 'users' collection document exists, update the 'collectionsCreated' field
        const userDoc = userQuerySnapshot.docs[0];
        const userRef = doc(db, "users", userDoc.id);

        await updateDoc(userRef, {
          collectionsCreated: [...userDoc.data().collectionsCreated, docId],
        });

        console.log("Updated 'users' collection with the new docId");
      }

    } else {
      console.error("Collection does not exist");
      throw new Error("Collection does not exist");
    }
  } catch (error) {
    console.error("Error updating collection: ", error);
    throw error;
  }
};





/*****************************************************************************************************************************************************************************************
                                                                                
                                                              CREATE VIDEO SERIES FUNCTION CALLED FROM CREATE COLLECTION PAGE

******************************************************************************************************************************************************************************************/

export const createVideoSeries = async (videoSeriesData, seriesImage, bannerImage, featuredImage) => {
  const firestore = getFirestore();
  const userCollectionsRef = collection(firestore, "userCollections");
  const newCollection = {
    seriesName: videoSeriesData.seriesName,
    website: videoSeriesData.website,
    walletAddress: videoSeriesData.walletAddress,
    seriesImageUrl: "",
    bannerImageUrl: "",
    featuredImageUrl: "",
    socials: videoSeriesData.socials || {
      twitter: "",
      facebook: "",
      instagram: "",
      tiktok: "",
      discord: "",
    },
    tokenIds: [],
    description: videoSeriesData.description,
    cast: videoSeriesData.cast,
    creator: videoSeriesData.creator,
    credits: videoSeriesData.credits,
    genres: videoSeriesData.genres,
    type: "VIDEO SERIES"
  };
  console.log("Created newCollection:", newCollection);

  try {
    const docRef = await addDoc(userCollectionsRef, newCollection);
    const docId = docRef.id;

    if (seriesImage) {
      const storage = getStorage();
      const seriesImageRef = ref(storage, `collectionImages/${docId}/logoImages`);
    

      await uploadBytes(seriesImageRef, seriesImage);
      console.log("Image uploaded successfully.");

      const seriesImageUrl = await getDownloadURL(seriesImageRef);
      console.log("collectionImageUrl:", seriesImageUrl);

      await updateDoc(doc(firestore, "userCollections", docId), {
        seriesImageUrl: seriesImageUrl,
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
    const userQuerySnapshot = await getDocs(query(usersRef, where("walletAddress", "==", videoSeriesData.walletAddress)));

    if (!userQuerySnapshot.empty) {
      const userDoc = userQuerySnapshot.docs[0];
      const userRef = doc(firestore, "users", userDoc.id);

      await updateDoc(userRef, {
        collectionsCreated: [...userDoc.data().collectionsCreated, docId],
      });

      console.log("Updated 'users' collection with the new docId");

      const followerIds = userDoc.data().followers;
      const creatorWalletAddress = videoSeriesData.walletAddress;

      followerIds.forEach(async (followerId) => {
        const followerDocSnapshot = await getDoc(doc(firestore, "users", followerId));
        if (followerDocSnapshot.exists()) {
          const followerData = followerDocSnapshot.data();


          await triggerCreateSeriesNotification(
            creatorWalletAddress,
            videoSeriesData,
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
                                                                                
                                                                 UPDATE VIDEO SERIES FUNCTION CALLED WHEN COLLECTION CREATED

******************************************************************************************************************************************************************************************/

export const updateVideoSeries = async (walletAddress, updates, bannerImage, featuredImage, docId) => {
  try {
    const userCollectionsRef = collection(db, "userCollections");
    const q = query(userCollectionsRef, where("walletAddress", "==", walletAddress));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const collectionDoc = querySnapshot.docs[0];
      const collectionRef = doc(db, "userCollections", collectionDoc.id);

      if (bannerImage) {
        const storage = getStorage();
        const bannerImageRef = ref(storage, `collectionImages/${collectionDoc.id}/bannerImages`);
        console.log("bannerImageRef:", bannerImageRef);

        await uploadBytes(bannerImageRef, bannerImage);
        console.log("Banner image uploaded successfully.");

        const bannerImageUrl = await getDownloadURL(bannerImageRef);
        console.log("bannerImageUrl:", bannerImageUrl);

        updates.bannerImageUrl = bannerImageUrl;
      }

      if (featuredImage) {
        const storage = getStorage();
        const featuredImageRef = ref(storage, `collectionImages/${collectionDoc.id}/featuredImages`);
        console.log("featuredImageRef:", featuredImageRef);

        await uploadBytes(featuredImageRef, featuredImage);
        console.log("Featured image uploaded successfully.");

        const featuredImageUrl = await getDownloadURL(featuredImageRef);
        console.log("featuredImageUrl:", featuredImageUrl);

        updates.featuredImageUrl = featuredImageUrl;
      }

      await updateDoc(collectionRef, updates);
      console.log("Collection document updated successfully");

      // Check if the 'users' collection document exists
      const usersRef = collection(db, "users");
      const userQuerySnapshot = await getDocs(query(usersRef, where("walletAddress", "==", walletAddress)));

      if (!userQuerySnapshot.empty) {
        // If the 'users' collection document exists, update the 'collectionsCreated' field
        const userDoc = userQuerySnapshot.docs[0];
        const userRef = doc(db, "users", userDoc.id);

        await updateDoc(userRef, {
          collectionsCreated: [...userDoc.data().collectionsCreated, docId],
        });

        console.log("Updated 'users' collection with the new docId");
      }

    } else {
      console.error("Collection does not exist");
      throw new Error("Collection does not exist");
    }
  } catch (error) {
    console.error("Error updating collection: ", error);
    throw error;
  }
};







/*****************************************************************************************************************************************************************************************
                                                                                
                                                                                    GET USER COLLECTIONS FUNCTION 

******************************************************************************************************************************************************************************************/


export const getUserCollections = async (currentAddress) => {
  console.log("currentAddress:", currentAddress);
  try {
    const userProfile = await getUserProfile(currentAddress);

    if (userProfile) {
      const { collectionsCreated } = userProfile;

      console.log("collectionsCreated:", collectionsCreated);

      const firestore = getFirestore();
      const usersCollections = collection(firestore, "userCollections");

      const collectionsCreatedData = await Promise.all(
        collectionsCreated.map(async (docId) => {
          const docRef = doc(usersCollections, docId);
          const docSnapshot = await getDoc(docRef);

          if (docSnapshot.exists()) {
            const nftData = { id: docSnapshot.id, ...docSnapshot.data() };
            console.log("Fetched collection data for docId:", docId, nftData);
            return nftData;
          } else {
            console.log("No matching collection found for docId:", docId);
            return null;
          }
        })
      );

      console.log("collectionsCreatedData:", collectionsCreatedData);

      return {
        collectionsCreated: collectionsCreatedData.filter((collection) => collection !== null),
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user NFTs:", error);
    throw error;
  }
}






/*****************************************************************************************************************************************************************************************

                                                                              GET USER COLLECTION DATA FUNCTION

******************************************************************************************************************************************************************************************/

const collectionsDataCache = {};

export const getCollectionsData = async (currentAddress) => {
  // Check cache
  if (collectionsDataCache[currentAddress]) {
    console.log("Returning collectionsData from cache for address:", currentAddress);
    return collectionsDataCache[currentAddress];
  }

  try {
    const collectionsData = await getUserCollections(currentAddress);

    if (collectionsData) {
      const { collectionsCreated } = collectionsData;
      const collectionsCreatedData = [];

      for (const collection of collectionsCreated) {
        const collectionData = {};

        // Iterate through the keys in the collection object and add them to collectionData
        for (const key in collection) {
          if (collection.hasOwnProperty(key)) {
            collectionData[key] = collection[key];
          }
        }

        collectionsCreatedData.push(collectionData);
      }

      // Store in cache
      collectionsDataCache[currentAddress] = collectionsCreatedData;

      console.log("collectionsData:", collectionsData);
      console.log("collectionsCreatedData:", collectionsCreatedData);
      return collectionsCreatedData;
    } else {
      console.log("No collections data found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching collections data:", error);
    throw error;
  }
};








const collectionDataWithNameCache = {};

export const getCollectionDataWithName = async (name) => {
  try {
    // Check cache
    if (collectionDataWithNameCache[name]) {
      console.log(`Returning collectionData from cache for name: ${name}`);
      return collectionDataWithNameCache[name];
    }

    const firestore = getFirestore();
    const userCollectionsRef = collection(firestore, 'userCollections');



    console.log(`Searching for name (${name}) in collectionName, albumName, or seriesName...`);
    const querySnapshot = await getDocs(
      query(userCollectionsRef, 
        where("collectionName", "===", name),
        where("albumName", "===", name),
        where("seriesName", "===", name)
      )
    );

    console.log(`Query snapshot size: ${querySnapshot.size}`);
    
    if (!querySnapshot.empty) {
      const collectionData = querySnapshot.docs[0].data();

      // Store in cache
      collectionDataWithNameCache[name] = collectionData;

      console.log(`Found collectionData for name (${name}):`, collectionData);
      return collectionData;
    } else {
      console.log(`Collection not found for name (${name}).`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching collections data:', error);
    throw error;
  }
};






/*****************************************************************************************************************************************************************************************
                                                                                
                                                 UPDATE TOKEN ID FUNCTION, CALLED WHEN NFT MINTED INTO USERS DOCID AND COLLECTION CREATED  

******************************************************************************************************************************************************************************************/

export async function updateTokenId(walletAddress, tokenId, collectionName) {
  try {
    console.log('Wallet Address:', walletAddress);
    console.log('Collection Name:', collectionName);

    const usersRef = collection(db, "users");
    const usersQuerySnapshot = await getDocs(
      query(usersRef, where("walletAddress", "==", walletAddress))
    );

    if (!usersQuerySnapshot.empty && collectionName) {
      const usersDoc = usersQuerySnapshot.docs[0];
      const usersRef = doc(db, "users", usersDoc.id);

      await updateDoc(usersRef, {
        nftsCreated: [tokenId, ...usersDoc.data().nftsCreated],
        nftsListed: [tokenId, ...usersDoc.data().nftsListed],
      });

      console.log("Token ID updated successfully in users document");
      console.log("Updated Users Doc ID:", usersDoc.id);
      console.log("Updated Token IDs in users:", [tokenId, ...usersDoc.data().nftsCreated]);
    }

    if (collectionName) {

      const userCollectionsRef = collection(db, "userCollections");
      const q = query(
        userCollectionsRef,
        where("walletAddress", "==", walletAddress),
        where("collectionName", "==", collectionName)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("Collection does not exist");
      }

      const collectionDoc = querySnapshot.docs[0];
      const collectionRef = doc(db, "userCollections", collectionDoc.id);

      await updateDoc(collectionRef, {
        tokenIds: [tokenId, ...collectionDoc.data().tokenIds],
      });

      console.log("Token ID updated successfully in collection document");
      console.log("Updated Collection Doc ID:", collectionDoc.id);
      console.log("Updated Token IDs:", [tokenId, ...collectionDoc.data().tokenIds]);

      return collectionDoc.id;
    }

  } catch (error) {
    console.error("Error updating token ID:", error);
    throw error;
  }
}





/*****************************************************************************************************************************************************************************************
                                                                                
                                                            ADD NFT TO FIREBASE FUNCTION DONE AT INITIAL NFT CREATION IN MO CONTEXT 

******************************************************************************************************************************************************************************************/

export async function addNFT(collectionName, walletAddress, createNFTData, tokenId, price, tokenURI, currentTimestamp,) {
  try {

    const firestore = getFirestore();
    const nftDataRef = collection(firestore, "nfts");
    const newNFT = {
      collectionName,
      walletAddress,
      ...createNFTData,
      tokenId,
      price: price.toString(),
      tokenURI,
      timestamp: currentTimestamp,
      contract: "0x0Ba25060d827FFb7c51E620c2115E0cD0b3500D8",
      type: "IMAGE ASSET",
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

      if (collectionName) {
        const userCollectionsRef = collection(db, "userCollections");
        const q = query(
          userCollectionsRef,
          where("walletAddress", "==", walletAddress),
          where("collectionName", "==", collectionName)
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


            await triggerAddNFTNotification(
              collectionName,
              creatorWalletAddress,
              createNFTData,
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
}/*****************************************************************************************************************************************************************************************
                                                                                
                                                            ADD  VIDEO NFT TO FIREBASE FUNCTION DONE AT INITIAL NFT CREATION IN MO CONTEXT 

******************************************************************************************************************************************************************************************/
export async function addVideoNFT(
  seriesName,
  walletAddress,
  createVideoData,
  tokenId,
  price,
  tokenURI,
  currentTimestamp,
) {
  try {
    const firestore = getFirestore();
    const nftDataRef = collection(firestore, "nfts");
    const newNFT = {
      seriesName,
      walletAddress,
      ...createVideoData,
      tokenId,
      price: price.toString(),
      tokenURI,
      timestamp: currentTimestamp,
      contract: "0x0Ba25060d827FFb7c51E620c2115E0cD0b3500D8",
      type: "VIDEO ASSET",
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

      if (seriesName && seriesName !== "N/A") {
        const userCollectionsRef = collection(db, "userCollections");
        const q = query(
          userCollectionsRef,
          where("walletAddress", "==", walletAddress),
          where("seriesName", "==", seriesName)
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
            await triggerAddVideoNFTNotification(
              seriesName,
              creatorWalletAddress,
              createVideoData,
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
export async function addCreateVideoTransactionToFirebase(
  txHash,
  tokenId,
  seriesName,
  walletAddress,
  createVideoData,
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
      seriesName: seriesName,
      walletAddress: walletAddress,
      createVideoData: createVideoData,
      formattedPriceString,
      blockHash: blockHash.toString(),
      blockNumber: blockNumber.toString(),
      from: from,
      to: to,
      gasUsed: gasUsed,
      tokenURI: tokenURI,
      timestamp: currentTimestamp,
      type: "CREATE VIDEO NFT FOR SALE",

    };


    await addDoc(transactionsRef, newTransaction);

    console.log('Transaction added to Firestore:', newTransaction);
  } catch (error) {
    console.error('Error adding transaction to Firestore:', error);
    throw error;
  }
}
/*****************************************************************************************************************************************************************************************
                                                                                
                                                                            SELL NFT TO FUNCTION   

******************************************************************************************************************************************************************************************/
export async function sellNFT(buyer, seller, tokenId, price, timestamp, name) {
  try {
    console.log('sellNFT function started');
    console.log('Buyer:', buyer);
    console.log('Seller:', seller);
    console.log('Token ID:', tokenId);
    console.log('Price:', price);
    console.log('Timestamp:', timestamp);
    console.log('nftName:', name);

    // Step 1: Search through the 'nfts' collection to find the document with matching tokenId
    console.log('Step 1: Searching for the NFT with matching Token ID...');
    const firestore = getFirestore();
    const nftsCollectionRef = collection(firestore, 'nfts');
    const q = query(nftsCollectionRef, where('tokenId', '==', Number(tokenId)));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error('NFT with tokenId not found:', tokenId);
      return;
    }

    // Get the matching NFT document and its ID
    let nftDocId;
    let nftData;
    querySnapshot.forEach((doc) => {
      nftDocId = doc.id;
      nftData = doc.data();
    });

    console.log('Step 3: Marking the NFT as sold...');
    const updatedNftData = { ...nftData, isSold: true };
    await updateDoc(doc(nftsCollectionRef, nftDocId), updatedNftData);


    // Step 4: Search the 'users' collection to find the document with the seller's walletAddress
    console.log('Step 4: Searching for the seller in the \'users\' collection...');
    const usersCollectionRef = collection(firestore, 'users');
    const sellerQuerySnapshot = await getDocs(query(usersCollectionRef, where('walletAddress', '==', seller)));

    if (sellerQuerySnapshot.empty) {
      console.error('Seller not found with walletAddress:', seller);
      return;
    }

    // Get the seller's document ID and data
    let sellerDocId;
    let sellerData;
    sellerQuerySnapshot.forEach((doc) => {
      sellerDocId = doc.id;
      sellerData = doc.data();
    });

    // Step 5: Remove the NFT from the seller's 'nftsListed' array and add it to the 'nftsSold' array
    console.log('Step 5: Updating the seller\'s nftsListed and nftsSold arrays...');
    const updatedNftsListed = sellerData.nftsListed.filter((nftId) => nftId !== nftDocId);
    const updatedNftsSold = [...(sellerData.nftsSold || []), nftDocId];

    // Update the seller's document in the 'users' collection
    await updateDoc(doc(usersCollectionRef, sellerDocId), { nftsListed: updatedNftsListed, nftsSold: updatedNftsSold });

    // Step 6: Search the 'users' collection to find the document with the buyer's walletAddress
    console.log('Step 6: Searching for the buyer in the \'users\' collection...');
    const buyerQuerySnapshot = await getDocs(query(usersCollectionRef, where('walletAddress', '==', buyer)));

    if (buyerQuerySnapshot.empty) {
      console.error('Buyer not found with walletAddress:', buyer);
      return;
    }

    // Get the buyer's document ID and data
    let buyerDocId;
    let buyerData;
    buyerQuerySnapshot.forEach((doc) => {
      buyerDocId = doc.id;
      buyerData = doc.data();
    });

    // Step 7: Add the NFT to the buyer's 'nftsOwned' array
    console.log('Step 7: Updating the buyer\'s nftsOwned array...');
    const updatedNftsOwned = [...(buyerData.nftsOwned || []), nftDocId];

    // Update the buyer's document in the 'users' collection
    await updateDoc(doc(usersCollectionRef, buyerDocId), { nftsOwned: updatedNftsOwned });
    await triggerSellNFTNotification(buyer, seller, tokenId, price, timestamp, name);

    console.log('NFT sold successfully!');
  } catch (error) {
    console.error('Error while selling NFT', error);
  }
};

/*****************************************************************************************************************************************************************************************
                                                                                
                                                                                GET MY NFTS + DATA FUNCTION

******************************************************************************************************************************************************************************************/
const nftsCache = {};

export async function getMyNFTs(currentAddress) {
  console.log("currentAddress:", currentAddress);

  if (nftsCache[currentAddress]) {
    console.log("Result fetched from nftsCache for currentAddress:", currentAddress);
    return nftsCache[currentAddress];
  }

  try {
    const userProfile = await getUserProfile(currentAddress);

    if (userProfile) {
      const { nftsCreated, nftsListed, nftsSold, nftsOwned } = userProfile;

      console.log("nftsCreated:", nftsCreated);
      console.log("nftsListed:", nftsListed);
      console.log("nftsSold:", nftsSold);
      console.log("nftsOwned:", nftsOwned);

      const firestore = getFirestore();
      const userCollections = collection(firestore, "nfts");

      const nftsCreatedData = await fetchNFTData(userCollections, nftsCreated);
      const nftsListedData = await fetchNFTData(userCollections, nftsListed);
      const nftsSoldData = await fetchNFTData(userCollections, nftsSold);
      const nftsOwnedData = await fetchNFTData(userCollections, nftsOwned);

      console.log("nftsCreatedData:", nftsCreatedData);
      console.log("nftsListedData:", nftsListedData);
      console.log("nftsSoldData:", nftsSoldData);
      console.log("nftsOwnedData:", nftsOwnedData);

      const result = {
        nftsCreated: nftsCreatedData.filter((nft) => nft !== null),
        nftsListed: nftsListedData.filter((nft) => nft !== null),
        nftsSold: nftsSoldData.filter((nft) => nft !== null),
        nftsOwned: nftsOwnedData.filter((nft) => nft !== null),
      };
      nftsCache[currentAddress] = result;
      return result;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user NFTs:", error);
    throw error;
  }
}

// Helper function to fetch NFT data and handle caching
async function fetchNFTData(userCollections, nftIds) {
  return await Promise.all(
    nftIds.map(async (docId) => {
      // Check if the result is already cached
      if (nftsCache[docId]) {
        console.log("Result fetched from nftsCache for docId:", docId);
        return nftsCache[docId];
      }

      const docRef = doc(userCollections, docId);
      const docSnapshot = await getDoc(docRef);
      const nftData = docSnapshot.exists() ? { id: docSnapshot.id, ...docSnapshot.data() } : null;

      // Cache the result before returning it
      nftsCache[docId] = nftData;
      return nftData;
    })
  );
}






/*****************************************************************************************************************************************************************************************
                                                                                
                                                                               GET NFT DATA FUNCTION

******************************************************************************************************************************************************************************************/
const nftDataCache = {};

export async function getNFTData(tokenId, name) {
  try {
    const cacheKey = `${tokenId}_${name}`;

    if (cacheKey in nftDataCache) {
      console.log("Retrieving NFT data from cache for cacheKey:", cacheKey);
      console.log("Cached data:", nftDataCache[cacheKey]);
      return nftDataCache[cacheKey]; // Return cached data and exit
    }

    const firestore = getFirestore();
    const q = query(collection(firestore, "nfts"), where("tokenId", "==", Number(tokenId)));

    console.log("tokenId FB:", tokenId); // Log the tokenId
    console.log("name FB:", name);

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      let nftData = null;
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        nftData = { id: doc.id, ...doc.data() };
      });
      console.log("Fetched NFT data FB:", nftData); // Log the fetched NFT data

      nftDataCache[cacheKey] = nftData;
      console.log("Cached data:", nftData);

      return nftData;
    } else {
      console.log("No matching NFT found for tokenId:", tokenId);
      return null;
    }
  } catch (error) {
    console.error("Error retrieving NFTs from Firebase:", error);
    throw error;
  }
}








export async function getcollectionNFTData(tokenIds) {
  try {
    console.log("TOKEN IDs to Fetch:", tokenIds);

    const firestore = getFirestore();
    const nftDataPromises = tokenIds.map(async (tokenId) => {
      try {
        const docRef = doc(collection(firestore, "nfts"), tokenId);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          return { id: docSnapshot.id, ...docSnapshot.data() };
        } else {
          console.log("No matching NFT found for tokenId:", tokenId);
          return null;
        }
      } catch (error) {
        console.error("Error fetching NFT data for tokenId:", tokenId, error);
        throw error; // Rethrow the error to be caught by the caller
      }
    });

    const fetchedNftData = await Promise.all(nftDataPromises);
    const filteredNftData = fetchedNftData.filter((data) => data !== null);

    console.log("Fetched NFT data from Firestore:", filteredNftData);
    return filteredNftData;
  } catch (error) {
    console.error("Error retrieving NFTs from Firebase:", error);
    throw error;
  }
}












/*****************************************************************************************************************************************************************************************
                                                                                
                                                                          GET ALL USERS DATA IN XMARKET FUNCTION

******************************************************************************************************************************************************************************************/
/* orig code 
export const getAllUsers = async () => {
  const firestore = getFirestore();
  const q = collection(firestore, "users");

  const querySnapshot = await getDocs(q);
  const users = [];

  querySnapshot.forEach((doc) => {
    users.push({ id: doc.id, ...doc.data() });
  });

  return users;
};
*/


let allUsersCache = null;

export const getAllUsers = async () => {

  if (allUsersCache !== null) {
    console.log("Result fetched from cache for getAllUsers");
    return allUsersCache;
  }

  const firestore = getFirestore();
  const q = collection(firestore, "users");

  const querySnapshot = await getDocs(q);
  const users = [];

  querySnapshot.forEach((doc) => {
    users.push({ id: doc.id, ...doc.data() });
  });

  allUsersCache = users;
  return users;
};





/*****************************************************************************************************************************************************************************************
                                                                                
                                                                        GET ALL USER COLLECTIONS DATA IN XMARKET FUNCTION

******************************************************************************************************************************************************************************************/
const collectionsCache = {};

export const getAllCollections = async () => {
  try {
    if ("allCollections" in collectionsCache) {
      console.log("Retrieving collections data from cache");
      return collectionsCache["allCollections"];
    }

    const firestore = getFirestore();
    const userCollectionsRef = collection(firestore, "userCollections");
    const usersRef = collection(firestore, "users");
    const nftsRef = collection(firestore, "nfts");

    const querySnapshot = await getDocs(userCollectionsRef);
    const collections = [];

    for (const doc of querySnapshot.docs) {
      const collectionData = doc.data();
      const walletAddress = collectionData.walletAddress;

      // Fetch corresponding user data
      const userQuerySnapshot = await getDocs(query(usersRef, where("walletAddress", "==", walletAddress)));
      const userDoc = userQuerySnapshot.docs[0];
      const userData = userDoc.exists ? userDoc.data() : null;

      // Determine the field name based on the type of collection
      const mediaType = collectionData.type; // assuming you have a field 'type' to differentiate between media types
      const fieldName = mediaType === "IMAGE COLLECTION" ? "collectionName" : 
                        mediaType === "VIDEO SERIES" ? "seriesName" : 
                        mediaType === "AUDIO ALBUM" ? "albumName" : null;

      if (fieldName) {
        const fieldValue = collectionData[fieldName];

        // Fetch corresponding NFT data based on the determined field name
        const nftQuerySnapshot = await getDocs(query(nftsRef, where(fieldName, "==", fieldValue)));
        const nftData = nftQuerySnapshot.docs.map((nftDoc) => nftDoc.data());

        console.log("NFT Data:", nftData);

        collections.push({
          id: doc.id,
          collection: collectionData,
          user: userData,
          nfts: nftData,
        });
      } else {
        console.error("Invalid media type:", mediaType);
      }
    }

    // Store the fetched collections data in the cache
    collectionsCache["allCollections"] = collections;
    console.log("Cached collections data:", collections);

    return collections;
  } catch (error) {
    console.error("Error fetching collections data:", error);
    throw error;
  }
};
/*****************************************************************************************************************************************************************************************
                                                                                
                                                                        GET ALL STUDIO X USER COLLECTIONS DATA IN XMARKET FUNCTION

******************************************************************************************************************************************************************************************/
const audioCollectionsCache = {};

export const getAudioCollections = async () => {
  try {
    if ("allCollections" in audioCollectionsCache) {
      console.log("Retrieving collections data from cache");
      return audioCollectionsCache["allCollections"];
    }

    const firestore = getFirestore();
    const userCollectionsRef = collection(firestore, "userCollections");
    const usersRef = collection(firestore, "studioXusers");
    const nftsRef = collection(firestore, "nfts");

    const querySnapshot = await getDocs(userCollectionsRef);
    const collections = [];

    for (const doc of querySnapshot.docs) {
      const collectionData = doc.data();
      const walletAddress = collectionData.walletAddress;

      // Fetch corresponding user data
      const userQuerySnapshot = await getDocs(query(usersRef, where("walletAddress", "==", walletAddress)));
      const userDoc = userQuerySnapshot.docs[0];

      if (userDoc && userDoc.exists) {
        const userData = userDoc.data();

        // Determine the field name based on the type of collection
        const mediaType = collectionData.type;
        const fieldName =
          mediaType === "AUDIO ALBUM" ? "albumName" : null;

        if (fieldName) {
          const fieldValue = collectionData[fieldName];

          // Fetch corresponding NFT data based on the determined field name
          const nftQuerySnapshot = await getDocs(query(nftsRef, where(fieldName, "==", fieldValue)));
          const nftData = nftQuerySnapshot.docs.map((nftDoc) => nftDoc.data());

          console.log("NFT Data:", nftData);

          collections.push({
            id: doc.id,
            collection: collectionData,
            user: userData,
            nfts: nftData,
          });
        } else {
          console.error("Invalid media type:", mediaType);
        }
      } else {
        console.error("User document not found or doesn't exist:", walletAddress);
      }
    }

    // Store the fetched collections data in the cache
    audioCollectionsCache["allCollections"] = collections;
    console.log("Cached collections data:", collections);

    return collections;
  } catch (error) {
    console.error("Error fetching collections data:", error);
    throw error;
  }
};








/*****************************************************************************************************************************************************************************************
                                                                                
                                                                               GET ALL NFTS DATA IN XMARKET FUNCTION

******************************************************************************************************************************************************************************************/
/*
export const getAllNFTs = async () => {
  const firestore = getFirestore();
  const q = collection(firestore, "nfts");

  const querySnapshot = await getDocs(q);
  const nfts = [];

  querySnapshot.forEach((doc) => {
    nfts.push({ id: doc.id, ...doc.data() });
  });

  return nfts;
};
*/


let allNFTsCache = null;

export const getAllNFTs = async () => {

  if (allNFTsCache !== null) {
    console.log("Result fetched from cache for getAllNFTs");
    return allNFTsCache;
  }

  const firestore = getFirestore();
  const q = collection(firestore, "nfts");

  const querySnapshot = await getDocs(q);
  const nfts = [];

  querySnapshot.forEach((doc) => {
    nfts.push({ id: doc.id, ...doc.data() });
  });

  allNFTsCache = nfts;
  return nfts;
};





/*****************************************************************************************************************************************************************************************
                                                                                
                                                                               GET ALL USER NFTS LIKED DATA IN XMARKET FUNCTION

******************************************************************************************************************************************************************************************/

const myLikesCache = {};

export const getMyLikes = async (connectedWallet) => {
  try {

    if (myLikesCache[connectedWallet]) {
      console.log("Result fetched from cache for getMyLikes");
      return myLikesCache[connectedWallet];
    }

    console.log('Fetching liked NFTs...');
    const firestore = getFirestore();
    const likesQuery = query(collection(firestore, 'likes'), where(`wallets.${connectedWallet}`, '==', true));

    console.log('Executing likes query...');
    const likesSnapshot = await getDocs(likesQuery);
    console.log('Likes query completed.', likesSnapshot.size, 'documents found.');

    const likedNfts = [];

    for (const likeDoc of likesSnapshot.docs) {
      const tokenId = likeDoc.id;
      console.log('Token ID:', tokenId);

      const nftsQuery = query(collection(firestore, 'nfts'), where('tokenId', '==', Number(tokenId)));
      console.log('Executing NFTs query for Token ID:', tokenId);
      const nftsSnapshot = await getDocs(nftsQuery);
      console.log('NFTs query completed for Token ID:', tokenId, nftsSnapshot.size, 'documents found.');

      nftsSnapshot.forEach((nftDoc) => {
        const nftData = nftDoc.data();
        console.log('Liked NFT:', nftData);
        likedNfts.push(nftData);
      });
    }

    console.log('Liked NFTs fetched:', likedNfts.length, 'NFTs retrieved.');

    myLikesCache[connectedWallet] = likedNfts;
    return likedNfts;
  } catch (error) {
    console.error('Error retrieving liked NFTs:', error);
    throw error;
  }
};





/*****************************************************************************************************************************************************************************************
                                                                                
                                                                               LIKE NFT FUNCTION

******************************************************************************************************************************************************************************************/

export const likeNFT = async (tokenId, ratingValue, walletAddress, seller, nftName) => {
  const firestore = getFirestore();
  const likesRef = doc(firestore, "likes", tokenId);
  const likesSnapshot = await getDoc(likesRef);
  const likesData = likesSnapshot.exists() ? likesSnapshot.data() : {};

  // Update the total count and total rating based on the existing data
  const totalCount = likesData.count || 0;
  const totalRating = likesData.totalRating || 0;

  // Check if the wallet already liked the NFT
  const walletLiked = likesData.likedBy && likesData.likedBy[walletAddress];

  // Fetch the user's userName from the 'users' collection based on the walletAddress
  const usersRef = collection(firestore, "users");
  const userQuery = query(usersRef, where("walletAddress", "==", walletAddress));
  const userSnapshot = await getDocs(userQuery);
  const user = userSnapshot.docs[0]?.data() || {}; // Get the first matching user or an empty object

  const newLikes = {
    count: walletLiked ? totalCount : totalCount + 1, // Increment the count if the wallet hasn't liked the NFT before
    totalRating: walletLiked
      ? totalRating - likesData.likedBy[walletAddress].rating + ratingValue
      : totalRating + ratingValue, // Adjust the total rating based on the new rating value
    wallets: {
      ...likesData.wallets,
      [walletAddress]: true,
    },
    likedBy: {
      ...likesData.likedBy,
      [walletAddress]: {
        wallet: walletAddress,
        userName: user.username || "Unknown User",
        rating: ratingValue,
      },
    },
    nftName, // Include the NFT name in the newLikes object
  };

  // Update the document in the 'likes' collection with the new aggregated data
  await setDoc(likesRef, newLikes);

  return newLikes;
};









/*****************************************************************************************************************************************************************************************
                                                                                
                                                                               UPDATE LIKES AND RATINGS FUNCTION

******************************************************************************************************************************************************************************************/

export const updateLikesAndRating = async (tokenId, count, rating, wallets) => {
  const firestore = getFirestore();
  const likesRef = doc(firestore, "likes", tokenId);
  const likesSnapshot = await getDoc(likesRef);
  if (likesSnapshot.exists()) {
    await updateDoc(likesRef, {
      count,
      rating,
      wallets,
    });
  } else {
    await setDoc(likesRef, {
      count,
      rating,
      wallets,
    });
  }
};




/*****************************************************************************************************************************************************************************************
                                                                                
                                                                               FETCH LIKES AND RATINGS FUNCTION

******************************************************************************************************************************************************************************************/

// cache likes & ratings to store fetched so not so many fb calls
const cache = {};

export const fetchLikesAndRatings = async (NFTData, walletAddress) => {
  try {
    const firestore = getFirestore();
    const likesObj = {};

    for (const el of NFTData) {
      const tokenId = el.tokenId.toString();

      // Check if data is already cached for this tokenId
      if (cache[tokenId]) {
        console.log("Fetching likes from cache for tokenId:", tokenId);
        likesObj[el.tokenId] = cache[tokenId];
      } else {
        console.log("Fetching likes from Firestore for tokenId:", tokenId);

        const likesRef = doc(firestore, "likes", tokenId);
        const likesSnapshot = await getDoc(likesRef);

        if (likesSnapshot.exists()) {
          const likesData = likesSnapshot.data();
          const totalLikes = Object.keys(likesData.wallets).length;
          const totalRating = likesData.totalRating || 0;
          const averageRating = totalLikes > 0 ? totalRating / totalLikes : 0;

          likesObj[el.tokenId] = {
            count: totalLikes || 0,
            liked: !!likesData.wallets[walletAddress],
            rating: likesData.rating || 0,
            wallets: likesData.wallets || {},
            averageRating: averageRating || 0,
            userRating: likesData.likedBy[walletAddress]?.rating || 0,
            userName: likesData.likedBy[walletAddress]?.username || "Unknown User",
          };

          cache[tokenId] = likesObj[el.tokenId];

        } else {
          likesObj[tokenId] = {
            count: 0,
            liked: false,
            rating: 0,
            wallets: {},
            averageRating: 0,
            userRating: 0,
            userName: "Unknown User",
          };
        }
      }
    }

    console.log("likesObj:", likesObj);
    return likesObj;
  } catch (error) {
    console.error("Error fetching likes and ratings:", error);
    throw error;
  }
};



/*****************************************************************************************************************************************************************************************
                                                                                
                                                                           TRIGGERING NOTIFICATIONS FOR LIKES FUNCTION

******************************************************************************************************************************************************************************************/

export const triggerLikeNotification = async (seller, likerWalletAddress, tokenId, nftName) => {
  try {
    console.log('Triggering like notification...');
    const firestore = getFirestore();
    const notificationsRef = collection(firestore, 'notifications');


    const usersRef = collection(firestore, 'users');
    const userQuery = query(usersRef, where('walletAddress', '==', likerWalletAddress));
    const userSnapshot = await getDocs(userQuery);

    let likerUserName = 'Unknown User';
    if (!userSnapshot.empty) {
      const userData = userSnapshot.docs[0].data();
      likerUserName = userData.username;
    }


    const notificationData = {
      type: 'NFT RATED',
      seller,
      likerWalletAddress,
      tokenId,
      nftName,
      likerUserName,
      recipient: seller,
      timestamp: Date.now(),
      Message: `${likerUserName} Has rated your NFT ${nftName} #${tokenId}`,
      read: false,
    };

    const newNotificationRef = await addDoc(notificationsRef, notificationData);

    console.log('Notification added:', newNotificationRef.id);

    console.log('Like notification triggered successfully!');

  } catch (error) {
    console.error('Error triggering like notification:', error);
    throw error;
  }
};


/*****************************************************************************************************************************************************************************************
                                                                                
                                                                        TRIGGERING NOTIFICATIONS FOR NFT MINTING FUNCTION

******************************************************************************************************************************************************************************************/

export const triggerAddNFTNotification = async (collectionName, walletAddress, createNFTData, tokenId, followerIds) => {
  try {
    console.log('Triggering add NFT notification...');
    console.log('Collection Name:', collectionName);
    console.log('Wallet Address:', walletAddress);
    console.log('Create NFT Data:', createNFTData);
    console.log('Token ID:', tokenId);
    console.log('Follower IDs:', followerIds);

    const firestore = getFirestore();
    const notificationsRef = collection(firestore, 'notifications');

    console.log('NFT Token ID:', tokenId);
    console.log('NFT Collection Name:', collectionName);

    const usersRef = collection(firestore, 'users');
    const sellerQuery = query(usersRef, where('walletAddress', '==', walletAddress));
    const sellerSnapshot = await getDocs(sellerQuery);

    let sellerUsername = 'Unknown User';
    if (!sellerSnapshot.empty) {
      sellerUsername = sellerSnapshot.docs[0].data().username;
    }

    const recipient = followerIds;

    let message;
    if (collectionName) {
      message = `${sellerUsername} Has minted ${createNFTData.name} #${tokenId} into ${collectionName}`;
    } else {
      message = `${sellerUsername} Has minted ${createNFTData.name} #${tokenId}`;
    }

    const notificationData = {
      type: 'NFT MINTED',
      seller: sellerUsername,
      tokenId: tokenId.toString(),
      nftName: createNFTData.name,
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
                                                                                
                                                                        TRIGGERING NOTIFICATIONS FOR NFT MINTING FUNCTION

******************************************************************************************************************************************************************************************/

export const triggerAddVideoNFTNotification = async (seriesName, walletAddress, createVideoData, tokenId, followerIds) => {
  try {
    console.log('Triggering add NFT notification...');
    console.log('Video Name:', seriesName);
    console.log('Wallet Address:', walletAddress);
    console.log('Create NFT Data:', createVideoData);
    console.log('Token ID:', tokenId);
    console.log('Follower IDs:', followerIds);

    const firestore = getFirestore();
    const notificationsRef = collection(firestore, 'notifications');

    console.log('NFT Token ID:', tokenId);
    console.log('NFT Collection Name:', seriesName);

    const usersRef = collection(firestore, 'users');
    const sellerQuery = query(usersRef, where('walletAddress', '==', walletAddress));
    const sellerSnapshot = await getDocs(sellerQuery);

    let sellerUsername = 'Unknown User';
    if (!sellerSnapshot.empty) {
      sellerUsername = sellerSnapshot.docs[0].data().username;
    }

    const recipient = followerIds;

    let message;
    if (seriesName) {
      message = `${sellerUsername} Has minted ${createVideoData.name} #${tokenId} into ${seriesName}`;
    } else {
      message = `${sellerUsername} Has minted ${createVideoData.name} #${tokenId}`;
    }

    const notificationData = {
      type: 'VIDEO NFT MINTED',
      seller: sellerUsername,
      tokenId: tokenId.toString(),
      nftName: createVideoData.name,
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





// Function to send notifications to the seller and the buyer after a successful NFT sale
export const triggerSellNFTNotification = async (buyer, seller, tokenId, price, timestamp, name) => {
  try {
    console.log('Triggering sell NFT notification...');
    console.log('Buyer Wallet:', buyer);
    console.log('Seller Wallet:', seller);
    console.log('Token ID:', tokenId);
    console.log('Price:', price);
    console.log('TimeStamp:', timestamp);
    console.log('nftName:', name);

    const firestore = getFirestore();
    const usersRef = collection(firestore, 'users');

    console.log('NFT Token ID:', tokenId);
    console.log('NFT Collection Name:', name);

    const buyerQuery = query(usersRef, where('walletAddress', '==', buyer));
    const buyerSnapshot = await getDocs(buyerQuery);

    let buyerUsername = 'Unknown User';
    if (!buyerSnapshot.empty) {
      buyerUsername = buyerSnapshot.docs[0].data().username;
    }

    // Fetch seller's username from the database using their wallet address
    let sellerUsername = 'Unknown User';
    const sellerQuery = query(usersRef, where('walletAddress', '==', seller));
    const sellerSnapshot = await getDocs(sellerQuery);
    if (!sellerSnapshot.empty) {
      sellerUsername = sellerSnapshot.docs[0].data().username;
    }

    const sellerMessage = `Congratulations! Your NFT ${name} has been sold to ${buyerUsername}.`;
    const buyerMessage = `Congratulations! You have successfully purchased the NFT ${name}.`;

    // Create the notification data for the seller
    const sellerNotificationData = {
      type: 'NFT SOLD',
      buyer: buyerUsername,
      tokenId: tokenId.toString(),
      nftName: name,
      recipient: seller,
      timestamp: Date.now(),
      Message: sellerMessage,
      read: false,
    };

    // Create the notification data for the buyer
    const buyerNotificationData = {
      type: 'NFT SOLD',
      seller: sellerUsername,
      tokenId: tokenId.toString(),
      nftName: name,
      recipient: buyer,
      timestamp: Date.now(),
      Message: buyerMessage,
      read: false,
    };

    // Add the notifications to the 'notifications' collection
    await addNotificationToNotificationsCollection(sellerNotificationData);
    await addNotificationToNotificationsCollection(buyerNotificationData);

    console.log('Sell NFT notifications triggered successfully!');
  } catch (error) {
    console.error('Error triggering sell NFT notifications:', error);
    throw error;
  }
};

async function addNotificationToNotificationsCollection(notificationData) {
  const firestore = getFirestore();
  const notificationsRef = collection(firestore, 'notifications');
  await addDoc(notificationsRef, notificationData);
}


/*****************************************************************************************************************************************************************************************
                                                                                
                                                                        TRIGGERING NOTIFICATIONS FOR FOLLOWED FUNCTION

******************************************************************************************************************************************************************************************/

export const triggerFollowedNotification = async (userAddress, followerAddress) => {
  try {
    console.log('Triggering follow notification...');
    const firestore = getFirestore();
    const notificationsRef = collection(firestore, 'notifications');
    const usersRef = collection(firestore, 'users');

    // Get the follower's username
    const followerQuery = query(usersRef, where('walletAddress', '==', followerAddress));
    const followerSnapshot = await getDocs(followerQuery);

    let followerUserName = 'Unknown User';
    if (!followerSnapshot.empty) {
      const followerData = followerSnapshot.docs[0].data();
      followerUserName = followerData.username;
    }

    // Get the user's username
    const userQuery = query(usersRef, where('walletAddress', '==', userAddress));
    const userSnapshot = await getDocs(userQuery);

    let userUserName = 'Unknown User';
    if (!userSnapshot.empty) {
      const userData = userSnapshot.docs[0].data();
      userUserName = userData.username;
    }

    const notificationData = {
      type: 'FOLLOWED',
      followerUserName,
      recipient: userAddress,
      timestamp: Date.now(),
      Message: `${followerUserName} is now following you.`,
      read: false,
    };

    const newNotificationRef = await addDoc(notificationsRef, notificationData);

    console.log('Notification added:', newNotificationRef.id);

    console.log('Follow notification triggered successfully!');
  } catch (error) {
    console.error('Error triggering follow notification:', error);
    throw error;
  }
};





/*****************************************************************************************************************************************************************************************
                                                                                
                                                                    TRIGGERING NOTIFICATIONS FOR COLLECTION CREATED FUNCTION

******************************************************************************************************************************************************************************************/

export const triggerCreateCollectionNotification = async (creatorWalletAddress, collectionData, followerIds) => {
  try {
    console.log('Triggering add NFT notification...');
    console.log('Wallet Address:', creatorWalletAddress);
    console.log('Create Collection Data:', collectionData);
    console.log('Follower IDs:', followerIds);

    const firestore = getFirestore();
    const notificationsRef = collection(firestore, 'notifications');

    console.log('NFT Collection Name:', collectionData.collectionName);

    const usersRef = collection(firestore, 'users');
    const creatorQuery = query(usersRef, where('walletAddress', '==', creatorWalletAddress));
    const creatorSnapshot = await getDocs(creatorQuery);

    let creatorUsername = 'Unknown User';
    if (!creatorSnapshot.empty) {
      creatorUsername = creatorSnapshot.docs[0].data().username;
    }

    const recipient = followerIds;
    const collectionName = collectionData.collectionName;

    const notificationData = {
      type: 'COLLECTION CREATED',
      creator: creatorUsername,
      collectionName: collectionName,
      recipient: recipient,
      timestamp: Date.now(),
      Message: `${creatorUsername} has created a new collection: ${collectionName}`,
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





/*****************************************************************************************************************************************************************************************
                                                                                
                                                                    TRIGGERING NOTIFICATIONS FOR COLLECTION CREATED FUNCTION

******************************************************************************************************************************************************************************************/

export const triggerCreateSeriesNotification = async (creatorWalletAddress, videoSeriesData, followerIds) => {
  try {
    console.log('Triggering add NFT notification...');
    console.log('Wallet Address:', creatorWalletAddress);
    console.log('Create Collection Data:', videoSeriesData);
    console.log('Follower IDs:', followerIds);

    const firestore = getFirestore();
    const notificationsRef = collection(firestore, 'notifications');

    console.log('NFT Collection Name:', videoSeriesData.seriesName);

    const usersRef = collection(firestore, 'users');
    const creatorQuery = query(usersRef, where('walletAddress', '==', creatorWalletAddress));
    const creatorSnapshot = await getDocs(creatorQuery);

    let creatorUsername = 'Unknown User';
    if (!creatorSnapshot.empty) {
      creatorUsername = creatorSnapshot.docs[0].data().username;
    }

    const recipient = followerIds;
    const collectionName = videoSeriesData.seriesName;

    const notificationData = {
      type: 'VIDEO SERIES CREATED',
      creator: creatorUsername,
      seriesName: seriesName,
      recipient: recipient,
      timestamp: Date.now(),
      Message: `${creatorUsername} has created a new collection: ${seriesName}`,
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






/*****************************************************************************************************************************************************************************************
                                                                                
                                                                           FETCHING USER NOTIFICATIONS FUNCTION

******************************************************************************************************************************************************************************************/



export const fetchUserNotificationsExactMatch = async (walletAddress) => {
  const firestore = getFirestore();
  const notificationsRef = collection(firestore, 'notifications');

  const querySnapshot = await getDocs(
    query(notificationsRef, where('recipient', '==', walletAddress))
  );

  const userNotifications = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return userNotifications;
};

export const fetchUserNotificationsArrayContains = async (walletAddress) => {
  const firestore = getFirestore();
  const notificationsRef = collection(firestore, 'notifications');

  const querySnapshot = await getDocs(
    query(notificationsRef, where('recipient', 'array-contains', walletAddress))
  );

  const userNotifications = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return userNotifications;
};


export const fetchUserNotifications = async (walletAddress) => {
  const exactMatchNotifications = await fetchUserNotificationsExactMatch(walletAddress);
  const arrayContainsNotifications = await fetchUserNotificationsArrayContains(walletAddress);

  // Merge the results by concatenating the two arrays
  const mergedNotifications = [...exactMatchNotifications, ...arrayContainsNotifications];

  // Remove duplicates based on notification ID (assuming IDs are unique)
  const uniqueNotifications = mergedNotifications.reduce((acc, notification) => {
    if (!acc.some((n) => n.id === notification.id)) {
      acc.push(notification);
    }
    return acc;
  }, []);

  return uniqueNotifications;
};



/*****************************************************************************************************************************************************************************************
                                                                                
                                                                           MARK NOTIFICATIONS AS READ FUNCTION

******************************************************************************************************************************************************************************************/

export const markNotificationAsRead = async (notificationId) => {
  try {
    const firestore = getFirestore();
    const notificationRef = doc(firestore, "notifications", notificationId);


    await updateDoc(notificationRef, {
      read: true,
    });

    console.log("Notification marked as read successfully!");

  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};





/*****************************************************************************************************************************************************************************************
                                                                                
                                                                           DELETE NOTIFICATIONS FUNCTION

******************************************************************************************************************************************************************************************/

export const deleteNotification = async (notificationId, walletAddress) => {
  try {
    const firestore = getFirestore();
    const notificationRef = doc(firestore, "notifications", notificationId);

    // Get the notification document
    const notificationSnapshot = await getDoc(notificationRef);
    if (!notificationSnapshot.exists()) {
      throw new Error("Notification document does not exist.");
    }

    const notificationData = notificationSnapshot.data();

    // Check if the wallet address is present in the recipient field (array-contains)
    if (!notificationData.recipient || !notificationData.recipient.includes(walletAddress)) {
      throw new Error("You are not authorized to delete this notification.");
    }

    // Delete the notification document
    await deleteDoc(notificationRef);
    console.log("Notification deleted successfully!");
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};






/*****************************************************************************************************************************************************************************************
                                                                                
                                                          FUNTION TO ADD A CREATE FOR SALE TRANSACTION TO TRANSACTIONS COLLECTION IN FIREBASE

******************************************************************************************************************************************************************************************/

export async function addCreateTransactionToFirebase(
  txHash,
  tokenId,
  collectionName,
  walletAddress,
  createNFTData,
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
      collectionName: collectionName,
      walletAddress: walletAddress,
      createNFTData: createNFTData,
      formattedPriceString,
      blockHash: blockHash.toString(),
      blockNumber: blockNumber.toString(),
      from: from,
      to: to,
      gasUsed: gasUsed,
      tokenURI: tokenURI,
      timestamp: currentTimestamp,
      type: "CREATE NFT FOR SALE",

    };


    await addDoc(transactionsRef, newTransaction);

    console.log('Transaction added to Firestore:', newTransaction);
  } catch (error) {
    console.error('Error adding transaction to Firestore:', error);
    throw error;
  }
}











/*****************************************************************************************************************************************************************************************
                                                                                
                                                                  FUNTION TO ADD A SELL TRANSACTION TO TRANSACTIONS COLLECTION IN FIREBASE

******************************************************************************************************************************************************************************************/

export async function addSellTransactionToFirebase(
  txHash,
  tokenId,
  nftSoldData,
  buyer,
  seller,
  timestamp,
  blockHash,
  blockNumber,
  from,
  to,
  gasUsed,
  status,
  transactionType
) {
  try {
    const firestore = getFirestore();
    const transactionsRef = collection(firestore, 'transactions');
    const newTransaction = {
      txHash: txHash,
      tokenId: tokenId,
      nftSoldData: {
        name: nftSoldData.name,
        price: nftSoldData.price,
        tokenId: nftSoldData.tokenId,
        tokenURI: nftSoldData.tokenURI,
      },
      buyer: buyer,
      seller: seller,
      timestamp: timestamp,
      blockHash: blockHash,
      blockNumber: blockNumber,
      from: from,
      to: to,
      gasUsed: gasUsed,
      status: status,
      type: transactionType,
    };

    // Add the new transaction document to Firestore
    await addDoc(transactionsRef, newTransaction);

    console.log('Transaction added to Firestore:', newTransaction);
  } catch (error) {
    console.error('Error adding transaction to Firestore:', error);
    throw error;
  }
}





/*****************************************************************************************************************************************************************************************
                                                                                
                                                                  FUNTION GET ALL TRANSACTIONS COLLECTION IN FIREBASE

******************************************************************************************************************************************************************************************/

/*
export async function getTransactionsByTokenIdFromFirebase(tokenId) {
  try {
    const firestore = getFirestore();
    const transactionsRef = collection(firestore, 'transactions');
    
    // Query for documents where the tokenId field matches the given tokenId
    const querySnapshot = await getDocs(query(transactionsRef, where('tokenId', '==', Number(tokenId))));    
    const transactions = [];
    
    // Loop through the documents and add them to the 'transactions' array
    querySnapshot.forEach((doc) => {
      transactions.push(doc.data());
    });

    return transactions;
  } catch (error) {
    console.error('Error retrieving transactions by tokenId from Firestore:', error);
    throw error;
  }
}
*/


const transactionsCache = {};

export async function getTransactionsByTokenIdFromFirebase(tokenId) {
  try {

    if (transactionsCache[tokenId]) {
      console.log("Result fetched from cache for tokenId:", tokenId);
      return transactionsCache[tokenId];
    }

    const firestore = getFirestore();
    const transactionsRef = collection(firestore, 'transactions');

    // Query for documents where the tokenId field matches the given tokenId
    const querySnapshot = await getDocs(query(transactionsRef, where('tokenId', '==', Number(tokenId))));
    const transactions = [];

    // Loop through the documents and add them to the 'transactions' array
    querySnapshot.forEach((doc) => {
      transactions.push(doc.data());
    });


    transactionsCache[tokenId] = transactions;
    return transactions;
  } catch (error) {
    console.error('Error retrieving transactions by tokenId from Firestore:', error);
    throw error;
  }
}







/*****************************************************************************************************************************************************************************************
                                                                                
                                                                  SEARCH ITEMS FUNCTION NOT CURRENTLY IMPLIMENTED

******************************************************************************************************************************************************************************************/

export const searchItems = async (searchQuery) => {
  try {
    const firestore = getFirestore();
    const searchResults = {
      nfts: [],
      users: [],
      userCollections: []
    };

    // Search in NFTs collection
    const nftsQuery = collection(firestore, "nfts");
    const nftsSnapshot = await getDocs(nftsQuery);
    nftsSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        searchResults.nfts.push({
          id: doc.id,
          name: data.name,
          // Add other NFT fields as needed
        });
      }
    });

    // Search in Users collection
    const usersQuery = collection(firestore, "users");
    const usersSnapshot = await getDocs(usersQuery);
    usersSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.username.toLowerCase().includes(searchQuery.toLowerCase())) {
        searchResults.users.push({
          id: doc.id,
          username: data.username,
          // Add other user fields as needed
        });
      }
    });

    // Search in User Collections collection
    const userCollectionsQuery = collection(firestore, "userCollections");
    const userCollectionsSnapshot = await getDocs(userCollectionsQuery);
    userCollectionsSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.collectionName.toLowerCase().includes(searchQuery.toLowerCase())) {
        searchResults.userCollections.push({
          id: doc.id,
          collectionName: data.collectionName,
          // Add other collection fields as needed
        });
      }
    });

    return searchResults;
  } catch (error) {
    console.error("Error performing search:", error);
    throw new Error("Internal server error");
  }
};




/*****************************************************************************************************************************************************************************************
                                                                                
                                                                          ADD KYC FUNCTION

******************************************************************************************************************************************************************************************/

export const addKYCDataAndSetKYCStatus = async (kycData) => {
  const firestore = getFirestore();
  const storage = getStorage();

  try {
    // Upload proofOfAddressImage to Firebase Storage
    const proofOfAddressImage = kycData.proofOfAddressImage;
    if (proofOfAddressImage) {
      const proofOfAddressImageRef = ref(storage, `kyc/${kycData.walletAddress}/proofOfAddressImage.jpg`);
      await uploadBytes(proofOfAddressImageRef, proofOfAddressImage);
      kycData.proofOfAddressImage = await getDownloadURL(proofOfAddressImageRef);
    }

    // Upload idFrontImage to Firebase Storage
    const idFrontImage = kycData.idFrontImage;
    if (idFrontImage) {
      const idFrontImageRef = ref(storage, `kyc/${kycData.walletAddress}/idFrontImage.jpg`);
      await uploadBytes(idFrontImageRef, idFrontImage);
      kycData.idFrontImage = await getDownloadURL(idFrontImageRef);
    }

    // Upload idBackImage to Firebase Storage
    const idBackImage = kycData.idBackImage;
    if (idBackImage) {
      const idBackImageRef = ref(storage, `kyc/${kycData.walletAddress}/idBackImage.jpg`);
      await uploadBytes(idBackImageRef, idBackImage);
      kycData.idBackImage = await getDownloadURL(idBackImageRef);
    }

    // Upload selfieImage to Firebase Storage
    const selfieImage = kycData.selfieImage;
    if (selfieImage) {
      const selfieImageRef = ref(storage, `kyc/${kycData.walletAddress}/selfieImage.jpg`);
      await uploadBytes(selfieImageRef, selfieImage);
      kycData.selfieImage = await getDownloadURL(selfieImageRef);
    }

    // Add KYC data to Firestore
    console.log("Adding KYC data to Firestore:", kycData);
    const kycCollection = collection(firestore, 'kyc');
    const kycRef = await addDoc(kycCollection, kycData);
    console.log("KYC data added to Firestore with ID:", kycRef.id);

    // Update KYC status for the user to "pending"
    console.log("Updating KYC status for walletAddress:", kycData.walletAddress);
    const usersCollection = collection(firestore, 'users');
    const userQuery = query(usersCollection, where("walletAddress", "==", kycData.walletAddress));
    const querySnapshot = await getDocs(userQuery);

    querySnapshot.forEach(async (doc) => {
      await updateDoc(doc.ref, { kyc: "PENDING" });
    });

    console.log("KYC status updated for walletAddress:", kycData.walletAddress);

    return kycRef.id;
  } catch (error) {
    console.error("Error adding KYC data and updating KYC status:", error);
    throw new Error("Error adding KYC data and updating KYC status: " + error.message);
  }
};





/*****************************************************************************************************************************************************************************************
                                                                                
                                                                          GET PENDING KYC FUNCTION

******************************************************************************************************************************************************************************************/

export const getPendingKYCApplicants = async () => {
  try {
    const firestore = getFirestore();
    const kycCollection = collection(firestore, 'kyc');
    const q = query(kycCollection, where('kyc', '==', 'PENDING'));
    const querySnapshot = await getDocs(q);

    const applicants = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

    return applicants;
  } catch (error) {
    console.error('Error fetching KYC applicants:', error);
    return [];
  }
};





/*****************************************************************************************************************************************************************************************
                                                                                
                                                                        Search for a user by username in the Firebase collection

******************************************************************************************************************************************************************************************/

export const searchUserByUsername = async (username) => {
  try {
    const firestore = getFirestore();
    const usersQuery = collection(firestore, 'users'); // Replace 'users' with your collection name
    const usersSnapshot = await getDocs(usersQuery);

    const matchedUsers = [];

    usersSnapshot.forEach((userDoc) => {
      const userData = userDoc.data();
      if (userData.username.toLowerCase() === username.toLowerCase()) {
        matchedUsers.push({
          id: userDoc.id,
          ...userData,
        });
      }
    });

    return matchedUsers.length > 0 ? matchedUsers : null;
  } catch (error) {
    console.error('Error searching for user:', error);
    throw error;
  }
};



/*****************************************************************************************************************************************************************************************
                                                                                
                                                      Delete a user by ID from the Firebase collection

******************************************************************************************************************************************************************************************/

export const deleteUserById = async (userId) => {
  try {
    const firestore = getFirestore();
    const userDocRef = doc(firestore, 'users', userId);
    await deleteDoc(userDocRef);
    console.log(`User with ID ${userId} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};




/*****************************************************************************************************************************************************************************************
                                                                                
                                                      UPDATE THE KYC STATUS OF THE USER 

******************************************************************************************************************************************************************************************/

export async function updateKYCStatus(walletAddress, newStatus) {
  try {
    console.log(`Updating KYC status to ${newStatus} for walletAddress: ${walletAddress}`);

    const firestore = getFirestore();
    const usersCollection = collection(firestore, 'users');
    const kycCollection = collection(firestore, 'kyc');

    const q = query(usersCollection, where('walletAddress', '==', walletAddress));
    const kycQuery = query(kycCollection, where('walletAddress', '==', walletAddress));

    const [querySnapshot, kycQuerySnapshot] = await Promise.all([getDocs(q), getDocs(kycQuery)]);

    const updatedUsers = [];
    const updatedKYCRecords = [];

    for (const userDoc of querySnapshot.docs) {
      const userRef = doc(firestore, 'users', userDoc.id);
      await updateDoc(userRef, { kyc: newStatus });

      updatedUsers.push({
        id: userDoc.id,
        ...userDoc.data(),
      });
    }

    for (const kycDoc of kycQuerySnapshot.docs) {
      const kycRef = doc(firestore, 'kyc', kycDoc.id);
      await updateDoc(kycRef, { kyc: newStatus });

      updatedKYCRecords.push({
        id: kycDoc.id,
        ...kycDoc.data(),
      });
    }

    console.log(`KYC status updated to ${newStatus} for matching users`, updatedUsers);
    console.log(`KYC status updated to ${newStatus} for matching KYC records`, updatedKYCRecords);

    return true;
  } catch (error) {
    console.error('Error updating KYC status:', error);
    return false;
  }
}





/*****************************************************************************************************************************************************************************************
                                                                                
                                                      UPDATE THE KYC INFORMATION OF THE USER 

******************************************************************************************************************************************************************************************/

export const updateKYCInfoFirebase = async (applicantId, updatedKYCInfo) => {
  try {
    const firestore = getFirestore();
    const kycDocRef = doc(firestore, 'kycApplicants', applicantId);

    // Update KYC information in Firestore
    await updateDoc(kycDocRef, updatedKYCInfo);

    console.log(`KYC information for applicant with ID ${applicantId} updated successfully.`);
  } catch (error) {
    console.error('Error updating KYC information:', error);
    throw error;
  }
};



/*****************************************************************************************************************************************************************************************
                                                                                
                                                      ADD PROMOTIONAL IMAGE FOR XECHO 

******************************************************************************************************************************************************************************************/

export const uploadPromoPost = async (file, selectedCategory) => {
  try {
    if (!file) {
      console.error('No file provided.');
      return null;
    }

    const firestore = getFirestore();
    const imageCollectionRef = collection(firestore, 'echoFeatured');

    // Create a new document in the Firestore collection with the selectedCategory
    const newFileDocRef = await addDoc(imageCollectionRef, {
      selectedCategory: selectedCategory,
    });

    console.log('Document created successfully. New document ID:', newFileDocRef.id);

    return newFileDocRef.id; // Returning the document ID instead of the file URL
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};







/*cache the promo images */
const fetchPromoImages = async () => {
  try {
    const firestore = getFirestore();
    const echoFeaturedCollection = collection(firestore, 'echoFeatured');
    const snapshot = await getDocs(echoFeaturedCollection);
    const featured = snapshot.docs.map((doc) => doc.data());
    return featured;
  } catch (error) {
    console.error('Error fetching promoImages:', error);
    throw error;
  }
};

let cachedPromoImages = null;

export const getPromoImages = async () => {
  if (cachedPromoImages) {
    console.log('Retrieved from cache');
    return cachedPromoImages;
  }

  const promoImages = await fetchPromoImages();

  cachedPromoImages = promoImages;
  console.log('Fetched from Firestore and cached');

  return promoImages;
};



/*****************************************************************************************************************************************************************************************
                                                                                
                                                       ADD, GET, UPDATE USERS PLAYLISTS IN FIREBASE USING WALLET ADDRESS AND PLAYLIST NAME 

******************************************************************************************************************************************************************************************/

/* ADD PLAYLIST */
export const createEmptyPlaylist = async (currentAddress, playlistName, user) => {
  try {
    console.log('Received wallet address:', currentAddress);
    console.log('Received playlist name:', playlistName);
    if (!currentAddress || !playlistName) {
      console.error('Wallet address or playlist name is missing.');
      return null;
    }

    const firestore = getFirestore();
    const playlistsCollectionRef = collection(firestore, 'xechoPlaylists');

    const newPlaylistDocRef = await addDoc(playlistsCollectionRef, {
      walletAddress: currentAddress,
      playlistName: playlistName,
      user: user,
      createdDate: serverTimestamp(),
    });

    console.log('New playlist document created with ID:', newPlaylistDocRef.id);
    return newPlaylistDocRef.id;
  } catch (error) {
    console.error('Error creating playlist document:', error);
    throw error;
  }
};




export const createPlaylistWithSong = async (currentAddress, playlistName, nft, user) => {
  try {
    console.log('Received wallet address:', currentAddress);
    console.log('Received playlist name:', playlistName);
    if (!currentAddress || !playlistName) {
      console.error('Wallet address or playlist name is missing.');
      return null;
    }

    const firestore = getFirestore();
    const playlistsCollectionRef = collection(firestore, 'xechoPlaylists');

    const newPlaylistDocRef = await addDoc(playlistsCollectionRef, {
      walletAddress: currentAddress,
      playlistName: playlistName,
      user: user,
      createdDate: serverTimestamp(),
      songs: arrayUnion(nft),
    });

    console.log('New playlist document created with ID:', newPlaylistDocRef.id);
    return newPlaylistDocRef.id;
  } catch (error) {
    console.error('Error creating playlist document:', error);
    throw error;
  }
};





export const addSongToPlaylist = async (playlistId, nft, ) => {
  try {
    console.log('Received playlist ID:', playlistId);
    console.log('Received song details:', nft);

    if (!playlistId || !nft) {
      console.error('Playlist ID or song details are missing.');
      return null;
    }

    const firestore = getFirestore();
    const playlistDocRef = doc(firestore, 'xechoPlaylists', playlistId);

    // Update the playlist document to add the new song
    await updateDoc(playlistDocRef, {
      songs: arrayUnion(nft), 
    });

    console.log('Song added to playlist successfully.');
  } catch (error) {
    console.error('Error adding song to playlist:', error);
    throw error;
  }
};



export const addAlbumToPlaylist = async (currentAddress, albumData, user) => {
  try {
    console.log('Received wallet address:', currentAddress);
    console.log('Received album data:', albumData);
    if (!currentAddress || !albumData) {
      console.error('Wallet address or album data is missing.');
      return null;
    }

    const firestore = getFirestore();
    const playlistsCollectionRef = collection(firestore, 'xechoPlaylists');

    const newPlaylistDocRef = await addDoc(playlistsCollectionRef, {
      walletAddress: currentAddress,
      playlistName: albumData.collection.albumName,
      albumData: albumData,
      user: user,
      createdDate: serverTimestamp(),
      type: "ALBUM", 
    });

    console.log('New playlist document created with ID:', newPlaylistDocRef.id);    
    const albumNFTs = albumData.nfts || [];
    const songs = albumNFTs.map((nft, index) => ({
      id: index.toString(), 
      name: nft.name || `Track ${index + 1}`,
      artist: nft.artist || "Unknown Artist",
      audioImageIPFSUrl: nft.audioImageIPFSUrl || "/default-audio-image.jpg",
      
    }));   
    await updateDoc(newPlaylistDocRef, { songs: songs });
    const newPlaylistSnapshot = await getDoc(newPlaylistDocRef);
    const newPlaylistData = newPlaylistSnapshot.data();

    return {
      id: newPlaylistDocRef.id,
      playlistName: newPlaylistData.playlistName,
      createdDate: newPlaylistData.createdDate,
      user: newPlaylistData.user,
      songs: newPlaylistData.songs || [],
      type: newPlaylistData.type,
    };
  } catch (error) {
    console.error('Error creating playlist document:', error);
    throw error;
  }
};






/* GET ALL USER PLAYLISTS */
export const getUserPlaylists = async (currentAddress) => {
  try {
    if (!currentAddress) {
      console.error('Wallet address is missing.');
      return [];
    }

    const firestore = getFirestore();
    const playlistsCollectionRef = collection(firestore, 'xechoPlaylists');

    // Query playlists that match the provided walletAddress
    const querySnapshot = await getDocs(
      query(playlistsCollectionRef, where('walletAddress', '==', currentAddress))
    );

    // Extract data from query results
    const userPlaylists = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        playlistName: data.playlistName,
        createdDate: data.createdDate,
        user: data.user,
        songs: data.songs || [],
      };
    });

    return userPlaylists;
  } catch (error) {
    console.error('Error fetching user playlists:', error);
    throw error;
  }
};


/* UPDATE USER PLAYLISTS WITH NEW FIELDS */
export const updateUserPlaylist = async (currentAddress, playlistName, updates) => {
  try {
    if (!currentAddress || !playlistName) {
      console.error('Wallet address or playlist name is missing.');
      return null;
    }

    const firestore = getFirestore();
    const playlistsCollectionRef = collection(firestore, 'xechoPlaylists');

    // Query the playlist document that matches the walletAddress and playlistName
    const querySnapshot = await getDocs(
      query(
        playlistsCollectionRef,
        where('walletAddress', '==', currentAddress),
        where('playlistName', '==', playlistName)
      )
    );

    if (querySnapshot.empty) {
      console.error('Playlist not found.');

      return null;
    }

    // Update the matching playlist document with the provided updates
    const playlistDoc = querySnapshot.docs[0];
    await updateDoc(playlistDoc.ref, updates);

    console.log('Playlist updated successfully.');
    return playlistDoc.id; // Return the ID of the updated document
  } catch (error) {
    console.error('Error updating playlist:', error);
    throw error;
  }
};




export const reportAsset = async (tokenId, reason, timestamp, walletAddress) => {
  try {
    const firestore = getFirestore();
    const report = {
      tokenId: tokenId,
      reason: reason,
      timestamp: timestamp,
      walletAddress: walletAddress || null, 
    };

  
    const reportsCollection = collection(firestore, "reports");
    await addDoc(reportsCollection, report);

    // Return success or any other response if needed
    return { success: true, message: "Report submitted successfully!" };
  } catch (error) {
    // Handle errors, log them, or return an error response
    console.error("Error reporting asset:", error);
    return { success: false, message: "Error reporting asset. Please try again later." };
  }
};

 

