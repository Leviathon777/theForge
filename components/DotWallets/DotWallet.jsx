// DotWallet.jsx

import React, { useContext, useEffect, useState, useMemo } from "react";
import Style from "./DotWallet.module.css";
import DotCarousel from "./DotCarousel.jsx";
import Eternal from "./DotEternal.jsx";
import { MyDotDataContext } from '../../Context/MyDotDataContext.js';
import { VideoPlayer, DotDetailsModal, RampDetails } from "../componentsindex.js";
import videos from "../../public/videos/index.js";

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
    if (address && dots && dots.length > 0) {
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
  }, [dots, address]);

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
    const walletAddress = address;
    const baseCost = 0.5;

    // Predefined medal details for lookup
    const medalDetails = [
      { title: "COMMON MEDAL OF HONOR", xdripThreshold: ".5% or 5,000,000 XdRiP", revenueShare: "10%", xdripBonus: "2%" },
      { title: "UNCOMMON MEDAL OF HONOR", xdripThreshold: ".75% or 7,500,000 XdRiP", revenueShare: "25%", xdripBonus: "5%" },
      { title: "RARE MEDAL OF HONOR", xdripThreshold: "1.0% or 10,000,000 XdRiP", revenueShare: "45%", xdripBonus: "7%" },
      { title: "EPIC MEDAL OF HONOR", xdripThreshold: "1.25% or 12,500,000 XdRiP", revenueShare: "70%", xdripBonus: "10%" },
      { title: "LEGENDARY MEDAL OF HONOR", xdripThreshold: "1.5% or 15,000,000 XdRiP", revenueShare: "100%", xdripBonus: "15%" },
      { title: "ETERNAL MEDAL OF HONOR", xdripThreshold: "N/A", revenueShare: "Global", xdripBonus: "N/A" },
    ];

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

        const medalInfo = medalDetails.find((m) => m.title === name) || {
          xdripThreshold: "Unknown",
          revenueShare: "Unknown",
          xdripBonus: "Unknown",
        };

        return {
          id: medal?.tokenId?.toString() || `unknown-${index}`, 
          name: name,
          cost: `${medalCost} BNB`,
          rewardIncome: rewardIncomeTotal ? `${rewardIncomeTotal} BNB` : "N/A",
          creators:
            medal?.metadata?.attributes?.find(
              (attr) => attr.trait_type === "CREATORS"
            )?.value || "Unknown Creators",
          externalUrl: medal?.metadata?.external_url || "No external URL provided",
          xdripThreshold: medalInfo.xdripThreshold,
          revenueShare: medalInfo.revenueShare,
          xdripBonus: medalInfo.xdripBonus,
        };
      }),
    };
    setInfoModalData(rampData);
    setIsInfoModalVisible(true);
  }

    useEffect(() => {
      if (!infoModalData || !infoModalData.medals?.length) {
        setIsInfoModalVisible(false);
      }
    }, [infoModalData]);


    const handleEternalInfo = () => {
      if (!eternalMedal) return;
    
      const walletAddress = address;
    
      const eternalMedalInfo = medalDetails.find((medal) => medal.title === "ETERNAL MEDAL OF HONOR") || {
        xdripThreshold: "Unknown",
        revenueShare: "Unknown",
        xdripBonus: "Unknown",
      };
    
      const eternalData = {
        numberOfMedals: 1,
        totalValueInBNB: 200,
        walletAddress,
        medals: [
          {
            id: eternalMedal.tokenId.toString() || "unknown", 
            name: eternalMedal.metadata.name || "ETERNAL MEDAL OF HONOR",
            cost: "200 BNB",
            rewardIncome: rewardIncomeTotal ? `${rewardIncomeTotal} BNB` : "N/A",
            creators:
              eternalMedal.metadata.attributes?.find(
                (attr) => attr.trait_type === "CREATORS"
              )?.value || "Unknown Creators",
            externalUrl:
              eternalMedal.metadata.external_url || "No external URL provided",
            xdripThreshold: eternalMedalInfo.xdripThreshold,
            revenueShare: eternalMedalInfo.revenueShare,
            xdripBonus: eternalMedalInfo.xdripBonus,
          },
        ],
      };    
      setInfoModalData(eternalData);
      setIsInfoModalVisible(true);
    };

    return (
      <div className={Style.dot_wallet}>
        <div className={Style.dot_wallet}>
          {Object.keys(ramps).map((rampKey, index) => (
            ramps[rampKey] && ramps[rampKey].length > 0 && (
              <div key={rampKey} className={Style.dot_wallet}>
                <div
                  onClick={() => handleRampInfo(rampKey)}
                  style={{ cursor: "pointer" }}
                >
                  <h2>MEDALS OF HONOR RAMP {index + 1}</h2>
                  {ramps[rampKey].some(medal => !medal.isPlaceholder) && (
                    <p style={{ fontSize: "16px", color: "#fff", margin: "5px 0 0", textAlign: "center" }}>
                      Click for details
                    </p>
                  )}
                </div>
                <DotCarousel medals={ramps[rampKey]} />
              </div>
            )
          ))}
        </div>
        <div className={Style.eternal_dot_card}>
          <h2
            onClick={() => eternalMedal && handleEternalInfo()}
            style={{ cursor: eternalMedal ? "pointer" : "default" }}
          >
            ETERNAL MEDAL OF HONOR
          </h2>
          <Eternal medals={eternalMedal ? [eternalMedal] : []} />
          <div>
          </div>
        </div>
        <RampDetails
          isVisible={isInfoModalVisible}
          onClose={() => setIsInfoModalVisible(false)}
          infoModalData={infoModalData}
        />
        {selectedMedal && (
          <DotDetailsModal
            medal={selectedMedal}
            onClose={() => setSelectedMedal(null)}
          />
        )}
      </div>
    );
  };
  export default React.memo(DotWallet);
