import React, { useState, useRef, useEffect, forwardRef } from "react";
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import Modal from "react-modal";
import PropTypes from "prop-types";
import Style from "./VideoPlayer.module.css";
Modal.setAppElement("#__next");
const VideoPlayer = forwardRef(({
  videoSrc,
  isMuted = true,
  hoverPlay = false,
  autoPlay = false,
  loop = true,
  videoStyles = {},
  hoverGrow = false,
  disableInternalModal = false,
  alwaysShowControls = false,
  disableClickModal = false,
  hideControls = false,
  onEnded,
}, ref) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMutedState, setIsMutedState] = useState(isMuted);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoRef = ref || useRef(null);
  useEffect(() => {
    if (disableInternalModal) {
      setIsPlaying(autoPlay);
      if (autoPlay && videoRef.current) {
        // Ensure video is muted for autoplay compatibility on iOS
        videoRef.current.muted = true;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Autoplay failed:", error);
          });
        }
      }
      return;
    }

    // Intersection observer for autoplay control
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (autoPlay && videoRef.current) {
            // Ensure video is muted for iOS autoplay
            videoRef.current.muted = true;
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
              playPromise.catch((error) => {
                console.error("Autoplay failed:", error);
              });
            }
            setIsPlaying(true);
          }
        } else {
          if (videoRef.current) {
            videoRef.current.pause();
          }
          setIsPlaying(false);
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
  }, [disableInternalModal, autoPlay]);

  useEffect(() => {
    if (hoverPlay && !disableInternalModal) {
      if (isHovered && videoRef.current) {
        videoRef.current.play();
        setIsPlaying(true);
      } else if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isHovered, hoverPlay, disableInternalModal]);
  const openModal = () => {
    if (!disableInternalModal) {
      setIsModalOpen(true);
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
    if (hoverPlay && !disableInternalModal) {
      if (isHovered && videoRef.current) {
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
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };
  return (
    <div
      className={`${Style.videoContainer} ${hoverGrow ? Style.hoverGrow : ""}`}
      style={videoStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <video
        ref={videoRef}
        playsInline
        muted={isMutedState || autoPlay}
        autoPlay={autoPlay}
        loop={loop}
        className={Style.videoPlayer}
        style={videoStyles}
        onClick={!disableClickModal ? openModal : undefined}
        controls={false}
        onEnded={onEnded}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {!isPlaying && !isHovered && !alwaysShowControls && !hideControls && (
        <div className={Style.playIcon} onClick={!disableClickModal ? openModal : undefined}>
          <FaPlay size={50} />
        </div>
      )}
      {(!hideControls && (isHovered || alwaysShowControls)) && (
        <div className={Style.controls}>
          <div onClick={handlePlayPauseClick} className={Style.controlButton}>
            {isPlaying ? <FaPause size={30} /> : <FaPlay size={30} />}
          </div>
          <div onClick={handleMuteClick} className={Style.controlButton}>
            {isMutedState ? <FaVolumeMute size={30} /> : <FaVolumeUp size={30} />}
          </div>
        </div>
      )}
      {!disableInternalModal && (
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
              muted={isMutedState || autoPlay}
              playsInline
              loop={loop}
              autoPlay={autoPlay}
              className={Style.modalVideo}
              controls={false}
            >
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {!hideControls && (isHovered || alwaysShowControls && isPlaying) && (
              <div className={Style.controls}>
                <div onClick={handlePlayPauseClick} className={Style.controlButton}>
                  {isPlaying ? <FaPause size={30} /> : <FaPlay size={30} />}
                </div>
                <div onClick={handleMuteClick} className={Style.controlButton}>
                  {isMutedState ? <FaVolumeMute size={30} /> : <FaVolumeUp size={30} />}
                </div>
              </div>
            )}
            <button className={Style.modalCloseButton} onClick={closeModal}>
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
});
VideoPlayer.propTypes = {
  videoSrc: PropTypes.string.isRequired,
  isMuted: PropTypes.bool,
  hoverPlay: PropTypes.bool,
  autoPlay: PropTypes.bool,
  loop: PropTypes.bool,
  videoStyles: PropTypes.object,
  hoverGrow: PropTypes.bool,
  disableInternalModal: PropTypes.bool,
  alwaysShowControls: PropTypes.bool,
  disableClickModal: PropTypes.bool,
  hideControls: PropTypes.bool,
  onEnded: PropTypes.func,
};
export default VideoPlayer;