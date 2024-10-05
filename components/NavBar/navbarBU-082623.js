import React, { useState, useEffect, useContext } from "react";
import { useWeb3React } from "@web3-react/core";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { MdNotifications } from "react-icons/md";
import { BsSearch } from "react-icons/bs";
import { CgMenuRight } from "react-icons/cg";
import { ConnectWallet } from "@thirdweb-dev/react";
import { useDisconnect } from "@thirdweb-dev/react";


import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  TwitterAuthProvider,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import {
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";


import Style from "./NavBar.module.css";
import { Discover, HelpCenter, Notification, Profile, SideBar } from "./index";
import { Error } from "../componentsindex";
import logo from "../../img/logo.png";

import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";
import { FaAngleDown, FaPlus } from 'react-icons/fa';
import { animated, useTransition, config } from 'react-spring';
import { fetchUserNotifications } from '../../firebase/services';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

import { ThirdwebSDKProvider } from "@thirdweb-dev/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
// Read-only mode
const readOnlySdk = new ThirdwebSDK("binance-testnet", {
  clientId: "1c814b4d0548668ba3eb1511796aef53", 
});



export const getUserProfileImageByWallet = async (walletAddress) => {
  const firestore = getFirestore();
  const q = query(collection(firestore, "users"),
    where("walletAddress", "==", walletAddress));

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    let profilePictureUrl = null;
    querySnapshot.forEach((doc) => {

      let userData = doc.data();
      profilePictureUrl = userData.profilePictureUrl;
    });
    return profilePictureUrl;
  } else {
    console.error("No user found with the given wallet address");
    return null;
  }
};



