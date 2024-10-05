import { getFirestore, collection, query, where, addDoc, getDocs, getDoc, deleteDoc, doc, updateDoc, setDoc, serverTimestamp, arrayUnion } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firestore, db } from "./config";
const storage = getStorage();
/************************************************************************************
                                                                                
                             ADD XECHO USER FUNCTION 

*************************************************************************************/
export const addXechoUser = async (connectedWalletAddress, xechoUser, xechoUserPhoto) => {
    const firestore = getFirestore();
    const userRef = collection(firestore, "xechoUsers");
    try {
// Check if wallet address is already used
        if (connectedWalletAddress) {
            const existingWalletUserQuery = query(userRef, where('walletAddress', '==', connectedWalletAddress));
            const existingWalletUserSnapshot = await getDocs(existingWalletUserQuery);
            if (existingWalletUserSnapshot.docs.length > 0) {
                throw new Error('Wallet address is already in use.');
            }
        }
// Check if username is already used
        const existingUsernameQuery = query(userRef, where('username', '==', xechoUser.username));
        const existingUsernameSnapshot = await getDocs(existingUsernameQuery);
        if (existingUsernameSnapshot.docs.length > 0) {
            throw new Error('Username is already in use.');
        }
// Check if email is already used
        const existingEmailQuery = query(userRef, where('email', '==', xechoUser.email));
        const existingEmailSnapshot = await getDocs(existingEmailQuery);
        if (existingEmailSnapshot.docs.length > 0) {
            throw new Error('Email is already in use.');
        }
        console.log("Adding user to Firestore:", xechoUser);
        let xechoUserPhotoUrl = xechoUserPhoto; // Assume it's a URL
// If xechoUserPhoto is not a URL, upload it
        if (!xechoUserPhoto.startsWith('http')) {
            const storage = getStorage();
            const profilePictureRef = ref(storage, `xechoUsers/${connectedWalletAddress}/artistImages/${xechoUserPhoto.name}`);
            await uploadBytes(profilePictureRef, xechoUserPhoto);
// Get download URL for the uploaded image
            xechoUserPhotoUrl = await getDownloadURL(profilePictureRef);
            console.log("Artist photo uploaded. URL:", xechoUserPhotoUrl);
        }
        const userDocData = {
            profilePictureUrl: xechoUserPhotoUrl,
            selectedTier: xechoUser.selectedTier,
            username: xechoUser.username,
            email: xechoUser.email,
            terms: true,   
            policy: true,  
            membership: xechoUser.membership || {
                membershipTier: "",
                renewalDate: "",
                creationDate: "",
                description: "",
                price: "",
            },
        };
// Conditionally add wallet address or password
        if (connectedWalletAddress) {
            userDocData.walletAddress = connectedWalletAddress;
// Set password to null for consistency
            userDocData.password = null; 
        } else {
// Set walletAddress to null for consistency
            userDocData.walletAddress = null; 
            userDocData.password = xechoUser.password || null;
        }
        const docRef = await setDoc(doc(userRef, xechoUser.username), userDocData);
        console.log("User added to Firestore with ID:", xechoUser.username);
    } catch (error) {
        console.error("Error adding user: ", error.message);
// Rethrow the error for handling in the calling function
        throw error; 
    }
};
/************************************************************************************
                                                                                
                          GET ALL XECHO USERS FUNCTION 

*************************************************************************************/
export const getAllXechoUsers = async () => {
    const firestore = getFirestore();
    const q = collection(firestore, "xechoUsers");
    const querySnapshot = await getDocs(q);
    const xechoUsers = [];
    querySnapshot.forEach((doc) => {
        xechoUsers.push({ id: doc.id, ...doc.data() });
    });
    return xechoUsers;
};
/************************************************************************************
                                                                                
                            UPDATE XECHO USER FUNCTION 
 
*************************************************************************************/
export const updateXechoUser = async (walletAddress, updatedData) => {
    const firestore = getFirestore();
    const userCollection = collection(firestore, 'xechoUsers');
    try {
        console.log("Updating user in Firestore:", walletAddress);
        const userQuery = query(userCollection, where('walletAddress', '==', walletAddress));
        const userSnapshot = await getDocs(userQuery);
        if (userSnapshot.docs.length > 0) {
            const userDoc = userSnapshot.docs[0];
            const storage = getStorage();
            if (updatedData.membership && updatedData.membership.xechoUserPhoto) {
                const profilePictureRef = ref(storage, `xechoUsers/${walletAddress}/artistImages/${updatedData.membership.xechoUserPhoto.name}`);
                await uploadBytes(profilePictureRef, updatedData.membership.xechoUserPhoto);
                const xechoUserPhotoUrl = await getDownloadURL(profilePictureRef);
                console.log("Artist photo updated. URL:", xechoUserPhotoUrl);
// Add or update the artistPhoto field
                await updateDoc(userDoc.ref, { xechoUserPhoto: xechoUserPhotoUrl });
            }
// Use the update function to add or update fields based on updatedData
            await updateDoc(userDoc.ref, {
                membership: {
                    ...userDoc.data().membership,
                    ...updatedData.membership,
                },
                selectedTier: updatedData.selectedTier,
            });
            console.log("User updated in Firestore:", walletAddress);
        } else {
            console.log("User not found in Firestore:", walletAddress);
        }
    } catch (error) {
        console.error("Error updating user: ", error);
    }
};
/************************************************************************************
                                                                              
                        GET DATA FOR XECHO USER FUNCTION 
 
*************************************************************************************/
export const getXechoUserProfile = async (walletAddress) => {
    console.log('User Address:', walletAddress);
    const firestore = getFirestore();
    const q = query(collection(firestore, "xechoUsers"),
        where("walletAddress", "==", walletAddress));
    console.log('User Address:', walletAddress);
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        let xechoUserProfile = null;
        querySnapshot.forEach((doc) => {
            xechoUserProfile = { id: doc.id, ...doc.data() };
        });
        return xechoUserProfile;
    } else {
        console.error("No user found with the given wallet address");
        return null;
    }
};
/************************************************************************************
                                                                              
                        GET STUDIO X DATA FOR USER FUNCTION 
 
*************************************************************************************/
export const getStudioXUserProfile = async (walletAddress) => {
    const firestore = getFirestore();
    const q = query(collection(firestore, "studioXusers"),
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
/************************************************************************************
                                                                                
            ADD PROMOTIONAL IMAGE FOR XECHO MARKETING AND ADVERTISING SLOTS 

*************************************************************************************/
export const uploadPromoPost = async (file, selectedCategory) => {
    try {
        if (!file) {
            console.error('No file provided.');
            return null;
        }
        const firestore = getFirestore();
        const imageCollectionRef = collection(firestore, 'echoFeatured');
        const newFileDocRef = await addDoc(imageCollectionRef, {
            selectedCategory: selectedCategory,
        });
        console.log('Document created successfully. New document ID:', newFileDocRef.id);
        return newFileDocRef.id;
    } catch (error) {
        console.error('Error creating document:', error);
        throw error;
    }
};
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
/************************************************************************************
                                                                                
            GET PROMOTIONAL IMAGE FOR XECHO MARKETING AND ADVERTISING SLOTS 

*************************************************************************************/
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
/************************************************************************************
                                                                                
 ADD, GET, UPDATE USERS PLAYLISTS IN FIREBASE USING WALLET ADDRESS AND PLAYLIST NAME 
 
*************************************************************************************/
export const createEmptyPlaylist = async (currentAddress, playlistName, xechoUser) => {
  try {
    console.log('Received wallet address:', currentAddress);
    console.log('Received playlist name:', playlistName);
    console.log('Received playlist user:', xechoUser);
    if (!currentAddress || !playlistName) {
      console.error('Wallet address or playlist name is missing.');
      return null;
    }
    const firestore = getFirestore();
    const playlistsCollectionRef = collection(firestore, 'xechoPlaylists');
// Check if a playlist with the same name already exists for the given wallet address
    const existingPlaylistQuery = query(
      playlistsCollectionRef,
      where('walletAddress', '==', currentAddress),
      where('playlistName', '==', playlistName)
    );
    const existingPlaylistSnapshot = await getDocs(existingPlaylistQuery);
    if (existingPlaylistSnapshot.docs.length > 0) {
      throw new Error('Playlist with the same name already exists.');
    }
// If no existing playlist with the same name, create a new one
    const newPlaylistDocRef = await addDoc(playlistsCollectionRef, {
      walletAddress: currentAddress,
      playlistName: playlistName,
      user: xechoUser,
      createdDate: serverTimestamp(),
      type: 'SONGS',
    });
    console.log('New playlist document created with ID:', newPlaylistDocRef.id);
    return newPlaylistDocRef.id;
  } catch (error) {
    console.error('Error creating playlist document:', error.message);
    throw error;
  }
};
/************************************************************************************
                                                                                  
            CREATING A NEW PLAYLIST WITH ADDING A SONG AT THE SAME TIME
  
*************************************************************************************/
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
  
      // Check if the playlist already exists
      const existingPlaylistQuery = query(
        playlistsCollectionRef,
        where('walletAddress', '==', currentAddress),
        where('playlistName', '==', playlistName)
      );
  
      const existingPlaylistSnapshot = await getDocs(existingPlaylistQuery);
  
      if (existingPlaylistSnapshot.docs.length > 0) {
        // If the playlist exists, add the song to it
        const existingPlaylistDoc = existingPlaylistSnapshot.docs[0];
        await updateDoc(existingPlaylistDoc.ref, {
          songs: arrayUnion(nft),
        });
  
        console.log('Song added to existing playlist successfully.');
        return existingPlaylistDoc.id;
      }
  
      // If no existing playlist, create a new one
      const newPlaylistDocRef = await addDoc(playlistsCollectionRef, {
        walletAddress: currentAddress,
        playlistName: playlistName,
        user: user,
        createdDate: serverTimestamp(),
        songs: [nft],
        type: 'SONGS',
      });
  
      console.log('New playlist document created with ID:', newPlaylistDocRef.id);
      return newPlaylistDocRef.id;
    } catch (error) {
      console.error('Error creating or updating playlist document:', error.message);
      throw error;
    }
  };
  
