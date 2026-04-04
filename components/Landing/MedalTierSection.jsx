import React, { useState } from "react";
import Image from "next/legacy/image";
import { motion } from "framer-motion";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import { useTilt } from "../../hooks/useTilt";
import Link from "next/link";
import ForgeCheckoutModal from "../ForgeCheckout/ForgeCheckoutModal";
import styles from "./MedalTierSection.module.css";

const PARALLAX_GROUPS = {
  COMMON: { bg: "parallaxForge", overlay: "overlayForge" },
  UNCOMMON: { bg: "parallaxForge", overlay: "overlayForge" },
  RARE: { bg: "parallaxBattle", overlay: "overlayBattle" },
  EPIC: { bg: "parallaxBattle", overlay: "overlayBattle" },
  LEGENDARY: { bg: "parallaxLegend", overlay: "overlayLegend" },
  ETERNAL: { bg: "parallaxEternal", overlay: "overlayEternal" },
};

const MedalTierSection = ({ medal, index, bnbPrice }) => {
  const [videoRef, isVisible] = useIntersectionObserver();
  const { ref: tiltRef, style: tiltStyle, onMouseMove, onMouseLeave } = useTilt(8);
  const isReversed = index % 2 !== 0;
  const priceUsd = bnbPrice ? (parseFloat(medal.price) * bnbPrice).toFixed(0) : "---";
  const group = PARALLAX_GROUPS[medal.title] || PARALLAX_GROUPS.COMMON;

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <>
      <section
        className={`${styles.section} ${styles[group.bg]}`}
        id={`medal-${medal.title.toLowerCase()}`}
        ref={videoRef}
      >
        <div className={`${styles.sectionOverlay} ${styles[group.overlay]}`} />

        <motion.div
          className={`${styles.inner} ${isReversed ? styles.reversed : ""}`}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Medal Image with 3D Tilt */}
          <div className={styles.media}>
            <div
              ref={tiltRef}
              className={styles.mediaFrame}
              style={tiltStyle}
              onMouseMove={onMouseMove}
              onMouseLeave={onMouseLeave}
            >
              <Image
                src={medal.image}
                alt={`${medal.title} Medal of Honor`}
                width={400}
                height={400}
                objectFit="cover"
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

          {/* Info Panel */}
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

            <div className={styles.ctaRow}>
              <button className={styles.forgeCta} onClick={() => setIsCheckoutOpen(true)}>
                Forge Now
              </button>
              <Link href={`/medal/${medal.title.toLowerCase()}`} className={styles.detailsLink}>
                View Details
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {isCheckoutOpen && (
        <ForgeCheckoutModal
          medal={medal}
          bnbPrice={bnbPrice}
          onClose={() => setIsCheckoutOpen(false)}
        />
      )}
    </>
  );
};

export default MedalTierSection;
