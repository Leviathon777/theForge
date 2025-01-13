import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Style from "./TransakButton.module.css";

const TransakButton = ({ user, walletAddress, onShowInvestorProfile }) => {
  const [isActive, setIsActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  let transak;

  const checkIsMobile = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  const initializeTransak = () => {
    const apiKey = process.env.NEXT_PUBLIC_TRANSAK_API_KEY;
    const hostURL = window.location.origin;

    // Log important environment and configuration variables
    console.log("Initializing Transak...");
    console.log("API Key:", apiKey);
    console.log("Environment: PRODUCTION");
    console.log("Host URL:", hostURL);
    console.log("Wallet Address:", walletAddress);
    console.log("User Email:", user?.email);

    // Check if the Transak SDK is loaded
    if (!window.TransakSDK) {
      console.error("Transak SDK is not loaded.");
      toast.error("Failed to load Transak SDK. Please refresh the page.");
      return;
    }

    transak = new window.TransakSDK.default({
      apiKey,
      environment: "PRODUCTION",
      widgetHeight: "600px",
      widgetWidth: "350px",
      exchangeScreenTitle: "XDRIP Digital Management BNB Onboarding",
      cryptoCurrencyCode: "BNB",
      network: "bsc",
      defaultCryptoCurrency: "BNB",
      fiatCurrency: "USD, GBP",
      walletAddress: walletAddress || "",
      themeColor: "000000",
      email: user?.email || "",
      hostURL,
      productsAvailed: "BUY,SELL",
      isFeeCalculationHidden: false,
      hideMenu: false,
      colorMode: "DARK",
    });

    // Log the Transak configuration
    console.log("Transak Configuration:", transak);

    transak.init();
    lockScroll();

    transak.on(transak.ALL_EVENTS, (data) => console.log("Event:", data));
    transak.on(transak.EVENTS.TRANSAK_WIDGET_CLOSE, () => {
      console.log("Transak widget closed.");
      unlockScroll();
      setIsActive(false);
    });
    transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
      console.log("Order successful!", orderData);
      unlockScroll();
      setIsActive(false);
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
      window.removeEventListener("resize", checkIsMobile);
      unlockScroll();
    };
  }, []);

  const handleButtonClick = (e) => {
    e.preventDefault();
    if (!walletAddress) {
     toast.info("To access investor areas, please connect your wallet.");
      return;
    }
    if (!user?.email) {
      onShowInvestorProfile && onShowInvestorProfile();
      return;
    }
    setIsActive(true);
    initializeTransak();
  };

  return (
    <div
      className={`${Style.dropdownMenuItem} ${isActive ? Style.active : ""}`}
      onClick={handleButtonClick}
    >
      <span className={Style.transakButtonLabel}>TRANSAK ONRAMP</span>
    </div>
  );
};

export default TransakButton;
