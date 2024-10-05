import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaUserAlt, FaRegImage, FaUserEdit, FaPlus, FaKey, FaCrown, FaShieldAlt, } from "react-icons/fa";
import { MdHelpCenter } from "react-icons/md";
import { TbDownloadOff, TbDownload } from "react-icons/tb";
import Link from "next/link";
import { useWeb3React } from "@web3-react/core";
import { ConnectWallet } from "@thirdweb-dev/react";
import NavBar from "../../NavBar/NavBar";
import { useRouter } from "next/router";
import styles from "./Profile.module.css";
import LoginAndSignUp from "../../../loginAndSignUp/LoginAndSignUp.jsx";

const Profile = ({
  isNavbarDocked,
  currentAccount,
  closeMenu,
  isWalletConnected,
  disconnectWallet,
  setIsProfileMenuOpen,
  setProfileImageSrc,
  isLoginAndSignUpOpen,
}) => {
  const { account, library } = useWeb3React();
  const [componentReloadFlag, setComponentReloadFlag] = useState(false);

  
  // List of owner wallet addresses
  const ownerAddresses = ['0x087228c5DB135c0F9b4e4BcFa7505BB543ccFA7a', '0x30bd0fBa7E3A54D766c5f0071B32a996595C50b0', ];

  // Check if the connected wallet address is in the ownerAddresses list
  const isOwner = ownerAddresses.includes(currentAccount);
  console.log('Connected Wallet Address:', currentAccount);
  console.log('isOwner:', isOwner);
  const handleProfilePictureChange = async (file) => {
    try {
      const url = await uploadProfilePicture(file);
      setProfileImageSrc(url);
      setMessage("Profile picture uploaded successfully!");

      // Update user's profile picture in the Firebase database
      await updateUser(currentAccount, { profilePicture: url });
    } catch (error) {
      console.log(error);
      setMessage("Failed to upload profile picture!");
    }
  };

  const router = useRouter();

  const handleDisconnect = () => {
    disconnectWallet();
    setIsProfileMenuOpen(false);
    if (closeMenu) closeMenu();
    setProfileImageSrc("/default-user.png");
    router.push("/");
    setTimeout(() => {
      window.location.reload();
    }, 200);
  };

  const [balance, setBalance] = React.useState("0");

  React.useEffect(() => {
    if (account && library) {
      library
        .getBalance(account)
        .then((balance) => {
          setBalance(library.utils.fromWei(balance));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [account, library]);

  return (
    <>
      {isLoginAndSignUpOpen && (
        <LoginAndSignUp
          currentAccount={currentAccount}
          setProfileImageSrc={setProfileImageSrc} // pass the function as a prop
        />
      )}
      <div
        key={componentReloadFlag ? "reloadKey" : "normalKey"}
        className={`${styles.profile} ${
          isNavbarDocked ? "" : styles.profileUndocked
        }`}
      >
        <div className={styles.profileContainer}>
          <div className={styles.profileBox}>
            <div className={styles.profileItems}>
              <div className={styles.linkContainer}>
                <Link href={isWalletConnected ? "/myProfile" : "/"}>
                  <a
                    onClick={() => setIsProfileMenuOpen(false)}
                    className={styles.linkA}
                  >
                    <span className={styles.linkText}>
                      {isWalletConnected ? "My Profile" : "Home"}
                    </span>
                    <FaUserAlt className={styles.icon} />
                  </a>
                </Link>
              </div>
              {isWalletConnected && (
                <div className={styles.linkContainer}>
                  <Link href="/editProfile">
                    <a
                      onClick={() => setIsProfileMenuOpen(false)}
                      className={styles.linkA}
                    >
                      <span className={styles.linkText}>Edit Profile</span>
                      <FaUserEdit className={styles.icon} />
                    </a>
                  </Link>
                </div>
              )}

              {isOwner && (
                <div className={styles.linkContainer}>
                  <Link href="/ownerOps">
                    <a className={styles.linkA}>
                      <span className={styles.linkText}>Owners</span>
                      <FaCrown className={styles.icon} />
                    </a>
                  </Link>
                </div>
              )}

              {isWalletConnected && (
                <div className={styles.linkContainer} onClick={handleDisconnect}>
                  <a className={styles.linkA}>
                    <span className={styles.linkText}>Disconnect Wallet</span>
                    <TbDownloadOff className={styles.icon} />
                  </a>
                </div>
              )}
            </div>
          </div>
          <div className={styles.profileUpgrade}>
            {isWalletConnected && (
              <div>{/* Render wallet information */}</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
