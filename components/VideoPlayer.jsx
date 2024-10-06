// components/VideoPlayer.jsx
import React, { useState, useRef, useEffect } from "react";
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import Modal from "react-modal";
import PropTypes from "prop-types";
import Style from "./VideoPlayer.module.css";

// Ensure Modal is attached to the root of your app
Modal.setAppElement("#__next");

const VideoPlayer = ({
  videoSrc,
  isMuted = true,
  hoverPlay = false,
  autoPlay = false,
  loop = true,
  videoStyles = {},
  hoverGrow = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMutedState, setIsMutedState] = useState(isMuted);
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoRef = useRef(null);

  // IntersectionObserver setup to detect when the video enters the viewport
  useEffect(() => {
    const options = {
      root: null, // Use the viewport as the root
      rootMargin: "0px",
      threshold: 0.25, // Video should be at least 25% visible to start playing
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        } else {
          setIsInView(false);
        }
      });
    }, options);

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  // Handle play/pause based on hover and view status
  useEffect(() => {
    if (hoverPlay && isInView) {
      if (isHovered) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    } else if (!isInView) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isHovered, isInView, hoverPlay]);

  // Modal toggling
  const openModal = () => {
    setIsModalOpen(true);
    // Pause the main video when opening the modal
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Resume playing the main video if it was playing before opening the modal
    if (hoverPlay && isInView) {
      if (isHovered) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleMuteClick = () => {
    setIsMutedState(!isMutedState);
    if (videoRef.current) {
      videoRef.current.muted = !isMutedState;
    }
  };

  const handlePlayPauseClick = () => {
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div
      className={`${Style.videoContainer} ${hoverGrow ? Style.hoverGrow : ""}`}
      style={videoStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        width="100%" // Fill the width of the container
        height="auto" // Keep aspect ratio
        muted={isMutedState}
        loop={loop}
        autoPlay={autoPlay && isInView}
        className={Style.videoPlayer}
        style={videoStyles}
        onClick={openModal}
        controls={false} // No default controls
      >
        <source src={videoSrc} type="video/mp4" />
        {/* Optional: Remove fallback text or style it to be hidden */}
        
      </video>

      {/* Play Icon if not playing and not hovered */}
      {!isPlaying && !isHovered && (
        <div className={Style.playIcon} onClick={openModal}>
          <FaPlay size={60} />
        </div>
      )}

      {/* Controls: Play/Pause and Mute */}
      {isHovered && (
        <div className={Style.controls}>
          <div onClick={handlePlayPauseClick} className={Style.controlButton}>
            {isPlaying ? <FaPause size={30} /> : <FaPlay size={30} />}
          </div>
          <div onClick={handleMuteClick} className={Style.controlButton}>
            {isMutedState ? <FaVolumeMute size={30} /> : <FaVolumeUp size={30} />}
          </div>
        </div>
      )}

      {/* Modal to display the video in larger size */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className={Style.modal}
        overlayClassName={Style.modalOverlay}
        contentLabel="Video Modal"
      >
        <div className={Style.modalContent}>
          <video
            src={videoSrc}
            muted={isMutedState}
            loop={loop}
            autoPlay
            className={Style.modalVideo}
            controls
          >
            <source src={videoSrc} type="video/mp4" />
            {/* Optional: Remove fallback text or style it to be hidden */}
            <span className={Style.hiddenFallback}>Your browser does not support the video tag.</span>
          </video>
          <button className={Style.modalCloseButton} onClick={closeModal}>
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

// PropTypes for validation
VideoPlayer.propTypes = {
  videoSrc: PropTypes.string.isRequired,
  isMuted: PropTypes.bool,
  hoverPlay: PropTypes.bool,
  autoPlay: PropTypes.bool,
  loop: PropTypes.bool,
  videoStyles: PropTypes.object,
  hoverGrow: PropTypes.bool,
};

export default VideoPlayer;
