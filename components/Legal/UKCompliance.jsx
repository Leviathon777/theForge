import React from "react";
import LegalDrawer from "./LegalDrawer";

const UKCompliance = ({ isOpen, onRequestClose, isClosing }) => (
  <LegalDrawer isOpen={isOpen} onClose={onRequestClose} title="UK Compliance">
    <h2>Important Disclosures for UK Investors</h2>
    <p>As a UK investor, we are required to ensure you are aware of the following:</p>

    <div>
      <h3>Risk Warning</h3>
      <p>Investments are high-risk and may result in the loss of all or part of your capital. The value of investments can go down as well as up, and you may not get back the amount you invested. Investments on this platform may also be illiquid.</p>
    </div>

    <div>
      <h3>Compliance with FCA Regulations</h3>
      <p>This communication is a financial promotion. Please note that investments on this platform are not authorized or guaranteed by the Financial Conduct Authority (FCA). By proceeding, you confirm that you understand this platform operates under FCA regulations where applicable but is not covered by the UK Financial Services Compensation Scheme.</p>
    </div>

    <div>
      <h3>Data Usage</h3>
      <p>Your personal data will be securely processed for identity verification, investment tracking, and regulatory compliance. We retain your data only for as long as necessary to meet legal obligations. Your data will not be shared with third parties unless required for KYC or transactional purposes, in compliance with GDPR.</p>
    </div>

    <div>
      <h3>Marketing Information</h3>
      <p>By proceeding, you acknowledge that we may send you updates, offers, and marketing communications. You may opt out at any time.</p>
    </div>

    <div>
      <h3>Declaration</h3>
      <p>By proceeding, you confirm that:</p>
      <ul>
        <li>You have read and understood the Risk Warning.</li>
        <li>You are aware of the risks associated with this investment.</li>
        <li>You acknowledge that your capital is at risk and returns are not guaranteed.</li>
        <li>You understand that this platform is not covered by the UK Financial Services Compensation Scheme.</li>
      </ul>
    </div>

    <div>
      <h3>Additional Resources</h3>
      <ul>
        <li><a href="https://www.fca.org.uk/publication/research/behaviourally-informed-risk-warnings.pdf" target="_blank" rel="noopener noreferrer">FCA Risk Warnings</a></li>
        <li><a href="https://www.fca.org.uk/data-protection" target="_blank" rel="noopener noreferrer">FCA Data Protection Guidelines</a></li>
        <li><a href="https://www.fca.org.uk/consumers/high-return-investments" target="_blank" rel="noopener noreferrer">High-Risk Investments Guidance</a></li>
      </ul>
    </div>
  </LegalDrawer>
);

export default UKCompliance;
