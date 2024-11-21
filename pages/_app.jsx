import React, { useEffect, useState, useCallback } from "react";
import {
  ThirdwebProvider,
  inAppWallet,
  metamaskWallet,
  trustWallet,
  phantomWallet,
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
    sponsorGas: true,
    relayerUrl: process.env.NEXT_PUBLIC_RELAYER_URL,
    headers: {
      "Authorization": "Bz313B8fzWGVEGb4jhYjBpWiY9h1FKzJ",
    },
    personalWallet: adminWallet,
  });

  const wallets = [
    inAppWallet({ persist: true }),
    metamaskWallet({ recommended: true }),
    trustWallet(),
    phantomWallet(),
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
