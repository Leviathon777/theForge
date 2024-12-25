/*
import React, { useEffect, useState, useCallback } from "react";
import {
  ThirdwebProvider,
  inAppWallet,
  metamaskWallet,
  trustWallet,
  //phantomWallet,
  coinbaseWallet,
  walletConnect,
  localWallet,
  smartWallet,
} from "@thirdweb-dev/react";
import Head from "next/head";
import Cookies from "js-cookie";
import { MOHProvider } from "../Context/MOHProviderContext";
import "../styles/globals.css";
import { EntryPage } from "../components/componentsindex";
import { ChainId } from "@thirdweb-dev/sdk";

const MyApp = ({ Component, pageProps }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [useGuestWallet, setUseGuestWallet] = useState(false);
  const [adminWallet, setAdminWallet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [splashVideo, setSplashVideo] = useState("/videos/splash.mp4");
  const [deferredPrompt, setDeferredPrompt] = useState(null); // strictly forbidden on ios - may work some android
  const [isInstallable, setIsInstallable] = useState(false); // strictly forbidden on ios - may work some android

  useEffect(() => {
    const mobileVideo = "/videos/splashmobile.mp4";
    const pcVideo = "/videos/splashpc.mp4";
    setSplashVideo(window.innerWidth <= 768 ? mobileVideo : pcVideo);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && !Cookies.get("acceptedCookies")) {
      setIsModalVisible(true);
    }
  }, [isLoading]);

  const handleAccept = () => {
    Cookies.set("acceptedCookies", "true", { expires: 30 });
    setIsModalVisible(false);
  };

  const handleDecline = () => setIsModalVisible(false);

  const connectAdminWallet = useCallback(async () => {
    const savedAdminWallet = sessionStorage.getItem("adminWallet");
    if (savedAdminWallet) {
      setAdminWallet(savedAdminWallet);
      return;
    }
  
    try {
      
      const walletAddress = await walletInstance.getAddress(); // Get wallet address
      setAdminWallet(walletAddress);
      sessionStorage.setItem("adminWallet", walletAddress);
    } catch (error) {
      console.error("Error connecting admin wallet:", error);
    }
  }, []);
  

  useEffect(() => {
    connectAdminWallet();
  }, [connectAdminWallet]);

  const guestWallet = smartWallet({
    chain: ChainId.BinanceSmartChainTestnet,
    factoryAddress: process.env.NEXT_PUBLIC_THIRDWEB_FACTORY_ADDRESS,
    
    relayerUrl: process.env.NEXT_PUBLIC_RELAYER_URL,
    headers: {
      "Authorization": "Bz313B8fzWGVEGb4jhYjBpWiY9h1FKzJ",
    },
    personalWallet: adminWallet,
  });

  const wallets = [
    inAppWallet({
      auth: {
        options: [ "google", "apple", "facebook"], // Specify desired auth methods
      },
    }),
    metamaskWallet({ recommended: true }),
    trustWallet(),
    
    walletConnect(),
    coinbaseWallet(),
    localWallet(),
  ];

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      console.log("Before Install Prompt fired"); // Log to see if it's triggered
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
  
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);
  

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        setDeferredPrompt(null);
        setIsInstallable(false);
      });
    }
  };

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          })
          .catch(error => {
            console.error('ServiceWorker registration failed: ', error);
          });
      });
    }
  }, []);
  

  return (
    <>
      {isLoading ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "#000",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <video
            src={splashVideo}
            autoPlay
            muted
            loop
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
          <h1 style={{ color: "#fff", fontSize: "24px", position: "relative", zIndex: 1 }}></h1>
        </div>
      ) : (
        <>
          {!hasEntered ? (
            <EntryPage
              onEnter={() => setHasEntered(true)}
              isModalVisible={isModalVisible}
              handleAccept={handleAccept}
              handleDecline={handleDecline}
            />
          ) : (
            <ThirdwebProvider
              activeChain={ChainId.BinanceSmartChainTestnet}
              clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
              supportedWallets={useGuestWallet && guestWallet ? [guestWallet] : wallets}
            >
              <Head>
                <link rel="manifest" href="/manifest.json" />
                <title>Medals of HONOR by XdRiP</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="theme-color" content="#000000" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="description" content="The Medals of Honor Collection by XdRiP Digital Management, LLC" />
              </Head>

              {isModalVisible && (
                <div className="welcomeMessageOverlay">
                  <div className="welcomeMessageContent">
                    <p>
                      XdRiP, XMarket, XECHO, TheForge, XdRiPia Content, affiliates, and others may use cookies to enhance your user experience...
                    </p>
                    <div>
                      <button onClick={handleAccept}>Accept All</button>
                      <button onClick={handleDecline}>Decline</button>
                    </div>
                  </div>
                </div>
              )}

              {isInstallable && (
                <button
                  onClick={handleInstallClick}
                  style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                    padding: "10px 20px",
                    fontSize: "16px",
                    backgroundColor: "#007aff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    zIndex: 1002,
                  }}
                >
                  Install App
                </button>
              )}

              <MOHProvider>
                <Component {...pageProps} />
              </MOHProvider>
            </ThirdwebProvider>
          )}
        </>
      )}
    </>
  );
};

export default MyApp;
*/

