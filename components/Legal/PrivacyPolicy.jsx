import React from "react";
import Modal from "react-modal";
import Style from "./TermsOfService.module.css";

const PrivacyPolicy = ({ isOpen, onRequestClose }) => (
    
  <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    contentLabel="Privacy Policy"
    className={Style.modal}
    overlayClassName={Style.modalOverlay}
  >
    <div className={Style.modal_wrapper}>
      <h2>Privacy Policy</h2>
      <p>
        Welcome to <strong>The Forge - Medals of Honor</strong>, a platform
        developed by XDRIP Digital Management LLC. This Privacy Policy outlines
        how we collect, use, and protect your personal information.
      </p>

      <h3>1. Information We Collect</h3>
      <p>
        We may collect personal information to provide and improve our services. This
        includes but is not limited to:
      </p>
      <ul>
        <li>Account information, such as email addresses and wallet addresses.</li>
        <li>Transaction details, including purchases and interactions with the platform.</li>
        <li>Communication data to respond to user inquiries and feedback.</li>
      </ul>

      <h3>2. How We Use Your Information</h3>
      <p>
        The information we collect is used to:
      </p>
      <ul>
        <li>Provide and improve the platform’s functionality.</li>
        <li>Facilitate secure transactions and user interactions.</li>
        <li>Comply with legal and regulatory requirements.</li>
        <li>Conduct platform analytics to enhance user experience.</li>
      </ul>

      <h3>3. Information Sharing</h3>
      <p>
        We may share your personal information with trusted third parties for:
      </p>
      <ul>
        <li>Platform operation and management.</li>
        <li>Legal compliance or in response to lawful requests.</li>
        <li>Protecting the rights, property, or safety of users or third parties.</li>
      </ul>

      <h3>4. Data Security</h3>
      <p>
        We employ industry-standard measures to safeguard your personal information.
        However, no system can guarantee absolute security, and users are advised to
        exercise caution.
      </p>

      <h3>5. Third-Party Links</h3>
      <p>
        Our platform may include links to third-party services not controlled by us.
        We are not responsible for their privacy practices. Please review the privacy
        policies of these third-party platforms before sharing personal information.
      </p>

      <h3>6. Children's Privacy</h3>
      <p>
        Our platform is not intended for individuals under the age of 18. We do not
        knowingly collect personal information from children. If such information is
        identified, it will be promptly deleted.
      </p>

      <h3>7. Your Rights</h3>
      <p>
        Users have the right to:
      </p>
      <ul>
        <li>Access and review the personal information we hold.</li>
        <li>Request corrections or deletions of inaccurate or outdated information.</li>
        <li>Opt out of certain data collection practices where applicable.</li>
      </ul>

      <h3>8. Contact Us</h3>
      <p>
        If you have any questions or concerns regarding this Privacy Policy or our
        data practices, please contact us at <strong>privacy@medalsofhonor.io</strong>.
      </p>

      <h3>9. Updates to This Policy</h3>
      <p>
        This Privacy Policy may be updated periodically to reflect changes in legal,
        regulatory, or operational requirements. Users will be notified of significant
        updates.
      </p>

      <div className={Style.lastUpdated}>
        <p>Last Updated: [Insert Updated Date]</p>
      </div>
    </div>
    <button onClick={onRequestClose} className={Style.closeButton}>
      Close
    </button>
  </Modal>
);

export default PrivacyPolicy;
