import React from "react";
import styles from "./MobileModal.module.css";

const MobileModal = ({ onDismiss }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Optimize Your Experience</h2>
        <p>
          You're visiting on a mobile device. For the best experience, consider using a desktop.
        </p>
        <p>
          Or, install our app as a PWA to enhance your mobile experience.          
        </p>
        <p>
          Detailed instructions will be found on mobile site if you choose to continue on mobile.
        </p>
        <button className={styles.continueButton} onClick={onDismiss}>
          Continue on Mobile
        </button>
      </div>
    </div>
  );
};

export default MobileModal;
