import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import styles from "./EntryPage.module.css";
import videos from "../../public/videos";
import { gsap } from "gsap";
import Image from "next/image";
import { VideoPlayer } from "../componentsindex";
const PixiPlugin = dynamic(() => import("gsap/PixiPlugin"), { ssr: false });
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const EntryPage = ({ onEnter, isModalVisible, handleAccept, handleDecline }) => {
  const [showEnterButton, setShowEnterButton] = useState(false);
  const containerRef = useRef(null);
  const videoPlayerRef = useRef(null); 


  useEffect(() => {
    gsap.registerPlugin(PixiPlugin);

    // Set the timer for showing the enter button after 16.5 seconds
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


  const handleEnterClick = () => {
    if (!isModalVisible) {
      gsap.to(containerRef.current, {
        duration: 1,
        opacity: 0,
        scale: 0.8,
        filter: "blur(20px)",
        onComplete: onEnter,
        ease: "power3.inOut"
      });
    }
  };

  return (
    <div className={styles.entryPageContainer} ref={containerRef}>
      <VideoPlayer
        ref={videoPlayerRef}
        videoSrc={videos.Forge1}
        videoStyles={{ width: "100%" }}
        isMuted={false}
        hoverPlay={false}
        autoPlay={true}
        loop={false}
        hoverGrow={false}
        disableInternalModal={true}
        alwaysShowControls={false}
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
              <button onClick={handleAccept} className="cookie-button">
                Accept All
              </button>
              <button onClick={handleDecline} className="cookie-button decline">
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntryPage;
