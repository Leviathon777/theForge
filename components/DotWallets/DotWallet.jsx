/*
import React, { useContext, useEffect, useState, useCallback, useMemo } from "react";
import Style from "./DotWallet.module.css";
import DotCarousel from "./DotCarousel.jsx";
import { MyDotDataContext } from '../../Context/MyDotDataContext.js';
import { Button, VideoPlayer, DotDetailsModal } from "../componentsindex.js";

import videos from "../../public/videos/index.js"; 

const videoPaths = {
  "COMMON MEDAL OF HONOR": videos.common,
  "UNCOMMON MEDAL OF HONOR": videos.uncommon,
  "RARE MEDAL OF HONOR": videos.rare,
  "EPIC MEDAL OF HONOR": videos.epic,
  "LEGENDARY MEDAL OF HONOR": videos.legendary,
  "ETERNAL MEDAL OF HONOR": videos.eternals,
};




const DotWallet = () => {
  const { dots } = useContext(MyDotDataContext);
  const [ramps, setRamps] = useState({});
  const [selectedMedal, setSelectedMedal] = useState(null);
  const [eternalMedal, setEternalMedal] = useState(null);

  
  const organizeMedalsByRarity = (medals) => {
    const orderedRarity = 
          ["COMMON MEDAL OF HONOR", 
           "UNCOMMON MEDAL OF HONOR", 
           "RARE MEDAL OF HONOR", 
           "EPIC MEDAL OF HONOR", 
           "LEGENDARY MEDAL OF HONOR"
          ];
    const ramps = {};
    let currentRamp = [];
    let rampNumber = 1;
    let eternal = null;
  
    medals.forEach((medal) => {
      if (medal.metadata.name === "ETERNAL MEDAL OF HONOR") {
        eternal = medal;
      } else if (orderedRarity.includes(medal.metadata.name)) {
        currentRamp.push(medal);
  
        if (currentRamp.length === 5) {
          const rampKey = `ramp${rampNumber}`;
          ramps[rampKey] = currentRamp;
          currentRamp = [];
          rampNumber++;
        }
      }
    });
  
    if (currentRamp.length > 0) {
      ramps[`ramp${rampNumber}`] = currentRamp;
    }
  
    console.log("Organized Ramps:", ramps);
    console.log("Eternal Medal:", eternal);
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
              videoSrc={videoPaths[eternalMedal.metadata.name]}
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
export default React.memo(DotWallet);
*/



import React, { useContext, useEffect, useState } from "react";
import Style from "./DotWallet.module.css";
import DotCarousel from "./DotCarousel.jsx";
import { MyDotDataContext } from '../../Context/MyDotDataContext.js';
import { VideoPlayer, DotDetailsModal } from "../componentsindex.js";
import videos from "../../public/videos/index.js";
import mohAddress from "../../Context/mohCA_ABI.json"

const videoPaths = {
  "COMMON MEDAL OF HONOR": videos.common,
  "UNCOMMON MEDAL OF HONOR": videos.uncommon,
  "RARE MEDAL OF HONOR": videos.rare,
  "EPIC MEDAL OF HONOR": videos.epic,
  "LEGENDARY MEDAL OF HONOR": videos.legendary,
  "ETERNAL MEDAL OF HONOR": videos.eternals,
};

