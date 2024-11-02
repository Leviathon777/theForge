import React, { useEffect, useState } from "react";
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
  const [adminConnected, setAdminConnected] = useState(false);
  const [adminWallet, setAdminWallet] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state for splash screen
  const [splashVideo, setSplashVideo] = useState("/videos/splash.mp4"); // Default video for PC

  const handleEnter = () => {
    setHasEntered(true);
  };


  useEffect(() => {
    const hasAcceptedCookies = Cookies.get("acceptedCookies");
    if (!hasAcceptedCookies) {
      setIsModalVisible(true);
    }
  }, []);



  const handleAccept = () => {
    Cookies.set("acceptedCookies", "true", { expires: 30 });
    setIsModalVisible(false);
  };

  const handleDecline = () => {
    setIsModalVisible(false);
  };

  const connectAdminWallet = async () => {
    try {
      const adminWalletInstance = metamaskWallet();
      await adminWalletInstance.connect();
      setAdminWallet(adminWalletInstance);
      console.log("Admin wallet connected:", await adminWalletInstance.getAddress());
    } catch (error) {
      console.error("Error connecting admin wallet:", error);
    }
  };

  useEffect(() => {
    connectAdminWallet();
  }, []);

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
    const timer = setTimeout(() => {
      setIsLoading(false); 
    }, 3500);

    // Detect if the user is on a mobile device or PC
    const detectDevice = () => {
      const mobileVideo = "/videos/splashmobile.mp4"; // Mobile splash video path
      const pcVideo = "/videos/splashpc.mp4"; // PC splash video path
      const isMobile = window.innerWidth <= 768; // Adjust screen width as needed for your criteria
      setSplashVideo(isMobile ? mobileVideo : pcVideo);
    };

    detectDevice(); // Run on load
    window.addEventListener("resize", detectDevice); // Update on window resize

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", detectDevice);
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const hasAcceptedCookies = Cookies.get("acceptedCookies");
      if (!hasAcceptedCookies) {
        setIsModalVisible(true);
      }
    }
  }, [isLoading]);

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
            src={splashVideo} // Use the detected video source
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
              onEnter={handleEnter}
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
