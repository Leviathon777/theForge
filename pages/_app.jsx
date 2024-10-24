import React, { useEffect, useState } from "react";
import {
  ThirdwebProvider,
  ConnectButton,
  inAppWallet,
  metamaskWallet,
  trustWallet,
  phantomWallet,
  coinbaseWallet,
  walletConnect,
  localWallet,
  smartWallet,
  useProfiles,
  useLinkProfile,
  PayEmbed,
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
      console.log("Admin wallet connected:", adminWalletInstance.getAddress());
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
          activeChain={ChainId.BinanceSmartChainTestnet} 
          clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
          supportedWallets={useGuestWallet && guestWallet ? [guestWallet] : wallets}
        >
          <Head>
            <title>Medals of HONOR by XdRiP</title>
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
  );
};

export default MyApp;