const DotWallet = () => {
  const { dots } = useContext(MyDotDataContext);
  const [ramps, setRamps] = useState({});
  const [selectedMedal, setSelectedMedal] = useState(null);
  const [eternalMedal, setEternalMedal] = useState(null);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [infoModalData, setInfoModalData] = useState({});

  const organizeMedalsByRarity = (medals) => {
    const orderedRarity = [
      "COMMON MEDAL OF HONOR",
      "UNCOMMON MEDAL OF HONOR",
      "RARE MEDAL OF HONOR",
      "EPIC MEDAL OF HONOR",
      "LEGENDARY MEDAL OF HONOR",
    ];
    const ramps = {};
    let currentRamp = [];
    let rampNumber = 1;
    let eternal = null;

    medals.forEach((medal) => {
      if (medal.metadata.name === "ETERNAL MEDAL OF HONOR") {
        eternal = medal;
      } else if (orderedRarity.includes(medal.metadata.name)) {
        currentRamp.push(medal);

        if (currentRamp.length === 5) {
          const rampKey = `ramp${rampNumber}`;
          ramps[rampKey] = currentRamp;
          currentRamp = [];
          rampNumber++;
        }
      }
    });

    if (currentRamp.length > 0) {
      ramps[`ramp${rampNumber}`] = currentRamp;
    }

    return { ramps, eternal };
  };

  useEffect(() => {
    if (dots && dots.length > 0) {
      const { ramps: organizedRamps, eternal } = organizeMedalsByRarity(dots);
      setRamps(organizedRamps);
      setEternalMedal(eternal);
    }
  }, [dots]);

  const handleRampInfo = (rampKey) => {
    const medals = ramps[rampKey];
    const walletAddress = "0x123...ABC"; // Replace with actual wallet address if available
    contractAddress: mohAddress.address;
    const baseCost = 0.5;
    const rampData = {
      numberOfMedals: medals.length,
      totalValueInBNB: medals.reduce((total, _, index) => total + (medals[index].metadata.name === "ETERNAL MEDAL OF HONOR" ? 200 : baseCost + index * 0.5), 0),
      walletAddress: walletAddress,
      medals: medals.map((medal, index) => {
        const medalCost = medal.metadata.name === "ETERNAL MEDAL OF HONOR" ? 200 : baseCost + index * 0.5;
        return {
          id: medal.tokenId,
          name: medal.metadata.name,
          cost: `${medalCost} BNB`,
          rewardIncome: medal.metadata.attributes.find(attr => attr.trait_type === "Reward")?.value || "N/A",
          xdripRewards: "50 XdRiP", // Placeholder
          revenueShare: "20%", // Placeholder
          otherIncome: "10%", // Placeholder
        };
      }),
    };
    setInfoModalData(rampData);
    setIsInfoModalVisible(true);
  };
  

  return (
    <div className={Style.dot_wallet}>
      <div className={Style.dot_wallet}>
        {Object.keys(ramps).map((rampKey, index) => (
          ramps[rampKey] && ramps[rampKey].length > 0 && (
            <div key={rampKey} className={Style.dot_wallet}>
              <h2 onClick={() => handleRampInfo(rampKey)} style={{ cursor: "pointer" }}>
                MEDALS OF HONOR RAMP {index + 1}
              </h2>
              <DotCarousel medals={ramps[rampKey]} />
            </div>
          )
        ))}
      </div>

      <div className={Style.eternal_dot_card}>
        <h2>ETERNAL MEDAL OF HONOR</h2>
        <div onClick={() => eternalMedal && setSelectedMedal(eternalMedal)} className={Style.card}>
          {eternalMedal ? (
            <VideoPlayer
              videoSrc={videoPaths[eternalMedal.metadata.name]}
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
        </div>
      </div>

      {isInfoModalVisible && (
  <div className={Style.infoModal}>
    <div className={Style.infoModalContent}>
      <h3>Ramp Information</h3>
      <p><strong>Wallet Address:</strong> {infoModalData.walletAddress}</p>
      <p><strong>Number of Medals:</strong> {infoModalData.numberOfMedals}</p>
      <p><strong>Total Value:</strong> {infoModalData.totalValueInBNB.toFixed(2)} BNB</p>
      <ul className={Style.medalList}>
        {infoModalData.medals.map((medal) => (
          <li key={medal.id} className={Style.medalItem}>
            <div>
              <p><strong>ID:</strong> {medal.id}</p>
              
              {/*
              <p><strong>CA:</strong> {mohAddress.address}</p>
              */}

              <p><strong>Name:</strong> {medal.name}</p>
              <p><strong>Cost:</strong> {medal.cost}</p>
              <p><strong>Total Value:</strong> {medal.totalValueInBNB}</p>
            </div>
            <div>
              <p><strong>XdRiP Rewards:</strong> {medal.xdripRewards}</p>
              <p><strong>Revenue Share:</strong> {medal.revenueShare}</p>
              <p><strong>Other Income:</strong> {medal.otherIncome}</p>
              <p><strong>Reward Income:</strong> {medal.rewardIncome}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className={Style.closeButtonContainer}>
        <button onClick={() => setIsInfoModalVisible(false)}>Close</button>
      </div>
    </div>
  </div>
)}

      {selectedMedal && (
        <DotDetailsModal medal={selectedMedal} onClose={() => setSelectedMedal(null)} />
      )}
    </div>
  );
};

export default React.memo(DotWallet);
