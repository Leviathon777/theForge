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
    transak = new window.TransakSDK.default({
      apiKey: process.env.NEXT_PUBLIC_TRANSAK_API_KEY,
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
      hostURL: window.location.origin,
      productsAvailed: "BUY,SELL",
      isFeeCalculationHidden: false,
      hideMenu: false,
      colorMode: "DARK",
    });

    transak.init();
    lockScroll();

    transak.on(transak.ALL_EVENTS, (data) => console.log("Event:", data));
    transak.on(transak.EVENTS.TRANSAK_WIDGET_CLOSE, () => {
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
      toast.info("Please connect your wallet to proceed.");
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
