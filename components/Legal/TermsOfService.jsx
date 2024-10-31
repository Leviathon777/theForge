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
    <div className={Style.modal_wrapper}>
    <h2>Terms of Service</h2>
    <p>These Terms of Service govern your use of our minting platform. Please read them carefully.</p>

    <h3>1. Scope of Service</h3>
    <p>
      Our platform allows users to mint digital assets on the blockchain by connecting their wallets. We do not control or manage user wallets or blockchain networks, and we provide no warranties regarding the availability or performance of blockchain services.
    </p>

    <h3>2. Account and Wallet Responsibility</h3>
    <p>
      You are solely responsible for securing access to your wallet and private keys. We do not have access to your private keys and cannot recover lost assets or accounts. Any transaction initiated through your wallet is your responsibility.
    </p>

    <h3>3. Fees and Transactions</h3>
    <p>
      All transactions involve network fees, and we may charge a fee for minting services. You agree to pay all fees associated with transactions on this platform, and you acknowledge that all fees are non-refundable.
    </p>

    <h3>4. Prohibited Conduct</h3>
    <p>
      You may not use the platform for illegal activities, including but not limited to money laundering, fraud, or any other activity prohibited by applicable law. We reserve the right to restrict access to the platform for any user engaging in prohibited conduct.
    </p>

    <h3>5. Compliance with Local Laws</h3>
    <p>
      You are responsible for ensuring that your use of the platform complies with all applicable laws, regulations, and guidelines in your jurisdiction. You acknowledge that we have no obligation to monitor compliance on your behalf.
    </p>

    <h3>6. Intellectual Property</h3>
    <p>
      All content on this platform, including text, graphics, logos, and software, is our property or the property of our licensors. You agree not to reproduce, distribute, or otherwise use any content without our express permission.
    </p>

    <h3>7. Indemnification</h3>
    <p>
      You agree to indemnify, defend, and hold us harmless from any claims, damages, or expenses arising from your use of the platform or any breach of these Terms of Service.
    </p>

    <h3>8. Limitation of Liability</h3>
    <p>
      We are not liable for any damages arising from your use of the platform, including loss of assets, data breaches, or unauthorized access to your wallet. You use the platform at your own risk.
    </p>

    <h3>9. Modifications to Terms</h3>
    <p>
      We may revise these Terms of Service at any time. Continued use of the platform constitutes acceptance of any modified terms.
    </p>

    <h3>10. Governing Law</h3>
    <p>
      These Terms of Service shall be governed by and construed in accordance with the laws of [Your Jurisdiction]. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of [Your Jurisdiction].
    </p>
    </div>
    <button onClick={onRequestClose} className={Style.closeButton}>Close</button>
  </Modal>
);

export default TermsOfService;
