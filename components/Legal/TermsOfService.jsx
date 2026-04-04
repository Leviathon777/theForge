import React from "react";
import LegalDrawer from "./LegalDrawer";

const TermsOfService = ({ isOpen, onRequestClose, isClosing, openModal }) => (
  <LegalDrawer isOpen={isOpen} onClose={onRequestClose} title="Terms of Service">
    <h2>XDRIP Terms of Service</h2>
    <p>
      Welcome to <strong>The Forge - Medals of Honor</strong>, a platform developed by XDRIP Digital Management LLC. Please read these Terms of Service carefully before using the platform.
    </p>

    <div>
      <h3>1. Acceptance of Terms</h3>
      <p>
        By accessing or using the platform, you confirm that you are at least 18 years old and have the legal capacity to enter into these Terms. If you do not agree with these Terms, please refrain from using the platform.
      </p>
    </div>

    <div>
      <h3>2. Overview of Services</h3>
      <p>
        The Forge enables users to invest in blockchain-based Digital Ownership Tokens (&quot;D.O.Ts&quot;) and manage them within decentralized finance (&quot;DeFi&quot;) wallets. Users can either:
      </p>
      <ul>
        <li>Create a DeFi wallet via the platform.</li>
        <li>Connect an existing self-custody wallet.</li>
      </ul>
      <p>
        The platform tracks transactions and purchases using secure backend infrastructure. KYC is not currently required but may be implemented in the future to comply with regulations.
      </p>
    </div>

    <div>
      <h3>3. Wallet Responsibility</h3>
      <p>
        You are solely responsible for maintaining the security of your wallet credentials. XDRIP Digital Management LLC is not liable for unauthorized access to your wallet or transactions initiated from it.
      </p>
    </div>

    <div>
      <h3>4. Investment Disclaimer</h3>
      <p>
        Investing in D.O.Ts involves inherent risks, including market volatility and regulatory uncertainties. XDRIP Digital Management LLC does not provide financial or investment advice. Consult a qualified professional before making investment decisions.
      </p>
    </div>

    <div>
      <h3>5. User Conduct</h3>
      <p>By using the platform, you agree to:</p>
      <ul>
        <li>Use the platform solely for lawful purposes.</li>
        <li>Refrain from activities that disrupt or compromise the platform&apos;s functionality.</li>
        <li>Not engage in fraudulent or misleading activities.</li>
      </ul>
    </div>

    <div>
      <h3>6. Privacy</h3>
      <p>
        The platform collects wallet-related data to track transactions and purchases. By connecting your wallet, you consent to this collection and usage as outlined in our Privacy Policy.
      </p>
    </div>

    <div>
      <h3>7. Limitation of Liability</h3>
      <p>XDRIP Digital Management LLC is not liable for losses caused by:</p>
      <ul>
        <li>Blockchain network outages or technical failures.</li>
        <li>Unauthorized wallet access.</li>
        <li>Investment losses due to market conditions.</li>
      </ul>
    </div>

    <div>
      <h3>8. Dispute Resolution</h3>
      <p>
        If you have a dispute, please contact us at{" "}
        <button
          onClick={() => {
            onRequestClose();
            setTimeout(() => openModal("isEmailFormOpen"), 500);
          }}
        >
          contact@moh.xdrip.io
        </button>
        . We will attempt to resolve disputes amicably.
      </p>
    </div>

    <div>
      <h3>9. Changes to Terms</h3>
      <p>
        We may update these Terms from time to time. Continued use of the platform constitutes acceptance of the updated Terms.
      </p>
    </div>

    <div>
      <h3>10. Governing Law</h3>
      <p>
        These Terms are governed by and construed in accordance with the laws of <strong>COLORADO, USA</strong>. Disputes will be resolved under the exclusive jurisdiction of the courts of <strong>COLORADO, USA</strong>.
      </p>
    </div>
  </LegalDrawer>
);

export default TermsOfService;
