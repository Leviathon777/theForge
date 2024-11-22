import React, { useState, useEffect, useRef, useContext } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ConnectWallet,
  darkTheme,
  useAddress,
  useConnect,
  useWallet,
  localWallet,
  useSigner,
} from "@thirdweb-dev/react";
import { MyDotDataContext } from "../../Context/MyDotDataContext.js";
import Style from "./theForge.module.css";
import moreStyles from "../Button/Button.module.css";
import videos from "../../public/videos/index.js";
import { Button, VideoPlayer, DotDetailsModal, WalkthroughModal, CheckoutModal } from "../componentsindex.js";
import { ethers } from "ethers";
import mohCA_ABI from "../../Context/mohCA_ABI.json";
import ipfsHashes from "../../Context/ipfsHashes.js";
import Web3 from "web3";
import xdripCA_ABI from "../../Context/xdripCA_ABI.json";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { useSwipeable } from 'react-swipeable';
import { getForger, addForger, logMedalPurchase, sendReceiptEmail, trackDetailedTransaction } from "../../firebase/forgeServices";
const MohAddress = mohCA_ABI.address;
const MohABI = mohCA_ABI.abi;
const fetchMohContract = (signerOrProvider) =>
  new ethers.Contract(MohAddress, MohABI, signerOrProvider);
const XdRiPContractAddress = xdripCA_ABI.address;
const XdRiPContractABI = xdripCA_ABI.abi;
const web3 = new Web3("https://bsc-dataseed.binance.org/");
const XdRiPContract = new web3.eth.Contract(XdRiPContractABI, XdRiPContractAddress);


