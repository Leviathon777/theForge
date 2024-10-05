import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAddress } from "@thirdweb-dev/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import Style from "./newloginAndSignUp.module.css";
import images from "../img";
import { Button } from "../components/componentsindex.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  TwitterAuthProvider,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ButtonSprite } from "../components/componentsindex.js";

const LoginAndSignUp = ({ currentAccount, setProfileImageSrc }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [activeBtn, setActiveBtn] = useState(1);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [message, setMessage] = useState("");
  const [isCreator, setIsCreator] = useState(false);
  const [creatorPage, setCreatorPage] = useState("");
  const router = useRouter();

  const firestore = getFirestore();

  const [emailError, setEmailError] = useState("");

  const [socials, setSocials] = useState({
    twitter: "",
    facebook: "",
    instagram: "",
    tiktok: "",
    discord: "",
  });

  const isValidEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
  };

  const handleEmailChange = (e) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);

    if (!inputEmail) {
      setEmailError("PLEASE ENTER YOUR EMAIL ADDRESS.");
      return;
    }

    if (!isValidEmail(inputEmail)) {
      setEmailError("INVALID EMAIL FORMAT.");
    } else {
      setEmailError("");
    }
  };

  const handleCreatorChange = (e) => {
    setIsCreator(e.target.checked);
  };

  const address = useAddress();

  useEffect(() => {
    if (address) {
      setWalletAddress(address);
    }
  }, [address]);

  useEffect(() => {
    if (currentAccount) {
      setWalletAddress(currentAccount);
    }
  }, [currentAccount]);

  const handleSignInWithTwitter = async () => {
    const auth = getAuth();
    const provider = new TwitterAuthProvider();
    try {
      const { user } = await signInWithPopup(auth, provider);
      setWalletAddress(user.walletAddress);
      setMessage("USER SIGNED IN SUCCESSFULLY!");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleSignInWithGoogle = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      const { user } = await signInWithPopup(auth, provider);
      setWalletAddress(user.walletAddress);
      setMessage("USER SIGNED IN SUCCESSFULLY!");

      const { uid, displayName, email, photoURL } = user;
      const newUser = {
        email,
        username: displayName || email,
        website: "",
        walletAddress,
        profilePictureUrl: photoURL,
        isCreator: isCreator || false,
        creatorPage: creatorPage || "",
        nftsCreated: [],
        nftsListed: [],
        nftsSold: [],
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
      };

      const userRef = collection(firestore, "users");
      const querySnapshot = await getDocs(
        query(userRef, where("email", "==", email))
      );

      if (querySnapshot.empty) {
        await addDoc(userRef, newUser);
      } else {
        const docRef = querySnapshot.docs[0].id;
        await updateDoc(doc(userRef, docRef), newUser);
      }

      toast.success("XMARKET USER CREATED SUCCESSFULLY!");
      router.push("/editProfile");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUser = {
        email,
        username,
        website: "",
        walletAddress,
        profilePictureUrl: "",
        isCreator: isCreator || false,
        creatorPage: creatorPage || "",
        nftsCreated: [],
        nftsListed: [],
        nftsSold: [],
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
      };
      const userRef = collection(firestore, "users");
      const docRef = await addDoc(userRef, newUser);

      if (profileImage) {
        const storage = getStorage();
        const fileRef = ref(storage, `profileImages/${docRef.id}`);
        await uploadBytes(fileRef, profileImage);
        const imageUrl = await getDownloadURL(fileRef);

        await updateDoc(doc(firestore, "users", docRef.id), {
          profilePictureUrl: imageUrl,
        });
      }

      toast.success("XMARKET user created successfully!");
      router.push("/myProfile"); // Navigate to the edit profile page
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleImageUpload = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const socialImage = [
    /*
    {
      social: images.twitter,
      name: "CONTINUE WITH TWITTER",
    },
    */

    {
      social: images.google,
      name: "CONTINUE WITH GOOGLE",
    },

    /*
    {
      social: images.facebook,
      name: "CONTINUE WITH FACEBOOK",
    },
    */
  ];

  const isNewUser = !currentAccount;

  return (
    <div className={Style.user}>
      <div className={Style.user_box}>
        <div className={Style.form_box}>
          <form onSubmit={handleSubmit} className={Style.user_box_input}>
            <div className={Style.user_box_input_box}>
              <label htmlFor="username">USERNAME</label>
              <input
                type="text"
                placeholder="ENTER YOUR USERNAME"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className={Style.user_box_input_box}>
              <label htmlFor="email">EMAIL ADDRESS</label>
              <input
                type="email"
                placeholder="example@example.com"
                value={email}
                onChange={handleEmailChange}
              />
              {emailError && (
                <span className={Style.error_message}>{emailError}</span>
              )}
            </div>

            <div className={Style.user_box_input_box}>
              <label htmlFor="walletAddress">WALLET ADDRESS</label>
              <input
                type="text"
                placeholder="ENTER YOUR WALLET ADDRESS"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
              />
            </div>

            <div className={Style.user_box_input_box}>
              <label htmlFor="password">PASSWORD</label>
              <input
                type="password"
                placeholder="ENTER YOUR PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className={Style.user_box_input_box}>
              <label htmlFor="profilePicture">PROFILE PICTURE</label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.gif"
                onChange={handleImageUpload}
              />
            </div>
            {message && <div className={Style.message}>{message}</div>}


            <ButtonSprite
              btnURL=""
              btnSize="size2"
              btnText="Submit"
              fontSize="16px"
              paddingLeft="4rem"
              paddingRight="default"
              playSound="yes"
              onClick={handleSubmit} type="submit" className={Style.submitBtn}
            />
          </form>
        </div>
        <p className={Style.user_box_or}>OR</p>
        <div className={Style.user_box_social}>
          {isNewUser && (
            <div className={`${Style.new_user_detected} ${Style.text_center}`}>
              <h2>CREATE YOUR XMARKET USER ACCOUNT</h2>
            </div>
          )}
          {socialImage.map((el, i) => (
            <div
              key={i}
              onClick={() => {
                if (el.name === "CONTINUE WITH TWITTER") {
                  handleSignInWithTwitter();
                } else if (el.name === "CONTINUE WITH GOOGLE") {
                  handleSignInWithGoogle();
                } else if (el.name === "CONTINUE WITH FACEBOOK") {
                  handleSignInWithFacebook();
                }
              }}
              className={`${Style.user_box_social_item} ${activeBtn === i + 1 ? Style.active : ""
                }`}
            >
              <Image
                src={el.social}
                alt={el.name}
                width={30}
                height={30}
                className={Style.user_box_social_item_img}
              />
              <p>
                <span>{el.name}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
      {message && <div className={Style.message}>{message}</div>}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastClassName={Style.toast_container}
        bodyClassName={Style.toast_body}
      />
    </div>
  );
};
export default LoginAndSignUp;
