import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheck } from "@fortawesome/free-solid-svg-icons";
import styles from "./AccountHeader.module.css";

const AccountHeader = ({ address, bnbBalance, xdripBalance }) => {
  const [copied, setCopied] = useState(false);

  const truncate = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.topRow}>
          <h1 className={styles.title}>Investment Account</h1>
          <div className={styles.balances}>
            <div className={styles.balance}>
              <span className={styles.balanceValue}>
                {bnbBalance ? parseFloat(bnbBalance).toFixed(4) : "0.0000"} BNB
              </span>
              <span className={styles.balanceLabel}>Wallet Balance</span>
            </div>
            <div className={styles.balance}>
              <span className={styles.balanceValue}>
                {xdripBalance ? Number(xdripBalance).toLocaleString() : "0"} XdRiP
              </span>
              <span className={styles.balanceLabel}>Token Holdings</span>
            </div>
          </div>
        </div>
        <div className={styles.addressRow}>
          <span className={styles.address}>{truncate(address)}</span>
          <button className={styles.copyBtn} onClick={handleCopy} title="Copy address">
            <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
          </button>
          <appkit-button size="sm" />
        </div>
      </div>
    </div>
  );
};

export default AccountHeader;