// pages/_app.js
// works missing splash svcreen shit
/*

import React, { useEffect, useState, useCallback } from "react";
import {
  ThirdwebProvider,
  inAppWallet,
  metamaskWallet,
  trustWallet,
  coinbaseWallet,
  walletConnect,
  localWallet,
  smartWallet,
  useAddress,
  useSigner,
  useDisconnect,
} from "@thirdweb-dev/react";
import Head from "next/head";
import Cookies from "js-cookie";
import { MOHProvider } from "../Context/MOHProviderContext";
import "../styles/globals.css";
import { EntryPage } from "../components/componentsindex";
import { ChainId } from "@thirdweb-dev/sdk";

const generateGenericMOHVAT = () => {
  const characters = "abcdef0123456789"; // Hexadecimal characters
  let hash = "";
  for (let i = 0; i < 256; i++) {
    hash += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return hash;
};

const generateGenericPayloadMessage = (userAddress) => {
  if (!userAddress) {
    throw new Error("Wallet address is required to generate the generic payload message");
  }
  const nonce = Math.floor(Math.random() * 1000000);
  const issuedAt = new Date().toISOString();
  const expirationTime = new Date(Date.now() + 60 * 1000).toISOString(); // 1 min expire

  return `*** AUTHORIZATION REQUEST ***\nMEDALS OF HONOR DIGITAL OWNERSHIP TOKEN (DOT) COLLECTION\n\nBy proceeding, you authorize this request for a Vault Access Token (VAT). This token is required for secure authenticated access to the Medals of Honor platform.\n\nACCOUNT & AUTHORIZATION INFORMATION:\n- Physical Blockchain Location: ${userAddress}\n- Version: MOH-Beta-v1.01124\n- Unique Nonce: ${nonce}, issued at: ${issuedAt}, valid until: ${expirationTime}\n\nIMPORTANT NOTICE:\n1. By signing this message, you confirm your intent to authenticate your account for access to the Medals of Honor platform.\n2. This authorization is valid only for the duration specified in the Expiration Time above.\n3. Signing this message does NOT grant access to your wallet’s funds or other permissions unrelated to authentication.\n\nDISCLAIMER:\nThis message is generated exclusively for Medals of Honor platform authentication. If you did not initiate this request, do not sign this message. Unauthorized use of this signature may result in account restrictions.\n\nTERMS OF SERVICE:\nBy signing this message, you agree to our Terms of Service. For more details, visit https://www.xdrip.io/terms\n\nSUPPORT:\nFor support or assistance, contact our team at support@xdrip.io\n`;
};

const AuthHandler = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [mohvat, setMohvat] = useState("");

  const address = useAddress();
  const signer = useSigner();
  const disconnectWallet = useDisconnect();

  const handleGenericPayloadPopup = (userAddress) => {
    const message = generateGenericPayloadMessage(userAddress);

    setPopupContent(
      <div style={{ whiteSpace: "pre-line", textAlign: "left", padding: "10px" }}>
        <p>{message}</p>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
          <button
            onClick={() => {
              const generatedMOHVAT = generateGenericMOHVAT();
              setMohvat(generatedMOHVAT);
              console.log(`Vault Access Token Generated: ${generatedMOHVAT}`);
              setIsPopupVisible(false);
            }}
            style={{
              background: "#0d0d0d",
              color: "white",
              padding: "10px 20px",
              borderRadius: "5px",
              border: "1px solid #1c1c1c",
              cursor: "pointer",
            }}
          >
            Accept
          </button>
          <button
            onClick={() => {
              disconnectWallet();
              setIsPopupVisible(false);
            }}
            style={{
              background: "#0d0d0d",
              color: "white",
              padding: "10px 20px",
              borderRadius: "5px",
              border: "1px solid #1c1c1c",
              cursor: "pointer",
            }}
          >
            Decline
          </button>
        </div>
      </div>
    );
    setIsPopupVisible(true);
  };

  useEffect(() => {
    const mobileVideo = "/videos/splashmobile.mp4";
    const pcVideo = "/videos/splashpc.mp4";
    setSplashVideo(window.innerWidth <= 768 ? mobileVideo : pcVideo);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && !Cookies.get("acceptedCookies")) {
      setIsModalVisible(true);
    }
  }, [isLoading]);

  const handleAccept = () => {
    Cookies.set("acceptedCookies", "true", { expires: 30 });
    setIsModalVisible(false);
  };

  const handleDecline = () => setIsModalVisible(false);

  const handleLoginConfirmation = async () => {
    if (!address) {
      console.error("No address found for login confirmation.");
      return;
    }

    try {
      const payload = generateGenericPayloadMessage(address);
      const message = payload;

      if (!signer) {
        throw new Error("No signer available");
      }

      const signedMessage = await signer.signMessage(message);
      console.log("MOHVAT (vault access token):", signedMessage);
      setMohvat(signedMessage);
    } catch (error) {
      console.error("Error during login:", error);
      if (error.code === 4001) {
        setPopupContent("You rejected the authorization request.");
        setIsPopupVisible(true);
      } else {
        handleGenericPayloadPopup(address);
      }
    }
  };

  useEffect(() => {
    if (address && signer) {
      handleLoginConfirmation();
    }
  }, [address, signer]);

  return (
    <>
      {isPopupVisible && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#1a1a1a",
              color: "white",
              borderRadius: "8px",
              padding: "20px",
              maxWidth: "500px",
              textAlign: "center",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            {popupContent}
          </div>
        </div>
      )}
    </>
  );
};

const MyApp = ({ Component, pageProps }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head>
        <title>Medals of HONOR by XdRiP</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="The Medals of Honor Collection by XdRiP Digital Management, LLC" />
      </Head>

      {isLoading ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "#000",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <h1 style={{ color: "#fff", fontSize: "24px" }}>Loading...</h1>
        </div>
      ) : (
        <ThirdwebProvider
          activeChain={ChainId.BinanceSmartChainTestnet}
          clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
          supportedWallets={[inAppWallet(), metamaskWallet(), trustWallet(), walletConnect]}
        >
          <AuthHandler />
          <MOHProvider>
            <Component {...pageProps} />
          </MOHProvider>
        </ThirdwebProvider>
      )}
    </>
  );
};

export default MyApp;
*/



