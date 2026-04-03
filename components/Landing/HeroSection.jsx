import React from "react";
import Image from "next/legacy/image";
import styles from "./HeroSection.module.css";

const HeroSection = () => {
  const scrollToMedals = () => {
    document.getElementById("showcase")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className={styles.hero}>
      <div className={styles.heroBg}>
        <Image
          src="/img/background.png"
          alt="The Forge"
          layout="fill"
          objectFit="cover"
          priority
          quality={75}
        />
      </div>
      <div className={styles.heroOverlay} />
      <div className={styles.heroOrb1} />
      <div className={styles.heroOrb2} />

      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          Forge Your Investment Legacy
        </h1>
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
