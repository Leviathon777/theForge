import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import styles from "./CookieBanner.module.css";

const CookieBanner = ({ onAccept, onDecline, onManage }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = Cookies.get("cookiesAccepted");
    if (!accepted) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!visible) return null;

  const handleAccept = () => {
    onAccept?.();
    setVisible(false);
  };

  const handleDecline = () => {
    onDecline?.();
    setVisible(false);
  };

  return (
    <div className={styles.banner}>
      <div className={styles.bannerInner}>
        <p className={styles.bannerText}>
          We use cookies to enhance your experience and analyze platform usage.
          By continuing, you agree to our use of cookies.
        </p>
        <div className={styles.bannerActions}>
          <button className={styles.btnAccept} onClick={handleAccept}>
            Accept All
          </button>
          <button className={styles.btnManage} onClick={onManage}>
            Manage
          </button>
          <button className={styles.btnDecline} onClick={handleDecline}>
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
