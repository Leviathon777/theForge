import React, { useState } from 'react';
import Image from "next/image";
import styles from './DotCarousel.module.css';
import { Button, VideoPlayer, DotDetailsModal } from "../componentsindex.js";
import mohCA_ABI from "../../Context/mohCA_ABI.json";
import { useSwipeable } from 'react-swipeable';
const Carousel = ({ medals = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMedal, setSelectedMedal] = useState(null);
  const medalPlaceholders = [
    {title:"COMMON MEDAL OF HONOR"},{title:"UNCOMMON MEDAL OF HONOR"},{title:"RARE MEDAL OF HONOR"},{title:"EPIC MEDAL OF HONOR"},{title:"LEGENDARY MEDAL OF HONOR"}];
  const handleMedalDetails = (medal) => {
    const formattedMedal = {
      id: medal.tokenId,
      medalVideo: medal.metadata.animation_url,
      title: medal.metadata?.name || medal.title,
      description: medal.metadata?.description || "NO DATA AVAILABLE",
      price: medal.metadata?.attributes?.find(attr => attr.trait_type === "Value")?.value || "N/A",
      collection: "MEDALS of HONOR",
      contractAddress: mohCA_ABI.address,
      isPlaceholder: medal.isPlaceholder
    };
    setSelectedMedal(formattedMedal);
  };
  const isImage = (url) => {
    const extensions = ["jpg", "jpeg", "png", "gif", "webp"];
    const match = url.match(/\.([a-z]+)(?:[?#]|$)/i);
    return extensions.includes(match && match[1]);
  };
  const nextVideo = () => {
    setCurrentIndex((currentIndex + 1) % 5);
  };
  const prevVideo = () => {
    setCurrentIndex((currentIndex - 1 + 5) % 5);
  };
  const displayedItems = medalPlaceholders.map((placeholder) => {
    const matchingMedal = medals.find(medal => medal.metadata?.name === placeholder.title);
    return matchingMedal
      ? { ...matchingMedal, isPlaceholder: false }
      : { ...placeholder, isPlaceholder: true, id: `placeholder-${placeholder.title}` };
  });
  const swipeHandlers = useSwipeable({
    onSwipedLeft: prevVideo,
    onSwipedRight: nextVideo,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });
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
          return (
            <div key={`${item.id}-${index}`} className={cardClass}>
              {item.isPlaceholder ? (
                <div className={styles.placeholder}>
                  <small className={styles.token_id} >{item.title || item.metadata.name}</small>
                  <small className={styles.token_id} >NOT FORGED</small>
                </div>
              ) : (
                isImage(item.metadata.animation_url) ? (
                  <Image
                    src={item.metadata.image_url}
                    alt={item.metadata.name}
                    width={300}
                    height={300}
                    className={styles.MedalsWalletCard_box_img_img}
                  />
                ) : (
                  <VideoPlayer
                    videoSrc={item.metadata.animation_url}
                    isMuted={true}
                    hoverPlay={true}
                    autoPlay={false}
                    loop={true}
                    videoStyles={{
                      width: "100%",
                      height: "325px",
                      objectFit: "cover",
                      borderRadius: "40px",
                    }}
                    hoverGrow={false}
                  />
                )
              )}
              <div onClick={() => handleMedalDetails(item)} className={styles.lower_card}>
                <small className={styles.token_id}>{item.title || item.metadata.name}</small>
                <small className={styles.token_id}>ID: {item.tokenId}</small>
                <small className={styles.dots}>. . .</small>
              </div>
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
export default Carousel;
