import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import styles from "./EntryPage.module.css";
import videos from "../../public/videos";
import Image from "next/image";
import { VideoPlayer, TermsOfService, UserAgreement, Button } from "../componentsindex";

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
        onEnded={() => {}}
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
            <h2>Cookie Consent</h2>
            <p>
              XdRiP, XMarket, XECHO, TheForge, XdRiPia Content, affiliates, and others may use cookies to enhance your user experience and ensure the security of your personal information. By accessing this website, you consent to our data collection practices as described and agree to our
              <a href="/termsOfService" target="_blank" rel="noopener noreferrer"> Terms of Service </a>
              and
              <a href="/userAgreement" target="_blank" rel="noopener noreferrer"> User Agreement</a>.
            </p>
            <div className={styles.button_container_lower}>
              <button onClick={handleAcceptCookies} className="cookie-button">
                Accept All
              </button>
              <button onClick={handleDeclineCookies} className="cookie-button decline">
                Decline
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
