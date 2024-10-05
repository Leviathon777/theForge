import React, { useState, useEffect, useContext, forwardRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { GrClose } from "react-icons/gr";
import {
  FaFacebookF,
  FaTiktok,
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaArrowDown,
} from "react-icons/fa";
import { useAddress } from "@thirdweb-dev/react";

//import { getUserProfileImageByWallet } from "../Discover/Discover";

import { ConnectWallet, darkTheme } from "@thirdweb-dev/react";

import { useDisconnect } from "@thirdweb-dev/react";
import { NFTMarketplaceContext } from "../../../Context/NFTMarketplaceContext";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import Style from "./SideBar.module.css";
import  xmarket_100h from "../../../img/xmarket_100h.png";

import { Discover, HelpCenter } from "../../NavBar/index";

/* WALLET CONNECT START */

export const getUserProfileImageByWallet = async (walletAddress) => {
  const firestore = getFirestore();
  const q = query(
    collection(firestore, "users"),
    where("walletAddress", "==", walletAddress)
  );

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    let profilePictureUrl = null;
    querySnapshot.forEach((doc) => {
      let userData = doc.data();
      profilePictureUrl = userData.profilePictureUrl;
    });
    return profilePictureUrl;
  } else {
    console.error("Wallet not found");
    return null;
  }
};

