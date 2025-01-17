import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import styles from "./EntryPage.module.css";
import videos from "../../public/videos";
import Image from "next/image";
import { VideoPlayer, Button } from "../componentsindex";
import { useRouter } from "next/router";

const EntryPage = ({
  isModalVisible,
}) => {
  const [showEnterButton, setShowEnterButton] = useState(false);
  const videoPlayerRef = useRef(null);
  const router = useRouter();
  const controls = useAnimation();

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
      controls.start({
        opacity: 0,
        scale: 0.9,
        transition: { duration: 0.8, ease: "easeInOut" },
      }).then(() => {
        router.push("/TheForge");

      });
    }
  };
  const handleSkipClick = () => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.pause();
    }
    setShowEnterButton(true);
  };
  return (
    <motion.div
      className={styles.entryPageContainer}
      initial={{ opacity: 1, scale: 1 }}
      animate={controls}
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
          fontSize=".8rem"
          paddingTop=".35rem"
          paddingRight=".9rem"
          paddingBottom=".35rem"
          paddingLeft=".9rem"
          onClick={isModalVisible ? null : handleSkipClick}
          className={styles.skipButton}
        />
      </motion.div>
    </motion.div>
  );
};
export default React.memo(EntryPage);
