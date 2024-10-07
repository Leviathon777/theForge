import React, { useEffect, useState } from "react";
import {
  ThirdwebProvider,
  metamaskWallet,
  trustWallet,
  phantomWallet,
  coinbaseWallet,
  walletConnect,
  localWallet,
  embeddedWallet,
} from "@thirdweb-dev/react";

import Head from "next/head";
import Cookies from "js-cookie";
import { MOHProvider } from "../Context/MOHProviderContext";
import "../styles/globals.css"; // Ensure global styles are included

const MyApp = ({ Component, pageProps }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  return (
    <ThirdwebProvider
      activeChain="binance-testnet"
      clientId="1c814b4d0548668ba3eb1511796aef53"
      supportedWallets={[
        metamaskWallet({ recommended: true }),
        trustWallet(),
        phantomWallet(),
        walletConnect(),
        coinbaseWallet(),
        localWallet(),
        embeddedWallet({
          auth: {
            options: ["email", "google", "apple", "facebook"],
          },
        }),
      ]}
    >
      <Head>
        <title>Medals of Honor by XdRiP</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="The Medals of Honor Collection by XdRiP Digital Management LLC "
        />
      </Head>

      {isModalVisible && (
        <div className="welcomeMessageOverlay">
          <div className="welcomeMessageContent">
            <p><h2>MEDALS OF HONOR Collection </h2>
            <h4>by XdRiP</h4></p>
            <p align="left">
              XdRiP, XMarket, XECHO, TheForge, XdRiPia Content, affiliates, and others may use cookies to enhance your user experience and ensure the security of your personal information...
            </p>
            <p align="left">
              By accessing this website, you consent to our data collection practices as described and agree to our{" "}
              <a href="/termsOfService" target="_blank" rel="noopener noreferrer" style={{ color: "#007bff" }}>
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/userAgreement" target="_blank" rel="noopener noreferrer" style={{ color: "#007bff" }}>
                User Agreement
              </a>.
            </p>
            <div>
              <button onClick={handleAccept} className="cookie-button">
                Accept All
              </button>
              <button onClick={handleDecline} className="cookie-button decline">
                Decline
              </button>
            </div>
            <a href="https://xdrip.io" target="_blank" rel="noopener noreferrer">
            <img 
              src="/xdrip1.jpg" 
              alt="XdRiP Logo" 
              className="cookie-logo" 
            />
            </a>
            
          </div>
        </div>
      )}

      <MOHProvider>
        <Component {...pageProps} />
      </MOHProvider>
    </ThirdwebProvider>
  );
};

export default MyApp;
