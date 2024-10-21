// pages/_app.js

import type { AppProps } from "next/app";
import {
  ThirdwebProvider,
  embeddedWallet,
  smartWallet,
  metamaskWallet,
  trustWallet,
  phantomWallet,
  coinbaseWallet,
  walletConnect,
  localWallet,
} from "@thirdweb-dev/react";
import Head from "next/head";
import Cookies from "js-cookie";
import { MOHProvider } from "../Context/MOHProviderContext";
import "../styles/globals.css";
import { EntryPage } from "../components/componentsindex"; 
import { ChainId } from "@thirdweb-dev/sdk";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [useGuestWallet, setUseGuestWallet] = useState(false); 

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

  // Configure Smart Wallet for LocalWallet
  const guestWallet = smartWallet(localWallet({ persist: true }), {
    factoryAddress: process.env.NEXT_PUBLIC_THIRDWEB_FACTORY_ADDRESS,
    gasless: true,
    relayerUrl: process.env.NEXT_PUBLIC_RELAYER_URL,
  });

  // Configure Embedded Wallet
  const embedded = embeddedWallet();

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
          desiredChainId={ChainId.BinanceSmartChainTestnet} // Binance Smart Chain Testnet Chain ID (97)
          clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID} // Your Thirdweb Client ID from .env.local
          supportedWallets={
            useGuestWallet
              ? [guestWallet, embedded] // Guest Wallet with SmartWallet and Embedded Wallet
              : [
                  metamaskWallet({ recommended: true }),
                  trustWallet(),
                  phantomWallet(),
                  walletConnect(),
                  coinbaseWallet(),
                  localWallet(),
                  embeddedWallet(),
                ]
          }
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
