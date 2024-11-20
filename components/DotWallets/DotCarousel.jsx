
import React, { useState, useMemo, useCallback } from 'react';
import Image from "next/image";
import styles from './DotCarousel.module.css';
import { Button, VideoPlayer, DotDetailsModal } from "../componentsindex.js";
import mohCA_ABI from "../../Context/mohCA_ABI.json";
import { useSwipeable } from 'react-swipeable';
import videos from "../../public/videos/index.js";

// Mapping medal titles to local video paths
const videoPaths = {
  "COMMON MEDAL OF HONOR": videos.common,
  "UNCOMMON MEDAL OF HONOR": videos.uncommon,
  "RARE MEDAL OF HONOR": videos.rare,
  "EPIC MEDAL OF HONOR": videos.epic,
  "LEGENDARY MEDAL OF HONOR": videos.legendary,
  "ETERNAL MEDAL OF HONOR": videos.eternals,
};

/*
const videoPathsHR = {
  "COMMON MEDAL OF HONOR": videos.COMMONHR,  
  "UNCOMMON MEDAL OF HONOR": videos.UNCOMMONHR,
  "RARE MEDAL OF HONOR": videos.RAREHR,
  "EPIC MEDAL OF HONOR": videos.EPICHR,
  "LEGENDARY MEDAL OF HONOR": videos.LEGENDARYHR,
  "ETERNAL MEDAL OF HONOR": videos.ETERNALSHR,
};
*/



const Carousel = ({ medals = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMedal, setSelectedMedal] = useState(null);

  const medalPlaceholders = useMemo(() => [
    { title: "COMMON MEDAL OF HONOR" },
    { title: "UNCOMMON MEDAL OF HONOR" },
    { title: "RARE MEDAL OF HONOR" },
    { title: "EPIC MEDAL OF HONOR" },
    { title: "LEGENDARY MEDAL OF HONOR" }
  ], []);

  const handleMedalDetails = useCallback((medal) => {
    const videoPath = videoPaths[medal.metadata.name] || ""; 
    console.log(`Loading video for ${medal.metadata.name}: ${videoPath}`); 

    const formattedMedal = {
      id: medal.tokenId,
      medalVideo: videoPath,
      title: medal.metadata?.name || medal.title,
      description: medal.metadata?.description || "NO DATA AVAILABLE",
      price: medal.metadata?.attributes?.find(attr => attr.trait_type === "Value")?.value || "N/A",
      collection: "MEDALS of HONOR",
      contractAddress: mohCA_ABI.address,
      isPlaceholder: medal.isPlaceholder
    };
    setSelectedMedal(formattedMedal);
  }, []);

  const isImage = useCallback((url) => {
    const extensions = ["jpg", "jpeg", "png", "gif", "webp"];
    const match = url.match(/\.([a-z]+)(?:[?#]|$)/i);
    return extensions.includes(match && match[1]);
  }, []);

  const nextVideo = useCallback(() => {
    setCurrentIndex((currentIndex + 1) % 5);
  }, [currentIndex]);

  const prevVideo = useCallback(() => {
    setCurrentIndex((currentIndex - 1 + 5) % 5);
  }, [currentIndex]);

  const displayedItems = useMemo(() => medalPlaceholders.map((placeholder) => {
    const matchingMedal = medals.find(medal => medal.metadata?.name === placeholder.title);
    return matchingMedal
      ? { ...matchingMedal, isPlaceholder: false }
      : { ...placeholder, isPlaceholder: true, id: `placeholder-${placeholder.title}` };
  }), [medals, medalPlaceholders]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: prevVideo,
    onSwipedRight: nextVideo,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const videoStyles = useMemo(() => ({
    width: "100%",
    height: "325px",
    objectFit: "cover",
    borderRadius: "40px",
  }), []);

  return (
    <div className={styles.carousel} {...swipeHandlers}>
      <div className={`${styles.arrowButton} ${styles.leftArrow}`}>
        <Button
          btnName="⟵"
          onClick={prevVideo}
          fontSize="1.25rem"
          isActive={false}
          title="Go Left"
          icon=""
        />
      </div>
      <div className={styles.cards}>
        {displayedItems.map((item, index) => {
          const position = (index - currentIndex + 5) % 5;
          const cardClass = `${styles.card} ${styles[`position${position}`]}`;
          const videoSrc = videoPaths[item.metadata?.name] || "";

          return (
            <div key={`${item.id}-${index}`} className={cardClass}>
              {item.isPlaceholder ? (
                <div className={styles.placeholder}>
                  <small className={styles.token_id}>{item.title || item.metadata.name}</small>
                  <small className={styles.token_id}>NOT FORGED</small>
                </div>
              ) : (
                !isImage(item.metadata.animation_url) ? (
                  <VideoPlayer
                    videoSrc={videoSrc}
                    isMuted={true}
                    hoverPlay={true}
                    autoPlay={true}
                    loop={true}
                    videoStyles={videoStyles}
                    hoverGrow={false}
                  />
                ) : (
                  <Image
                    src={item.metadata.image_url}
                    alt={item.metadata.name}
                    width={300}
                    height={300}
                    className={styles.MedalsWalletCard_box_img_img}
                  />
                )
              )}
              {!item.isPlaceholder && (
                <div onClick={() => handleMedalDetails(item)} className={styles.lower_card}>
                  <small className={styles.token_id}>{item.title || item.metadata.name}</small>
                  <small className={styles.token_id}>ID: {item.tokenId}</small>
                  <small className={styles.dots}>. . .</small>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className={`${styles.arrowButton} ${styles.rightArrow}`}>
        <Button
          btnName="⟶"
          onClick={nextVideo}
          fontSize="1.25rem"
          isActive={false}
          title="Go Right"
          icon=""
        />
      </div>
      {selectedMedal && (
        <DotDetailsModal medal={selectedMedal} onClose={() => setSelectedMedal(null)} />
      )}
    </div>
  );
};

export default React.memo(Carousel);
