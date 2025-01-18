import React from "react";
import Modal from "react-modal";
import Style from "./Agreements.module.css";
import { Button } from "../componentsindex";

const PrivacyPolicy = ({ isOpen, onRequestClose, isClosing }) => (

  
  <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    contentLabel="Privacy Policy"
    className={Style.modal}
    overlayClassName={`${Style.modalOverlay} ${isClosing ? Style.slideDown : ""}`}
  >
    <div className={Style.modalWrapper}>
      <h2 className={Style.modalTitle}>XDRIP Privacy Policy</h2>
      <p className={Style.modalIntro}>
        Welcome to <strong>The Forge - Medals of Honor</strong>, a platform developed by XDRIP Digital Management LLC. This Privacy Policy outlines how we collect, use, and protect your personal information.
      </p>

      <div className={Style.modalSection}>
        <h3 className={Style.sectionTitle}>1. Information We Collect</h3>
        <p className={Style.sectionContent}>
          We may collect personal information to provide and improve our services. This includes but is not limited to:
        </p>
        <ul className={Style.sectionList}>
          <li className={Style.listItem}>Account information, such as email addresses and wallet addresses.</li>
          <li className={Style.listItem}>Transaction details, including purchases and interactions with the platform.</li>
          <li className={Style.listItem}>Communication data to respond to user inquiries and feedback.</li>
        </ul>
      </div>

      <div className={Style.modalSection}>
        <h3 className={Style.sectionTitle}>2. How We Use Your Information</h3>
        <p className={Style.sectionContent}>The information we collect is used to:</p>
        <ul className={Style.sectionList}>
          <li className={Style.listItem}>Provide and improve the platform’s functionality.</li>
          <li className={Style.listItem}>Facilitate secure transactions and user interactions.</li>
          <li className={Style.listItem}>Comply with legal and regulatory requirements.</li>
          <li className={Style.listItem}>Conduct platform analytics to enhance user experience.</li>
        </ul>
      </div>

      <div className={Style.modalSection}>
        <h3 className={Style.sectionTitle}>3. Information Sharing</h3>
        <p className={Style.sectionContent}>We may share your personal information with trusted third parties for:</p>
        <ul className={Style.sectionList}>
          <li className={Style.listItem}>Platform operation and management.</li>
          <li className={Style.listItem}>Legal compliance or in response to lawful requests.</li>
          <li className={Style.listItem}>Protecting the rights, property, or safety of users or third parties.</li>
        </ul>
      </div>

      <div className={Style.modalSection}>
        <h3 className={Style.sectionTitle}>4. Data Security</h3>
        <p className={Style.sectionContent}>
          We employ industry-standard measures to safeguard your personal information. However, no system can guarantee absolute security, and users are advised to exercise caution.
        </p>
      </div>

      <div className={Style.modalSection}>
        <h3 className={Style.sectionTitle}>5. Third-Party Links</h3>
        <p className={Style.sectionContent}>
          Our platform may include links to third-party services not controlled by us. We are not responsible for their privacy practices. Please review the privacy policies of these third-party platforms before sharing personal information.
        </p>
      </div>

      <div className={Style.modalSection}>
        <h3 className={Style.sectionTitle}>6. Children's Privacy</h3>
        <p className={Style.sectionContent}>
          Our platform is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If such information is identified, it will be promptly deleted.
        </p>
      </div>

      <div className={Style.modalSection}>
        <h3 className={Style.sectionTitle}>7. Your Rights</h3>
        <p className={Style.sectionContent}>Users have the right to:</p>
        <ul className={Style.sectionList}>
          <li className={Style.listItem}>Access and review the personal information we hold.</li>
          <li className={Style.listItem}>Request corrections or deletions of inaccurate or outdated information.</li>
          <li className={Style.listItem}>Opt out of certain data collection practices where applicable.</li>
        </ul>
      </div>

      <div className={Style.modalSection}>
        <h3 className={Style.sectionTitle}>8. Contact Us</h3>
        <p className={Style.sectionContent}>
          If you have any questions or concerns regarding this Privacy Policy or our data practices, please contact us at <strong>privacy@medalsofhonor.io</strong>.
        </p>
      </div>

      <div className={Style.modalSection}>
        <h3 className={Style.sectionTitle}>9. Updates to This Policy</h3>
        <p className={Style.sectionContent}>
          This Privacy Policy may be updated periodically to reflect changes in legal, regulatory, or operational requirements. Users will be notified of significant updates.
        </p>
      </div>

      <div className={Style.lastUpdated}>
        <p>Last Updated: 1/5/2025</p>
      </div>
      <div className={Style.closeButtonBox}>
        <Button
            btnName="Close"
            onClick={onRequestClose}
            fontSize="1rem"
            paddingTop=".5rem"
            paddingRight="1rem"
            paddingBottom=".5rem"
            paddingLeft="1rem"
            background=""
            title="Close Modal"
          />
          </div>
    </div>
  </Modal>
);

export default PrivacyPolicy;
