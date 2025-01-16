import React, { useState, useMemo, useCallback } from 'react';
import Image from "next/image";
import styles from './DotCarousel.module.css';
import { Button, VideoPlayer, DotDetailsModal } from "../componentsindex.js";
import mohCA_ABI from "../../Context/mohCA_ABI.json";
import { useSwipeable } from 'react-swipeable';
import videos from "../../public/videos/index.js";

const videoPaths = {
  "COMMON MEDAL OF HONOR": videos.common,
  "UNCOMMON MEDAL OF HONOR": videos.uncommon,
  "RARE MEDAL OF HONOR": videos.rare,
  "EPIC MEDAL OF HONOR": videos.epic,
  "LEGENDARY MEDAL OF HONOR": videos.legendary,
  "ETERNAL MEDAL OF HONOR": videos.eternals,
};

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
    const formattedMedal = {
      id: medal.tokenId.toString(), 
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

  // Helper to determine if a URL is an image
  const isImage = useCallback((url) => {
    const extensions = ["jpg", "jpeg", "png", "gif", "webp"];
    const match = url?.match(/\.([a-z]+)(?:[?#]|$)/i);
    return extensions.includes(match && match[1]);
  }, []);

  // Handlers for navigating the carousel
  const nextVideo = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % 5);
  }, []);

  const prevVideo = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + 5) % 5);
  }, []);

  // Prepare the items to be displayed in the carousel
  const displayedItems = useMemo(() => medalPlaceholders.map((placeholder) => {
    const matchingMedal = medals.find(medal => medal.metadata?.name === placeholder.title);
    return matchingMedal
      ? { ...matchingMedal, isPlaceholder: false }
      : { ...placeholder, isPlaceholder: true, id: `placeholder-${placeholder.title}` };
  }), [medals, medalPlaceholders]);

  // Swipe handlers for mobile interactions
  const swipeHandlers = useSwipeable({
    onSwipedLeft: prevVideo,
    onSwipedRight: nextVideo,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  // Styles for the video player
  const videoStyles = useMemo(() => ({
    width: "100%",
    height: "325px",
    objectFit: "cover",
    borderRadius: "40px",
  }), []);

  return (
    <div className={styles.carousel} {...swipeHandlers}>
      {/* Left Arrow Button */}
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

      {/* Carousel Cards */}
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
                  <small className={styles.token_id}>ID: {item.tokenId.toString()}</small> 
                  <small className={styles.dots}>. . .</small>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Right Arrow Button */}
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

      {/* Details Modal for Selected Medal */}
      {selectedMedal && (
        <DotDetailsModal medal={selectedMedal} onClose={() => setSelectedMedal(null)} />
      )}
    </div>
  );
};

export default React.memo(Carousel);
