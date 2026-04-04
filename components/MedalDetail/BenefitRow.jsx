import React from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartPie, faTicket, faLink, faCoins, faCheckToSlot,
  faFileInvoice, faGlobe, faBolt, faStar, faCrown, faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import styles from "./BenefitRow.module.css";

const ICON_MAP = {
  "chart-pie": faChartPie,
  "ticket": faTicket,
  "link": faLink,
  "coins": faCoins,
  "check-to-slot": faCheckToSlot,
  "file-invoice": faFileInvoice,
  "globe": faGlobe,
  "bolt": faBolt,
  "star": faStar,
  "crown": faCrown,
  "trophy": faTrophy,
};

const SingleBenefit = ({ benefit, index }) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.2 });
  const icon = ICON_MAP[benefit.icon];

  return (
    <motion.div
      ref={ref}
      className={styles.row}
      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <div className={styles.rowTop}>
        <div className={styles.icon}>
          {icon && <FontAwesomeIcon icon={icon} />}
        </div>
        <div className={styles.textBlock}>
          <h3 className={styles.benefitTitle}>{benefit.title}</h3>
          <p className={styles.benefitText}>{benefit.text}</p>
        </div>
      </div>
      <div className={styles.barTrack}>
        <div
          className={styles.barFill}
          style={{ width: isVisible ? `${benefit.fillPct}%` : "0%" }}
        />
      </div>
    </motion.div>
  );
};

const BenefitsList = ({ benefits }) => {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.sectionTitle}>Full Benefits Breakdown</h2>
        <div className={styles.list}>
          {benefits.map((benefit, i) => (
            <SingleBenefit key={benefit.title} benefit={benefit} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsList;
