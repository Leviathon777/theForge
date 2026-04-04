import React, { useState, useEffect } from "react";
import Image from "next/legacy/image";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./MedalDetailHero.module.css";

const MedalDetailHero = ({ medal, bnbPrice }) => {
  const [offset, setOffset] = useState(0);
  const priceUsd = bnbPrice ? (parseFloat(medal.price) * bnbPrice).toFixed(0) : "---";

  useEffect(() => {
    const handler = () => setOffset(window.scrollY * 0.3);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <Link href="/#showcase" className={styles.backLink}>
          &larr; Back to Collection
        </Link>

        <motion.div
          className={styles.medalFrame}
          style={{ transform: `translateY(${offset}px)` }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Image
            src={medal.image}
            alt={`${medal.title} Medal of Honor`}
            layout="fill"
            objectFit="cover"
            priority
          />
          {medal.video && (
            <video
              className={styles.medalVideo}
              src={medal.video}
              autoPlay
              muted
              loop
              playsInline
            />
          )}
        </motion.div>

        <motion.div
          className={styles.heroText}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className={styles.tierName}>{medal.title}</h1>
          <p className={styles.tierSub}>Medal of Honor</p>
          <p>
            <span className={styles.price}>{medal.price} BNB</span>
            <span className={styles.priceUsd}>(~${priceUsd} USD)</span>
          </p>
          <button
            className={styles.forgeCta}
            onClick={() => (window.location.href = "/TheForge")}
          >
            Forge Now
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default MedalDetailHero;
