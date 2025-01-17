import React from "react";
import styles from "./MobileModal.module.css";
import {Button} from "../componentsindex"
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
        <Button
              btnName=" Continue on Mobile"
              onClick={onDismiss}
              className={styles.continueButton}
              fontSize="1rem"
              paddingTop=".5rem"
              paddingRight=".75rem"
              paddingBottom=".5rem"
              paddingLeft=".75rem"
            />
      </div>
    </div>
  );
};

export default MobileModal;
