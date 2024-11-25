import React, { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import styles from "./DotCarousel.module.css";
import { Button, VideoPlayer, DotDetailsModal } from "../componentsindex.js";
import mohCA_ABI from "../../Context/mohCA_ABI.json";
import { useSwipeable } from "react-swipeable";
import videos from "../../public/videos/index.js";

// Video path for Eternal Medal
const videoPath = { "ETERNAL MEDAL OF HONOR": videos.eternals };

const Eternal = ({ medals = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMedal, setSelectedMedal] = useState(null);

  // Filter only the Eternal Medal
  const eternalMedals = useMemo(
    () => medals.filter((medal) => medal.metadata?.name === "ETERNAL MEDAL OF HONOR"),
    [medals]
  );

  // Placeholder for when Eternal Medal is not forged
  const placeholder = useMemo(
    () => ({
      id: "placeholder-eternal",
      title: "ETERNAL MEDAL OF HONOR",
      isPlaceholder: true,
    }),
    []
  );

  const displayedItems = useMemo(
    () => (eternalMedals.length > 0 ? eternalMedals : [placeholder]),
    [eternalMedals, placeholder]
  );

  const handleMedalDetails = useCallback((medal) => {
    const formattedMedal = {
      id: medal.tokenId || "unknown",
      medalVideo: videoPath[medal.metadata?.name] || "",
      title: medal.metadata?.name || "ETERNAL MEDAL OF HONOR",
      description: medal.metadata?.description || "No data available",
      price: medal.metadata?.attributes?.find((attr) => attr.trait_type === "Value")?.value || "N/A",
      collection: "Medals of Honor",
      contractAddress: mohCA_ABI.address,
      isPlaceholder: medal.isPlaceholder,
    };
    setSelectedMedal(formattedMedal);
  }, []);

  const nextVideo = useCallback(() => {
    setCurrentIndex((currentIndex + 1) % displayedItems.length);
  }, [currentIndex, displayedItems.length]);

  const prevVideo = useCallback(() => {
    setCurrentIndex((currentIndex - 1 + displayedItems.length) % displayedItems.length);
  }, [currentIndex, displayedItems.length]);

  

  const videoStyles = useMemo(
    () => ({
      width: "100%",
      height: "325px",
      objectFit: "cover",
      borderRadius: "40px",
    }),
    []
  );

  return (
    <div className={styles.carousel}>
      
      <div className={styles.cards}>
        {displayedItems.map((item, index) => {
          const position = (index - currentIndex + displayedItems.length) % displayedItems.length;
          const cardClass = `${styles.card} ${styles[`position${position}`]}`;
          

          return (
            <div key={`${item.id}-${index}`} className={cardClass}>
              {item.isPlaceholder ? (
                <div className={styles.placeholder}>
                  <small className={styles.token_id}>{item.title}</small>
                  <small className={styles.token_id}>NOT FORGED</small>
                </div>
              ) : (
                <VideoPlayer
                  videoSrc={videoPath["ETERNAL MEDAL OF HONOR"]}
                  isMuted={true}
                  hoverPlay={true}
                  autoPlay={true}
                  loop={true}
                  videoStyles={videoStyles}
                  hoverGrow={false}
                />
              )}
              {!item.isPlaceholder && (
                <div onClick={() => handleMedalDetails(item)} className={styles.lower_card}>
                  <small className={styles.token_id}>{item.metadata?.name}</small>
                  <small className={styles.token_id}>ID: {item.tokenId}</small>
                  <small className={styles.dots}>. . .</small>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {selectedMedal && (
        <DotDetailsModal medal={selectedMedal} onClose={() => setSelectedMedal(null)} />
      )}
      
    </div>
  );
};

export default React.memo(Eternal);
