import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import ReactPlayer from "react-player";
import MedalDetailsModal from "../../MOHDetailsPage/medaldetails.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";
import { ConnectWallet, darkTheme, useAddress } from "@thirdweb-dev/react"; 

import VideoPlayer from "../VideoPlayer.jsx";

// INTERNAL IMPORT
import Style from "./TheForge.module.css";
import moreStyles from "../Button/Button.module.css";
import moreStylesToo from "../NFTWallet/NFTWallet.module.css"
import user1 from "../../img";
import videos from "../../public/videos";
//import Button from "../Button/Button";
import { ButtonSprite } from "../../components/componentsindex.js";
import Link from "next/link";

import { ethers } from "ethers";
import mohCA_ABI from "../../Context/mohCA_ABI.json";
import ipfsHashes from "../../Context/ipfsHashes";

const MohAddress = mohCA_ABI.address;
const MohABI = mohCA_ABI.abi;

const fetchMohContract = (signerOrProvider) =>
  new ethers.Contract(MohAddress, MohABI, signerOrProvider);

const TheForge = () => {
  const [idNumber, setIdNumber] = useState(0);
  const address = useAddress();
  const [selectedMedal, setSelectedMedal] = useState(null);

  const DynamicReactPlayer = dynamic(() => import("react-player"), {
    ssr: false,
  });
  const [isMuted, setIsMuted] = useState(true);
  const [playingStates, setPlayingStates] = useState(
    new Array(videos.length).fill(false)
  );

  const mohData = [
    {
      title: "COMMON",
      id: 1,
      name: "XDRIP OFFICIAL",
      collection: "MEDALS OF HONOR",
      price: "0.5 BNB",
      like: 1,
      image: user1,
      nftVideo: videos.common,
      description:
        "COMMON Medal, forged in the fires of battle, this medal represents the courage and determination of the XdRiP warrior.",
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
      image: user1,
      nftVideo: videos.uncommon,
      description:
        "UNCOMMON Medal, crafted by the most skilled, this medal is a symbol of the exceptional strength and valor possessed by those who rise above the rest.",
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
      image: user1,
      nftVideo: videos.rare,
      description:
        "RARE Medal, forged from rare and precious metals, this medal is a testament to the elite few who have demonstrated unparalleled bravery and honor.",
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
      image: user1,
      nftVideo: videos.epic,
      description:
        "EPIC Medal, wrought with mystical powers, this medal is a sign of the legendary feats accomplished by only the most heroic and mighty of warriors.",
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
      image: user1,
      nftVideo: videos.legendary,
      description:
        "LEGENDARY Medal, forged by the XdRiP Gods, this medal is a symbol of the ultimate achievement in battle, an honor bestowed only upon the greatest of heroes. ",
      ipfsHash: ipfsHashes.find((hash) => hash.title === "LEGENDARY").url,
      inventory: {
        forged: 0,
        available: 500,
      },
    },
  ];
  const videoRefs = new Array(mohData.length).fill(null);
  const intervalIds = new Array(mohData.length).fill(null);

  const handleMedalDetails = (medal) => {
    setSelectedMedal(medal);
  };

  const mint = async (medalType, ipfsHash) => {
    try {
      console.log("Minting medal of type:", medalType);

      if (!address) {
        console.log("No address found, enabling Ethereum.");
        window.ethereum.enable();
        return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = fetchMohContract(signer);
      console.log("Connected to contract at:", MohAddress);

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
        default:
          throw new Error("Invalid medal type");
      }

      console.log("Selected mint function:", mintFunction);

      const itemPrice = mohData
        .find((item) => item.title === medalType)
        .price.split(" ")[0];
      console.log("Item price:", itemPrice);

      const price = ethers.utils.parseUnits(itemPrice, "ether");

      console.log("Converted price:", price.toString());

      const transaction = await mintFunction(ipfsHash, {
        value: price,
        gasLimit: 650000,
      });

      console.log("Transaction sent:", transaction);

      const receipt = await transaction.wait();
      console.log("Transaction confirmed:", receipt);

      //toast.success("Your Medal Of Honor was forged successfully!");

      toast.success("Your Medal Of Honor was forged successfully!", {
        toastId: "successToast",
        className: "MedalDetailsModal_success",
        style: {
          background: "black",
          color: "white",
          padding: "0.5rem",
          borderRadius: "0.5rem",
          boxShadow: "var(--white-glow)",
          width: "300px",
          height: "100px",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "1rem",
          fontFamily: "Aldrich, sans-serif",
          textShadow:
            "0 0 2px rgb(1, 122, 254, 255), 0 0 2px rgb(1, 122, 254, 255), 0 0 2px rgb(1, 122, 254, 255), 0 0 2px rgb(1, 122, 254, 255), 0 0 3px rgb(1, 122, 254, 255), 0 0 3px rgb(1, 122, 254, 255), 0 0 3px rgb(1, 122, 254, 255), 0 0 5px rgb(1, 122, 254, 255), 0 0 5px rgb(1, 122, 254, 255)",
          opacity: 0.9,
        },
      });
    } catch (error) {
      console.error("Forge failed", error);
      console.log("Error object:", error);

      if (error.code === 4001) {
        // denied transaction signature
        toast.error("You rejected the transaction, signature denied.");
      } else {
        toast.error("Error while forging Medal");
      }
    }
  };

  const handleCloseModal = () => {
    setSelectedMedal(null);
  };

  const [isPlaying, setIsPlaying] = useState(false);

  const handleMuteClick = () => {
    setIsMuted(!isMuted);
  };

  const handlePauseClick = (index) => {
    setPlayingStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = !prevStates[index];
      return updatedStates;
    });
  };

  useEffect(() => {
    setIsPlaying(true);
    return () => {
      setIsPlaying(false);
    };
  }, []);

  const handleMouseEnter = (index) => {
    setPlayingStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = true;
      return updatedStates;
    });

    if (videoRefs[index]) {
      videoRefs[index].play(); // Start playing the video

      videoRefs[index].addEventListener("loadeddata", () => {
        // Set an interval to check the video's progress
        intervalIds[index] = setInterval(() => {
          // Check the video's currentTime and restart it if necessary
          if (videoRefs[index].currentTime >= videoRefs[index].duration) {
            videoRefs[index].currentTime = 0;
            videoRefs[index].play();
          }
        }, 1000); // Check every 1 second
      });
    }
  };

  const handleMouseLeave = (index) => {
    setPlayingStates((prevStates) => {
      const updatedStates = [...prevStates];
      updatedStates[index] = false;
      return updatedStates;
    });

    if (videoRefs[index]) {
      clearInterval(intervalIds[index]); // Clear the interval
      videoRefs[index].pause(); // Pause the video
      videoRefs[index].currentTime = 0; // Reset the video's currentTime
    }
  };

  return (
<div align="center">
    <ConnectWallet
          btnTitle="FORGE CONNECT"
          style={{
            backgroundColor: "black",
            color: "white",
            border: "0.2rem solid black",
          }}
          className={`${Style.loginSignupBtn} ${Style.box_box_right_btn}`}
          modalTitle="Sign In"
          theme={darkTheme({
            colors: {
              modalBg: "#000000",
              walletSelectorButtonHoverBg: "#1a1a1a",
              dropdownBg: "#000000",
              borderColor: "black",
              separatorLine: "white",
            },
          })}
          switchToActiveChain={true}
          termsOfServiceUrl="../../pages/termsOfService.js"
          privacyPolicyUrl="../../privacyPolicy.js"
          welcomeScreen={{
            title: "THE FORGE by XdRiP",
            subtitle: "MOH Tagline here",
            img: {
              src: "medal_1.png",
              width: 300,
              height: 300,
            },
          }}
        />



    <div className={Style.theForge_container}>



      <div className={Style.theForge}>
        {mohData.map((item, index) => (
          <div key={index} className={Style.card}>
            <div className={Style.card_left}>
              <h2>{item.title}</h2>
            </div>
            <div className={Style.card_right}>
              <div className={Style.card_right_top}>

                {/*
                <video
                  ref={(videoRef) => (videoRefs[index] = videoRef)} // Save the ref
                  controls
                  muted={isMuted}
                  width="100%"
                  className={Style.card_right_top_video}
                  autoPlay={playingStates[index]} // Start playing when true
                  loop={true} // Enable looping
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                ></video>
                */}


                <VideoPlayer
                  videoSrc={item.nftVideo}
                  videoStyles={{ width: "100%", borderRadius: "10px" }}
                  isMuted={false}
                  hoverPlay={true}
                  autoPlay={false}
                  loop={true}
                  hoverGrow={true}

                />


                <source src={item.nftVideo} type="video/mp4" />
                  
                
              </div>
              <div className={Style.card_right_bottom}>
                <div className={Style.card_right_bottom_bidding}>
                  <div className={Style.card_right_bottom_bidding_box_timer}>
                    <div
                      className={Style.card_right_bottom_bidding_box_timer_item}
                    >
                      <span>FORGED</span>
                      <p>{item.inventory.forged}</p>
                    </div>
                    <div
                      className={Style.card_right_bottom_bidding_box_timer_item}
                    >
                      <span>AVAILABLE</span>
                      <p>{item.inventory.available}</p>
                    </div>
                  </div>
                  <div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "1rem",
    marginBottom: "1rem",
    textAlign: "center",
  }}
>
  <div
    style={{
      backgroundColor: "#1f1f1f", 
      border: "4px solid gray", 
      padding: "0.5rem", 
      borderRadius: "0.5rem", 
      textAlign: "center",
      color: "white", 
    }}
  >
    <small
      style={{
        fontSize: "1rem",
        fontWeight: "bold",
        textTransform: "uppercase", 
        color: "white", 
      }}
    >
      MEDALS WORTH
    </small>
    <p
      style={{
        fontSize: "1.25rem", 
        fontWeight: "bold",
        color: "white", 
        marginTop: "0.5rem",
        textShadow: "0 0 5px rgba(255, 255, 255, 0.8)", 
      }}
    >
      {item.price}
    </p>
  </div>
</div>

                  <div className={Style.button_wrapper}>
                    <ButtonSprite
                      btnURL=""
                      btnSize="size1"
                      btnText="FORGE"
                      fontSize="default"
                      paddingLeft="default"
                      paddingRight="default"
                      playSound="yes"
                      isResponsive={true}
                      maxWidth="120px"
                      onClick={() => mint(item.title, item.ipfsHash)}
                    />
                    <ButtonSprite
                      btnURL=""
                      btnSize="size1"
                      btnText="DETAILS"
                      fontSize="default"
                      paddingLeft="default"
                      paddingRight="default"
                      playSound="yes"
                      isResponsive={true}
                      maxWidth="120px"
                      onClick={() => handleMedalDetails(item)}
                    />
                    {/*<Button
                      btnName="FORGE"
                      icon="/buttons/black_button_sm1.png"
                      imageWidth={125}
                      imageHeight={44}
                      fontSize="17px"
                      handleClick={() => mint(item.title, item.ipfsHash)}
                    />

                    <Button
                      handleClick={() => handleMedalDetails(item)}
                      btnName="DETAILS"
                      icon="/buttons/black_button_sm1.png"
                      imageWidth={125}
                      imageHeight={44}
                      fontSize="17px"
                    />*/}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedMedal && (
        <MedalDetailsModal medal={selectedMedal} onClose={handleCloseModal} />
      )}
      <ToastContainer
        position={toast.POSITION.TOP_CENTER}
        className={Style.toast_container_center}
      />
    </div></div>
  );
};

export default TheForge;
