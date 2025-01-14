import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Style from "./RampDetails.module.css";
import Modal from "react-modal";

if (typeof window !== 'undefined') {
  Modal.setAppElement('#__next');
}

const RampDetails = ({ isVisible, onClose, infoModalData }) => {
  useEffect(() => {
    if (infoModalData) {
    }
  }, [infoModalData]);
  if (!isVisible || !infoModalData || !infoModalData.medals) {
    return null;
  }

  const headerMapping = [
    { display: "ID", key: "id" },
    { display: "Cost", key: "cost" },
    { display: "XdRiP Threshold", key: "xdripThreshold" },
    { display: "Revenue Share", key: "revenueShare" },
    { display: "XdRiP Bonus", key: "xdripBonus" },
    { display: "Reward Income", key: "rewardIncome" },
    { display: "Creators", key: "creators" },
    { display: "External URL", key: "externalUrl" },
  ];

  return (
    <Modal
      isOpen={isVisible}
      onRequestClose={onClose}
      className={Style.infoModalContent}
      overlayClassName={Style.infoModalOverlay}
      contentLabel="Ramp Details Modal"
    >
      <div className={Style.top}>
        <h3>Ramp Information</h3>
        <p>
          <strong>Wallet Address:</strong> {infoModalData.walletAddress || "N/A"}
        </p>
        <p>
          <strong>Number of Medals:</strong> {infoModalData.numberOfMedals || 0}
        </p>
        <p>
          <strong>Total Value:</strong>{" "}
          {infoModalData.totalValueInBNB
            ? infoModalData.totalValueInBNB.toFixed(2)
            : "0.00"}{" "}
          BNB
        </p>
      </div>
      <div className={Style.middle}>
        <div className={Style.tableWrapper}>
          {infoModalData.medals.length > 0 ? (
            <table className={Style.medalTable}>
              <thead>
                <tr>
                  <th>Items</th>
                  {infoModalData.medals.map((medal, index) => (
                    <th key={medal.id || `medal-${index}`}>
                      {medal.name || "Unknown Medal"}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {headerMapping.map(({ display, key }, rowIndex) => (
                  <tr key={rowIndex}>
                    <td>
                      <strong>{display}</strong>
                    </td>
                    {infoModalData.medals.map((medal, colIndex) => (
                      <td key={`${rowIndex}-${colIndex}`}>
                        {key === "animationUrl" || key === "externalUrl" ? (
                          <a
                            href={medal[key]}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {medal[key] ? "Link" : "N/A"}
                          </a>
                        ) : (
                          medal[key] || "N/A"
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No medals available.</p>
          )}
        </div>
      </div>
      <div className={Style.bottom}>
        <button onClick={onClose} className={Style.closeButton}>
          Close
        </button>
      </div>
    </Modal>
  );
};
RampDetails.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  infoModalData: PropTypes.shape({
    walletAddress: PropTypes.string,
    numberOfMedals: PropTypes.number,
    totalValueInBNB: PropTypes.number,
    medals: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        externalUrl: PropTypes.string,
      })
    ),
  }),
};
export default RampDetails;
