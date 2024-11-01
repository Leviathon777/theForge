import React from "react";
import Modal from "react-modal";
import Style from "./UserAgreement.module.css";

const UserAgreement = ({ isOpen, onRequestClose }) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    contentLabel="User Agreement"
    className={Style.modal}
    overlayClassName={Style.modalOverlay}
  >
    <div className={Style.modal_wrapper}>
    <h2>User Agreement</h2>
    <p>Welcome to our minting platform. By accessing or using this site, you agree to be bound by the terms of this User Agreement. Please read it carefully.</p>

    <h3>1. Acceptance of Terms</h3>
    <p>
      By using our services, connecting your wallet, or participating in any minting activity, you confirm that you have read, understood, and agree to be bound by this User Agreement. If you do not agree with these terms, you must discontinue use of our services immediately.
    </p>

    <h3>2. Eligibility</h3>
    <p>
      You must be at least 18 years old or have reached the age of majority in your jurisdiction to use this platform. By using our services, you represent and warrant that you meet these eligibility requirements.
    </p>

    <h3>3. Wallet Connection and Security</h3>
    <p>
      To participate in minting, you will need to connect a compatible wallet. You are solely responsible for securing your wallet and private keys. We do not store or have access to your private keys. Should you lose access to your wallet, we cannot recover any assets or provide assistance.
    </p>

    <h3>4. Minting and Transactions</h3>
    <p>
      All transactions are conducted through blockchain technology and are irreversible. You agree that all fees and transactions associated with minting are final and non-refundable. We are not responsible for any transactions you make through your connected wallet.
    </p>

    <h3>5. Compliance and Legal Obligations</h3>
    <p>
      You are responsible for ensuring that your use of this platform is compliant with all applicable laws and regulations. We make no representation regarding the legality of our services in your jurisdiction and disclaim any liability associated with your use.
    </p>

    <h3>6. Intellectual Property</h3>
    <p>
      All intellectual property on this site, including logos, designs, text, and graphics, is owned by or licensed to us. You may not use, copy, or distribute any content without our express permission.
    </p>

    <h3>7. Termination</h3>
    <p>
      We reserve the right to terminate your access to the platform or services at any time, without notice, for any reason, including violations of this User Agreement or our Terms of Service.
    </p>

    <h3>8. Limitation of Liability</h3>
    <p>
      We shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform, including loss of assets or unauthorized access to your wallet.
    </p>

    <h3>9. Changes to the Agreement</h3>
    <p>
      We may modify this User Agreement at any time. Changes will be posted on our platform, and continued use of the platform constitutes acceptance of those changes.
    </p>
    </div>
    <button onClick={onRequestClose} className={Style.closeButton}>Close</button>
  </Modal>
);

export default UserAgreement;
