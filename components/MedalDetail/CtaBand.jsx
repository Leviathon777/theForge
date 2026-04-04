import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./CtaBand.module.css";

const CtaBand = ({ medal, bnbPrice }) => {
  const priceUsd = bnbPrice ? (parseFloat(medal.price) * bnbPrice).toFixed(0) : "---";

  return (
    <section className={styles.section}>
      <motion.div
        className={styles.inner}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className={styles.headline}>Ready to Forge?</h2>
        <p className={styles.price}>
          {medal.price} BNB (~${priceUsd} USD)
        </p>
        <button
          className={styles.forgeCta}
          onClick={() => (window.location.href = "/TheForge")}
        >
          Forge {medal.title}
        </button>
        <Link href="/#showcase" className={styles.backLink}>
          &larr; Back to Collection
        </Link>
      </motion.div>
    </section>
  );
};

export default CtaBand;
