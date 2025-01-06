import React, { useState } from "react";
import Modal from "react-modal";
import Style from "./UKCompliance.module.css";

const UKCompliance = ({ isOpen, onRequestClose, onConfirm }) => {
  const [agreed, setAgreed] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="UK Compliance Agreement"
      className={Style.modal}
      overlayClassName={Style.modalOverlay}
    >
      <div className={Style.modalWrapper}>
        <h2 className={Style.modalTitle}>Important Disclosures for UK Investors</h2>
        <p className={Style.modalIntro}>
          As a UK investor, we are required to ensure you are aware of the following:
        </p>

        <div className={Style.modalSection}>
          <h3 className={Style.sectionTitle}>Risk Warning</h3>
          <p className={Style.sectionContent}>
            Investments are subject to risk and may result in the loss of all or part of
            your capital. Please ensure you understand the risks and seek independent
            advice if necessary.
          </p>
        </div>

        <div className={Style.modalSection}>
          <h3 className={Style.sectionTitle}>Data Usage</h3>
          <p className={Style.sectionContent}>
            Your data will be processed for identity verification, investment tracking,
            and regulatory compliance. We will never share your data with third parties
            unless required for KYC or transaction purposes.
          </p>
        </div>

        <div className={Style.modalSection}>
          <h3 className={Style.sectionTitle}>Marketing Information</h3>
          <p className={Style.sectionContent}>
            By proceeding, you acknowledge that we may send you updates, offers, and marketing communications.
            If you wish to opt out of these communications in the future, you can do so at any time by following the
            instructions provided in the communication or contacting us directly.
          </p>
        </div>


        <div className={Style.modalSection}>
          <h3 className={Style.sectionTitle}>Declaration</h3>
          <p className={Style.sectionContent}>By proceeding, you confirm that:</p>
          <ul className={Style.sectionList}>
            <li className={Style.listItem}>You have read and understood the Risk Warning.</li>
            <li className={Style.listItem}>You are aware of the risks associated with this investment.</li>
            <li className={Style.listItem}>You acknowledge that your capital is at risk.</li>
          </ul>
        </div>
        <div className={Style.modalFooter}>
          <h3 className={Style.footerTitle}>Additional Resources</h3>
          <ul className={Style.footerLinks}>
            <li>
              <a
                href="https://www.fca.org.uk/publication/research/behaviourally-informed-risk-warnings.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={Style.footerLink}
              >
                FCA Risk Warnings
              </a>
            </li>
            <li>
              <a
                href="https://www.stellantis.com/content/dam/stellantis-corporate/archives/fca/corporate-regulations/FCA_Data_Privacy_Guidelines_2018.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={Style.footerLink}
              >
                FCA Data Privacy Guidelines
              </a>
            </li>
            <li>
              <a
                href="https://www.simmons-simmons.com/en/publications/cl6f4kpvp1or80a26iwul09ox/fca-sets-out-new-rules-on-financial-promotion-of-high-risk-investments"
                target="_blank"
                rel="noopener noreferrer"
                className={Style.footerLink}
              >
                FCA Marketing Restrictions for High-Risk Investments
              </a>
            </li>
          </ul>
        </div>
        <button onClick={onRequestClose} className={Style.closeButton}>
          Close
        </button>
      </div>


    </Modal>
  );
};

export default UKCompliance;