import React, { useEffect, useState, useCallback } from "react";
import {
  ThirdwebProvider,
  inAppWallet,
  metamaskWallet,
  trustWallet,
  coinbaseWallet,
  walletConnect,
  localWallet,
  smartWallet,
  useAddress,
  useSigner,
  useDisconnect,
} from "@thirdweb-dev/react";
import Head from "next/head";
import Cookies from "js-cookie";
import { MOHProvider } from "../Context/MOHProviderContext";
import "../styles/globals.css";
import { EntryPage } from "../components/componentsindex";
import { ChainId } from "@thirdweb-dev/sdk";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const AuthHandler = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [mohvat, setMohvat] = useState("");

  const address = useAddress();
  const signer = useSigner();
  const disconnectWallet = useDisconnect();

  
  const generateGenericMOHVAT = () => {
    const characters = "abcdef0123456789"; 
    let hash = "";
    for (let i = 0; i < 256; i++) {
      hash += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return hash;
  };

  const generateGenericPayloadMessage = (userAddress) => {
    if (!userAddress) {
      throw new Error("Wallet address is required to generate the generic payload message");
    }
    const nonce = Math.floor(Math.random() * 1000000);
    const issuedAt = new Date().toISOString();
    const expirationTime = new Date(Date.now() + 60 * 1000).toISOString(); // 1 min expire

    return `*** AUTHORIZATION REQUEST ***
MEDALS OF HONOR DIGITAL OWNERSHIP TOKEN (DOT) COLLECTION

By proceeding, you authorize this request for a Vault Access Token (VAT). This token is required for secure authenticated access to the Medals of Honor platform.

ACCOUNT & AUTHORIZATION INFORMATION:
- Physical Blockchain Location: ${userAddress}
- Version: MOH-Beta-v1.01124
- Unique Nonce: ${nonce}, issued at: ${issuedAt}, valid until: ${expirationTime}

IMPORTANT NOTICE:
1. By signing this message, you confirm your intent to authenticate your account for access to the Medals of Honor platform.
2. This authorization is valid only for the duration specified in the Expiration Time above.
3. Signing this message does NOT grant access to your wallet’s funds or other permissions unrelated to authentication.

DISCLAIMER:
This message is generated exclusively for Medals of Honor platform authentication. If you did not initiate this request, do not sign this message. Unauthorized use of this signature may result in account restrictions.

TERMS OF SERVICE:
By signing this message, you agree to our Terms of Service. For more details, visit https://www.xdrip.io/terms

SUPPORT:
For support or assistance, contact our team at support@xdrip.io
`;
  };

  const handleGenericPayloadPopup = (userAddress) => {
    const message = generateGenericPayloadMessage(userAddress);

    setPopupContent(
      <div style={{ whiteSpace: "pre-line", textAlign: "left", padding: "10px" }}>
        <p>{message}</p>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
          <button
            onClick={handleAccept}
            onTouchStart={(e) => e.preventDefault() || handleAccept()}
            className="signature-button"
            
          >
            Accept
          </button>
          <button
            onClick={handleDecline}
            onTouchStart={(e) => e.preventDefault() || handleDecline()}
            className="signature-button"
           
          >
            Decline
          </button>
        </div>
      </div>
    );
    setIsPopupVisible(true);
  };

  
  const handleAccept = () => {
    if (signer && address) {
      const payload = generateGenericPayloadMessage(address);
      signer
        .signMessage(payload)
        .then((signedMessage) => {
          console.log("MOHVAT (Vault Access Token):", signedMessage);
          setMohvat(signedMessage);
          setIsPopupVisible(false);
        })
        .catch((error) => {
          console.error("Error during autorization:", error);
          if (error.code === 4001) {
            setPopupContent("You rejected the authorization request.");
          } else {
            
            setPopupContent("An unexpected error occurred. Please try again.");
          }
        });
    } else {
      console.error("Signer or address is not available.");
      setPopupContent("Wallet connection issue. Please reconnect your wallet.");
    }
  };
  
  const handleDecline = () => {
    disconnectWallet();
    setIsPopupVisible(false);
  };

  useEffect(() => {
    if (address && signer) {
      handleGenericPayloadPopup(address);
    }
    
  }, [address, signer]);

  return (
    <>
      {isPopupVisible && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      overflow: "hidden", // Prevent scrolling of the background
    }}
  >
    <div
      style={{
        background: "#1a1a1a",
        color: "white",
        borderRadius: "8px",
        padding: "20px",
        maxWidth: "800px",
        maxHeight: "80vh", // Ensure the modal doesn't exceed screen height
        overflowY: "auto", // Enable vertical scrolling for the content
        textAlign: "center",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      }}
    >
      {popupContent}
    </div>
  </div>
)}

    </>
  );
};

