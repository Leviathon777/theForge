import React, { useState, useEffect, useRef } from "react";
import { FaPause, FaPlay, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { ConnectWallet, darkTheme } from "@thirdweb-dev/react";  // Import Thirdweb components
import TheForge from "../components/TheForge/theForge";
import NFTWallet from "../components/NFTWallet/NFTWallet";
import MyNFTData from "../Context/MyNFTDataContext";
import Style from "../styles/theForge.module.css";
import videos from "../public/videos";
import moreStyles from "../components/NFTWallet/NFTWAllet.module.css";

import Image from "next/image";


const TheForgePage = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [playAttemptInProgress, setPlayAttemptInProgress] = useState(false);

  const handleMuteClick = () => {
    setIsMuted(!isMuted);
  };

  const handlePauseClick = () => {
    setIsPaused(!isPaused);
    if (videoRef.current) {
      if (isPaused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  useEffect(() => {
    setIsPlaying(true);
    return () => {
      setIsPlaying(false);
    };
  }, []);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && videoRef.current && !playAttemptInProgress) {
          setPlayAttemptInProgress(true);
          const promise = videoRef.current.play();
          promise
            .then(() => {
              setPlayAttemptInProgress(false);
            })
            .catch((error) => {
              console.error("Error attempting to play video:", error);
              setPlayAttemptInProgress(false);
            });
        } else if (videoRef.current) {
          videoRef.current.pause();
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, options);
    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [playAttemptInProgress]);

  return (
    <div className={Style.theForge}>
      
      

      <div className={Style.videoContainer}>
        <video
          ref={videoRef}
          src={videos.Forge1}
          className={Style.video_background}
          loop
          autoPlay
          muted={isMuted}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        <div className={Style.bottomLeft}>
          <div className={Style.mute_button} onClick={handleMuteClick}>
            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          </div>
        </div>
        <div className={Style.bottomRight}>
          <div className={Style.pause_button} onClick={handlePauseClick}>
            {isPaused ? <FaPlay /> : <FaPause />}
          </div>
        </div>
      </div>
      <div className={Style.theForge_content}>
        <div className={Style.theForgeContent}>
          <h1 className={moreStyles.page_title}>MEDALS OF HONOR</h1>
          <p className={Style.medalsText}>
          In the legendary land of Xdripia, a place of unmatched courage and
            determination exists, known as "The Forge of Destiny". This hallowed
            place serves as the ultimate proving ground for the mightiest and
            most valiant warriors of the realm. It is here that they must face a
            series of dangerous trials and extreme physical tests to demonstrate
            their unyielding dedication to XdRiPia, its people, their unwavering
            loyalty, and their ultimate power and skill in the art of combat.
            <br />
            <br />
            Hidden deep within the treacherous, jagged peaks of XdriPia's
            IronForge Mountains, the Forge of Destiny is surrounded by mystery
            and awe, making it a revered and sacred location in Xdripia.
            <br />
            <br />
            The difficult journey to reach the Forge itself serves as the first
            trial, as only those with the strength and resilience to travel the
            treacherous terrain can hope to prove their worth within its sacred
            halls.
            <br />
            <br />
            Once inside the Forge of Destiny, the warriors face a series of
            formidable challenges, each one more extreme than the last. A
            champion emerging victorious from this gauntlet of trials earns the
            highest of honors, the right to forge the Medal of Honor,
            demonstrating the ultimate achievement a warrior can receive in
            Xdripia.
            <br />
            <br />
            This cherished reward symbolizes their unwavering commitment to
            protecting their land and their people, and signifies their place
            among the most uncommon, rare, epic, and legendary heroes of all
            time.
          </p>
        </div>

        <h1 className={moreStyles.page_title}>FORGE YOUR MEDAL</h1>
        <TheForge />
        
        
        <MyNFTData>
          <NFTWallet />
        </MyNFTData>
      </div>
    </div>
  );
};

export default TheForgePage;
