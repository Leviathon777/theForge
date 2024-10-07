// components/MedalDetailsModal.jsx

import React from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
import VideoPlayer from "../components/VideoPlayer.jsx"; // Adjust the path as necessary
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Style from "./MedalDetailsModal.module.css"; // Ensure correct path
import mohCA_ABI from "../Context/mohCA_ABI.json"; // Adjust the path as necessary

// Attach Modal to the root of your app to manage accessibility
if (typeof window !== 'undefined') {
  Modal.setAppElement('#__next');
}

const MedalDetailsModal = ({ medal, onClose }) => {
  const mohContractAddress = mohCA_ABI.address; // Your actual contract address

  const formatAddress = (address) => {
    return `${address.substring(0, 4)} ... ${address.substring(address.length - 4)}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Address copied to clipboard");
      })
      .catch((err) => {
        toast.error("Could not copy text");
      });
  };

  const companies = [
    { name: "XdRiP Digital Management, LLC", url: "https://xdrip.io" },
    { name: "XMarket Digital Asset Solutions, LLC", url: "https://xdrip.io" },
    { name: "XECHO", url: "https://xdrip.io" },
    { name: "TalesofXdRiPia", url: "https://talesofxdripia.com" },
    { name: "XdRiPiaWaves", url: "https://xdripiawaves.com" },
    { name: "The Skywalk 1000", url: "https://skywalk1000.com" },
    { name: "ElaraTech", url: "https://elaratech.ch" },
    { name: "Arcadian Pixels", url: "https://arcadianpixels.com" },
  ];

  return (
    <Modal
      isOpen={!!medal}
      onRequestClose={onClose}
      className={Style.MedalDetailsModal}
      overlayClassName={Style.modalOverlay}
      contentLabel="Medal Details"
    >
      <div className={Style.MedalDetailsModal_content}>
        {/* Header */}
        <div className={Style.MedalDetailsModal_header}>
          <h1>
            {medal.title} MEDAL LEVEL {medal.id}
          </h1>
          <button
            className={Style.MedalDetailsModal_closeButton}
            onClick={onClose}
            aria-label="Close Medal Details Modal"
          >
            Close
          </button>
        </div>

        {/* Body */}
        <div className={Style.MedalDetailsModal_body}>
          {/* Video Player Container */}
          <div className={Style.videoContainer}>
            <VideoPlayer
              videoSrc={medal.nftVideo.startsWith('/') ? medal.nftVideo : `/${medal.nftVideo}`}
              isMuted={true}
              hoverPlay={false} // Disable hover play inside modal
              autoPlay={true} // Enable autoplay
              loop={true}
              videoStyles={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              hoverGrow={false}
              disableInternalModal={true} // Disable internal modal
            />
            {/* Details Overlay */}
            <div className={Style.detailsOverlay}>
              <div className={Style.detailsContent}>
                {/* Each detail section */}
                <div className={Style.MedalDetailsModal_description}>
                  {medal.description || "NO DATA AVAILABLE"}
                </div>
                <div className={Style.MedalDetailsModal_creators}>
                  <strong>Creators:</strong> XdRiP Dev Team: Brad, Jim, Flo, and Jordi
                </div>
                <div className={Style.MedalDetailsModal_price}>
                  <p><strong>Medals Worth:</strong> {medal.price}</p>
                </div>
                <div className={Style.MedalDetailsModal_info}>
                  <p><strong>COLLECTION:</strong> {medal.collection || "MEDALS of HONOR"}</p>
                  <p><strong>MEDAL:</strong> {medal.name || "NO DATA AVAILABLE"}</p>
                  <p><strong>CONTRACT ADDRESS:</strong>
                    <span className={Style.MedalDetailsModal_contractAddress} onClick={() => copyToClipboard(mohContractAddress)}>
                      {mohContractAddress && formatAddress(mohContractAddress)}
                      
                    </span>
                  </p>
                </div>
                <div className={Style.MedalDetailsModal_notes}>
                  <small>Minting Medals requires a 24-hour hold between tiers.</small>
                  <br />
                  <small>Excluding the COMMON, you must own each previous tier to be eligible to forge the next.</small>
                </div>

                {/* Companies List */}
                <div className={Style.MedalDetailsModal_companies}>
                  <h3>Our Companies</h3>
                  <ul>
                    {companies.map((company, idx) => (
                      <li key={idx}>
                        <a href={company.url} target="_blank" rel="noopener noreferrer">{company.name}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </Modal>
  );
};

// PropTypes for validation
MedalDetailsModal.propTypes = {
  medal: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MedalDetailsModal;
