import React from "react";
import LegalDrawer from "./LegalDrawer";

const PrivacyPolicy = ({ isOpen, onRequestClose, isClosing, openModal }) => (
  <LegalDrawer isOpen={isOpen} onClose={onRequestClose} title="Privacy Policy">
    <h2>XDRIP Privacy Policy</h2>
    <p>
      Welcome to <strong>The Forge - Medals of Honor</strong>, a platform developed by XDRIP Digital Management LLC. This Privacy Policy outlines how we collect, use, and protect your personal information.
    </p>

    <div>
      <h3>1. Information We Collect</h3>
      <p>We may collect personal information to provide and improve our services. This includes but is not limited to:</p>
      <ul>
        <li>Account information, such as email addresses and wallet addresses.</li>
        <li>Transaction details, including purchases and interactions with the platform.</li>
        <li>Communication data to respond to user inquiries and feedback.</li>
      </ul>
    </div>

    <div>
      <h3>2. How We Use Your Information</h3>
      <p>The information we collect is used to:</p>
      <ul>
        <li>Provide and improve the platform&apos;s functionality.</li>
        <li>Facilitate secure transactions and user interactions.</li>
        <li>Comply with legal and regulatory requirements.</li>
        <li>Conduct platform analytics to enhance user experience.</li>
      </ul>
    </div>

    <div>
      <h3>3. Information Sharing</h3>
      <p>We may share your personal information with trusted third parties for:</p>
      <ul>
        <li>Platform operation and management.</li>
        <li>Legal compliance or in response to lawful requests.</li>
        <li>Protecting the rights, property, or safety of users or third parties.</li>
      </ul>
    </div>

    <div>
      <h3>4. Data Security</h3>
      <p>We employ industry-standard measures to safeguard your personal information. However, no system can guarantee absolute security, and users are advised to exercise caution.</p>
    </div>

    <div>
      <h3>5. Third-Party Links</h3>
      <p>Our platform may include links to third-party services not controlled by us. We are not responsible for their privacy practices.</p>
    </div>

    <div>
      <h3>6. Children&apos;s Privacy</h3>
      <p>Our platform is not intended for individuals under the age of 18. We do not knowingly collect personal information from children.</p>
    </div>

    <div>
      <h3>7. Your Rights</h3>
      <p>Users have the right to:</p>
      <ul>
        <li>Access and review the personal information we hold.</li>
        <li>Request corrections or deletions of inaccurate or outdated information.</li>
        <li>Opt out of certain data collection practices where applicable.</li>
      </ul>
    </div>

    <div>
      <h3>8. Contact Us</h3>
      <p>
        If you have any questions regarding this Privacy Policy, please contact us at{" "}
        <button onClick={() => { onRequestClose(); setTimeout(() => openModal("isEmailFormOpen"), 500); }}>
          contact@moh.xdrip.io
        </button>.
      </p>
    </div>

    <div>
      <h3>9. Updates to This Policy</h3>
      <p>This Privacy Policy may be updated periodically. Users will be notified of significant updates.</p>
    </div>

    <p style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", marginTop: "1rem" }}>Last Updated: 1/5/2025</p>
  </LegalDrawer>
);

export default PrivacyPolicy;
