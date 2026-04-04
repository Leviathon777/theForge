import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartBar } from "@fortawesome/free-solid-svg-icons";
import styles from "./HoldingsOverview.module.css";

const DOT_WEIGHTS = { COMMON: 10, UNCOMMON: 25, RARE: 45, EPIC: 70, LEGENDARY: 110 };
const MEDAL_ORDER = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY"];
const TIER_COLORS = {
  COMMON: "#8B7355", UNCOMMON: "#4A90D9", RARE: "#9B59B6",
  EPIC: "#E67E22", LEGENDARY: "#F1C40F", ETERNAL: "#22c55e",
};

const HoldingsOverview = ({ dots }) => {
  // Count medals by tier
  const tierCounts = {};
  (dots || []).forEach((dot) => {
    const name = dot.metadata?.name?.replace(" MEDAL OF HONOR", "").trim() || "UNKNOWN";
    tierCounts[name] = (tierCounts[name] || 0) + 1;
  });

  const totalMedals = dots?.length || 0;
  const fullRamps = MEDAL_ORDER.length > 0
    ? Math.min(...MEDAL_ORDER.map((t) => tierCounts[t] || 0))
    : 0;

  // Calculate revenue weight
  let revenueWeight = fullRamps * DOT_WEIGHTS.LEGENDARY;
  const remaining = MEDAL_ORDER.filter((t) => (tierCounts[t] || 0) > fullRamps);
  if (remaining.length > 0) revenueWeight += DOT_WEIGHTS[remaining[remaining.length - 1]];

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>
        <FontAwesomeIcon icon={faChartBar} /> Holdings Overview
      </h2>
      <div className={styles.statsGrid}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{totalMedals}</span>
          <span className={styles.statLabel}>Total Medals</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{fullRamps}</span>
          <span className={styles.statLabel}>Full Ramps</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{revenueWeight}</span>
          <span className={styles.statLabel}>Revenue Weight</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>
            {Object.keys(tierCounts).length}
          </span>
          <span className={styles.statLabel}>Tier Types</span>
        </div>
      </div>
      {totalMedals > 0 && (
        <div className={styles.tierBadges}>
          {Object.entries(tierCounts).map(([tier, count]) => (
            <span
              key={tier}
              className={styles.tierBadge}
              style={{ background: TIER_COLORS[tier] || "#555" }}
            >
              {tier.charAt(0)}:{count}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default HoldingsOverview;
