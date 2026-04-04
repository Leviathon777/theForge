import React from "react";
import LegalDrawer from "./LegalDrawer";

const EUCompliance = ({ isOpen, onRequestClose, isClosing }) => (
  <LegalDrawer isOpen={isOpen} onClose={onRequestClose} title="EU Compliance">
    <h2>Important Disclosures for EU Investors</h2>
    <p>As an EU investor, we are required to provide the following disclosures:</p>

    <div>
      <h3>Risk Warning</h3>
      <p>Investments in this platform are high-risk and may result in the loss of all or part of your capital. Past performance is not indicative of future results. Investments may also be illiquid.</p>
    </div>

    <div>
      <h3>Compliance with EU Financial Regulations</h3>
      <p>This platform complies with applicable EU financial regulations, including:</p>
      <ul>
        <li>Compliance with the Markets in Financial Instruments Directive (MiFID II).</li>
        <li>Adherence to EU Anti-Money Laundering (AML) and Counter-Terrorism Financing (CTF) regulations.</li>
        <li>GDPR compliance for data privacy and security.</li>
      </ul>
    </div>

    <div>
      <h3>Declaration</h3>
      <p>By proceeding, you confirm that:</p>
      <ul>
        <li>You understand the risks associated with investments and have sought independent advice where necessary.</li>
        <li>You are aware that your capital is at risk, and returns are not guaranteed.</li>
        <li>You consent to the processing of your personal data as described.</li>
      </ul>
    </div>

    <div>
      <h3>Additional Resources</h3>
      <ul>
        <li><a href="https://ec.europa.eu/info/business-economy-euro/banking-and-finance/financial-markets_en" target="_blank" rel="noopener noreferrer">EU Financial Markets Regulation Overview</a></li>
        <li><a href="https://ec.europa.eu/info/law/gdpr_en" target="_blank" rel="noopener noreferrer">GDPR Compliance Information</a></li>
      </ul>
    </div>
  </LegalDrawer>
);

export default EUCompliance;