const TheForge = () => {
  const [selectedMedal, setSelectedMedal] = useState(null);
  const [bnbBalance, setBnbBalance] = useState(null);
  const [bnbToUsd, setBnbToUsd] = useState(null);
  const [rewardStatus, setRewardStatus] = useState(null);
  const [xdripBalance, setXdripBalance] = useState(null);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const { dots, fetchDots } = useContext(MyDotDataContext);
  const [isBNBPrice, setIsBNBPrice] = useState(true);
  const [currentMedal, setCurrentMedal] = useState(null);
  const wallet = useWallet();
  const isGuestWallet = wallet?.walletId === "SmartWallet";
  const address = useAddress();
  const signer = useSigner();
  const [forgedCounts, setForgedCounts] = useState({});
  const connectLocalWallet = useConnect(localWallet);
  const carouselRef = useRef();
  const cardRefs = useRef([]);
  const controls = useAnimation();
  const [currentAccount, setCurrentAccount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const handleWalletConnect = async () => {
      if (address) {
        setCurrentAccount(address);
        console.log(`Wallet connected: ${address}`);        
        try {
          const userData = await getForger(address);
          if (userData) {
            setCurrentUser(userData);
            console.log("User info fetched successfully:", userData);
          } else {
            console.log("No user info available. Proceeding without user info.");
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      } else {
        setCurrentAccount("");
        setCurrentUser(null);
      }
    };  
    handleWalletConnect();
  }, [address]);

  const mohData = [
    { title: "COMMON", id: 1, price: "0.5 BNB", description: "Common Medal, forged in the fires of battle, honors the unwavering courage and steadfast determination of XdRiP warriors. This emblem recognizes those who consistently face adversity with resilience and commitment, playing a foundational role within the XdRiP community. Bearing this medal signifies a warrior’s dedication to the cause and their readiness to uphold the strength and integrity of our ranks in every challenge they encounter.", revenueAccess: "10%", xdripBonus: "2%", medalVideo: videos.common, ipfsHash: ipfsHashes.find((hash) => hash.title === "COMMON").url, inventory: { forged: 0, available: 10000, }, },
    { title: "UNCOMMON", id: 2, price: "1 BNB", description: "Uncommon Medal, meticulously crafted by master artisans, symbolizes the exceptional strength and valor of XdRiP warriors who transcend the ordinary. This prestigious emblem honors individuals who demonstrate superior skills and unwavering bravery in the face of formidable challenges. Holding this medal signifies a distinguished place within the XdRiP community, acknowledging those who strive to exceed expectations and lead by remarkable example.", revenueAccess: "25%", xdripBonus: "5%", medalVideo: videos.uncommon, ipfsHash: ipfsHashes.find((hash) => hash.title === "UNCOMMON").url, inventory: { forged: 0, available: 5000, }, },
    { title: "RARE", id: 3, price: "1.5 BNB", description: "Rare Medal, forged from rare and precious metals, stands as a testament to the elite few who exhibit unparalleled bravery and honor within the XdRiP ranks. This distinguished emblem recognizes warriors who achieve extraordinary feats, showcasing exceptional prowess and unwavering dedication. Possessing this medal signifies an esteemed status and highlights significant contributions to the enduring mission of XdRiP, celebrating those who consistently go above and beyond.", revenueAccess: "45%", xdripBonus: "7%", medalVideo: videos.rare, ipfsHash: ipfsHashes.find((hash) => hash.title === "RARE").url, inventory: { forged: 0, available: 2500, }, },
    { title: "EPIC", id: 4, price: "2 BNB", description: "Epic Medal, wrought with mystical powers, signifies the legendary feats accomplished by the most heroic and mighty of XdRiP warriors. This extraordinary emblem honors individuals who demonstrate remarkable heroism and strategic brilliance in the most challenging battles. Bearing this medal marks a warrior as a legend within our ranks, celebrated for their enduring impact and heroic legacy that shapes the destiny of XdRiP through unmatched valor and tactical genius", revenueAccess: "70%", xdripBonus: "10%", medalVideo: videos.epic, ipfsHash: ipfsHashes.find((hash) => hash.title === "EPIC").url, inventory: { forged: 0, available: 1000, }, },
    { title: "LEGENDARY", id: 5, price: "2.5 BNB", description: "Legendary Medal, forged by the XdRiP Gods themselves, embodies the ultimate achievement in battle—a rare honor bestowed solely upon the greatest heroes of all time within the XdRiP legacy. This unparalleled emblem recognizes warriors who transcend the ordinary, leaving an indelible mark through extraordinary actions and unwavering dedication. Holding this medal signifies a legacy of greatness and an everlasting bond with the very essence of XdRiP’s heroic spirit.", revenueAccess: "100%", xdripBonus: "15%", medalVideo: videos.legendary, ipfsHash: ipfsHashes.find((hash) => hash.title === "LEGENDARY").url, inventory: { forged: 0, available: 500, }, },
    { title: "ETERNAL", id: 6, price: "200 BNB", description: "Forged in celestial fires, The Eternal DOT embodies a bond of absolute strength with XdRiP Digital Management LLC, reserved for those who seek influence beyond the ordinary. This singular emblem bestows an authority that extends deeply into our realm, empowering its holders with a lasting presence and rare access to the inner sanctum of XdRiP’s vision. As custodians of this legacy, they stand unmatched in their role, helping to shape the future with every step.", revenueAccess: "Global", xdripBonus: "N/A", medalVideo: videos.eternals, ipfsHash: ipfsHashes.find((hash) => hash.title === "ETERNAL").url, inventory: { forged: 0, available: 20, }, },];
  const togglePrice = () => {
    setIsBNBPrice(!isBNBPrice);
  };
  const fetchXDRIPBalance = async () => {
    try {
      const balance = await XdRiPContract.methods.balanceOf(address).call();
      console.log("Raw balance (in Wei):", balance);
      const formattedBalance = balance / (10 ** 9);
      const finalDisplayBalance = parseFloat(formattedBalance).toFixed(0);
      console.log("Displayed XDRIP balance:", finalDisplayBalance);
      setXdripBalance(finalDisplayBalance);
    } catch (error) {
      console.error("Error retrieving XDRIP balance:", error);
      setXdripBalance("Error fetching balance");
    }
  };
  useEffect(() => {
    if (address) {
      fetchXDRIPBalance();
    }
  }, [address]);
  const lens = 500;
  const rotationStep = 360 / mohData.length;
  const [currentRotation, setCurrentRotation] = useState(0);
  useEffect(() => {
    cardRefs.current.forEach((card, i) => {
      const angle = rotationStep * i;
      card.style.transform = `rotateY(${angle}deg) translateZ(${lens}px)`;
    });
  }, [mohData.length]);
  useEffect(() => {
    controls.start({
      rotateY: [0, 360],
      transition: {
        ease: "linear",
        duration: 30,
        repeat: Infinity,
      },
    });
    return () => controls.stop();
  }, [controls]);
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleArrowClick("right"),
    onSwipedRight: () => handleArrowClick("left"),
    onTap: (eventData) => {
      const tappedCard = eventData.event.target.closest(`.${Style.card}`);
      if (tappedCard) {
        const index = cardRefs.current.indexOf(tappedCard);
        if (index !== -1) {
          handleCardClick(index);
        }
      }
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });
  
  const handleArrowClick = (direction) => {
    controls.stop();

    const remainder = currentRotation % rotationStep;
    const closestRotationAdjustment = remainder > rotationStep / 2 ? rotationStep - remainder : -remainder;

    const delta = direction === "right" ? -rotationStep : rotationStep;
    const targetRotation = currentRotation + closestRotationAdjustment + delta;


    setCurrentRotation(targetRotation);
    controls.start({
      rotateY: targetRotation,
      transition: { duration: 1, ease: "easeInOut" },
    });
  };
  const handleCardClick = (index) => {
    controls.stop();  
    const targetRotation = -rotationStep * index;
    setCurrentRotation(targetRotation);
  
    controls.start({
      rotateY: targetRotation,
      transition: { duration: 1, ease: "easeInOut" },
    });
  };
  
  useEffect(() => {
    const fetchBNBPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd');
        const data = await response.json();
        const bnbPriceInUsd = data.binancecoin.usd;
        setBnbToUsd(bnbPriceInUsd);
      } catch (error) {
        console.error("Error fetching BNB price:", error);
      }
    };
    fetchBNBPrice();
    const interval = setInterval(fetchBNBPrice, 60000);
    return () => clearInterval(interval);
  }, []);
  const handleMedalDetails = (medal) => {
    setSelectedMedal(medal);
  };
  useEffect(() => {
    const fetchBalance = async () => {
      if (signer && address) {
        const provider = signer.provider;
        if (!provider) {
          console.error("Provider is missing!");
          return;
        }
        try {
          const balance = await provider.getBalance(address);
          const formattedBalance = ethers.utils.formatEther(balance);
          console.log("BNB Balance:", formattedBalance);
          setBnbBalance(formattedBalance);
        } catch (error) {
          console.error("Error fetching BNB balance:", error);
        }
      }
    };
    fetchBalance();
  }, [signer, address]);
  const fetchForgedCounts = async () => {
    if (!signer) return;
    try {
      const contract = fetchMohContract(signer);
      const [
        commonForged, commonRemaining,
        uncommonForged, uncommonRemaining,
        rareForged, rareRemaining,
        epicForged, epicRemaining,
        legendaryForged, legendaryRemaining,
        eternalForged, eternalRemaining
      ] = await contract.getForgedCounts();
      return {
        COMMON: { forged: commonForged.toNumber(), available: commonRemaining.toNumber() },
        UNCOMMON: { forged: uncommonForged.toNumber(), available: uncommonRemaining.toNumber() },
        RARE: { forged: rareForged.toNumber(), available: rareRemaining.toNumber() },
        EPIC: { forged: epicForged.toNumber(), available: epicRemaining.toNumber() },
        LEGENDARY: { forged: legendaryForged.toNumber(), available: legendaryRemaining.toNumber() },
        ETERNAL: { forged: eternalForged.toNumber(), available: eternalRemaining.toNumber() },
      };
    } catch (error) {
      console.error("Error fetching forged counts:", error);
      return null;
    }
  };
  useEffect(() => {
    const loadForgedCounts = async () => {
      const counts = await fetchForgedCounts();
      if (counts) {
        setForgedCounts(counts);
      }
    };
    if (signer) {
      loadForgedCounts();
    }
  }, [signer]);
  const getInventory = (item) => {
    if (forgedCounts && forgedCounts[item.title]) {
      return {
        forged: forgedCounts[item.title].forged,
        available: forgedCounts[item.title].available,
      };
    }
    return item.inventory;
  };
  const confirmForge = async () => {
    if (!currentMedal) return;
    try {
      if (!signer) {
        toast.error("Signer not available. Please connect your wallet.");
        return;
      }
      const contract = fetchMohContract(signer);
      const ipfsHash = currentMedal.ipfsHash;
      const itemPrice = currentMedal.price.split(" ")[0];
      const price = ethers.utils.parseUnits(itemPrice, "ether");
      const forgeFunction = contract[`forge${currentMedal.title}`];
      const transaction = await forgeFunction(ipfsHash, {
        value: price,
      });
      const receipt = await transaction.wait();
      if (receipt.status === 1) {
        toast.success("Your Medal Of Honor was forged successfully!");
        await fetchDots();
        const updatedCounts = await fetchForgedCounts();
        if (updatedCounts) {
          setForgedCounts(updatedCounts);
        }
      } else {
        toast.error("Transaction failed. Please try again.");
      }
    } catch (error) {
      console.error("Forging failed:", error);
      toast.error("Error while forging Medal.");
    } finally {
      setIsConfirmationModalVisible(false);
      setCurrentMedal(null);
    }
  };

  const handleUserInfoSubmit = async (info) => {
    if (!address) {
        console.error("Wallet address is not available.");
        return;
    }
    try {
        const dateOfJoin = new Date();
        await addForger(address, info.email, info.name, info.agreed, dateOfJoin);
        setUserInfo({ ...info, dateOfJoin });
        console.log("Forger info collected and saved:", { ...info, dateOfJoin });
    } catch (error) {
        console.error("Error adding forger:", error);
        toast.error("Failed to save your information. Please try again.");
    }
};

  
/*
  const handleForgeClick = (medalType, ipfsHash, revenueAccess, xdripBonus) => {
    if (!userInfo) {
      setIsUserInfoModalOpen(true);
    } else {
      forge(medalType, ipfsHash, revenueAccess, xdripBonus);
    }
  };
  */

  const handleForgeClick = async (medalType, ipfsHash, revenueAccess, xdripBonus) => {
    if (!address) {
      // Trigger wallet connection when no wallet is connected
      toast.info("Please connect your wallet to proceed.");
      connectLocalWallet();
      return;
    }
  
    if (!userInfo) {
      setIsUserInfoModalOpen(true); // Open user info modal if required
    } else {
      forge(medalType, ipfsHash, revenueAccess, xdripBonus);
    }
  };
  


  const forge = async (medalType, ipfsHash, revenueAccess, xdripBonus) => {
    if (!userInfo) {
      console.error("User info not provided!");
      return;
    }
    try {
      console.log("Forging medal of type:", medalType);
      if (!signer) {
        toast.error("Signer not available. Please connect your wallet.");
        return;
      }
      if (!address) {
        toast.error("No address found. Please connect your wallet.");
        return;
      }
      const provider = signer.provider;
      if (!provider) {
        toast.error("Provider is missing. Please reconnect your wallet.");
        console.log("Provider is missing!");
        return;
      }
      const contract = fetchMohContract(signer);
      console.log("Connected to contract at:", MohAddress);
      switch (medalType) {
        case "COMMON":
          break;
        case "UNCOMMON":
          const ownsCommon = await contract.balanceOf(address);
          if (ownsCommon.toNumber() < 1) {
            toast.error("You must own a COMMON medal to forge an UNCOMMON medal.");
            return;
          }
          break;
        case "RARE":
          const ownsUncommon = await contract.balanceOf(address);
          if (ownsUncommon.toNumber() < 2) {
            toast.error("You must own an UNCOMMON medal to forge a RARE medal.");
            return;
          }
          break;
        case "EPIC":
          const ownsRare = await contract.balanceOf(address);
          if (ownsRare.toNumber() < 3) {
            toast.error("You must own a RARE medal to forge an EPIC medal.");
            return;
          }
          break;
        case "LEGENDARY":
          const ownsEpic = await contract.balanceOf(address);
          if (ownsEpic.toNumber() < 4) {
            toast.error("You must own an EPIC medal to forge a LEGENDARY medal.");
            return;
          }
          break;
        case "ETERNAL":
          break;
        default:
          throw new Error("Invalid medal type");
      }
      const itemPrice = mohData.find((item) => item.title === medalType).price.split(" ")[0];
      const price = ethers.utils.parseUnits(itemPrice, "ether");
      let forgeFunction;
      switch (medalType) {
        case "COMMON":
          forgeFunction = contract.forgeCommon;
          break;
        case "UNCOMMON":
          forgeFunction = contract.forgeUncommon;
          break;
        case "RARE":
          forgeFunction = contract.forgeRare;
          break;
        case "EPIC":
          forgeFunction = contract.forgeEpic;
          break;
        case "LEGENDARY":
          forgeFunction = contract.forgeLegendary;
          break;
        case "ETERNAL":
          forgeFunction = contract.forgeEternal;
          break;
        default:
          throw new Error("Invalid medal type");
      }
      let gasLimit;
      try {
        const estimatedGas = await contract.estimateGas[forgeFunction.name](ipfsHash, { value: price });
        gasLimit = estimatedGas.add(ethers.BigNumber.from(10000));
        console.log("Estimated gas:", gasLimit.toString());
      } catch (error) {
        console.error("Gas estimation failed. Falling back ");
        gasLimit = ethers.BigNumber.from(990000);
      }
      const transaction = await forgeFunction(ipfsHash, {
        value: price,
        gasLimit,
      });
      console.log("Transaction sent:", transaction);
      const receipt = await transaction.wait();
      console.log("Transaction Confirmed:", receipt);
      if (receipt.status === 1) {
        toast.success("Your Medal Of Honor was forged successfully!");
        await fetchDots();
        await logMedalPurchase(address, medalType, itemPrice, transaction.hash, revenueAccess, xdripBonus);
        await sendReceiptEmail(
          userInfo.email,
          userInfo.name,
          medalType,
          itemPrice,
          transaction.hash
        );
        const transactionData = {
          transactionHash: receipt.transactionHash,
          status: "Success",
          blockNumber: receipt.blockNumber,
          timestamp: new Date(),
          action: `Forge ${medalType}`,
          from: address,
          to: MohAddress,
          valueBNB: ethers.utils.formatEther(ethers.utils.parseUnits(itemPrice, "ether")),
          gasUsed: receipt.gasUsed?.toNumber(),
          inputData: transaction.data,
          revenuePrecent: revenueAccess,
          xdripBonusPercent: xdripBonus,
        };

        await trackDetailedTransaction(address, medalType, transactionData);
      } else {
        toast.error("Transaction failed. Please try again.");
      }
    } catch (error) {
      console.error("Forging failed:", error);
      if (error.code === 4001) {
        toast.error("You rejected the transaction.");
      } else if (error.data && error.data.message) {
        const errorMessage = error.data.message.includes("revert")
          ? error.data.message.split("revert ")[1]
          : error.data.message;
        toast.error(`Error: ${errorMessage}`);
      } else {
        toast.error("Error while forging Medal.");
      }
    }
  };
  const [showArrows, setShowArrows] = useState(true);
  useEffect(() => {
    const updateArrowsVisibility = () => {
      if (window.innerWidth < 768) {
        setShowArrows(false);
      } else {
        setShowArrows(true);
      }
    };
    updateArrowsVisibility();
    window.addEventListener('resize', updateArrowsVisibility);
    return () => {
      window.removeEventListener('resize', updateArrowsVisibility);
    };
  }, []);



  const [medalCount, setMedalCount] = useState(0);
  const fetchMedalCount = async (userAddress) => {
    if (!signer) return;
    try {
      const contract = fetchMohContract(signer);
      const count = await contract.balanceOf(userAddress);
      setMedalCount(count.toNumber());
    } catch (error) {
      console.error("Error fetching medal count:", error);
      setMedalCount(0);
    }
  };



  useEffect(() => {
    if (address) {
      setCurrentAccount(address);
      fetchMedalCount(address);
    } else {
      setCurrentAccount("");
    }
  }, [address]);



  const fetchForgedCountsForAddress = async (address) => {
    if (!signer) return;
    try {
      const contract = fetchMohContract(signer);
      const counts = await contract.getForgedCountsForAddress(address);
      setMedalCount(counts);
    } catch (error) {
      console.error("Error fetching forged counts for address:", error);
    }
  };

  useEffect(() => {
    if (address) {
      fetchForgedCountsForAddress(address);
    }
  }, [address]);






  return (
    <div className={Style.the_forge}>
      <div className={Style.the_forge_wrapper}>
        <div className={Style.forge_button_upper}>
          <h1 className={Style.lore_text}>MEDALS OF HONOR VAULT</h1>
          <div className={Style.forge_button_wrapper}>
            <Button
              btnName="WALLET TUTORIALS"
              onClick={() => setIsModalOpen(true)}
              className={Style.openWalkthroughButton}
              fontSize="inherit"
              paddingLeft="0"
              paddingRight="0"
              isActive={false}
            />

            <ConnectWallet
              btnTitle="OPEN THE VAULT"
              style={{
                background: 'linear-gradient(145deg, #0d0d0d, #1a1a1a)',
                color: 'white',
                border: '2px solid #1c1c1c',
                borderRadius: '12px',
                boxShadow: 'inset 0px 0px 10px rgba(255, 255, 255, 0.1), 0px 5px 15px rgba(0, 0, 0, 0.7)',
                transition: 'all 0.3s ease',
                padding: '0',
                width: '240px',
                height: '52px',
                cursor: 'pointer',
                textAlign: 'center',
                textTransform: 'uppercase',
                fontSize: '20px',
                textShadow: '0px 0px 2px black',
                backgroundImage: 'linear-gradient(145deg, rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0.7))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}

              detailsBtn={() => {
                return (
                  <button
                    className={Style.genericInfoBox}
                    style={{ backgroundColor: "transparent" }}
                  >
                    <div
                      style={{
                        background: 'linear-gradient(145deg, #0d0d0d, #1a1a1a)',
                        color: 'white',
                        border: '2px solid #1c1c1c',
                        borderRadius: '12px',
                        boxShadow: 'inset 0px 0px 10px rgba(255, 255, 255, 0.1), 0px 5px 15px rgba(0, 0, 0, 0.7)',
                        transition: 'all 0.3s ease',
                        padding: '0',
                        width: '240px',
                        height: '52px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        fontSize: '20px',
                        textShadow: '0px 0px 2px black',
                        backgroundImage: 'linear-gradient(145deg, rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0.7))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <div>
                        <p style={{ fontSize: "small", color: "lightgray", marginTop: "14px", marginLeft: "20px" }}>
                          {`${medalCount} Medals Found`}
                        </p>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <p
                            style={{
                              fontSize: "medium",
                              marginBottom: "4px",
                              marginTop: "0",
                              maxWidth: "160px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              color: "white",
                            }}
                          >
                          </p>
                        </div>
                        <p
                          style={{
                            color: "white",
                            fontSize: "10px",
                            marginTop: "-10px",
                            marginLeft: "18px",
                          }}
                        >
                          {currentAccount.slice(0, 4) +
                            " . . . . " +
                            currentAccount.slice(-4)}
                        </p>

                      </div>
                      <div
                        style={{
                          marginLeft: "10px",
                          display: "flex",
                          alignItems: "center",
                          paddingLeft: "5px",
                          marginBottom: "10px",
                        }}
                      >

                        <Image
                          src="/img/mohwallet-logo.png"
                          alt="MOH"
                          width="30"
                          height="30"
                        />


                      </div>
                    </div>
                  </button>
                );
              }}
              className={`${moreStyles.btn}`}
              modalTitle="ACCESS  OPTIONS"
              theme={darkTheme({
                colors: {
                  modalBg: "linear-gradient(145deg, rgba(42, 42, 42, 0.4), rgba(28, 28, 28, 0.4))",
                },
              })}

              modalSize={"wide"}
              switchToActiveChain={true}
              termsOfServiceUrl="/components/Legal/TermsOfService.jsx"
              privacyPolicyUrl="/components/Legal/UserAgreement.jsx"
              ThirdwebBranding={false}
              welcomeScreen={{
                title: " ",
                subtitle: " ",
                img: {
                  src: "/img/mohwalletmodal.png",
                  width: 420,
                  height: 420,
                },

              }}

            />
          </div>

          {address && (
            <div className={Style.balances}>
              <Button
                btnName={`XDRIP Balance: ${xdripBalance !== null ? `${xdripBalance} XDRIP` : "Loading..."}`}
                onClick={() => window.open('https://poocoin.app/tokens/0x905a46de6f99b6efc5fa062ab398153048e121ea', '_blank')}
                fontSize="inherit"
                paddingLeft="0"
                paddingRight="0"
                isActive={false}
              />
            </div>
          )}
        </div>
        <div className={Style.carousel}>
          <div className={Style.carousel_wrapper}>
            <motion.div
              ref={carouselRef}
              className={Style.carousel_container}
              animate={controls}
              {...swipeHandlers}
            >
              {mohData.map((item, index) => (
                <div
                  key={index}
                  ref={(el) => (cardRefs.current[index] = el)}
                  className={Style.card}
                  onClick={() => handleCardClick(index)}
                >
                  <div className={Style.card_inner}>
                    <div className={`${Style.card_face} ${Style.card_front}`}>
                      <div className={Style.card_right}>
                        <h2>{item.title}</h2>
                        <div className={Style.card_right_top}>
                          <VideoPlayer
                            videoSrc={item.medalVideo}
                            playsInline
                            videoStyles={{
                              width: "100%",
                              borderRadius: '40px'
                            }}

                            hoverPlay={true}
                            autoPlay={true}
                            loop={true}
                            hoverGrow={true}
                            borderRadius="40px"
                            disableInternalModal={false}
                          />
                        </div>
                        <div className={Style.card_right_bottom}>
                          <div className={Style.card_right_bottom_bidding}>
                            <div className={Style.card_right_bottom_bidding_box_timer}>
                              <div className={Style.card_right_bottom_bidding_box_timer_item}>
                                <span>FORGED</span>
                                <p>{getInventory(item).forged} OF</p>
                                <p>{getInventory(item).available}</p>
                              </div>
                            </div>
                            <div className={Style.button_wrapper}>
                              <Button
                                btnName="FORGE"
                                onClick={() => handleForgeClick(item.title, item.ipfsHash, item.revenueAccess, item.xdripBonus)}
                                classStyle="size1"
                                fontSize="12px"
                                padding="0px 0px"
                                isActive={false}
                                setIsActive={() => { }}
                                title="Forge Medal"
                                imageWidth={50}
                                imageHeight={50}
                                icon=""
                              />
                              <div className={Style.card_right_bottom_bidding_box_timer_item_box}>
                                <small className={Style.card_right_bottom_bidding_box_timer_item_small}>
                                  Valuation
                                  <FontAwesomeIcon
                                    icon={faSyncAlt}
                                    onClick={togglePrice}
                                    className={Style.toggle_price_icon}
                                    title="Switch Currency"
                                  />
                                </small>
                                <p
                                  className={Style.card_right_bottom_bidding_box_timer_item_price}
                                  title={`$${bnbToUsd ? (parseFloat(item.price) * bnbToUsd).toFixed(2) : 'Loading...'} USD`}
                                >
                                  {isBNBPrice
                                    ? `${item.price}`
                                    : `$${bnbToUsd ? (parseFloat(item.price) * bnbToUsd).toFixed(2) : 'Loading...'} USD`
                                  }
                                </p>
                              </div>
                              <Button
                                btnName="DETAILS"
                                onClick={() => handleMedalDetails(item)}
                                paddingLeft="default"
                                paddingRight="default"
                                fontSize="12px"
                                isActive={false}
                                setIsActive={() => { }}
                                title="Medal Details"
                                imageWidth={50}
                                imageHeight={50}
                                icon=""
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={`${Style.card_side} ${Style.side_top}`}></div>
                    <div className={`${Style.card_side} ${Style.side_bottom}`}></div>
                    <div className={`${Style.card_side} ${Style.card_left_side}`}>
                      <div className={Style.card_rside_text}>XDRIP MEDALS OF HONOR COLLECTION</div>
                    </div>
                    <div className={`${Style.card_side} ${Style.card_right_side}`}>
                      <div className={Style.card_lside_text}>XDRIP MEDALS OF HONOR COLLECTION</div>
                    </div>
                    <div className={`${Style.card_face} ${Style.card_back}`}>
                      <Image
                        src={"/img/metal.png"}
                        alt={`${item.title} - Back`}
                        width={250}
                        height={250}
                        className={Style.card_image}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
            <div className={Style.arrow_container}>
              <Button
                btnName="⟵"
                onClick={() => handleArrowClick("right")}
                classStyle={Style.arrowButton}
                fontSize="1.75rem"
                isActive={false}
                title="Go Left"
                icon=""
              />
              <Button
                btnName="⟶"
                onClick={() => handleArrowClick("left")}
                classStyle={Style.arrowButton}
                fontSize="1.75rem"
                isActive={false}
                title="Go Right"
                icon=""
              />
            </div>
          </div>
        </div>
        {selectedMedal && (
          <DotDetailsModal
          medal={selectedMedal}
          onClose={() => setSelectedMedal(null)}
          forge={forge}
          userInfo={userInfo} 
          isUserInfoModalOpen={isUserInfoModalOpen}
          setIsUserInfoModalOpen={setIsUserInfoModalOpen}
        />
        
        )}
        {isModalOpen && (
          <WalkthroughModal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
          />
        )}
        <CheckoutModal
          isOpen={isUserInfoModalOpen}
          onClose={() => setIsUserInfoModalOpen(false)}
          onSubmit={handleUserInfoSubmit}
        />
        {isConfirmationModalVisible && (
          <div className={Style.confirmation_modal}>
            <div className={Style.confirmation_modal_content}>
              <h2>Confirm Forging</h2>
              <p>Are you sure you want to forge the {currentMedal.title} medal for {currentMedal.price}?</p>
              <div className={Style.modal_buttons}>
                <button onClick={confirmForge} className={Style.confirm_button}>Confirm</button>
                <button onClick={() => setIsConfirmationModalVisible(false)} className={Style.cancel_button}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        <ToastContainer
          position={toast.POSITION.TOP_CENTER}
          className={Style.toast_container_center}
        />

      </div>
    </div>
  );
};
export default React.memo(TheForge);