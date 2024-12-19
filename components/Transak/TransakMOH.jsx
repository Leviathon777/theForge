import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Style from "./TransakButton.module.css";
import { Transak } from "@transak/transak-sdk";
import Pusher from "pusher-js";

const TransakMOH = ({ user, medal, onClose, onSuccess, onError }) => {
  const [isActive, setIsActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  let transak;

  const checkIsMobile = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  const initializeTransak = () => {
    if (!medal) {
      console.error("No medal data provided.");
      return;
    }

    const settings = {
      apiKey: process.env.NEXT_PUBLIC_TRANSAK_API_KEY,
      environment: "STAGING",
      widgetHeight: "600px",
      widgetWidth: "350px",
      themeColor: "000000",
      defaultPaymentMethod: "credit_debit_card",
      walletAddress: user.walletAddress, 
      email: user.email,
      exchangeScreenTitle: `Forge ${medal.title}`,
      disableWalletAddressForm: true,
      estimatedGasLimit: 70000,
      calldata: "0xc2db2c4200000000000000000000000000000000000000000000000000000000ee6b2812",
      network: "bsc",
      cryptoCurrencyCode: "BNB", 
      nftData: [
        {
          imageURL: medal.imageURL || "",
          nftName: medal.title || "NFT Medal",
          collectionAddress: medal.collectionAddress || "",
          tokenID: medal.tokenID || ["0"],
          price: [parseFloat(medal.price.split(" ")[0]) || 0],
          quantity: 1,
          nftType: "ERC721", 
        },
      ],
      isNFT: true,
      contractId: medal.contractId || "defaultContractId",
    };

    transak = new Transak(settings);

    transak.init();

    lockScroll();

    // Websocket setup
    const pusher = new Pusher("1d9ffac87de599c61283", { cluster: "ap2" });

    const subscribeToWebsockets = (orderId) => {
      const channel = pusher.subscribe(orderId);

      channel.bind("ORDER_COMPLETED", (orderData) => {
        console.log("ORDER COMPLETED websocket event", orderData);
        unlockScroll();
        setIsActive(false);
        onSuccess(orderData);
      });

      channel.bind("ORDER_FAILED", (orderData) => {
        console.log("ORDER FAILED websocket event", orderData);
        unlockScroll();
        setIsActive(false);
        onError(orderData);
      });
    };

    transak.on(Transak.EVENTS.TRANSAK_ORDER_CREATED, (orderData) => {
      console.log("Transak order created:", orderData);
      const orderId = orderData.status?.id;
      if (orderId) subscribeToWebsockets(orderId);
    });

    transak.on(Transak.EVENTS.TRANSAK_WIDGET_CLOSE, () => {
      console.log("Widget closed");
      unlockScroll();
      setIsActive(false);
      onClose();
    });
  };

  const lockScroll = () => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  };

  const unlockScroll = () => {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  };

  useEffect(() => {
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      console.log("Component unmounting. Cleaning up...");
      window.removeEventListener("resize", checkIsMobile);
      unlockScroll();
    };
  }, []);

  const handleButtonClick = (e) => {
    e.preventDefault();
    setIsActive(true);
    initializeTransak();
  };

  return (
    <div className={`${Style.box} ${isActive ? Style.active : ""}`}>
      <button onClick={handleButtonClick} className={Style.btn}>
        <div className={Style.btnName}>
          <span className={Style.buttonName}>
            {isMobile ? "NFT Checkout (Mobile)" : "NFT Checkout"}
          </span>
        </div>
      </button>
    </div>
  );
};

TransakMOH.propTypes = {
  medal: PropTypes.shape({
    title: PropTypes.string.isRequired,
    imageURL: PropTypes.string,
    collectionAddress: PropTypes.string,
    tokenID: PropTypes.arrayOf(PropTypes.string),
    price: PropTypes.string.isRequired,
    contractId: PropTypes.string.isRequired,
  }),
  address: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
};

export default TransakMOH;
