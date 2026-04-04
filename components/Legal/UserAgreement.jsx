import React from "react";
import LegalDrawer from "./LegalDrawer";

const UserAgreement = ({ isOpen, onRequestClose, isClosing, openModal }) => (
  <LegalDrawer isOpen={isOpen} onClose={onRequestClose} title="User Agreement">
    <h2>XDRIP User Agreement</h2>
    <p>
      Welcome to <strong>The Forge - Medals of Honor</strong>, a platform developed by XDRIP Digital Management LLC. Please read this User Agreement carefully before using the platform.
    </p>

    <div>
      <h3>1. Purpose and Scope</h3>
      <p>This Agreement defines the relationship between you (&quot;User&quot;) and XDRIP Digital Management LLC (&quot;Company&quot;) concerning your use of The Forge. The platform enables investments through the creation and transfer of Digital Ownership Tokens (&quot;D.O.Ts&quot;) to decentralized finance (&quot;DeFi&quot;) wallets.</p>
    </div>

    <div>
      <h3>2. Eligibility</h3>
      <p>To use the platform, you must:</p>
      <ul>
        <li>Be at least 18 years old.</li>
        <li>Possess the legal capacity to enter into this Agreement.</li>
        <li>Ensure compliance with the laws of your jurisdiction related to cryptocurrency and blockchain usage.</li>
      </ul>
    </div>

    <div>
      <h3>3. User Responsibilities</h3>
      <p>As a User, you agree to:</p>
      <ul>
        <li>Use the platform only for its intended purposes.</li>
        <li>Secure and maintain access to your wallet credentials. The Company does not have access to your private keys or recovery phrases.</li>
        <li>Accurately provide any required information for tracking purchases and transactions.</li>
        <li>Assume full responsibility for the outcomes of your transactions.</li>
      </ul>
    </div>

    <div>
      <h3>4. Wallet Connection and Security</h3>
      <p>To participate in forging D.O.Ts, you will need to connect a compatible wallet. You are solely responsible for safeguarding your private keys and wallet credentials.</p>
    </div>

    <div>
      <h3>5. Prohibited Activities</h3>
      <p>You may not:</p>
      <ul>
        <li>Use the platform for illegal purposes, including money laundering or fraud.</li>
        <li>Disrupt the functionality of the platform or attempt unauthorized access.</li>
        <li>Misrepresent information or impersonate another person or entity.</li>
      </ul>
    </div>

    <div>
      <h3>6. Privacy and Data Collection</h3>
      <p>The platform collects and processes limited data to track transactions and purchases. All data practices are detailed in our Privacy Policy.</p>
    </div>

    <div>
      <h3>7. Risks and Investment Disclaimer</h3>
      <p>Investing in D.O.Ts carries risks, including market volatility and regulatory changes. XDRIP Digital Management LLC does not provide financial or investment advice.</p>
    </div>

    <div>
      <h3>8. Intellectual Property</h3>
      <p>All intellectual property related to the platform is owned by XDRIP Digital Management LLC or its licensors. Users may not reproduce, distribute, or exploit these materials without express written consent.</p>
    </div>

    <div>
      <h3>9. Termination</h3>
      <p>The Company reserves the right to terminate or suspend your access to the platform for violations of this Agreement.</p>
    </div>

    <div>
      <h3>10. Limitation of Liability</h3>
      <p>The Company is not liable for losses caused by blockchain network errors, unauthorized wallet access, or market conditions impacting D.O.T investments.</p>
    </div>

    <div>
      <h3>11. Modifications</h3>
      <p>The Company may update or modify this Agreement at any time. Continued use of the platform constitutes acceptance of the updated Agreement.</p>
    </div>

    <div>
      <h3>12. Dispute Resolution</h3>
      <p>
        If you have a dispute, please contact us at{" "}
        <button onClick={() => { onRequestClose(); setTimeout(() => openModal("isEmailFormOpen"), 500); }}>
          contact@moh.xdrip.io
        </button>. Disputes will be governed by the laws of <strong>COLORADO, USA</strong>.
      </p>
    </div>
  </LegalDrawer>
);

export default UserAgreement;
