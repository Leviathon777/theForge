import React from "react";
import { motion } from "framer-motion";
import styles from "./LoreSection.module.css";

const loreFragments = [
  {
    text: `In the mythical land of Xdripia, a beacon of courage and relentless perseverance stands above all else: <strong>The Forge of Destiny</strong>. This revered place, shrouded in mystery, is the ultimate arena where only the most steadfast and fearless warriors dare to tread. Here, champions face brutal trials, their mettle tested against both the elements and the fierce legacy of those who came before.`,
    direction: { x: -40, y: 0 },
  },
  {
    text: `Nestled within the unforgiving, jagged peaks of the IronForge Mountains, The Forge of Destiny remains hidden from those not called by destiny. The journey alone is the first trial—an arduous trek through treacherous ravines and chilling winds designed to strip away any pretenders. Only those with resilience in their hearts and fire in their spirits will emerge at the gates of the Forge.`,
    direction: { x: 40, y: 0 },
  },
  {
    text: `In these dark times, Xdripia has seen betrayal from allies, sabotage from within, and the relentless assault of the Caller Syndicate—a ruthless coalition of traitors who seek to tear apart the unity of Xdripia. But with every strike from the enemy, the Forge produces a new champion, a beacon of hope to rally the people.`,
    direction: { x: 0, y: 30 },
  },
  {
    text: `For the few who emerge victorious, they earn more than glory—they earn the right to forge the <strong>Medal of Honor</strong>. This medal is a sacred symbol, imbued with the memories of battles fought, and a promise to guard Xdripia against all foes. Its existence binds the warrior to the ancient duty of defending their homeland, marking them among the most uncommon, rare, epic, and legendary heroes in history.`,
    direction: { x: -40, y: 0 },
  },
];

const LoreSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.overlay} />
      <div className={styles.inner}>
        <motion.h2
          className={styles.loreTitle}
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          A Legend&apos;s Lore
        </motion.h2>

        {loreFragments.map((fragment, i) => (
          <motion.div
            key={i}
            className={styles.fragment}
            initial={{ opacity: 0, ...fragment.direction }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: "easeOut" }}
          >
            <p
              className={styles.fragmentText}
              dangerouslySetInnerHTML={{ __html: fragment.text }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default LoreSection;
