import React, { useContext, useEffect, useState } from "react";
import Style from "./DotWallet.module.css";
import DotCarousel from "./DotCarousel.jsx";
import { MyDotDataContext } from '../../Context/MyDotDataContext.js';
import { VideoPlayer, DotDetailsModal, RampDetails } from "../componentsindex.js";
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

const DotWallet = ({ address, rewardIncomeTotal }) => {
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
    console.log("Dots data:", dots);
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

  const handleRampInfo = (rampKey) => {
    const medals = ramps[rampKey];
    if (
      !medals ||
      medals.length === 0 ||
      medals.every((medal) => medal.isPlaceholder)
    ) {
      console.warn(`No real medals found for ramp key: ${rampKey}`);
      return;
    }
    const walletAddress = (address);
    const baseCost = 0.5;

    const rampData = {
      numberOfMedals: medals.length,
      totalValueInBNB: medals.reduce((total, medal, index) => {
        const name = medal?.metadata?.name || "Unknown Medal";
        const cost = name === "ETERNAL MEDAL OF HONOR" ? 200 : baseCost + index * 0.5;
        return total + cost;
      }, 0),
      walletAddress,
      medals: medals.map((medal, index) => {
        const name = medal?.metadata?.name || "Unknown Medal";
        const medalCost =
          name === "ETERNAL MEDAL OF HONOR" ? 200 : baseCost + index * 0.5;
        return {
          id: medal?.tokenId || `unknown-${index}`,
          name: name,
          cost: `${medalCost} BNB`,
          rewardIncome: rewardIncomeTotal
            ? `${rewardIncomeTotal} BNB`
            : "N/A",
          creators:
            medal?.metadata?.attributes?.find(
              (attr) => attr.trait_type === "CREATORS"
            )?.value || "Unknown Creators",
          /* description: medal?.metadata?.description || "No description available",
           animationUrl: medal?.metadata?.animation_url || "No animation available",*/
          externalUrl: medal?.metadata?.external_url || "No external URL provided",
          xdripRewards: "50 XdRiP",
          revenueShare: "20%",
          otherIncome: "10%",
        };
      }),
    };
    setInfoModalData(rampData);
    setIsInfoModalVisible(true);
  };


  useEffect(() => {
    if (!infoModalData || !infoModalData.medals?.length) {
      setIsInfoModalVisible(false);
    }
  }, [infoModalData]);


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
      <RampDetails
        isVisible={isInfoModalVisible}
        onClose={() => setIsInfoModalVisible(false)}
        infoModalData={infoModalData}
      />

      {selectedMedal && (
        <DotDetailsModal medal={selectedMedal} onClose={() => setSelectedMedal(null)} />
      )}
    </div>
  );
};

export default React.memo(DotWallet);
