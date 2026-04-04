import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faCoins, faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { useCountUp } from "../../hooks/useCountUp";
import styles from "./InvestmentProposition.module.css";

const CountStat = ({ value, label }) => {
  const { ref, displayValue } = useCountUp(value);
  return (
    <div className={styles.stat} ref={ref}>
      <span className={styles.statValue}>
        {typeof value === "number" ? displayValue.toLocaleString() : value}
      </span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
};

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
            <span className={styles.cardIcon}><FontAwesomeIcon icon={faChartLine} /></span>
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
            <span className={styles.cardIcon}><FontAwesomeIcon icon={faCoins} /></span>
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
            <span className={styles.cardIcon}><FontAwesomeIcon icon={faLayerGroup} /></span>
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
          <CountStat value={totalSupply || 20020} label="Total Supply" />
          <CountStat value={totalForged || 0} label="Medals Forged" />
          <CountStat value={6} label="Investment Tiers" />
          <CountStat value={bnbPrice ? Math.floor(bnbPrice) : 0} label="BNB / USD" />
        </motion.div>
      </div>
    </section>
  );
};

export default InvestmentProposition;
