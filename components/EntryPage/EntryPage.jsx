import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import styles from "./EntryPage.module.css";
import videos from "../../public/videos";
import Image from "next/image";
import { VideoPlayer, TermsOfService, UserAgreement, Button } from "../componentsindex";
import PrivacyPolicy from "../Legal/PrivacyPolicy";

const EntryPage = ({ onEnter, isModalVisible, handleAccept, handleDecline }) => {
  const [showEnterButton, setShowEnterButton] = useState(false);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isUserAgreementModalOpen, setIsUserAgreementModalOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const videoPlayerRef = useRef(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEnterButton(true);
    }, 16500);
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowEnterButton(true);
        clearTimeout(timer);
        if (videoPlayerRef.current) {
          videoPlayerRef.current.pause();
        }
      } else if (event.key === "Enter" && showEnterButton) {
        handleEnterClick();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showEnterButton]);
  const handleEnterClick = () => {
    if (!isModalVisible) {
      setIsExiting(true);
      setTimeout(() => onEnter(), 1000);
    }
  };
  const handleAcceptCookies = () => {
    handleAccept();
    setShowSkipButton(true);
  };
  const handleDeclineCookies = () => {
    handleDecline();
    setShowSkipButton(true);
  };
  const handleSkipClick = () => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.pause();
    }
    setShowEnterButton(true);
    setShowSkipButton(false);
  };
  const handleManagePreferences = () => {
    setShowPreferencesModal(true);
  };
  const closePreferencesModal = () => {
    setShowPreferencesModal(false);
  };
  const togglePreference = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const savePreferences = () => {
    try {
      if (preferences) {
        document.cookie = `cookiePreferences=${JSON.stringify(preferences)};path=/;max-age=2592000`;
        localStorage.setItem("cookiePreferences", JSON.stringify(preferences));
        closePreferencesModal();
      } else {
        console.error("Preferences state is undefined!");
      }
    } catch (error) {
      console.error("Failed to save preferences:", error);
    }
  };
  useEffect(() => {
    const savedPreferences = localStorage.getItem("cookiePreferences") || getCookie("cookiePreferences");
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.error("Failed to parse saved preferences:", error);
      }
    }
  }, []);
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false,
  });
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [isPrivacyPolicyModalOpen, setIsPrivacyPolicyModalOpen] = useState(false);
  return (
    <motion.div
      className={styles.entryPageContainer}
      initial={{ opacity: 1, scale: 1 }}
      animate={isExiting ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      <VideoPlayer
        ref={videoPlayerRef}
        playsInline
        videoSrc={videos.Forge1}
        videoStyles={{ width: "100%" }}
        isMuted={true}
        hoverPlay={false}
        autoPlay={true}
        loop={false}
        hoverGrow={false}
        borderRadius="0px"
        disableInternalModal={false}
        disableClickModal={true}
        hideControls={true}
        onEnded={() => { }}
      />
      {showEnterButton && (
        <motion.div
          className={styles.enterContainer}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          onClick={handleEnterClick}
        >
          <div className={styles.imageWrapper}>
            <Image
              src="/img/entry_x.png"
              alt="Your Image"
              layout="fill"
              objectFit="contain"
              priority
              className={styles.enterImage}
            />
          </div>
        </motion.div>
      )}
      {isModalVisible && (
        <div className={styles.cookieOverlay}>
          <div className={styles.cookieContent}>
            <h2 className={styles.cookieHeader}>We Respect Your Privacy</h2>
            <div className={styles.cookieBody}>
              <p className={styles.cookieParagraph}>
                At XdRiP, XMarket, XECHO, TheForge, XdRiPia Content, and our affiliates, we strive to provide a personalized and enhanced experience for all users. To achieve this, we use cookies and similar technologies to understand your preferences, improve site functionality, analyze website performance, and deliver tailored content, including promotions and marketing.
              </p>
              <p className={styles.cookieParagraph}>
                <strong>How We Use Your Information:</strong> When you interact with our platform, we may collect and process limited information about your browsing behavior. This data helps us to:
              </p>
              <ul className={styles.cookieList}>
                <li>Optimize your experience by remembering your preferences.</li>
                <li>Understand how you use our services, enabling us to improve functionality.</li>
                <li>Deliver relevant content, promotions, and advertisements that match your interests.</li>
                <li>Ensure compliance with security and legal obligations.</li>
              </ul>
              <p className={styles.cookieParagraph}>
                Please note that we <strong>do not sell your personal data</strong> to third parties. Any information shared is strictly for the purposes outlined above and remains protected under our
                <button
                  className={styles.linkButton}
                  onClick={() => setIsPrivacyPolicyModalOpen(true)}
                >
                  Privacy Policy
                </button>.
              </p>
              <p className={styles.cookieParagraph}>
                <strong>Your Choices Matter:</strong> You are in control of your data and how it is used. By clicking "Accept All," you consent to the use of cookies for the purposes stated above. If you prefer to customize your cookie settings, you may click "Manage Preferences" to select only essential cookies or decline non-essential cookies altogether.
              </p>
              <p className={styles.cookieParagraph}>
                Additionally, while we may use limited data to send personalized promotional content, you can
                <button
                  className={styles.linkButton}
                  onClick={() => setIsUserAgreementModalOpen(true)}
                >
                  opt out of receiving promotional emails
                </button>{" "}
                at any time. Opting out will not affect essential service communications required for your account.
              </p>
            </div>
            <div className={styles.footerLinks}>
              <p>
                <button
                  className={styles.linkButton}
                  onClick={() => setIsTermsModalOpen(true)}
                >
                  Terms of Service
                </button>{" "}
                |{" "}
                <button
                  className={styles.linkButton}
                  onClick={() => setIsPrivacyPolicyModalOpen(true)}
                >
                  Privacy Policy
                </button>{" "}
                |{" "}
                <button
                  className={styles.linkButton}
                  onClick={() => setIsUserAgreementModalOpen(true)}
                >
                  User Agreement
                </button>
              </p>
            </div>
            <div className={styles.buttonContainer}>
              <button
                onClick={handleAcceptCookies}
                className={`${styles.cookieButton} ${styles.accept}`}
              >
                Accept All
              </button>
              <button
                onClick={handleDeclineCookies}
                className={`${styles.cookieButton} ${styles.decline}`}
              >
                Decline
              </button>
              <button
                onClick={handleManagePreferences}
                className={`${styles.cookieButton} ${styles.manage}`}
              >
                Manage Preferences
              </button>
            </div>
          </div>
        </div>
      )}
      {isTermsModalOpen && (
        <div className={styles.modal}>
          <TermsOfService />
          <button className={styles.closeButton} onClick={() => setIsTermsModalOpen(false)}>
            Close
          </button>
        </div>
      )}
      {isPrivacyPolicyModalOpen && (
        <PrivacyPolicy
          isOpen={isPrivacyPolicyModalOpen}
          onRequestClose={() => setIsPrivacyPolicyModalOpen(false)}
        />
      )}
      {isUserAgreementModalOpen && (
        <div className={styles.modal}>
          <UserAgreement />
          <button className={styles.closeButton} onClick={() => setIsUserAgreementModalOpen(false)}>
            Close
          </button>
        </div>
      )}
      {showPreferencesModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",

            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "99999",
          }}
        >
          <div
            style={{
              background: "rgba(0, 0, 0, 0.8)",
              padding: "20px",
              borderRadius: "8px",
              border: "4px solid black",
              width: "90%",
              maxWidth: "500px",
              textAlign: "left",
            }}
          >
            <h2 style={{ textAlign: "center" }}>Manage Cookie Preferences</h2>
            <p style={{ marginBottom: "10px" }}>
              Customize how we use cookies and similar technologies to enhance your experience. Select the categories of cookies you wish to allow:
            </p>
            <form style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%" }}>
                <input
                  type="checkbox"
                  checked={preferences.essential}
                  disabled
                />{" "}
                <span>Essential Cookies (Required for website functionality)</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%" }}>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={() => togglePreference("analytics")}
                />{" "}
                <span>Analytics Cookies (Help us improve our services)</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%" }}>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={() => togglePreference("marketing")}
                />{" "}
                <span>Marketing Cookies (Deliver personalized promotions)</span>
              </label>
            </form>
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <button
                onClick={savePreferences}
                style={{
                  margin: "0 10px",
                  padding: "10px 20px",
                  background: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Save Preferences
              </button>
              <button
                onClick={closePreferencesModal}
                style={{
                  margin: "0 10px",
                  padding: "10px 20px",
                  background: "#dc3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        <Button
          btnName="Skip"
          fontSize="12px"
          onClick={isModalVisible ? null : handleSkipClick}
          className={styles.skipButton}
        />
      </motion.div>
      <TermsOfService
        isOpen={isTermsModalOpen}
        onRequestClose={() => setIsTermsModalOpen(false)}
      />
      <UserAgreement
        isOpen={isUserAgreementModalOpen}
        onRequestClose={() => setIsUserAgreementModalOpen(false)}
      />
    </motion.div>
  );
};
export default React.memo(EntryPage);
