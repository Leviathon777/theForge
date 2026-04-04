import React from "react";
import Link from "next/link";
import styles from "./TierComparison.module.css";

const TIERS = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY", "ETERNAL"];

const TierComparison = ({ currentTier }) => {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h3 className={styles.title}>Explore All Tiers</h3>
        <div className={styles.strip}>
          {TIERS.map((tier) => (
            <Link
              key={tier}
              href={`/medal/${tier.toLowerCase()}`}
              className={`${styles.tierBtn} ${tier === currentTier ? styles.tierBtnActive : ""}`}
            >
              {tier}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TierComparison;