/************************************************************************************
                                                                                  
                 ADDING A SONG TO AN ALREADY EXISTING PLAYLIST
  
*************************************************************************************/
export const addSongToPlaylist = async (playlistId, nft) => {
    try {
      console.log('Received playlist ID:', playlistId);
      console.log('Received song details:', nft);
  
      if (!playlistId || !nft) {
        console.error('Playlist ID or song details are missing.');
        return null;
      }
  
      const firestore = getFirestore();
      const playlistDocRef = doc(firestore, 'xechoPlaylists', playlistId);
  
      // Check if a song with the same tokenId already exists in the playlist
      const existingSongQuery = query(
        collection(firestore, 'xechoPlaylists'),
        where('id', '==', playlistId),
        where('songs.tokenId', '==', nft.tokenId)
      );
  
      const existingSongSnapshot = await getDocs(existingSongQuery);
  
      if (existingSongSnapshot.docs.length > 0) {
        throw new Error('Song with the same tokenId already exists in the playlist.');
      }
  
      // If no existing song with the same tokenId, update the playlist to add the new song
      await updateDoc(playlistDocRef, {
        type: 'MULTI-SONG',
        songs: arrayUnion(nft),
      });
  
      console.log('Song added to playlist successfully.');
    } catch (error) {
      console.error('Error adding song to playlist:', error.message);
      throw error;
    }
  };
  
  