const NavBar = () => {
  const [discover, setDiscover] = useState(false);
  const [showWalletInfo, setShowWalletInfo] = useState(false);
  const [help, setHelp] = useState(false);
  const [notification, setNotification] = useState(false);
  const [profile, setProfile] = useState(false);
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [openTimeoutId, setOpenTimeoutId] = useState(null);
  const [closeTimeoutId, setCloseTimeoutId] = useState(null);
  const disconnectWallet = useDisconnect();
  const router = useRouter();
  const { account, library } = useWeb3React();
  const [profileImageSrc, setProfileImageSrc] = useState("/default-user.png");
  const [isLoginAndSignUpOpen, setIsLoginAndSignUpOpen] = useState(false);
  const [showLoginAndSignUp, setShowLoginAndSignUp] = useState(false);
  const [isXploreOpen, setIsXploreOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [profileTimeoutId, setProfileTimeoutId] = useState(null);
  const [notificationTimeoutId, setNotificationTimeoutId] = useState(null);
  const [userNotifications, setUserNotifications] = useState([]);

  const [clickedCreate, setClickedCreate] = useState(false);
  const [shouldCloseWindow, setShouldCloseWindow] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedArea, setSelectedArea] = useState("NFTs");
  const [showDropdown, setShowDropdown] = useState(false);
  const updateUnreadNotifications = (hasUnread) => {
    setHasUnreadNotifications(hasUnread);
  };
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  const { currentAccount, connectWallet, openError, searchNavQuery, setSearchNavQuery } = useContext(
    NFTMarketplaceContext
  );
  const isWalletConnected = Boolean(currentAccount);
  const [showSmallWindow, setShowSmallWindow] = useState(true);

  useEffect(() => {
    const closeSmallWindow = () => {
      setShowSmallWindow(false);
    };


    const timeoutId = setTimeout(closeSmallWindow, 10000);

    return () => clearTimeout(timeoutId);
  }, []);



  // Sub-menu Animations using React-Spring
  const discoverTransition = useTransition(discover, {
    from: { opacity: 0, transform: 'translateY(0) translateX(-50%)', height: '0px' },
    // if nav links are added must manually adjust this height below,
    // very difficult to get the height of these containers when they are not rendered on load:
    enter: { opacity: 1, transform: 'translateY(0) translateX(-50%)', height: '125px' },
    leave: { opacity: 0, transform: 'translateY(0) translateX(-50%)', height: '0px' },
    config: config.stiff,
  });
  const helpTransition = useTransition(help, {
    from: { opacity: 0, transform: 'translateY(0) translateX(-50%)', height: '0px' },
    // if nav links are added must manually adjust this height below,
    // very difficult to get the height of these containers when they are not rendered on load:
    enter: { opacity: 1, transform: 'translateY(0) translateX(-50%)', height: '125px' },
    leave: { opacity: 0, transform: 'translateY(0) translateX(-50%)', height: '0px' },
    config: config.stiff,
  });
  const profileTransition = useTransition(isProfileMenuOpen, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: config.stiff,
  });
  const notificationTransition = useTransition(notification, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: config.stiff,
  });
  const sidebarTransition = useTransition(openSideMenu, {
    from: { opacity: 0, transform: "translateX(100%)" },
    enter: { opacity: 1, transform: "translateX(0%)" },
    leave: { opacity: 0, transform: "translateX(100%)" },
    config: config.stiff,
  });



  useEffect(() => {
    const fetchNotifications = async () => {
      if (currentAccount) {
        const notifications = await fetchUserNotifications(currentAccount);
        setUserNotifications(notifications);
        const hasUnread = notifications.some((notification) => !notification.read);
        setHasUnreadNotifications(hasUnread);
        console.log("Unread Notifications Length:", notifications.filter((notification) => !notification.read).length);
      }
    };

    if (currentAccount) {
      fetchNotifications();
    } else {
      setUserNotifications([]);
      setHasUnreadNotifications(false);
    }
  }, [currentAccount]);


  const checkWalletExists = async () => {
    if (currentAccount) {
      const firestore = getFirestore();
      const q = query(collection(firestore, "users"), where("walletAddress", "==", currentAccount));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        router.push("/loginandsignup");
      }
    }
  };


  const closeSmallWindow = () => {
    setShowSmallWindow(false);
    setClickedCreate(false);
  };


  useEffect(() => {
    const timeoutId = setTimeout(closeSmallWindow, 5000);

    return () => clearTimeout(timeoutId);
  }, []);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSmallWindow && !shouldCloseWindow) {
        const smallWindow = document.querySelector(".smallWindow");
        if (smallWindow && !smallWindow.contains(event.target)) {
          closeSmallWindow();
        }
      }
    };

    window.addEventListener("click", handleClickOutside);


    return () => window.removeEventListener("click", handleClickOutside);
  }, [showSmallWindow, shouldCloseWindow]);


  const handleCreateButtonClick = () => {

    checkWalletExists();


    if (isWalletConnected && currentAccount) {
      router.push("/createButtonsPage");
    } else {
      setShowSmallWindow(true);
      setTimeout(closeSmallWindow, 8000);
    }
  };


  const handleLinkClick = () => {
    setShowSmallWindow(false);

  };


  useEffect(() => {
    const fetchProfileImage = async () => {
      if (currentAccount) {
        const profileImageUrl = await getUserProfileImageByWallet(currentAccount);
        console.log('Profile Image URL: ', profileImageUrl);
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



  useEffect(() => {
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

  const closeNavbarButtons = () => {
    setDiscover(false);
    setHelp(false);
    setNotification(false);
    setProfile(false);
  };

  const closeSideBar = () => {
    setOpenSideMenu(false);
  };

  const openMenu = (menuType) => {
    clearTimeout(closeTimeoutId);
    if (openTimeoutId) {
      clearTimeout(openTimeoutId);
    }

    const newOpenTimeoutId = setTimeout(() => {
      if (menuType === "XPLORE") {
        setIsXploreOpen(true);
        setIsSupportOpen(false);
        setDiscover(true);
        setHelp(false);
        setNotification(false);
        setProfile(false);
      } else if (menuType === "SUPPORT") {
        setIsXploreOpen(false);
        setIsSupportOpen(true);
        setDiscover(false);
        setHelp(true);
        setNotification(false);
        setProfile(false);
      }
    }, 100); // shorter timeout for opening menus
    setOpenTimeoutId(newOpenTimeoutId);
  };

  const closeMenu = () => {
    if (openTimeoutId) {
      clearTimeout(openTimeoutId);
    }

    const newCloseTimeoutId = setTimeout(() => {
      setDiscover(false);
      setHelp(false);
      setIsXploreOpen(false);
      setIsSupportOpen(false);
    }, 200); // longer timeout for closing menus
    setCloseTimeoutId(newCloseTimeoutId);
  };

  const openNotification = () => {
    if (profile) setProfile(false); setIsProfileMenuOpen(false);
    closeSideBar();
    if (notificationTimeoutId) clearTimeout(notificationTimeoutId);
    if (!notification) {
      closeNavbarButtons();
      setNotification(true);
    } else {
      setNotification(false);
    }
  };

  const openProfile = () => {
    if (notification) setNotification(false);
    closeSideBar();
    if (profileTimeoutId) clearTimeout(profileTimeoutId);
    if (!profile) {
      closeNavbarButtons();
      setProfile(true);
      setIsProfileMenuOpen(true);
    } else {
      setProfile(false);
      setIsProfileMenuOpen(false);
    }
  };

  const closeProfileMenu = () => {
    const timeoutId = setTimeout(() => {
      setProfile(false);
      setIsProfileMenuOpen(false);
    }, 500);
    setProfileTimeoutId(timeoutId);
  };

  const handleNotificationMouseEnter = () => {
    if (notificationTimeoutId) clearTimeout(notificationTimeoutId);
    clearTimeout(profileTimeoutId);
  };

  const handleNotificationMouseLeave = () => {
    const timeoutId = setTimeout(() => {
      setNotification(false);
    }, 500);
    setNotificationTimeoutId(timeoutId);
  };

  const handleProfileMouseEnter = () => {
    if (profileTimeoutId) clearTimeout(profileTimeoutId);
    clearTimeout(notificationTimeoutId);
  };

  const handleProfileMouseLeave = () => {
    const timeoutId = setTimeout(() => {
      setProfile(false);
      setIsProfileMenuOpen(false);
    }, 500);
    setProfileTimeoutId(timeoutId);
  };

  const openSideBar = () => {
    if (!openSideMenu) {
      closeNavbarButtons();
      setOpenSideMenu(true);
      setIsProfileMenuOpen(false);
    } else {
      setOpenSideMenu(false);
    }
  };

  useEffect(() => {
    const handleRouteChange = () => {
      closeNavbarButtons();
      setOpenSideMenu(false);
    };
    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [timeoutId, setTimeoutId]);

  const handleConnectWallet = async (account) => {
    const profileImageUrl = await getUserProfileImageByWallet(account);
    if (profileImageUrl) {
      setProfileImageSrc(profileImageUrl);
      console.log("IMAGE URL: ", profileImageUrl);
    }
  };




  useEffect(() => {
    if (isWalletConnected && currentAccount) {
      const checkWalletExists = async () => {
        const firestore = getFirestore();
        const q = query(collection(firestore, "users"), where("walletAddress", "==", currentAccount));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          router.push("/loginandsignup");
        }


      };
      checkWalletExists();
    }
  }, [isWalletConnected, currentAccount, router]);

  const [isNavbarDocked, setIsNavbarDocked] = useState(true);


  useEffect(() => {
    const handleScroll = () => {
      setIsNavbarDocked(window.scrollY < 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // console.log("hasUnreadNotifications:", hasUnreadNotifications);

  const reloadRouter = function () {
    router.push("/");
    /*
    setTimeout(() => {
      window.location.reload();
    }, 200);
    */


  };


  const reloadLogin = function () {
    router.push("/loginandsignup");

  };

const handleSearchClick = () => {
  const encodedSearchNavQuery = encodeURIComponent(searchNavQuery);
  router.push(`/searchPage?searchNavQuery=${encodedSearchNavQuery}`);
  setSearchNavQuery("");
};


const handleInputKeyPress = (e) => {
  if (e.key === "Enter") {
    const encodedSearchNavQuery = encodeURIComponent(searchNavQuery);
    router.push(`/searchPage?searchNavQuery=${encodedSearchNavQuery}`);
    setSearchNavQuery("");
  }
};


  return (
    <div className={`${Style.navbar} ${isNavbarDocked ? "" : Style["navbar-undocked"]}`}>
      <div className={Style.navbar_container}>
        <div className={Style.navbar_container_left}>
          <Link href="/">
            <a>
              <div className={Style.logo}>
                <Image
                  src={logo}
                  alt="XMARKET NFT MARKETPLACE"
                  onClick={reloadRouter}

                />
              </div>
            </a>
          </Link>
          <div className={Style.navbar_container_left_box_input}>
            <div className={Style.navbar_container_left_box_input_box}>
            <input
              type="text"
              placeholder="XPLORE NFTs"
              value={searchNavQuery}
              onChange={(e) => setSearchNavQuery(e.target.value)}
              onKeyPress={handleInputKeyPress} 
            />
            <BsSearch onClick={handleSearchClick} className={Style.search_icon} />
            </div>
          </div>
        </div>


        {/* END OF LEFT SECTION */}
        <div className={Style.navbar_container_right}>
          {/* MAIN MENU LINKS */}
          <div className={Style.navbar_container_right_nav}>
            <nav>
              <ul className={Style.navbar_container_right_nav_ul}>
                <li>
                  <button onClick={handleCreateButtonClick} className={`${Style.createButton} ${Style.transparentButton} ${Style.createButtonFont}`}>
                    <a>
                      <span className={Style.iconContainer}>
                        CREATE
                        <FaPlus />

                      </span>
                    </a>
                  </button>
                </li>

                {/* DISCOVER / XPLORE MENU */}
                <li onMouseEnter={() => openMenu('XPLORE')} onMouseLeave={closeMenu}>
                  <a>
                    <span className={Style.iconContainer}>
                      XPLORE
                      <animated.div className={isXploreOpen ? "rotatedIcon" : ""}>
                        <FaAngleDown style={{ position: 'relative', top: '0.1rem' }} />
                      </animated.div>
                    </span>
                  </a>
                  {discoverTransition((style, item) =>
                    item ? (
                      <animated.div style={style} className={Style.navbar_container_right_discover_box}>
                        <Discover />
                      </animated.div>
                    ) : null
                  )}
                </li>
                {/* HELP CENTER / SUPPORT MENU */}
                <li onMouseEnter={() => openMenu('SUPPORT')} onMouseLeave={closeMenu}>
                  <a>
                    <span className={Style.iconContainer}>
                      SUPPORT
                      <animated.div className={isSupportOpen ? "rotatedIcon" : ""}>
                        <FaAngleDown style={{ position: 'relative', top: '0.1rem' }} />
                      </animated.div>
                    </span>
                  </a>
                  {helpTransition((style, item) =>
                    item ? (
                      <animated.div style={style} className={Style.navbar_container_right_help_box}>
                        <HelpCenter />
                      </animated.div>
                    ) : null
                  )}
                </li>
              </ul>
            </nav>
          </div>

          {/* NOTIFICATION MENU */}
          <div
            className={`${Style.navbar_container_right_notify} ${hasUnreadNotifications ? Style.hasUnread : ""}`}
            onMouseEnter={handleNotificationMouseEnter}
            onMouseLeave={handleNotificationMouseLeave}
          >
            <FontAwesomeIcon
              icon={faBell}
              className={Style.notify}
              onClick={() => openNotification()}
            />
            {notificationTransition((style, item) =>
              item ? (
                <animated.div
                  style={style}
                  className={Style.notification_menu}
                  onMouseEnter={handleNotificationMouseEnter}
                  onMouseLeave={handleNotificationMouseLeave}
                >
                  <Notification
                    isNavbarDocked={isNavbarDocked}
                    updateUnreadNotifications={updateUnreadNotifications}
                  />
                </animated.div>
              ) : null
            )}
          </div>

          <div className={Style.box_box_right}>
            <ConnectWallet
              className={`btn ${Style.loginSignupBtn} ${Style.box_box_right_btn}`}
              btnTitle="XCONNECT"
              modalTitle="LOGIN TO XMARKET"
              theme="dark"
              onConnect={handleConnectWallet}

            />
          </div>

          {/* USER PROFILE MENU */}
          <div className={Style.navbar_container_right_profile_box}>
            <div
              className={Style.navbar_container_right_profile}
              onMouseEnter={handleProfileMouseEnter}
              onMouseLeave={handleProfileMouseLeave}
              onClick={openProfile}
            >
              <img
                src={profileImageSrc}
                alt="Profile"
                width={40}
                height={40}
                className={Style.navbar_container_right_profile}
              />
            </div>
            {profileTransition((style, item) =>
              item ? (
                <animated.div
                  style={style}
                  className={Style.profile_menu}
                  onMouseEnter={handleProfileMouseEnter}
                  onMouseLeave={handleProfileMouseLeave}
                >
                  <div className={Style.profileMenuContainer}>
                    <Profile
                      currentAccount={currentAccount}
                      isWalletConnected={isWalletConnected}
                      disconnectWallet={disconnectWallet}
                      closeMenu={closeProfileMenu}
                      setIsProfileMenuOpen={setIsProfileMenuOpen}
                      showWalletInfo={showWalletInfo}
                      setProfileImageSrc={setProfileImageSrc}
                      isLoginAndSignUpOpen={isLoginAndSignUpOpen}
                      setIsLoginAndSignUpOpen={setIsLoginAndSignUpOpen}
                      showLoginAndSignUp={showLoginAndSignUp}
                      setShowLoginAndSignUp={setShowLoginAndSignUp}
                      isNavbarDocked={isNavbarDocked}
                    />
                  </div>
                </animated.div>
              ) : null
            )}
          </div>

          {/* SIDEBAR MENU BUTTON */}
          <div className={Style.navbar_container_right_menuBtn}>
            <CgMenuRight className={Style.menuIcon} onClick={() => openSideBar()} />
          </div>

          {/* SIDEBAR MENU */}
          {sidebarTransition((style, item) =>
            item ? (
              <animated.div
                style={style}
                className={Style.sideBar}
              >
                <SideBar
                  setOpenSideMenu={setOpenSideMenu}
                  currentAccount={currentAccount}
                  connectWallet={connectWallet}
                />
              </animated.div>
            ) : null
          )}

        </div>
      </div>

      {/* display the connect popup */}

      {!isWalletConnected && showSmallWindow && (
        <div className={`${Style.smallWindow} `}>
          <p style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '10px' }}>
            Welcome To XMARKET
          </p>
          <p style={{ textAlign: 'center', margin: '10px 0' }}>
            Please Connect a BSC / Web3 Wallet
          </p>


          <div className={Style.box_box_right}>

            <ConnectWallet
              className={`btn ${Style.loginSignupBtn} ${Style.box_box_right_btn}`}
              modalTitle="WELCOME TO XMARKET"
              btnTitle="LOGIN  |  CREATE  XACCOUNT"
              theme="dark"
              onConnect={handleConnectWallet}

            />
          </div>


          {/* Login/Signup Link 
        <div className={Style.box_box_right}>
          <Link href="/loginandsignup">
            <a className={`btn ${Style.box_box_right_btn} ${Style.loginSignupBtn}`}>Login / Signup</a>
          </Link>
        </div>
        */}

        </div>
      )}


      {openError && <Error />}
    </div>
  );
};

export default NavBar;

