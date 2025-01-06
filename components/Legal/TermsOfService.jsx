import React from "react";
import Modal from "react-modal";
import Style from "./TermsOfService.module.css";

const TermsOfService = ({ isOpen, onRequestClose }) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    contentLabel="Terms of Service"
    className={Style.modal}
    overlayClassName={Style.modalOverlay}
  >
    <div className={Style.modalWrapper}>
      <h2 className={Style.modalTitle}>Terms of Service</h2>
      <p className={Style.modalIntro}>
        Welcome to <strong>The Forge - Medals of Honor</strong>, a platform developed by XDRIP Digital Management LLC. Please read these Terms of Service carefully before using the platform.
      </p>

      <div className={Style.modalSection}>
        <h3 className={Style.sectionTitle}>1. Acceptance of Terms</h3>
        <p className={Style.sectionContent}>
          By accessing or using the platform, you confirm that you are at least 18 years old and have the legal capacity to enter into these Terms. If you do not agree with these Terms, please refrain from using the platform.
        </p>
      </div>

      <div className={Style.modalSection}>
        <h3 className={Style.sectionTitle}>2. Overview of Services</h3>
        <p className={Style.sectionContent}>
          The Forge enables users to invest in blockchain-based Digital Ownership Tokens ("D.O.Ts") and manage them within decentralized finance ("DeFi") wallets. Users can either:
        </p>
        <ul className={Style.sectionList}>
          <li className={Style.listItem}>Create a DeFi wallet via the platform using thirdweb dev tools.</li>
          <li className={Style.listItem}>Connect an existing self-custody wallet.</li>
        </ul>
        <p className={Style.sectionContent}>
          The platform also tracks transactions and purchases using Firebase. KYC is not currently required but may be implemented in the future to comply with regulations.
        </p>
      </div>

      <div className={Style.modalSection}>
        <h3 className={Style.sectionTitle}>3. Wallet Responsibility</h3>
        <p className={Style.sectionContent}>
          You are solely responsible for maintaining the security of your wallet credentials. XDRIP Digital Management LLC is not liable for unauthorized access to your wallet or transactions initiated from it.
        </p>
      </div>

      <div className={Style.modalSection}>
        <h3 className={Style.sectionTitle}>4. Investment Disclaimer</h3>
        <p className={Style.sectionContent}>
          Investing in D.O.Ts involves inherent risks, including market volatility and regulatory uncertainties. XDRIP Digital Management LLC does not provide financial or investment advice. Consult a qualified professional before making investment decisions.
        </p>
      </div>

      <div className={Style.modalSection}>
        <h3 className={Style.sectionTitle}>5. User Conduct</h3>
        <p className={Style.sectionContent}>By using the platform, you agree to:</p>
        <ul className={Style.sectionList}>
          <li className={Style.listItem}>Use the platform solely for lawful purposes.</li>
          <li className={Style.listItem}>Refrain from activities that disrupt or compromise the platform’s functionality.</li>
          <li className={Style.listItem}>Not engage in fraudulent or misleading activities.</li>
        </ul>
      </div>

      <div className={Style.modalSection}>
        <h3 className={Style.sectionTitle}>6. Privacy</h3>
        <p className={Style.sectionContent}>
          The platform collects wallet-related data to track transactions and purchases. By connecting your wallet, you consent to this collection and usage as outlined in our Privacy Policy.
        </p>
      </div>

      <div className={Style.modalSection}>
        <h3 className={Style.sectionTitle}>7. Limitation of Liability</h3>
        <p className={Style.sectionContent}>XDRIP Digital Management LLC is not liable for losses caused by:</p>
        <ul className={Style.sectionList}>
          <li className={Style.listItem}>Blockchain network outages or technical failures.</li>
          <li className={Style.listItem}>Unauthorized wallet access.</li>
          <li className={Style.listItem}>Investment losses due to market conditions.</li>
        </ul>
      </div>

      <div className={Style.modalSection}>
        <h3 className={Style.sectionTitle}>8. Dispute Resolution</h3>
        <p className={Style.sectionContent}>
          If you have a dispute, please contact us at <a href="mailto:contact@moh.xdrip.io">contact@moh.xdrip.io</a>. We will attempt to resolve disputes amicably.
        </p>
      </div>

      <div className={Style.modalSection}>
        <h3 className={Style.sectionTitle}>9. Changes to Terms</h3>
        <p className={Style.sectionContent}>
          We may update these Terms from time to time. Continued use of the platform constitutes acceptance of the updated Terms.
        </p>
      </div>

      <div className={Style.modalSection}>
        <h3 className={Style.sectionTitle}>10. Governing Law</h3>
        <p className={Style.sectionContent}>
          These Terms are governed by and construed in accordance with the laws of <strong>COLORADO, USA</strong>. Disputes will be resolved under the exclusive jurisdiction of the courts of <strong>COLORADO, USA</strong>.
        </p>
      </div>

      <button onClick={onRequestClose} className={Style.closeButton}>
        Close
      </button>
    </div>
  </Modal>
);

export default TermsOfService;