/************************************************************************************
                                                                                  
                           ADDING AN ENTIRE ALBUM TO THE PLAYLIST 
  
************************************************************************************/
export const addAlbumToPlaylist = async (currentAddress, albumData) => {
    try {
      if (!currentAddress || !albumData) {
        console.error('Wallet address or album data is missing.');
        return null;
      }
      const firestore = getFirestore();
      const playlistsCollectionRef = collection(firestore, 'xechoPlaylists');
  
      const existingPlaylistQuery = query(
        collection(firestore, 'xechoPlaylists'),
        where('walletAddress', '==', currentAddress),
        where('playlistName', '==', albumData.collection.albumName),
        where('type', '==', 'ALBUM')
      );
      const existingPlaylistSnapshot = await getDocs(existingPlaylistQuery);
      if (existingPlaylistSnapshot.docs.length > 0) {
        throw new Error('Playlist with the same albumName already exists.');
      }
      const newPlaylistDocRef = await addDoc(playlistsCollectionRef, {
        walletAddress: currentAddress,
        playlistName: albumData.collection.albumName,
        collection: albumData.collection,
        user: albumData.user,
        createdDate: serverTimestamp(),
        type: 'ALBUM', // Set the type to 'ALBUM'
      });
      console.log('New playlist document created with ID:', newPlaylistDocRef.id);   
// Ensure the structure of the songs array for albums
      const songs = albumData.nfts.map((nft, index) => ({
        id: index.toString(),
        name: nft.name || `Track ${index + 1}`,
        artist: nft.artist || 'Unknown Artist',
        audioImageIPFSUrl: nft.audioImageIPFSUrl || '/default-audio-image.jpg',
        track: nft.track || '',
        price: nft.price || '',
      }));
      await updateDoc(newPlaylistDocRef, { songs: songs }); 
      const newPlaylistSnapshot = await getDoc(newPlaylistDocRef);
      const newPlaylistData = newPlaylistSnapshot.data();
      return {
        id: newPlaylistDocRef.id,
        playlistName: newPlaylistData.playlistName,
        collection: newPlaylistData.collection,
        createdDate: newPlaylistData.createdDate,
        user: newPlaylistData.user,
        songs: newPlaylistData.songs || [],
        type: newPlaylistData.type,
      };
    } catch (error) {
      console.error('Error creating playlist document:', error.message);
      throw error;
    }
  };
