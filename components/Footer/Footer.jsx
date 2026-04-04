import React from "react";
import Link from "next/link";
import styles from "./Footer.module.css";

const Footer = ({ openModal }) => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerMain}>
          <div className={styles.footerBrand}>
            <img
              src="/img/mohwallet-logo.png"
              alt="Medals of Honor"
              style={{ width: "100px", height: "auto", display: "block" }}
            />
            <p>Forge Your Investment Legacy</p>
          </div>

          <div className={styles.footerLinksSection}>
            <div className={styles.footerLinkGroup}>
              <h4>Platform</h4>
              <Link href="/" className={styles.footerLink}>Home</Link>
              <Link href="/account" className={styles.footerLink}>My Account</Link>
            </div>

            <div className={styles.footerLinkGroup}>
              <h4>Company</h4>
              <a
                href="https://www.xdrip.io"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerLink}
              >
                XdRiP Digital Management
              </a>
              <a
                href="https://www.xcoldpro.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerLink}
              >
                XColdPro Cold Storage
              </a>
              <a
                href="https://www.talesofxdripia.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerLink}
              >
                Tales of Xdripia
              </a>

            </div>

            <div className={styles.footerLinkGroup}>
              <h4>Legal</h4>
              <button
                className={styles.footerLink}
                onClick={() => openModal?.("isTermsModalOpen")}
              >
                Terms of Service
              </button>
              <button
                className={styles.footerLink}
                onClick={() => openModal?.("isPrivacyPolicyModalOpen")}
              >
                Privacy Policy
              </button>
              <button
                className={styles.footerLink}
                onClick={() => openModal?.("isUserAgreementModalOpen")}
              >
                User Agreement
              </button>
              <button
                className={styles.footerLink}
                onClick={() => openModal?.("isUKComplianceModalOpen")}
              >
                UK Compliance
              </button>
              <button
                className={styles.footerLink}
                onClick={() => openModal?.("isEUComplianceModalOpen")}
              >
                EU Compliance
              </button>
            </div>

            <div className={styles.footerLinkGroup}>
              <h4>Connect</h4>
              <a
                href="https://x.com/XDRIP"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerLink}
              >
                X (Twitter)
              </a>
              <a
                href="https://www.instagram.com/thexdripofficial/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerLink}
              >
                Instagram
              </a>
              <a
                href="https://www.facebook.com/TheXdripOfficial/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerLink}
              >
                Facebook
              </a>
              <button
                className={styles.footerLink}
                onClick={() => openModal?.("isEmailFormOpen")}
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>
            &copy; {new Date().getFullYear()} XDRIP Digital Management LLC. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
