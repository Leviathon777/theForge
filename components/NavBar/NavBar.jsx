import React, { useState, useEffect, useContext, useRef } from "react";
import { useWeb3React } from "@web3-react/core";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { BsSearch } from "react-icons/bs";
import { CgMenuRight } from "react-icons/cg";
import { ConnectWallet, darkTheme } from "@thirdweb-dev/react";

import { useDisconnect } from "@thirdweb-dev/react";

import Style from "./NavBar.module.css";
import {
  Create,
  Discover,
  HelpCenter,
  Notification,
  Profile,
  SideBar,
  Projects,
} from "./index";
import { Error } from "../componentsindex";
import logo from "../../img/logo.png";
import xmarket_100h from "../../img/xmarket_100h.png";
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";
import { FaAngleDown, FaPlus } from "react-icons/fa";
import { animated, useTransition, config } from "react-spring";
//import { fetchUserNotifications } from "../../firebase/services";


import { ThirdwebSDK } from "@thirdweb-dev/sdk";

const readOnlySdk = new ThirdwebSDK("binance-testnet", {
  clientId: "1c814b4d0548668ba3eb1511796aef53",
});

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
    console.error("No user found with the given wallet address");
    return null;
  }
};

const NavBar = () => {
  const [discover, setDiscover] = useState(false);
  const [projects, setProjects] = useState(false);
  const [create, setCreate] = useState(false);
  const [showWalletInfo, setShowWalletInfo] = useState(false);
  const [help, setHelp] = useState(false);
  const [notification, setNotification] = useState(false);
  const [profile, setProfile] = useState(false);
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const sidebarRef = useRef();
  const sidebarMenuButtonRef = useRef();
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
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [profileTimeoutId, setProfileTimeoutId] = useState(null);
  const [notificationTimeoutId, setNotificationTimeoutId] = useState(null);
  const [userNotifications, setUserNotifications] = useState([]);

  const [welcomeMessageShown, setWelcomeMessageShown] = useState(false);

  const [loading, setLoading] = useState(true);

  const [clickedCreate, setClickedCreate] = useState(false);
  const [shouldCloseWindow, setShouldCloseWindow] = useState(false);
  const updateUnreadNotifications = (hasUnread) => {
    setHasUnreadNotifications(hasUnread);
  };
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);

  const [username, setUsername] = useState("");
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);

  const {
    currentAccount,
    connectWallet,
    openError,
    searchNavQuery,
    setSearchNavQuery,
  } = useContext(NFTMarketplaceContext);
  const isWalletConnected = Boolean(currentAccount);
  const [showSmallWindow, setShowSmallWindow] = useState(true);

  const [shouldShowWelcomeMessage, setShouldShowWelcomeMessage] =
    useState(false);

  useEffect(() => {
    const closeSmallWindow = () => {
      setShowSmallWindow(false);
    };

    const timeoutId = setTimeout(closeSmallWindow, 8000);

    return () => clearTimeout(timeoutId);
  }, []);

  const createTransition = useTransition(create, {
    from: {
      opacity: 0,
      transform: "translateY(0) translateX(-50%)",
      height: "0px",
    },
    // if nav links are added must manually adjust this height below,
    // very difficult to get the height of these containers when they are not rendered on load:
    enter: {
      opacity: 1,
      transform: "translateY(0) translateX(-50%)",
      height: "125px",
    },
    leave: {
      opacity: 0,
      transform: "translateY(0) translateX(-50%)",
      height: "0px",
    },
    config: config.stiff,
  });
  const discoverTransition = useTransition(discover, {
    from: {
      opacity: 0,
      transform: "translateY(0) translateX(-50%)",
      height: "0px",
    },
    // if nav links are added must manually adjust this height below,
    // very difficult to get the height of these containers when they are not rendered on load:
    enter: {
      opacity: 1,
      transform: "translateY(0) translateX(-50%)",
      height: "155px",
    },
    leave: {
      opacity: 0,
      transform: "translateY(0) translateX(-50%)",
      height: "0px",
    },
    config: config.stiff,
  });
  const projectsTransition = useTransition(projects, {
    from: {
      opacity: 0,
      transform: "translateY(0) translateX(-50%)",
      height: "0px",
    },
    // if nav links are added must manually adjust this height below,
    // very difficult to get the height of these containers when they are not rendered on load:
    enter: {
      opacity: 1,
      transform: "translateY(0) translateX(-50%)",
      height: "155px",
    },
    leave: {
      opacity: 0,
      transform: "translateY(0) translateX(-50%)",
      height: "0px",
    },
    config: config.stiff,
  });
  const helpTransition = useTransition(help, {
    from: {
      opacity: 0,
      transform: "translateY(0) translateX(-50%)",
      height: "0px",
    },
    // if nav links are added must manually adjust this height below,
    // very difficult to get the height of these containers when they are not rendered on load:
    enter: {
      opacity: 1,
      transform: "translateY(0) translateX(-50%)",
      height: "125px",
    },
    leave: {
      opacity: 0,
      transform: "translateY(0) translateX(-50%)",
      height: "0px",
    },
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
        const hasUnread = notifications.some(
          (notification) => !notification.read
        );
        setHasUnreadNotifications(hasUnread);
        setShowWelcomeMessage(true);
        console.log(
          "Unread Notifications Length:",
          notifications.filter((notification) => !notification.read).length
        );
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
      const q = query(
        collection(firestore, "users"),
        where("walletAddress", "==", currentAccount)
      );
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If there's a click outside the sidebar and not on the menu button, close the sidebar
      if (
        openSideMenu &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        if (
          sidebarMenuButtonRef.current &&
          sidebarMenuButtonRef.current.contains(event.target)
        ) {
          return;
        }
        closeSideBar();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openSideMenu, sidebarRef, sidebarMenuButtonRef]);

  const handleCreateButtonClick = () => {
    checkWalletExists();

    if (isWalletConnected && currentAccount) {
      router.push("/createButtonsPage");
    } else {
      setShowSmallWindow(true);
      setTimeout(closeSmallWindow, 8000);
    }
  };

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (currentAccount) {
        const profileImageUrl = await getUserProfileImageByWallet(
          currentAccount
        );
        console.log("Profile Image URL: ", profileImageUrl);
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
    return () => {
      clearTimeout(profileTimeoutId);
    };
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
    setProjects(false);
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
        setIsProjectsOpen(false);
        setIsSupportOpen(false);
        setIsCreateOpen(false);
        setCreate(false);
        setDiscover(true);
        setHelp(false);
        setNotification(false);
        setProfile(false);
        setProjects(false);
      } else if (menuType === "PROJECTS") {
        setIsXploreOpen(false);
        setIsProjectsOpen(true);
        setIsSupportOpen(false);
        setIsCreateOpen(false);
        setCreate(false);
        setDiscover(false);
        setHelp(false);
        setNotification(false);
        setProfile(false);
        setProjects(true);
      } else if (menuType === "SUPPORT") {
        setIsXploreOpen(false);
        setIsProjectsOpen(false);
        setIsSupportOpen(true);
        setIsCreateOpen(false);
        setCreate(false);
        setDiscover(false);
        setHelp(true);
        setNotification(false);
        setProfile(false);
        setProjects(false);
      } else if (menuType === "CREATE") {
        setIsXploreOpen(false);
        setIsProjectsOpen(false);
        setIsSupportOpen(false);
        setIsCreateOpen(true);
        setCreate(true);
        setDiscover(false);
        setHelp(false);
        setNotification(false);
        setProfile(false);
        setProjects(false);
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
      setCreate(false);
      setProjects(false);
      setIsXploreOpen(false);
      setIsSupportOpen(false);
      setIsCreateOpen(false);
      setIsProjectsOpen(false);
    }, 200); // longer timeout for closing menus
    setCloseTimeoutId(newCloseTimeoutId);
  };

  const openNotification = () => {
    if (profile) setProfile(false);
    setIsProfileMenuOpen(false);
    closeSideBar();
    if (notificationTimeoutId) clearTimeout(notificationTimeoutId);
    if (!notification) {
      closeNavbarButtons();
      setNotification(true);
      setNotificationMenuOpen(true);
      //setShowWelcomeMessage(true);
    } else {
      setNotification(false);
      setNotificationMenuOpen(false);
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

  const fetchUsernameAndShowWelcome = async (account) => {
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
        setShowWelcomeMessage(true);

        setTimeout(() => {
          setShowWelcomeMessage(false);
        }, 4000);
      });
    }
  };

  const handleConnectWallet = async (account) => {
    const profileImageUrl = await getUserProfileImageByWallet(account);

    if (profileImageUrl) {
      setProfileImageSrc(profileImageUrl);
      fetchUsernameAndShowWelcome(account);

      if (!welcomeMessageShown) {
        setShowWelcomeMessage(true);
        setWelcomeMessageShown(true);
        setTimeout(() => {
          setShowWelcomeMessage(false);
        }, 4000);
      }

      console.log("IMAGE URL: ", profileImageUrl);
    }
  };

  useEffect(() => {
    if (isWalletConnected && currentAccount) {
      const checkWalletExists = async () => {
        const firestore = getFirestore();
        const q = query(
          collection(firestore, "users"),
          where("walletAddress", "==", currentAccount)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setShowWelcomeMessage(true);
          setUsername("New Visitor, Please Standby");

          setTimeout(() => {
            setShowWelcomeMessage(false);
            router.push("/loginandsignup");
          }, 4000);
          setProfileTimeoutId(timeoutId);
        } else {
          fetchUsernameAndShowWelcome(currentAccount);
        }
      };
      checkWalletExists();
    }
  }, [isWalletConnected, currentAccount]);

  useEffect(() => {
    if (showWelcomeMessage && welcomeMessageShown) {
      const hideWelcomeTimeout = setTimeout(() => {
        setShowWelcomeMessage(false);
      }, 4000);
      return () => clearTimeout(hideWelcomeTimeout);
    }
  }, [showWelcomeMessage, welcomeMessageShown]);

  useEffect(() => {
    if (router.pathname === "/") {
      setShouldShowWelcomeMessage(true);
      const hideTimeout = setTimeout(() => {
        setShouldShowWelcomeMessage(false);
      }, 4000);

      return () => clearTimeout(hideTimeout);
    }
  }, [router.pathname]);

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

  useEffect(() => {
    setLoading(false);

    if (!isWalletConnected) {
      setShowSmallWindow(true);
    }
  }, [isWalletConnected]);

  const WalletSelectorButton = `
  background-color: #000000; 
  &:hover {

      
    backgroundColor: transparent;
    border: 3px solid #017afe;
    fontColor: #ffffff;
    fontWeight: bold;
  }
`;

  return (
    <div
      className={`${Style.navbar} ${isNavbarDocked ? "" : Style["navbar-undocked"]
        }`}
    >
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
              <BsSearch
                onClick={handleSearchClick}
                className={Style.search_icon}
              />
            </div>
          </div>
        </div>

        {/* END OF LEFT SECTION */}
        <div className={Style.navbar_container_right}>
          {/* MAIN MENU LINKS */}
          <div className={Style.navbar_container_right_nav}>
            <nav>
              <ul className={Style.navbar_container_right_nav_ul}>
                <li
                  onMouseEnter={() => openMenu("CREATE")}
                  onMouseLeave={closeMenu}
                >
                  <a>
                    <span className={Style.iconContainer}>
                      CREATE
                      <animated.div
                        className={isCreateOpen ? "rotatedIcon" : ""}
                      >
                        <FaAngleDown
                          style={{ position: "relative", top: "0.1rem" }}
                        />
                      </animated.div>
                    </span>
                  </a>
                  {createTransition((style, item) =>
                    item ? (
                      <animated.div
                        style={style}
                        className={Style.navbar_container_right_discover_box}
                      >
                        <Create />
                      </animated.div>
                    ) : null
                  )}
                </li>

                {/* DISCOVER / XPLORE MENU */}
                <li
                  onMouseEnter={() => openMenu("XPLORE")}
                  onMouseLeave={closeMenu}
                >
                  <a>
                    <span className={Style.iconContainer}>
                      XPLORE
                      <animated.div
                        className={isXploreOpen ? "rotatedIcon" : ""}
                      >
                        <FaAngleDown
                          style={{ position: "relative", top: "0.1rem" }}
                        />
                      </animated.div>
                    </span>
                  </a>
                  {discoverTransition((style, item) =>
                    item ? (
                      <animated.div
                        style={style}
                        className={Style.navbar_container_right_discover_box}
                      >
                        <Discover />
                      </animated.div>
                    ) : null
                  )}
                </li>
                {/* PROJECTS MENU */}
                <li
                  onMouseEnter={() => openMenu("PROJECTS")}
                  onMouseLeave={closeMenu}
                >
                  <a>
                    <span className={Style.iconContainer}>
                      PROJECTS
                      <animated.div
                        className={isProjectsOpen ? "rotatedIcon" : ""}
                      >
                        <FaAngleDown
                          style={{ position: "relative", top: "0.1rem" }}
                        />
                      </animated.div>
                    </span>
                  </a>
                  {projectsTransition((style, item) =>
                    item ? (
                      <animated.div
                        style={style}
                        className={Style.navbar_container_right_discover_box}
                      >
                        <Projects />
                      </animated.div>
                    ) : null
                  )}
                </li>
                {/* HELP CENTER / SUPPORT MENU */}
                <li
                  onMouseEnter={() => openMenu("SUPPORT")}
                  onMouseLeave={closeMenu}
                >
                  <a>
                    <span className={Style.iconContainer}>
                      SUPPORT
                      <animated.div
                        className={isSupportOpen ? "rotatedIcon" : ""}
                      >
                        <FaAngleDown
                          style={{ position: "relative", top: "0.1rem" }}
                        />
                      </animated.div>
                    </span>
                  </a>
                  {helpTransition((style, item) =>
                    item ? (
                      <animated.div
                        style={style}
                        className={Style.navbar_container_right_help_box}
                      >
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
            className={`${Style.navbar_container_right_notify} ${hasUnreadNotifications ? Style.hasUnread : ""
              }`}
            onMouseEnter={handleNotificationMouseEnter}
            onMouseLeave={handleNotificationMouseLeave}
          >
            <FontAwesomeIcon
              icon={faBell}
              className={Style.notify}
              onClick={() => openNotification()}
            />

            {/* added a welcome message  */}
            {showWelcomeMessage &&
              !router.pathname.includes("/loginandsignup") && (
                <div className={Style.welcomeMessageOverlay}>
                  <div className={Style.welcomeMessageContent}>
                    Welcome {username}
                  </div>
                </div>
              )}

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
              btnTitle="Sign In | Sign Up"
              className={`btn ${Style.loginSignupBtn} ${Style.box_box_right_btn}`}
              // using our sdtuff nw instead of 3rdweb default
              detailsBtn={() => {
                return (
                  <button
                    className={Style.genericInfoBox}
                    style={{ backgroundColor: "transparent" }}
                  >
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
                          <p
                            style={{
                              fontSize: "medium",
                              marginBottom: "4px",
                              marginTop: "0",
                              maxWidth: "160px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {username}
                          </p>
                        </div>
                        <p
                          style={{
                            color: "#017afe",
                            fontSize: "12px",
                            margin: "0",
                          }}
                        >
                          {currentAccount.slice(0, 4) +
                            " . . . " +
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
                          width="30"
                          height="30"
                        />
                      </div>
                    </div>
                  </button>
                );
              }}
              modalTitle="  Please Select Wallet"
              theme={darkTheme({
                colors: {
                  modalBg: "#000000",
                  walletSelectorButtonHoverBg: WalletSelectorButton,
                  //walletSelectorButtonHoverBg: "#017afe",

                  dropdownBg: "#000000",
                  borderColor: "#017afe",
                  separatorLine: "#017afe",
                },
              })}
              modalSize={"wide"}
              onConnect={handleConnectWallet}
              //auth={{ loginOptional: false }}
              switchToActiveChain={true}
              termsOfServiceUrl="../../pages/termsOfService.js"
              privacyPolicyUrl="../../privacyPolicy.js"
              welcomeScreen={{
                title: "Welcome To XMARKET by XdRiP",
                subtitle: "The Future In Digital Asset Creation",
                img: {
                  src: "xmarketsquare2.png",
                  width: 300,
                  height: 300,
                },
              }}
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
          <div
            className={Style.navbar_container_right_menuBtn}
            ref={sidebarMenuButtonRef}
          >
            <CgMenuRight
              className={Style.menuIcon}
              onClick={() => openSideBar()}
            />
          </div>

          {/* SIDEBAR MENU */}
          {sidebarTransition((style, item) =>
            item ? (
              <animated.div style={style} className={Style.sideBar}>
                <SideBar
                  ref={sidebarRef}
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
        <div
          className={`${Style.smallWindow} ${isNavbarDocked ? "" : Style.smallWindowUndocked
            }`}
        >
          <p
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "10px",
            }}
          >
            Welcome To XMARKET
          </p>
          <div className={Style.box_box_right}>
            <ConnectWallet
              className={`btn ${Style.loginSignupBtn} ${Style.box_box_right_btn}`}
              modalTitle="WELCOME TO XMARKET"
              btnTitle="Login  |  Create  XAccount"
              theme="dark"
              onConnect={handleConnectWallet}
            />
          </div>
        </div>
      )}
      {openError && <Error />}
    </div>
  );
};

export default NavBar;
