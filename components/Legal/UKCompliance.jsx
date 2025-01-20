import React, { useState } from "react";
import Modal from "react-modal";
import Style from "./Agreements.module.css";
import { Button } from "../componentsindex";

const UKCompliance = ({ isOpen, onRequestClose, isClosing }) => {
  const [agreed, setAgreed] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="UK Compliance Agreement"
      className={Style.modal}
      overlayClassName={`${Style.modalOverlay} ${isClosing ? Style.slideDown : ""}`}
    >
      <div className={Style.modalWrapper}>
        <h2 className={Style.modalTitle}>Important Disclosures for UK Investors</h2>
        <p className={Style.modalIntro}>
          As a UK investor, we are required to ensure you are aware of the following:
        </p>

        <div className={Style.modalSection}>
          <h3 className={Style.sectionTitle}>Risk Warning</h3>
          <p className={Style.sectionContent}>
            Investments are high-risk and may result in the loss of all or part of your capital. The value of investments can go down as well as up, and you may not get back the amount you invested. Investments on this platform may also be illiquid, meaning you may not be able to sell your investment promptly or at all. Please ensure you fully understand these risks and seek independent advice if necessary.
          </p>
        </div>

        <div className={Style.modalSection}>
          <h3 className={Style.sectionTitle}>Compliance with FCA Regulations</h3>
          <p className={Style.sectionContent}>
            This communication is a financial promotion. Please note that investments on this platform are not authorized or guaranteed by the Financial Conduct Authority (FCA). By proceeding, you confirm that you understand this platform operates under FCA regulations where applicable but is not covered by the UK Financial Services Compensation Scheme.
          </p>
        </div>

        <div className={Style.modalSection}>
          <h3 className={Style.sectionTitle}>Data Usage</h3>
          <p className={Style.sectionContent}>
            Your personal data will be securely processed for identity verification, investment tracking, and regulatory compliance. We retain your data only for as long as necessary to meet legal obligations. Your data will not be shared with third parties unless required for KYC or transactional purposes, in compliance with GDPR.
          </p>
        </div>

        <div className={Style.modalSection}>
          <h3 className={Style.sectionTitle}>Marketing Information</h3>
          <p className={Style.sectionContent}>
            By proceeding, you acknowledge that we may send you updates, offers, and marketing communications. You may opt out of these communications at any time by following the instructions provided in the communication or contacting us directly.
          </p>
        </div>

        <div className={Style.modalSection}>
          <h3 className={Style.sectionTitle}>Declaration</h3>
          <p className={Style.sectionContent}>
            By proceeding, you confirm that:
          </p>
          <ul className={Style.sectionList}>
            <li className={Style.listItem}>You have read and understood the Risk Warning.</li>
            <li className={Style.listItem}>You are aware of the risks associated with this investment.</li>
            <li className={Style.listItem}>You acknowledge that your capital is at risk and returns are not guaranteed.</li>
            <li className={Style.listItem}>You understand that this platform is not covered by the UK Financial Services Compensation Scheme.</li>
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
                href="https://www.fca.org.uk/data-protection"
                target="_blank"
                rel="noopener noreferrer"
                className={Style.footerLink}
              >
                FCA Data Protection Guidelines
              </a>
            </li>
            <li>
              <a
                href="https://www.fca.org.uk/consumers/high-return-investments"
                target="_blank"
                rel="noopener noreferrer"
                className={Style.footerLink}
              >
                High-Risk Investments Guidance
              </a>
            </li>
          </ul>
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
};

export default UKCompliance;
