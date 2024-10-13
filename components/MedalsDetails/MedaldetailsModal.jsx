import React from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
import {VideoPlayer} from "../componentsindex"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Style from "./MedalDetailsModal.module.css"; 
import mohCA_ABI from "../../Context/mohCA_ABI.json";
if (typeof window !== 'undefined') {
  Modal.setAppElement('#__next');
}
const MedalDetailsModal = ({ medal, onClose }) => {
  const mohContractAddress = mohCA_ABI.address; 
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
        <div className={Style.MedalDetailsModal_header}>
          <h1>
            TIER {medal.id}
          </h1>
          <button
            className={Style.MedalDetailsModal_closeButton}
            onClick={onClose}
            aria-label="Close Medal Details Modal"
          >
            Close
          </button>
        </div>
        <div className={Style.MedalDetailsModal_body}>
          <div className={Style.videoContainer}>
            <VideoPlayer
              videoSrc={medal.nftVideo.startsWith('/') ? medal.nftVideo : `/${medal.nftVideo}`}
              isMuted={true}
              hoverPlay={false} 
              autoPlay={true} 
              loop={true}
              videoStyles={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              hoverGrow={false}
              disableInternalModal={true}
            />
            <div className={Style.detailsOverlay}>
              <div className={Style.detailsContent}>            
              <div className={Style.MedalDetailsModal_description}>
                  <h1>The {medal.title || "NO DATA AVAILABLE"} Medal</h1>
                </div>
                <div className={Style.MedalDetailsModal_description}>
                  <h2>{medal.description || "NO DATA AVAILABLE"}</h2>
                </div>
                <div className={Style.MedalDetailsModal_price}>
                  <p><h5>Medals Worth: {medal.price}</h5></p>
                </div>
                <div className={Style.MedalDetailsModal_creators}>
                  <strong>Created by:</strong> XdRiP Dev Team: Brad, Jim, Flo, and Jordi
                </div>
                <div className={Style.MedalDetailsModal_info}>
                  <p><h5>Collection: {medal.collection || "MEDALS of HONOR"}</h5></p>
                  <p><strong>Contract: </strong>
                    <span className={Style.MedalDetailsModal_contractAddress} onClick={() => copyToClipboard(mohContractAddress)}>
                      {mohContractAddress && formatAddress(mohContractAddress)}
                    </span>
                  </p>
                </div>
                <div className={Style.MedalDetailsModal_notes}>
                  <small align="center">Forging Medals require a 24-hour hold between tiers</small>
                  <br />
                  <small>Excluding the COMMON, you must own each previous tier to be eligible to forge the next</small>
                </div>
                <div className={Style.MedalDetailsModal_companies}>
                  <h3>Global Businesses & Partnerships</h3>
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
MedalDetailsModal.propTypes = {
  medal: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default MedalDetailsModal;