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
import { NFTMarketplaceProvider } from "../Context/NFTMarketplaceContext";

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
        <title>The Forge Medals of Honor</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <meta
          name="description"
          content="The Medals of Honor Collection by XdRiP Digital Management LLC "
        />
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
      <NFTMarketplaceProvider>
        <Component {...pageProps} />
      </NFTMarketplaceProvider>
    </ThirdwebProvider>
  );
};

export default MyApp;
