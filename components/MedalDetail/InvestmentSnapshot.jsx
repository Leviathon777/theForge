import React from "react";
import { motion } from "framer-motion";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import styles from "./InvestmentSnapshot.module.css";

const InvestmentSnapshot = ({ snapshot, medal }) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.3 });

  return (
    <section className={styles.section} ref={ref}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className={styles.title}>Investment Snapshot</h2>

        <div className={styles.grid}>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Revenue Share Weight</span>
            <span className={styles.rowValue}>{snapshot.revenueWeight}%</span>
            <div className={styles.barTrack}>
              <div
                className={styles.barFill}
                style={{ width: isVisible ? `${snapshot.revenueWeight}%` : "0%" }}
              />
            </div>
          </div>

          <div className={styles.row}>
            <span className={styles.rowLabel}>XdRiP Bonus Unlock</span>
            <span className={styles.rowValue}>
              {snapshot.bonusPct > 0 ? `+${snapshot.bonusPct}% bonus` : "Global access"}
            </span>
            <div className={styles.barTrack}>
              <div
                className={styles.barFill}
                style={{ width: isVisible ? `${Math.min(snapshot.bonusPct * 6.67, 100)}%` : "0%" }}
              />
            </div>
          </div>

          <div className={styles.row}>
            <span className={styles.rowLabel}>XdRiP Threshold</span>
            <span className={styles.rowValue}>{snapshot.bonusThreshold}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.rowLabel}>Ecosystem Position</span>
            <span className={styles.rowValue}>{snapshot.position}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.rowLabel}>Illustrative Monthly Estimate</span>
            <span className={styles.rowValue}>
              ~{snapshot.monthlyEst} BNB
            </span>
          </div>

          <div className={styles.row}>
            <span className={styles.rowLabel}>Supply</span>
            <span className={styles.rowValue}>
              {medal.supply.toLocaleString()} total / {medal.forged} forged
            </span>
          </div>
        </div>

        <p className={styles.disclaimer}>
          * Illustrative projections only. Actual returns depend on pool size,
          holder distribution, and platform revenue. Not financial advice.
        </p>
      </motion.div>
    </section>
  );
};

export default InvestmentSnapshot;
