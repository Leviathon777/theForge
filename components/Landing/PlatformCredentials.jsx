import React from "react";
import { motion } from "framer-motion";
import styles from "./PlatformCredentials.module.css";

const PlatformCredentials = () => {
  return (
    <section className={styles.section}>
      <motion.div
        className={styles.inner}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className={styles.title}>About XdRiP Digital Management</h2>

        <p className={styles.text}>
          XdRiP Digital Management LLC is a blockchain-focused company building
          decentralized platforms for digital ownership, content distribution, and
          community-driven investment. Medals of Honor is our flagship tiered
          ownership token collection — a direct stake in the company's revenue
          and growth trajectory.
        </p>

        <p className={styles.text}>
          All medal contracts are deployed on the Binance Smart Chain with full
          transparency. Revenue distribution is handled by auditable smart contracts
          with weighted allocation based on medal tier and XdRiP token holdings.
          No intermediaries. No gatekeepers. Direct, on-chain ownership.
        </p>

        <div className={styles.details}>
          <div className={styles.detail}>
            <span className={styles.detailLabel}>Blockchain</span>
            <span className={styles.detailValue}>Binance Smart Chain</span>
          </div>
          <div className={styles.detail}>
            <span className={styles.detailLabel}>Token Standard</span>
            <span className={styles.detailValue}>ERC-721</span>
          </div>
          <div className={styles.detail}>
            <span className={styles.detailLabel}>Distribution</span>
            <span className={styles.detailValue}>On-Chain Weighted</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default PlatformCredentials;
