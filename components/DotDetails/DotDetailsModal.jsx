import React, { useEffect, useCallback, useMemo } from "react";
import Modal from "react-modal";
import PropTypes from "prop-types";
import { VideoPlayer, Button } from "../componentsindex";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Style from "./DotDetailsModal.module.css";
import mohCA_ABI from "../../Context/mohCA_ABI.json";

if (typeof window !== 'undefined') {
  Modal.setAppElement('#__next');
}

const MedalDetailsModal = React.memo(({ medal, onClose, forge, userInfo, address, isUserInfoModalOpen, setIsReminderPopupVisible }) => {
  const mohContractAddress = useMemo(() => mohCA_ABI.address, []);
  const companies = useMemo(() => [
    { name: "XdRiP Digital Management, LLC", url: "https://xdrip.io" },
    { name: "XMarket Digital Asset Solutions, LLC", url: "https://xdrip.io" },
    { name: "XECHO", url: "https://xdrip.io" },
    { name: "TalesofXdRiPia", url: "https://talesofxdripia.com" },
    { name: "XdRiPiaWaves", url: "https://xdripiawaves.com" },
    { name: "The Skywalk 1000", url: "https://skywalk1000.com" },
    { name: "ElaraTech", url: "https://elaratech.ch" },
    { name: "Arcadian Pixels", url: "https://arcadianpixels.com" },
  ], []);

  useEffect(() => {
    if (medal) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => document.body.classList.remove("no-scroll");
  }, [medal]);

  const formatAddress = useCallback((address) => {
    return `${address.substring(0, 4)} ... ${address.substring(address.length - 4)}`;
  }, []);

  const copyToClipboard = useCallback((text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Address copied to clipboard"))
      .catch(() => toast.error("Could not copy text"));
  }, []);

  
  /*
  const handleForgeClick = () => {
    if (!address) {
      toast.info("Please connect your wallet to proceed with Forging.");
      return;
    }
    if (!userInfo) {
      setIsReminderPopupVisible(true);
      return;
    }
    forge(medal.title, medal.ipfsHash, medal.revenueAccess, medal.xdripBonus);
  };
  */




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
          <h1>#{medal.id}</h1>
          <Button
            btnName="Close"
            onClick={onClose}
            fontSize=".8rem"
            paddingTop=".25rem"
            paddingRight="1rem"
            paddingBottom=".25rem"
            paddingLeft="1rem"
            background=""
            title="Close Medal Details Modal"
          />

        </div>

        <div className={Style.MedalDetailsModal_body}>
          <div className={Style.videoContainer}>
            <VideoPlayer
              videoSrc={medal.medalVideo}
              isMuted={true}
              hoverPlay={false}
              autoPlay={true}
              loop={true}
              videoStyles={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                WebkitObjectFit: "cover",
              }}
              playsInline
              hoverGrow={false}
              disableInternalModal={true}
            />

            <div className={Style.detailsOverlay}>
              <div className={Style.detailsContent}>
              <div className={Style.buttonContainer}>
                
                {/*
                <Button
                  btnName="Forge"
                  onClick={handleForgeClick}
                  fontSize=".8rem"
                  paddingTop=".5rem"
                  paddingRight="1rem"
                  paddingBottom=".5rem"
                  paddingLeft="1rem"
                  background=""
                />
                */}


                </div>
                <div className={Style.MedalDetailsModal_description}>

                  <h1>{medal.title || "NO DATA AVAILABLE"}</h1>
                </div>
                <div className={Style.MedalDetailsModal_description}>
                  <h2 className={Style.MedalDetailsModal_description_font}>{medal.description || "NO DATA AVAILABLE"}</h2>
                </div>
                <div className={Style.MedalDetailsModal_price}>
                  <h2 className={Style.MedalDetailsModal_description_font}>MEDAL OF HONOR WORTH:</h2>
                  <p>{medal.price}</p>
                </div>
                <div className={Style.MedalDetailsModal_price}>
                  <h2 className={Style.MedalDetailsModal_description_font}>CREATED BY THE XDRIP EXECUTIVE STAFF:</h2>
                  <p>Brad Messier ~ Jim Carney ~ Flo Righetti ~ Jordi ~ Amos</p>
                </div>
                <div className={Style.MedalDetailsModal_price}>
                  <h2 className={Style.MedalDetailsModal_description_font}>DIGITAL OWNERSHIP TOKEN COLLECTION:</h2>
                  <p>{medal.collection || "MEDALS OF HONOR"}</p>
                </div>
                <div className={Style.MedalDetailsModal_price}>
                  <h2 className={Style.MedalDetailsModal_description_font}>MEDALS OF HONOR CONTRACT:</h2>
                  <p>
                    <span className={Style.MedalDetailsModal_contractAddress} onClick={() => copyToClipboard(mohContractAddress)}>
                      {formatAddress(mohContractAddress)}
                    </span>
                  </p>
                </div>
                <div className={Style.MedalDetailsModal_notes}>
                  <small align="center">For The Honor of Forging Medals</small>
                  <br />
                  <small>Excluding the COMMON, you must own each previous tier to be eligible to forge the next, while the Eternal stands alone</small>
                </div>
                <div className={Style.MedalDetailsModal_companies}>
                  <h5>GLOBAL BUSINESS AND PARTNERSHIP LINKS</h5>
                  <ul>
                    {companies.map((company, idx) => (
                      <li key={idx}>
                        <a href={company.url} target="_blank" rel="noopener noreferrer">{company.name}</a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={Style.MedalDetailsModal_actions}>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={Style.fixedForgeButtonContainer}>
      </div>


    </Modal>
  );
});

MedalDetailsModal.propTypes = {
  medal: PropTypes.shape({
    title: PropTypes.string.isRequired,
    ipfsHash: PropTypes.string.isRequired,
    revenueAccess: PropTypes.string.isRequired,
    xdripBonus: PropTypes.string.isRequired,

  }).isRequired,
  onClose: PropTypes.func.isRequired,
  forge: PropTypes.func.isRequired,
  userInfo: PropTypes.object,
  isUserInfoModalOpen: PropTypes.bool,
  setIsUserInfoModalOpen: PropTypes.func,
};


export default MedalDetailsModal;
