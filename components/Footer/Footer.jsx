import React from "react";
import Image from "next/legacy/image";
import Link from "next/link";
import styles from "./Footer.module.css";

const Footer = ({ openModal }) => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerMain}>
          <div className={styles.footerBrand}>
            <Image
              src="/img/mohwallet-logo.png"
              alt="Medals of Honor"
              width={140}
              height={50}
              objectFit="contain"
            />
            <p>
              Digital ownership tokens by XdRiP Digital Management LLC.
              Revenue sharing, tiered access, and strategic investment.
            </p>
          </div>

          <div className={styles.footerLinksSection}>
            <div className={styles.footerLinkGroup}>
              <h4>Platform</h4>
              <Link href="/" className={styles.footerLink}>Home</Link>
              <Link href="/TheForge" className={styles.footerLink}>The Forge</Link>
              <Link href="/InvestorWallet" className={styles.footerLink}>Investor Wallet</Link>
              <Link href="/InvestorProfile" className={styles.footerLink}>Investor Profile</Link>
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
