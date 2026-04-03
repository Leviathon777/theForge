import React from "react";
import Image from "next/legacy/image";
import { motion } from "framer-motion";
import styles from "./ShowcaseCarousel.module.css";

const ShowcaseCarousel = ({ medals }) => {
  const scrollToTier = (title) => {
    document
      .getElementById(`medal-${title.toLowerCase()}`)
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className={styles.section} id="showcase">
      <div className={styles.sectionHeader}>
        <h2 className={styles.title}>The Collection</h2>
      </div>

      <motion.div
        className={styles.track}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {medals.map((medal, i) => (
          <motion.div
            key={medal.title}
            className={styles.card}
            onClick={() => scrollToTier(medal.title)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <div className={styles.cardImage}>
              <Image
                src={medal.image}
                alt={`${medal.title} Medal`}
                layout="fill"
                objectFit="cover"
                sizes="220px"
              />
            </div>
            <div className={styles.cardInfo}>
              <span className={styles.cardTier}>{medal.title}</span>
              <span className={styles.cardPrice}>{medal.price} BNB</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default ShowcaseCarousel;
