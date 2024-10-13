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
import "../styles/globals.css";
import {EntryPage} from "../components/componentsindex"; 
const MyApp = ({ Component, pageProps }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
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
  return (
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
              content="The Medals of Honor Collection by XdRiP Digital Management LLC"
            />
          </Head>
          <MOHProvider>
            <Component {...pageProps} />
          </MOHProvider>
        </ThirdwebProvider>
      )}
    </>
  );
};
export default MyApp;
