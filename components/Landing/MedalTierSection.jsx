import React from "react";
import Image from "next/legacy/image";
import { motion } from "framer-motion";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import styles from "./MedalTierSection.module.css";

const MedalTierSection = ({ medal, index, bnbPrice }) => {
  const [videoRef, isVisible] = useIntersectionObserver();
  const isReversed = index % 2 !== 0;
  const priceUsd = bnbPrice ? (parseFloat(medal.price) * bnbPrice).toFixed(0) : "---";

  const scrollToForge = () => {
    window.location.href = "/TheForge";
  };

  return (
    <section
      className={styles.section}
      id={`medal-${medal.title.toLowerCase()}`}
      ref={videoRef}
    >
      <motion.div
        className={`${styles.inner} ${isReversed ? styles.reversed : ""}`}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Media */}
        <div className={styles.media}>
          <div className={styles.mediaFrame}>
            <Image
              src={medal.image}
              alt={`${medal.title} Medal of Honor`}
              width={420}
              height={420}
              objectFit="cover"
              className={styles.medalImage}
            />
            {isVisible && medal.video && (
              <video
                className={styles.medalVideo}
                src={medal.video}
                autoPlay
                muted
                loop
                playsInline
                preload="none"
              />
            )}
          </div>
        </div>

        {/* Info */}
        <div className={styles.info}>
          <div className={styles.tierHeader}>
            <h2 className={styles.tierTitle}>{medal.title} Medal of Honor</h2>
          </div>

          <p className={styles.description}>{medal.description}</p>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Total Supply</span>
              <span className={styles.statValue}>
                {medal.supply.toLocaleString()}
              </span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Forged</span>
              <span className={styles.statValue}>{medal.forged}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Revenue Weight</span>
              <span className={styles.statValue}>{medal.revenueShare}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>XdRiP Bonus</span>
              <span className={styles.statValue}>{medal.xdripBonus}</span>
            </div>
          </div>

          <div className={styles.priceRow}>
            <span className={styles.priceBnb}>{medal.price} BNB</span>
            <span className={styles.priceUsd}>(~${priceUsd} USD)</span>
          </div>

          <button className={styles.forgeCta} onClick={scrollToForge}>
            Forge Now
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default MedalTierSection;
