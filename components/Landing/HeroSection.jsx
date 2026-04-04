import React from "react";
import styles from "./HeroSection.module.css";

const HeroSection = () => {
  const scrollToMedals = () => {
    document.getElementById("showcase")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className={styles.hero}>
      <div className={styles.heroOverlay} />
      <div className={styles.heroOrb1} />
      <div className={styles.heroOrb2} />

      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          The Forge of Destiny
        </h1>
        <p className={styles.heroTagline}>
          Forge Your Investment Legacy
        </p>
        <p className={styles.heroSubtitle}>
          Tiered digital ownership in XdRiP Digital Management — revenue sharing,
          token bonuses, and exclusive access through the Medals of Honor collection.
        </p>
        <div className={styles.heroCtas}>
          <appkit-button />
          <button className={styles.heroExploreBtn} onClick={scrollToMedals}>
            Explore Medals
          </button>
        </div>
      </div>

      <div className={styles.scrollIndicator}>
        <span>Scroll</span>
        <div className={styles.scrollArrow} />
      </div>
    </section>
  );
};

export default HeroSection;
