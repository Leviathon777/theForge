import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import styles from "./EntryPage.module.css";
import videos from "../../public/videos";
import { gsap } from "gsap";
import Image from "next/image";
import { VideoPlayer, TermsOfService, UserAgreement } from "../componentsindex";
const PixiPlugin = dynamic(() => import("gsap/PixiPlugin"), { ssr: false });

const EntryPage = ({ onEnter, isModalVisible, handleAccept, handleDecline }) => {
  const [showEnterButton, setShowEnterButton] = useState(false);
  const [showSkipButton, setShowSkipButton] = useState(false); // New state for Skip button
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isUserAgreementModalOpen, setIsUserAgreementModalOpen] = useState(false);
  const containerRef = useRef(null);
  const videoPlayerRef = useRef(null);

  // Timer to show the "Enter" button after 16.5 seconds
  useEffect(() => {
    gsap.registerPlugin(PixiPlugin);
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
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Show the "Skip" button when the user accepts or declines cookies
  const handleAcceptCookies = () => {
    handleAccept(); // Existing accept logic
    setShowSkipButton(true); // Show Skip button after accepting cookies
  };

  const handleDeclineCookies = () => {
    handleDecline(); // Existing decline logic
    setShowSkipButton(true); // Show Skip button after declining cookies
  };

  // Handle the Skip button click
  const handleSkipClick = () => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.pause(); // Pause the video
    }
    setShowEnterButton(true); // Show the Enter button
    setShowSkipButton(false); // Hide the Skip button
  };

  const handleEnterClick = () => {
    if (!isModalVisible) {
      gsap.to(containerRef.current, {
        duration: 1,
        opacity: 0,
        scale: 0.8,
        filter: "blur(20px)",
        onComplete: onEnter,
        ease: "power3.inOut",
      });
    }
  };

  return (
    <div className={styles.entryPageContainer} ref={containerRef}>
      <VideoPlayer
        ref={videoPlayerRef}
        videoSrc={videos.Forge1}
        videoStyles={{ width: "100%" }}
        isMuted={true}
        hoverPlay={false}
        autoPlay={true}
        loop={false}
        hoverGrow={false}
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
              src="/img/entry_x.svg"
              alt="Your Image"
              layout="fill"
              objectFit="contain"
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

     
      {showSkipButton && (
        <motion.button
          className={styles.skipButton}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          onClick={handleSkipClick}
        >
          Skip
        </motion.button>
      )}

      <TermsOfService
        isOpen={isTermsModalOpen}
        onRequestClose={() => setIsTermsModalOpen(false)}
      />
      <UserAgreement
        isOpen={isUserAgreementModalOpen}
        onRequestClose={() => setIsUserAgreementModalOpen(false)}
      />
    </div>
  );
};

export default EntryPage;
