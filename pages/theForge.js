import React, { useState, useEffect, useRef } from "react";
import { FaPause, FaPlay, FaVolumeMute, FaVolumeUp } from "react-icons/fa";

import TheForge from "../components/TheForge/theForge";
import NFTWallet from "../components/NFTWallet/NFTWallet";
import MyNFTData from "../Context/MyNFTDataContext";
import Style from "../styles/theForge.module.css";
import videos from "../public/videos";

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
          <h1 className={Style.medalsTitle}>MEDALS OF HONOR</h1>
          <p className={Style.medalsText}>
            In the legendary land of Xdripia, a place of unmatched courage and
            determination exists, known as "The Forge of Destiny"...
          </p>
        </div>
        <h1 className={Style.medalsTitle}>FORGE YOUR MEDAL</h1>
        <TheForge />
        <MyNFTData>
          <NFTWallet />
        </MyNFTData>
      </div>
    </div>
  );
};

export default TheForgePage;
