
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
  ConnectButton,
  ConnectEmbed, PayEmbed
} from "@thirdweb-dev/react";
import { MyNFTDataContext } from "../../Context/MyNFTDataContext";
import Style from "./TheForge.module.css";
import moreStyles from "../Button/Button.module.css";
import videos from "../../public/videos/index.js";
import { Button, VideoPlayer, MedalDetailsModal } from "../componentsindex.js";
import { ethers } from "ethers";
import mohCA_ABI from "../../Context/mohCA_ABI.json";
import ipfsHashes from "../../Context/ipfsHashes.js";
import Web3 from "web3";
import xdripCA_ABI from "../../Context/xdripCA_ABI.json";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
const MohAddress = mohCA_ABI.address;
const MohABI = mohCA_ABI.abi;
const fetchMohContract = (signerOrProvider) =>
  new ethers.Contract(MohAddress, MohABI, signerOrProvider);
const XdRiPContractAddress = xdripCA_ABI.address;
const XdRiPContractABI = xdripCA_ABI.abi;
const web3 = new Web3("https://bsc-dataseed.binance.org/");
const XdRiPContract = new web3.eth.Contract(XdRiPContractABI, XdRiPContractAddress);



const TheForge = ({ setIsModalOpen }) => {
  const [selectedMedal, setSelectedMedal] = useState(null);
  const [bnbBalance, setBnbBalance] = useState(null);
  const [bnbToUsd, setBnbToUsd] = useState(null);
  const [rewardStatus, setRewardStatus] = useState(null);
  const [xdripBalance, setXdripBalance] = useState(null);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const { nfts, fetchNFTs } = useContext(MyNFTDataContext);
  const [isBNBPrice, setIsBNBPrice] = useState(true);
  const [currentMedal, setCurrentMedal] = useState(null);
  const wallet = useWallet();
  const isGuestWallet = wallet?.walletId === "SmartWallet";
  const address = useAddress();
  const signer = useSigner();
  const [mintedCounts, setMintedCounts] = useState({});
  const connectLocalWallet = useConnect(localWallet);
  const carouselRef = useRef();
  const cardRefs = useRef([]);
  const controls = useAnimation();
  const [startX, setStartX] = useState(0);
  const mohData = [
    {
      title: "COMMON",
      id: 1,
      name: "XDRIP OFFICIAL",
      collection: "MEDALS OF HONOR",
      price: "0.5 BNB",
      like: 1,
      image: "../public/img/nft-image-1.webp",
      nftVideo: videos.common,
      description:
        "Forged in the fires of battle, this medal represents the courage and determination of the XdRiP warrior.",
      ipfsHash: ipfsHashes.find((hash) => hash.title === "COMMON").url,
      inventory: {
        forged: 0,
        available: 10000,
      },
    },
    {
      title: "UNCOMMON",
      id: 2,
      name: "XDRIP OFFICIAL",
      collection: "MEDALS OF HONOR",
      price: "1 BNB",
      like: 369,
      image: "../public/img/nft-image-2.webp",
      nftVideo: videos.uncommon,
      description:
        "Crafted by the most skilled, this medal is a symbol of the exceptional strength and valor possessed by those who rise above the rest.",
      ipfsHash: ipfsHashes.find((hash) => hash.title === "UNCOMMON").url,
      inventory: {
        forged: 0,
        available: 5000,
      },
    },
    {
      title: "RARE",
      id: 3,
      name: "XDRIP OFFICIAL",
      collection: "MEDALS OF HONOR",
      price: "1.5 BNB",
      like: 1,
      image: "../public/img/nft-image-3.webp",
      nftVideo: videos.rare,
      description:
        "Forged from rare and precious metals, this medal is a testament to the elite few who have demonstrated unparalleled bravery and honor.",
      ipfsHash: ipfsHashes.find((hash) => hash.title === "RARE").url,
      inventory: {
        forged: 0,
        available: 2500,
      },
    },
    {
      title: "EPIC",
      id: 4,
      name: "XDRIP OFFICIAL",
      collection: "MEDALS OF HONOR",
      price: "2 BNB",
      like: 1,
      image: "../public/img/nft-image-4.webp",
      nftVideo: videos.epic,
      description:
        "Wrought with mystical powers, this medal is a sign of the legendary feats accomplished by only the most heroic and mighty of warriors.",
      ipfsHash: ipfsHashes.find((hash) => hash.title === "EPIC").url,
      inventory: {
        forged: 0,
        available: 1000,
      },
    },
    {
      title: "LEGENDARY",
      id: 5,
      name: "XDRIP OFFICIAL",
      collection: "MEDALS OF HONOR",
      price: "2.5 BNB",
      like: 1,
      image: "../public/img/nft-image-5.webp",
      nftVideo: videos.legendary,
      description:
        "Forged by the XdRiP Gods, this medal is a symbol of the ultimate achievement in battle, an honor bestowed only upon the greatest of heroes. ",
      ipfsHash: ipfsHashes.find((hash) => hash.title === "LEGENDARY").url,
      inventory: {
        forged: 0,
        available: 500,
      },
    },
    {
      title: "ETERNAL",
      id: 6,
      name: "XDRIP OFFICIAL",
      collection: "MEDALS OF HONOR",
      price: "200 BNB",
      like: 1,
      image: "../public/img/nft-image-6.webp",
      nftVideo: videos.eternals,
      description:
        "Forged in the heart of the universe itself, the Eternal medal is a symbol of timeless strength and immortality. Wielded by only the most enduring of warriors, this medal transcends the mortal realm, representing an unbreakable bond between heroism and the cosmos. To wear this medal is to be forever remembered as a champion of infinite valor.",
      ipfsHash: ipfsHashes.find((hash) => hash.title === "ETERNAL").url,
      inventory: {
        forged: 0,
        available: 20,
      },
    },
  ];
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
  const handleConnectLocalWallet = async () => {
    try {
      await connectLocalWallet();
      toast.success("Local Wallet connected!");
    } catch (error) {
      console.error("Error connecting local wallet:", error);
      toast.error("Error connecting local wallet.");
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

  const handleSwipeStart = (event) => {
    setStartX(event.touches[0].clientX);
  };

  const handleSwipeEnd = (event) => {
    const endX = event.changedTouches[0].clientX;
    const swipeDistance = startX - endX;

    if (swipeDistance > 50) {
      handleArrowClick("right");
    } else if (swipeDistance < -50) {
      handleArrowClick("left");
    }
  };
  const handleArrowClick = (direction) => {
    controls.stop();
    const delta = direction === "left" ? -1 : 1;
    const newRotation = currentRotation + delta * rotationStep;
    setCurrentRotation(newRotation);
    controls.start({
      rotateY: newRotation,
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

  const fetchMintedCounts = async () => {
    if (!signer) return;

    try {
      const contract = fetchMohContract(signer);
      const [
        commonMinted, commonRemaining,
        uncommonMinted, uncommonRemaining,
        rareMinted, rareRemaining,
        epicMinted, epicRemaining,
        legendaryMinted, legendaryRemaining,
        eternalMinted, eternalRemaining
      ] = await contract.getMintedCounts();

      // Return the counts for updating the UI
      return {
        COMMON: { forged: commonMinted.toNumber(), available: commonRemaining.toNumber() },
        UNCOMMON: { forged: uncommonMinted.toNumber(), available: uncommonRemaining.toNumber() },
        RARE: { forged: rareMinted.toNumber(), available: rareRemaining.toNumber() },
        EPIC: { forged: epicMinted.toNumber(), available: epicRemaining.toNumber() },
        LEGENDARY: { forged: legendaryMinted.toNumber(), available: legendaryRemaining.toNumber() },
        ETERNAL: { forged: eternalMinted.toNumber(), available: eternalRemaining.toNumber() },
      };
    } catch (error) {
      console.error("Error fetching minted counts:", error);
      return null;
    }
  };

  useEffect(() => {
    const loadMintedCounts = async () => {
      const counts = await fetchMintedCounts();
      if (counts) {
        setMintedCounts(counts);
      }
    };

    if (signer) {
      loadMintedCounts();
    }
  }, [signer]);

  // Function to get updated inventory counts for display
  const getInventory = (item) => {
    if (mintedCounts && mintedCounts[item.title]) {
      return {
        forged: mintedCounts[item.title].forged,
        available: mintedCounts[item.title].available,
      };
    }
    // Fallback to the original inventory if mintedCounts isn't available yet
    return item.inventory;
  };



  const confirmMint = async () => {
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

      const mintFunction = contract[`mint${currentMedal.title}`];

      const transaction = await mintFunction(ipfsHash, {
        value: price,
      });

      const receipt = await transaction.wait();
      if (receipt.status === 1) {
        toast.success("Your Medal Of Honor was forged successfully!");
        await fetchNFTs();
        // Fetch updated minted counts after successful mint
        const updatedCounts = await fetchMintedCounts();
        if (updatedCounts) {
          setMintedCounts(updatedCounts);
        }
      } else {
        toast.error("Transaction failed. Please try again.");
      }
    } catch (error) {
      console.error("Minting failed:", error);
      toast.error("Error while forging Medal.");
    } finally {
      setIsConfirmationModalVisible(false);
      setCurrentMedal(null);
    }
  };

  const mint = async (medalType, ipfsHash) => {
    try {
      console.log("Minting medal of type:", medalType);
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
            toast.error("You must own a COMMON medal to mint an UNCOMMON medal.");
            return;
          }
          break;
        case "RARE":
          const ownsUncommon = await contract.balanceOf(address);
          if (ownsUncommon.toNumber() < 2) {
            toast.error("You must own an UNCOMMON medal to mint a RARE medal.");
            return;
          }
          break;
        case "EPIC":
          const ownsRare = await contract.balanceOf(address);
          if (ownsRare.toNumber() < 3) {
            toast.error("You must own a RARE medal to mint an EPIC medal.");
            return;
          }
          break;
        case "LEGENDARY":
          const ownsEpic = await contract.balanceOf(address);
          if (ownsEpic.toNumber() < 4) {
            toast.error("You must own an EPIC medal to mint a LEGENDARY medal.");
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
      let mintFunction;
      switch (medalType) {
        case "COMMON":
          mintFunction = contract.mintCommon;
          break;
        case "UNCOMMON":
          mintFunction = contract.mintUncommon;
          break;
        case "RARE":
          mintFunction = contract.mintRare;
          break;
        case "EPIC":
          mintFunction = contract.mintEpic;
          break;
        case "LEGENDARY":
          mintFunction = contract.mintLegendary;
          break;
        case "ETERNAL":
          mintFunction = contract.mintEternal;
          break;
        default:
          throw new Error("Invalid medal type");
      }
      let gasLimit;
      try {
        const estimatedGas = await contract.estimateGas[mintFunction.name](ipfsHash, { value: price });
        gasLimit = estimatedGas.add(ethers.BigNumber.from(10000));
        console.log("Estimated gas:", gasLimit.toString());
      } catch (error) {
        console.error("Gas estimation failed. Falling back ");
        gasLimit = ethers.BigNumber.from(990000);
      }
      const transaction = await mintFunction(ipfsHash, {
        value: price,
        gasLimit,
      });
      console.log("Transaction sent:", transaction);
      const receipt = await transaction.wait();
      console.log("Transaction Confirmed:", receipt);
      if (receipt.status === 1) {
        toast.success("Your Medal Of Honor was forged successfully!");
        await fetchNFTs();
      } else {
        toast.error("Transaction failed. Please try again.");
      }
    } catch (error) {
      console.error("Minting failed:", error);
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
              className={`${moreStyles.btn}`}
              modalTitle="The Medals of Honor Collection"
              theme={darkTheme({
                colors: {
                  modalBg: "linear-gradient(145deg, rgba(42, 42, 42, 0.4), rgba(28, 28, 28, 0.4))",
                },
              })}
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
              onTouchStart={handleSwipeStart}
              onTouchEnd={handleSwipeEnd}
            >
              {mohData.map((item, index) => (
                <div
                  key={index}
                  ref={(el) => (cardRefs.current[index] = el)}
                  className={Style.card}
                >
                  <div className={Style.card_inner}>
                    <div className={`${Style.card_face} ${Style.card_front}`}>
                      <div className={Style.card_right}>
                        <h2>{item.title}</h2>
                        <div className={Style.card_right_top}>
                          <VideoPlayer
                            videoSrc={item.nftVideo}
                            playsInline
                            videoStyles={{ width: "100%" }}
                            isMuted={true}
                            hoverPlay={true}
                            autoPlay={true}
                            loop={true}
                            hoverGrow={true}
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
                                onClick={() => mint(item.title, item.ipfsHash)}
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
                                    : `$${bnbToUsd ? (parseFloat(item.price) * bnbToUsd).toFixed(2) : 'Loading...'} USD` // Show USD price
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
                        src={"/img/metal.webp"}
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
                onClick={() => handleArrowClick("left")}
                classStyle={Style.arrowButton}
                fontSize="1.75rem"
                isActive={false}
                title="Go Left"
                icon=""
              />
              <Button
                btnName="⟶"
                onClick={() => handleArrowClick("right")}
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
          <MedalDetailsModal medal={selectedMedal} onClose={() => setSelectedMedal(null)} />
        )}
        {isConfirmationModalVisible && (
          <div className={Style.confirmation_modal}>
            <div className={Style.confirmation_modal_content}>
              <h2>Confirm Minting</h2>
              <p>Are you sure you want to mint the {currentMedal.title} medal for {currentMedal.price}?</p>
              <div className={Style.modal_buttons}>
                <button onClick={confirmMint} className={Style.confirm_button}>Confirm</button>
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
export default TheForge;