//const SideBar = ({ setOpenSideMenu }) => {
const SideBar = forwardRef(({ setOpenSideMenu }, ref) => {
  const [profileImageSrc, setProfileImageSrc] = useState("/default-user.png");
  const [openDiscover, setOpenDiscover] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);
  const address = useAddress();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [username, setUsername] = useState("");

  const { currentAccount, connectWallet, openError } = useContext(
    NFTMarketplaceContext
  );

  const handleConnectWallet = async (account) => {
    const profileImageUrl = await getUserProfileImageByWallet(account);
    if (profileImageUrl) {
      setProfileImageSrc(profileImageUrl);
      console.log("IMAGE URL: ", profileImageUrl);
    }
  };

  useEffect(() => {
    setIsWalletConnected(Boolean(address));
  }, [address]);

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (currentAccount) {
        const profileImageUrl = await getUserProfileImageByWallet(
          currentAccount
        );
        console.log("Profile Image URL: ", profileImageUrl); // Log the retrieved URL
        if (profileImageUrl) {
          setProfileImageSrc(profileImageUrl);
        } else {
          setProfileImageSrc("/default-user.png");
        }
      } else {
        setProfileImageSrc("/default-user.png");
      }
    };

    fetchProfileImage();
  }, [currentAccount]);

  const fetchUsername = async (account) => {
    const firestore = getFirestore();
    const q = query(
      collection(firestore, "users"),
      where("walletAddress", "==", account)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        setUsername(userData.username);

        setTimeout(() => {
          setShowWelcomeMessage(false);
        }, 5000);
      });
    }
  };

  /* WALLET CONNECT END */

  /*  const discover = [
    {
      name: "SEARCH XM",
      link: "searchPage",
    },
    {
      name: "XM CATEGORIES",
      link: "categoriesPage",
    },
    {
      name: "XM CREATORS",
      link: "author",
    },
    {
      name: "BEGIN CREATING",
      link: "createButtonsPage",
    },
    {
      name: "XNEWS",
      link: "https://www.xdrip.io/news",
    },
  ];

  const helpCenter = [
    {
      name: "ABOUT US",
      link: "aboutus",
    },
    {
      name: "CONTACT US",
      link: "contactus",
    },
    {
      name: "FAQS",
      link: "faqs",
    },
  ];

  const openDiscoverMenu = () => {
    setOpenDiscover(!openDiscover);
  };

  const openHelpMenu = () => {
    setOpenHelp(!openHelp);
  };*/

  const closeSideBar = () => {
    setOpenSideMenu(false);
  };

  return (
    <div className={Style.sideBar} ref={ref}>
      <ConnectWallet
        btnTitle="Sign In | Sign Up"
        className={`btn ${Style.loginSignupBtn} ${Style.box_box_right_btn}`}
        // using our sdtuff nw instead of 3rdweb default
        detailsBtn={() => {
          return (
            <button
              className={Style.genericInfoBox}
              style={{ backgroundColor: "transparent" }}
            >
              {console.log(username)}
              <div
                style={{
                  padding: "8px 10px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyItems: "center",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <h4>{username}</h4>
                  </div>

                  <p style={{ color: "#017afe", fontSize: "9px", margin: "0" }}>
                    {currentAccount.slice(0, 2) +
                      "..." +
                      currentAccount.slice(-4)}
                  </p>
                </div>
                <div
                  style={{
                    marginLeft: "10px",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "5px",
                  }}
                >
                  <Image
                    src={xmarket_100h}
                    alt="XMARKET Image"
                    width="20"
                    height="20"
                  />
                </div>
              </div>
            </button>
          );
        }}
        modalTitle="Sign In"
        theme={darkTheme({
          colors: {
            modalBg: "#000000",
            dropdownBg: "#000000",
            borderColor: "#017afe",
            separatorLine: "#017afe",
          },
        })}
        modalSize={"compact"}
        onConnect={handleConnectWallet}
        //auth={{ loginOptional: false }}
        switchToActiveChain={true}
        termsOfServiceUrl="../../pages/termsOfService.js"
        privacyPolicyUrl="../../privacyPolicy.js"
        welcomeScreen={{
          title: "Welcome To XMARKET by XdRiP",
          subtitle: "The Future In Digital Asset Creation",
          img: {
            src: "https://6qj9ln-3000.csb.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.b8c5d488.png&w=1920&q=75",
            width: 300,
            height: 50,
          },
        }}
      />

      <div className={Style.sideBar_menu}>
        <h3>XPLORE</h3>
        <Discover isWalletConnected={isWalletConnected} />

        <h3>SUPPORT</h3>
        <HelpCenter />

        {/*<GrClose
        className={Style.sideBar_closeBtn}
        onClick={() => closeSideBar()}
      />

      <div className={Style.sideBar_box}>
        <Image src={logo} alt="logo" width={150} height={45} />
        <p>
          Discover Xcellent articles on all topics regarding NFT's. Write your
          own stories and share them as well.
        </p>
        <div className={Style.sideBar_social}>
          <a href="https://www.facebook.com/TheXdripOfficial/">
            <FaFacebookF />
          </a>
          <a href="https://www.tiktok.com/@xdripofficial?lang=en">
            <FaTiktok />
          </a>
          <a href="https://twitter.com/XDRIP__">
            <FaTwitter />
          </a>
          <a href="https://www.youtube.com/channel/UCql_clMpK5GYxXUREIGfnRw">
            <FaYoutube />
          </a>
          <a href="https://www.instagram.com/thexdripofficial/">
            <FaInstagram />
          </a>
        </div>
      </div>
        <div>
          <div
            className={Style.sideBar_menu_box}
            onClick={() => openDiscoverMenu()}
          >
            <p>XPLORE XM</p>
            <FaArrowDown />
          </div>

          {openDiscover && (
            <div className={Style.sideBar_discover}>
              {discover.map((el, i) => (
                <p key={i + 1}>
                  <Link href={{ pathname: `${el.link}` }}>{el.name}</Link>
                </p>
              ))}
            </div>
          )}
        </div>
        <div>
          <div
            className={Style.sideBar_menu_box}
            onClick={() => openHelpMenu()}
          >
            <p>Help Center</p>
            <FaArrowDown />
          </div>

          {openHelp && (
            <div className={Style.sideBar_discover}>
              {helpCenter.map((el, i) => (
                <p key={i + 1}>
                  <Link href={{ pathname: `${el.link}` }}>{el.name}</Link>
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className={Style.sideBar_button}>
        <button className={Style.box_box_right_btn}>
            could use in future but navbar does it atm 
          {address ? "Connected" : "Connect Wallet"}
        </button>
      </div>*/}
      </div>
    </div>
  );
});

export default SideBar;
