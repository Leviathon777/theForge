import React from "react";
import { motion } from "framer-motion";
import styles from "./InvestmentProposition.module.css";

const InvestmentProposition = ({ totalSupply, totalForged, bnbPrice }) => {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Why Invest in Medals of Honor</h2>
        </div>

        <motion.div
          className={styles.cards}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, staggerChildren: 0.15 }}
        >
          <motion.div
            className={styles.card}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <span className={styles.cardIcon}>&#9878;</span>
            <h3 className={styles.cardTitle}>Revenue Sharing</h3>
            <p className={styles.cardText}>
              Each medal tier carries a weighted share of platform revenue distribution.
              Higher tiers receive proportionally greater allocation — a direct financial
              stake in the growth of XdRiP Digital Management.
            </p>
          </motion.div>

          <motion.div
            className={styles.card}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <span className={styles.cardIcon}>&#10070;</span>
            <h3 className={styles.cardTitle}>XdRiP Token Bonuses</h3>
            <p className={styles.cardText}>
              Hold XdRiP tokens alongside your medals to unlock bonus multipliers on
              revenue distribution. Thresholds scale with tier — rewarding committed
              ecosystem participants.
            </p>
          </motion.div>

          <motion.div
            className={styles.card}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <span className={styles.cardIcon}>&#9733;</span>
            <h3 className={styles.cardTitle}>Tiered Ownership</h3>
            <p className={styles.cardText}>
              Six tiers from Common to Eternal — each representing a deeper commitment
              and proportionally greater influence. Complete a full ramp of five tiers
              for maximum distribution weight.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.statsBar}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className={styles.stat}>
            <span className={styles.statValue}>
              {totalSupply ? totalSupply.toLocaleString() : "20,020"}
            </span>
            <span className={styles.statLabel}>Total Supply</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{totalForged || 0}</span>
            <span className={styles.statLabel}>Medals Forged</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>6</span>
            <span className={styles.statLabel}>Investment Tiers</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>
              ${bnbPrice ? bnbPrice.toFixed(0) : "---"}
            </span>
            <span className={styles.statLabel}>BNB / USD</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InvestmentProposition;
