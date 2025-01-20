import React, { useState } from "react";
import Modal from "react-modal";
import Style from "./Agreements.module.css";
import { Button } from "../componentsindex";

const EUCompliance = ({ isOpen, onRequestClose, isClosing }) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="EU Compliance Agreement"
      className={Style.modal}
      overlayClassName={`${Style.modalOverlay} ${isClosing ? Style.slideDown : ""}`}
    >
      <div className={Style.modalWrapper}>
        <h2 className={Style.modalTitle}>Important Disclosures for EU Investors</h2>
        <p className={Style.modalIntro}>
          As an EU investor, we are required to provide the following disclosures:
        </p>

        <div className={Style.modalSection}>
          <h3 className={Style.sectionTitle}>Risk Warning</h3>
          <p className={Style.sectionContent}>
            Investments in this platform are high-risk and may result in the loss of all
            or part of your capital. Past performance is not indicative of future results.
            Investments may also be illiquid, and you may not be able to sell or withdraw
            funds when desired.
          </p>
        </div>

        <div className={Style.modalSection}>
          <h3 className={Style.sectionTitle}>Compliance with EU Financial Regulations</h3>
          <p className={Style.sectionContent}>
            This platform complies with applicable EU financial regulations, including:
          </p>
          <ul className={Style.sectionList}>
            <li className={Style.listItem}>
              Compliance with the Markets in Financial Instruments Directive (MiFID II).
            </li>
            <li className={Style.listItem}>
              Adherence to EU Anti-Money Laundering (AML) and Counter-Terrorism Financing (CTF) regulations.
            </li>
            <li className={Style.listItem}>
              GDPR compliance for data privacy and security.
            </li>
          </ul>
        </div>

        <div className={Style.modalSection}>
          <h3 className={Style.sectionTitle}>Declaration</h3>
          <p className={Style.sectionContent}>
            By proceeding, you confirm that:
          </p>
          <ul className={Style.sectionList}>
            <li className={Style.listItem}>
              You understand the risks associated with investments and have sought
              independent advice where necessary.
            </li>
            <li className={Style.listItem}>
              You are aware that your capital is at risk, and returns are not guaranteed.
            </li>
            <li className={Style.listItem}>
              You consent to the processing of your personal data as described.
            </li>
          </ul>
        </div>

        <div className={Style.modalFooter}>
          <h3 className={Style.footerTitle}>Additional Resources</h3>
          <ul className={Style.footerLinks}>
            <li>
              <a
                href="https://ec.europa.eu/info/business-economy-euro/banking-and-finance/financial-markets_en"
                target="_blank"
                rel="noopener noreferrer"
                className={Style.footerLink}
              >
                EU Financial Markets Regulation Overview
              </a>
            </li>
            <li>
              <a
                href="https://ec.europa.eu/info/law/gdpr_en"
                target="_blank"
                rel="noopener noreferrer"
                className={Style.footerLink}
              >
                GDPR Compliance Information
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

export default EUCompliance;
