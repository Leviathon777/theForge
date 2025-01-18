import React from "react";
import Modal from "react-modal";
import Style from "./Agreements.module.css";
import { Button } from "../componentsindex";

const UserAgreement = ({ isOpen, onRequestClose, isClosing }) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    contentLabel="User Agreement"
    className={Style.modal}
    overlayClassName={`${Style.modalOverlay} ${isClosing ? Style.slideDown : ""}`}
  >
    <div className={Style.modalWrapper}>
      <h2 className={Style.modalTitle}>XDRIP User Agreement</h2>
      <p className={Style.modalIntro}>
        Welcome to <strong>The Forge - Medals of Honor</strong>, a platform developed by XDRIP Digital Management LLC. Please read this User Agreement carefully before using the platform.
      </p>

      <div className={Style.modalSection}>
        <h3 className={Style.sectionTitle}>1. Purpose and Scope</h3>
        <p className={Style.sectionContent}>
          This Agreement defines the relationship between you ("User") and XDRIP Digital Management LLC ("Company") concerning your use of The Forge. The platform enables investments through the creation and transfer of Digital Ownership Tokens (“D.O.Ts”) to decentralized finance (“DeFi”) wallets.
        </p>
      </div>

      <div className={Style.modalSection}>
        <h3 className={Style.sectionTitle}>2. Eligibility</h3>
        <p className={Style.sectionContent}>To use the platform, you must:</p>
        <ul className={Style.sectionList}>
          <li className={Style.listItem}>Be at least 18 years old.</li>
          <li className={Style.listItem}>Possess the legal capacity to enter into this Agreement.</li>
          <li className={Style.listItem}>
            Ensure compliance with the laws of your jurisdiction related to cryptocurrency and blockchain usage.
          </li>
        </ul>
        <p className={Style.sectionContent}>
          By using the platform, you represent and warrant that you meet these requirements.
        </p>
      </div>

      <div className={Style.modalSection}>
        <h3 className={Style.sectionTitle}>3. User Responsibilities</h3>
        <p className={Style.sectionContent}>As a User, you agree to:</p>
        <ul className={Style.sectionList}>
          <li className={Style.listItem}>Use the platform only for its intended purposes.</li>
          <li className={Style.listItem}>
            Secure and maintain access to your wallet credentials. The Company does not have access to your private keys or recovery phrases.
          </li>
          <li className={Style.listItem}>
            Accurately provide any required information for tracking purchases and transactions.
          </li>
          <li className={Style.listItem}>
            Assume full responsibility for the outcomes of your transactions, including the management of funds and tokens.
          </li>
        </ul>
      </div>

      <div className={Style.modalSection}>
        <h3 className={Style.sectionTitle}>4. Wallet Connection and Security</h3>
        <p className={Style.sectionContent}>
          To participate in forging D.O.Ts, you will need to connect a compatible wallet. You are solely responsible for safeguarding your private keys and wallet credentials. XDRIP Digital Management LLC is not liable for unauthorized access to your wallet or the loss of funds.
        </p>
      </div>

      <div className={Style.modalSection}>
        <h3 className={Style.sectionTitle}>5. Prohibited Activities</h3>
        <p className={Style.sectionContent}>You may not:</p>
        <ul className={Style.sectionList}>
          <li className={Style.listItem}>Use the platform for illegal purposes, including money laundering or fraud.</li>
          <li className={Style.listItem}>Disrupt the functionality of the platform or attempt unauthorized access.</li>
          <li className={Style.listItem}>Misrepresent information or impersonate another person or entity.</li>
        </ul>
      </div>

      <div className={Style.modalSection}>
        <h3 className={Style.sectionTitle}>6. Privacy and Data Collection</h3>
        <p className={Style.sectionContent}>
          The platform collects and processes limited data to track transactions and purchases, including wallet addresses and transaction history. All data practices are detailed in our Privacy Policy. By using the platform, you consent to this data collection and processing.
        </p>
      </div>

      <div className={Style.modalSection}>
        <h3 className={Style.sectionTitle}>7. Risks and Investment Disclaimer</h3>
        <p className={Style.sectionContent}>
          Investing in D.O.Ts carries risks, including market volatility and regulatory changes. XDRIP Digital Management LLC does not provide financial or investment advice. Users should consult qualified professionals before making investment decisions.
        </p>
      </div>

      <div className={Style.modalSection}>
        <h3 className={Style.sectionTitle}>8. Intellectual Property</h3>
        <p className={Style.sectionContent}>
          All intellectual property related to the platform, including but not limited to logos, branding, and software, is owned by XDRIP Digital Management LLC or its licensors. Users may not reproduce, distribute, or exploit these materials without express written consent.
        </p>
      </div>

      <div className={Style.modalSection}>
        <h3 className={Style.sectionTitle}>9. Termination</h3>
        <p className={Style.sectionContent}>
          The Company reserves the right to terminate or suspend your access to the platform for violations of this Agreement or other applicable terms.
        </p>
      </div>

      <div className={Style.modalSection}>
        <h3 className={Style.sectionTitle}>10. Limitation of Liability</h3>
        <p className={Style.sectionContent}>
          To the fullest extent permitted by law, the Company is not liable for losses caused by blockchain network errors, unauthorized wallet access, or market conditions impacting D.O.T investments.
        </p>
      </div>

      <div className={Style.modalSection}>
        <h3 className={Style.sectionTitle}>11. Modifications to the Agreement</h3>
        <p className={Style.sectionContent}>
          The Company may update or modify this Agreement at any time. Continued use of the platform constitutes acceptance of the updated Agreement.
        </p>
      </div>

      <div className={Style.modalSection}>
        <h3 className={Style.sectionTitle}>12. Dispute Resolution</h3>
        <p className={Style.sectionContent}>
          If you have a dispute regarding your use of the platform, please contact us at <a href="mailto:contact@moh.xdrip.io">contact@moh.xdrip.io</a>. Disputes will be governed by the laws of <strong>COLORADO, USA</strong>.
        </p>
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

export default UserAgreement;