/************************************************************************************
                                                                                  
                 FETCHING THE USERS PLAYLISTS WITH SONGS AND ALBUMS
  
*************************************************************************************/
export const getUserPlaylists = async (currentAddress) => {
    try {
// Check if wallet address is provided
        if (!currentAddress) {
            console.error('Wallet address is missing.');
            return [];
        }
        const firestore = getFirestore();
        const playlistsCollectionRef = collection(firestore, 'xechoPlaylists');
// Query playlists based on wallet address
        const querySnapshot = await getDocs(
            query(playlistsCollectionRef, where('walletAddress', '==', currentAddress))
        );
// Map raw data from Firestore to a structured playlist format
        const userPlaylists = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            console.log('Raw Data from Firestore:', data);
            let songs = [];
            // Determine the type of playlist and set songs accordingly
            if (data.type === 'ALBUM') {
                songs = data.songs || [];
            } else if (data.type === 'MULTI-SONG') {
                songs = data.songs || [];
            }
// Return the structured playlist object
            return {
                id: doc.id,
                playlistName: data.playlistName,
                createdDate: data.createdDate?.toDate(), // Convert timestamp to Date object
                type: data.type,
                songs: songs,
                user: data.user,
                collection: data.collection,
            };
        });
// Log the user playlists
        console.log('User Playlists:', userPlaylists);
        return userPlaylists;
    } catch (error) {
// Handle errors
        console.error('Error fetching user playlists:', error);
        throw error;
    }
};
/************************************************************************************
                                                                                  
                     UPDATING AN EXISTING PLAYLIST FIELDS 
  
************************************************************************************/
export const updateUserPlaylist = async (currentAddress, playlistName, updates) => {
    try {
// Check if wallet address and playlist name are provided
        if (!currentAddress || !playlistName) {
            console.error('Wallet address or playlist name is missing.');
            return null;
        }
        const firestore = getFirestore();
        const playlistsCollectionRef = collection(firestore, 'xechoPlaylists');
 // Query playlists based on wallet address and playlist name
        const querySnapshot = await getDocs(
            query(
                playlistsCollectionRef,
                where('walletAddress', '==', currentAddress),
                where('playlistName', '==', playlistName)
            )
        );
// Check if the playlist is found
        if (querySnapshot.empty) {
            console.error('Playlist not found.');
            return null;
        }
// Get the playlist document
        const playlistDoc = querySnapshot.docs[0];
// Update the playlist document with the provided updates
        await updateDoc(playlistDoc.ref, updates);
// Log success message and return playlist ID
        console.log('Playlist updated successfully.');
        return playlistDoc.id;
    } catch (error) {
// Handle errors
        console.error('Error updating playlist:', error);
        throw error;
    }
};
/************************************************************************************
                                                                                  
                   LIKED SONGS ADDITION WITH WALLET ADDRESS 
  
************************************************************************************/
export const likeSong = async (nft, userProfile, walletAddress) => {
    try {
// Get Firestore instance
        const firestore = getFirestore();
// Reference to the likes document for the song
        const likesRef = doc(firestore, "xechoLikes", nft.tokenId);
// Get the current likes data for the song
        const likesSnapshot = await getDoc(likesRef);
        const likesData = likesSnapshot.exists() ? likesSnapshot.data() : {};
// Check if the wallet has already liked the song
        const walletLiked = likesData.likedBy && likesData.likedBy[walletAddress];
        let newLikes;
// If wallet has already liked, remove the like; otherwise, add the like
        if (walletLiked) {
            // Remove like
            const newLikedBy = { ...likesData.likedBy };
            delete newLikedBy[walletAddress];
            newLikes = {
                count: Math.max(0, (likesData.count || 0) - 1),
                asset: nft,
                user: userProfile,
                songName: nft.name,
                type: "SONG",
                likedBy: newLikedBy,
            };
        } else {
// Add like
            newLikes = {
                count: (likesData.count || 0) + 1,
                asset: nft,
                user: userProfile,
                songName: nft.name,
                type: "SONG",
                likedBy: {
                    ...likesData.likedBy,
                    [walletAddress]: true,
                },
            };
        }
 // Update the likes document with the new likes data
        await setDoc(likesRef, newLikes);
  // Return the updated likes data
        return newLikes;
    } catch (error) {
// Handle errors
        console.error('Error liking song:', error);
        throw error;
    }
};

