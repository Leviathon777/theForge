import React, { useContext, useEffect, useState } from "react";
import Style from "./DotWallet.module.css";
import DotCarousel from "./DotCarousel.jsx";
import { MyDotDataContext } from '../../Context/MyDotDataContext.js';
import { Button, VideoPlayer, DotDetailsModal } from "../componentsindex.js";
const DotWallet = () => {
  const { dots } = useContext(MyDotDataContext);
  const [ramps, setRamps] = useState({});
  const [selectedMedal, setSelectedMedal] = useState(null);
  const [eternalMedal, setEternalMedal] = useState(null);
  const organizeMedalsByRarity = (medals) => {
    const rarityLevels = ["COMMON MEDAL OF HONOR", "UNCOMMON MEDAL OF HONOR", "RARE MEDAL OF HONOR", "EPIC MEDAL OF HONOR", "LEGENDARY MEDAL OF HONOR"];
    const ramps = { ramp1: [], ramp2: [], ramp3: [], ramp4: [] };
    let eternal = null;
    medals.forEach((medal) => {
      if (medal.metadata.name === "ETERNAL MEDAL OF HONOR") {
        eternal = medal;
      } else if (rarityLevels.includes(medal.metadata.name)) {
        const rarity = medal.metadata.name;
        const filteredMedals = medals.filter((medal) => medal.metadata.name === rarity);
        filteredMedals.sort((a, b) => a.tokenId - b.tokenId);
        filteredMedals.forEach((medal, index) => {
          const rampNumber = `ramp${(index % 4) + 1}`;
          ramps[rampNumber].push({ ...medal, ramp: rampNumber });
        });
      }
    });
    return { ramps, eternal };
  };
  useEffect(() => {
    if (dots && dots.length > 0) {
      const { ramps: organizedRamps, eternal } = organizeMedalsByRarity(dots);
      setRamps(organizedRamps);
      setEternalMedal(eternal);
    } else {
      const placeholderRamps = {
        ramp1: [
          { title: "COMMON MEDAL OF HONOR", isPlaceholder: true },
          { title: "UNCOMMON MEDAL OF HONOR", isPlaceholder: true },
          { title: "RARE MEDAL OF HONOR", isPlaceholder: true },
          { title: "EPIC MEDAL OF HONOR", isPlaceholder: true },
          { title: "LEGENDARY MEDAL OF HONOR", isPlaceholder: true },
        ],
      };
      setRamps(placeholderRamps);
      setEternalMedal(null);
    }
  }, [dots]);
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
  return (
    <div className={Style.dot_wallet}>
      <div className={Style.dot_wallet}>
        {Object.keys(ramps).map((rampKey, index) => (
          ramps[rampKey] && ramps[rampKey].length > 0 && (
            <div key={rampKey} className={Style.dot_wallet}>
              <h2>MEDALS OF HONOR RAMP {index + 1}</h2>
              <DotCarousel medals={ramps[rampKey]} />
            </div>
          )
        ))}
      </div>
      <div className={Style.eternal_dot_card}>
        <h2>ETERNAL MEDAL OF HONOR</h2>
        <div onClick={() => eternalMedal && handleMedalDetails(eternalMedal)} className={Style.card}>
          {eternalMedal ? (
            <VideoPlayer
              videoSrc={eternalMedal.metadata.animation_url}
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
          ) : (
            <div className={Style.placeholder}>
              <p>{eternalMedal?.metadata?.name || "ETERNAL MEDAL OF HONOR"}</p>
              <p>NOT FORGED</p>
            </div>
          )}

          <div onClick={() => handleMedalDetails(eternalMedal)}  className={Style.lower_card}>
            {eternalMedal ? (
              <>
                <small className={Style.token_id}>ID: {eternalMedal.tokenId}</small>
                <small className={Style.dots}>. . .</small>
              </>
            ) : null}
          </div>
        </div>
      </div>
      {selectedMedal && (
        <DotDetailsModal medal={selectedMedal} onClose={() => setSelectedMedal(null)} />
      )}
    </div>
  );
};
export default DotWallet;
