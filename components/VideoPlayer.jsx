
import React, { useState, useRef, useEffect } from "react";
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import Modal from "react-modal";
import PropTypes from "prop-types";
import Style from "./VideoPlayer.module.css";


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


    useEffect(() => {
        const options = {
            root: null,
            rootMargin: "0px",
            threshold: 0.25,
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


    const openModal = () => {
        setIsModalOpen(true);

        if (videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);

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

            <video
                ref={videoRef}
                width="100%"
                height="auto"
                muted={isMutedState}
                loop={loop}
                autoPlay={autoPlay && isInView}
                className={Style.videoPlayer}
                style={videoStyles}
                onClick={openModal}
                controls={false}
            >
                <source src={videoSrc} type="video/mp4" />

            </video>


            {!isPlaying && !isHovered && (
                <div className={Style.playIcon} onClick={openModal}>
                    <FaPlay size={50} />
                </div>
            )}


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
                    </video>
                    <button className={Style.modalCloseButton} onClick={closeModal}>
                        Close
                    </button>
                </div>
            </Modal>
        </div>
    );
};


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