const handleInstallClick = () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      setDeferredPrompt(null);
      setIsInstallable(false);
    });
  }
};



const MyApp = ({ Component, pageProps }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [splashVideo, setSplashVideo] = useState("/videos/splash.mp4");
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const mobileVideo = "/videos/splashmobile.mp4";
    const pcVideo = "/videos/splashpc.mp4";
    setSplashVideo(window.innerWidth <= 768 ? mobileVideo : pcVideo);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && !Cookies.get("acceptedCookies")) {
      setIsModalVisible(true);
    }
  }, [isLoading]);

  const handleAccept = () => {
    Cookies.set("acceptedCookies", "true", { expires: 30 });
    setIsModalVisible(false);
  };

  const handleDecline = () => setIsModalVisible(false);
  
  useEffect(() => {
    // Service Worker Registration
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((registration) => {
            console.log("Service Worker registered with scope:", registration.scope);
          })
          .catch((error) => {
            console.error("Service Worker registration failed:", error);
          });
      });
    }

    // Listen for 'beforeinstallprompt' Event
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        setDeferredPrompt(null);
        setIsInstallable(false);
      });
    }
  };


  return (
    <>
      <Head>
        <title>Medals of HONOR by XdRiP</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" /><meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="theme-color" content="#000000" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta
          name="description"
          content="The Medals of Honor Collection by XdRiP Digital Management, LLC"

        />
      </Head>

      {isLoading ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "#000",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <video
            src={splashVideo}
            autoPlay
            muted
            loop
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
        </div>
      ) : (
        <ThirdwebProvider
          activeChain={ChainId.BinanceSmartChainTestnet}
          clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
          //autoConnect={false}
          modalConfig={{
            disableBuyButton: true,
          }}

          supportedWallets={[
            inAppWallet(),
            metamaskWallet({ recommended: true }),
            trustWallet(),
            walletConnect(),
            localWallet(),
            
          ]}
        >

          {!hasEntered ? (
            <EntryPage
              onEnter={() => setHasEntered(true)}
              isModalVisible={isModalVisible}
              handleAccept={handleAccept}
              handleDecline={handleDecline}
              
            />            
          ) : (
            <>

            {/*
              {isModalVisible && (
                <div className="welcomeMessageOverlay">
                  <div className="welcomeMessageContent">
                    <p>
                      XdRiP, XMarket, XECHO, TheForge, XdRiPia Content, affiliates, and
                      others may use cookies to enhance your user experience...
                    </p>
                    <div>
                      <button onClick={handleAccept}>Accept All</button>
                      <button onClick={handleDecline}>Decline</button>
                    </div>
                  </div>
                </div>
              )}
            */}

<ToastContainer
  position="top-center"
  autoClose={3000}
  hideProgressBar={true} 
  closeOnClick={true}
  pauseOnHover={true}
  draggable={false}
  style={{
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 9999,
    maxWidth: "600px",
    width: "auto",
  }}
  
  toastStyle={{
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
    borderRadius: "16px", 
    boxShadow: "0 8px 15px rgba(0, 0, 0, 0.5)",
    padding: "20px",
    color: "#ffffff", 
    fontFamily: "'Saira', sans-serif",
    textAlign: "center",
    backdropFilter: "blur(8px)",
  }}
/>

              <AuthHandler />
              <MOHProvider>
                <Component {...pageProps} />
              </MOHProvider>
            </>
          )}
        </ThirdwebProvider>
      )}
    </>
  );
};

export default MyApp;
