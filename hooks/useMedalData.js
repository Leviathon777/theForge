import { useState, useEffect } from "react";
import { ethers } from "ethers";
import mohCA_ABI from "../Context/mohCA_ABI.json";

const MEDAL_TIERS = [
  {
    title: "COMMON",
    id: 1,
    price: "0.5",
    supply: 10000,
    revenueShare: "10%",
    xdripBonus: "2%",
    xdripThreshold: "0.5% (5,000,000 XdRiP)",
    image: "/img/common.png",
    video: "/videos/common.mp4",
    description:
      "The Common Medal of Honor represents your entry into the XdRiP Digital Management investment ecosystem. Holders gain foundational revenue sharing access and begin building their position within the platform's tiered ownership structure.",
  },
  {
    title: "UNCOMMON",
    id: 2,
    price: "1",
    supply: 5000,
    revenueShare: "25%",
    xdripBonus: "5%",
    xdripThreshold: "0.75% (7,500,000 XdRiP)",
    image: "/img/uncommon.png",
    video: "/videos/uncommon.mp4",
    description:
      "The Uncommon Medal elevates your investment standing with enhanced revenue distribution weighting. This tier recognizes investors who demonstrate deeper commitment to the XdRiP ecosystem and its long-term growth trajectory.",
  },
  {
    title: "RARE",
    id: 3,
    price: "1.5",
    supply: 2500,
    revenueShare: "45%",
    xdripBonus: "7%",
    xdripThreshold: "1.0% (10,000,000 XdRiP)",
    image: "/img/rare.png",
    video: "/videos/rare.mp4",
    description:
      "The Rare Medal signifies an elite investment position within XdRiP Digital Management. With significantly increased revenue weighting and substantial XdRiP token bonuses, Rare holders play a distinguished role in the platform's growth.",
  },
  {
    title: "EPIC",
    id: 4,
    price: "2",
    supply: 1000,
    revenueShare: "70%",
    xdripBonus: "10%",
    xdripThreshold: "1.25% (12,500,000 XdRiP)",
    image: "/img/epic.png",
    video: "/videos/epic.mp4",
    description:
      "The Epic Medal represents a premium investment tier with commanding revenue distribution weight. Epic holders exercise significant influence within the XdRiP ecosystem and benefit from substantial returns on their strategic commitment.",
  },
  {
    title: "LEGENDARY",
    id: 5,
    price: "2.5",
    supply: 1500,
    revenueShare: "100%",
    xdripBonus: "15%",
    xdripThreshold: "1.5% (15,000,000 XdRiP)",
    image: "/img/legendary.png",
    video: "/videos/legendary.mp4",
    description:
      "The Legendary Medal carries the maximum revenue share weight in the platform — a testament to the highest level of investment commitment. Legendary holders sit at the apex of the tiered ownership structure with unmatched distribution priority.",
  },
  {
    title: "ETERNAL",
    id: 6,
    price: "200",
    supply: 20,
    revenueShare: "Global",
    xdripBonus: "N/A",
    xdripThreshold: "N/A",
    image: "/img/eternal.png",
    video: "/videos/eternals.mp4",
    description:
      "The Eternal Medal of Honor is the pinnacle of XdRiP Digital Management ownership. With only 20 in existence, Eternal holders gain a direct, lasting bond with the company's operations — providing access, influence, and global revenue participation reserved for an exclusive circle of strategic partners.",
  },
];

const readProvider = new ethers.providers.JsonRpcProvider(
  "https://bsc-dataseed1.binance.org/"
);

const readOnlyContract = new ethers.Contract(
  mohCA_ABI.address,
  mohCA_ABI.abi,
  readProvider
);

export const useMedalData = () => {
  const [forgedCounts, setForgedCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [
          commonforged, commonRemaining,
          uncommonforged, uncommonRemaining,
          rareforged, rareRemaining,
          epicforged, epicRemaining,
          legendaryforged, legendaryRemaining,
          eternalforged, eternalRemaining,
        ] = await readOnlyContract.getforgedCounts();

        setForgedCounts({
          COMMON: { forged: commonforged.toNumber(), available: commonRemaining.toNumber() },
          UNCOMMON: { forged: uncommonforged.toNumber(), available: uncommonRemaining.toNumber() },
          RARE: { forged: rareforged.toNumber(), available: rareRemaining.toNumber() },
          EPIC: { forged: epicforged.toNumber(), available: epicRemaining.toNumber() },
          LEGENDARY: { forged: legendaryforged.toNumber(), available: legendaryRemaining.toNumber() },
          ETERNAL: { forged: eternalforged.toNumber(), available: eternalRemaining.toNumber() },
        });
      } catch (error) {
        console.error("Error fetching forged counts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const medals = MEDAL_TIERS.map((tier) => ({
    ...tier,
    forged: forgedCounts[tier.title]?.forged || 0,
    available: forgedCounts[tier.title]?.available || tier.supply,
  }));

  const totalForged = Object.values(forgedCounts).reduce(
    (sum, c) => sum + (c.forged || 0),
    0
  );

  const totalSupply = MEDAL_TIERS.reduce((sum, t) => sum + t.supply, 0);

  return { medals, forgedCounts, totalForged, totalSupply, isLoading };
};

export { MEDAL_TIERS };