/************************************************************************************
                                                                                
                     LIKED ALBUM ADDITION WITH WALLET ADDRESS 
 
*************************************************************************************/
export const likeAlbum = async (album, albumName, walletAddress) => {
    try {
        const firestore = getFirestore();
        const albumCache = {};

        const likesRef = doc(firestore, "xechoLikes", album.id);
        const likesSnapshot = await getDoc(likesRef);
        const likesData = likesSnapshot.exists() ? likesSnapshot.data() : {};

        const walletLiked = likesData.likedBy && likesData.likedBy[walletAddress];

        let newLikes;
        if (walletLiked) {
            const newLikedBy = { ...likesData.likedBy };
            delete newLikedBy[walletAddress];

            newLikes = {
                album: album,
                albumName: albumName,
                count: Math.max(0, (likesData.count || 0) - 1),
                type: "ALBUM",
                likedBy: newLikedBy,
            };
        } else {
            newLikes = {
                album: album,
                albumName: albumName,
                count: (likesData.count || 0) + 1,
                type: "ALBUM",
                likedBy: {
                    ...likesData.likedBy,
                    [walletAddress]: true,
                },
            };
        }

        await setDoc(likesRef, newLikes);

        return newLikes;
    } catch (error) {
        console.error('Error liking album:', error);
        throw error;
    }
};
/************************************************************************************
                                                                              
                          FETCH LIKED SONGS AND ALBUMS
 
*************************************************************************************/
export const getUsersLikes = async (walletAddress) => {
    try {
        const userLikesCache = {};
        const firestore = getFirestore();
        const likesCollectionRef = collection(firestore, 'xechoLikes');

        console.log('Fetching liked items for wallet:', walletAddress);

        const querySnapshot = await getDocs(
            query(likesCollectionRef, where(`likedBy.${walletAddress}`, '==', true))
        );

        const likedItems = [];

        for (const doc of querySnapshot.docs) {
            const data = doc.data();
            const likedItem = {
                id: doc.id,
                type: data.type, // Include the 'type' field in the result
                ...data,
                isLiked: true,
            };

            likedItems.push(likedItem);
        }

        console.log('Liked Items for wallet:', walletAddress, likedItems);

        return likedItems;
    } catch (error) {
        console.error('Error getting liked items:', error);
        throw error;
    }
};







const getSongDetails = async (tokenId) => {
    try {
        const firestore = getFirestore();
        const userCollectionsRef = collection(firestore, 'nfts');
        const querySnapshot = await getDocs(
            query(userCollectionsRef, where('tokenId', '==', tokenId))
        );
        if (querySnapshot.size > 0) {
            return querySnapshot.docs[0].data();
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting song details:', error);
        throw error;
    }
};




const getAlbumDetails = async (docId) => {
    try {
        const firestore = getFirestore();
        const albumDoc = await getDoc(collection(firestore, 'userCollections', docId));
        return albumDoc.exists() ? albumDoc.data() : null;
    } catch (error) {
        console.error('Error getting album details:', error);
        throw error;
    }
};




export const reportAsset = async (assetId, assetName, reason, timestamp, walletAddress, assetType) => {
    try {
        console.log("Report Asset - Data to be submitted:", {
            assetId,
            assetName,
            reason,
            timestamp,
            walletAddress,
            assetType,
        });

        const firestore = getFirestore();
        const report = {
            assetId: assetId,
            assetName: assetName,
            reason: reason,
            timestamp: timestamp,
            walletAddress: walletAddress || null,
            assetType: assetType,
        };

        const reportsCollection = collection(firestore, "xechoReports");
        await addDoc(reportsCollection, report);

        console.log("Report Asset - Report submitted successfully!");

        return { success: true, message: "Report submitted successfully!" };
    } catch (error) {
        console.error("Report Asset - Error reporting asset:", error);
        return { success: false, message: "Error reporting asset. Please try again later." };
    }
};




