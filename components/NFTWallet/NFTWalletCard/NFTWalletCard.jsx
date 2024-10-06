import React, { useContext, useState } from "react";
import Image from "next/image";

import Style from "./NFTWalletCard.module.css";
import { MyNFTDataContext } from "../../../Context/MyNFTDataContext";
import mohCA_ABI from "../../../Context/mohCA_ABI.json";
import { ButtonSprite } from "../../../components/componentsindex.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VideoPlayer from "../../../components/VideoPlayer.jsx"; // Ensure correct path

const NFTWalletCard = () => {
  const { nfts } = useContext(MyNFTDataContext);
  const mohContractAddress = mohCA_ABI.address;
  const [flippedCards, setFlippedCards] = useState(
    Array(nfts.length).fill(false)
  );

  const handleClick = (i) => {
    const newFlippedCards = [...flippedCards];
    newFlippedCards[i] = !newFlippedCards[i];
    setFlippedCards(newFlippedCards);
  };

  const isImage = (url) => {
    const extensions = ["jpg", "jpeg", "png", "gif", "webp"];
    const match = url.match(/\.([a-z]+)(?:[?#]|$)/i);
    return extensions.includes(match && match[1]);
  };

  const formatAddress = (address) => {
    return `${address.substring(0, 4)} ... ${address.substring(
      address.length - 4
    )}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Address copied to clipboard");
      })
      .catch((err) => {
        toast.error("Could not copy text: ", err);
      });
  };

  const CopyIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      fill="none"
      viewBox="0 0 16 16"
      style={{ marginLeft: "5px", cursor: "pointer" }}
      onClick={() => copyToClipboard(mohContractAddress)}
    >
      <path d="M5.333 11.167a.5.5 0 100-1v1zM2.666 9.333h-.5.5zM4 2.667v-.5.5zm5.333 0v-.5.5zm.833 2.666a.5.5 0 001 0h-1zm-.833 8.5a.5.5 0 100-1v1zm-4-1.833h-.5.5zm1.333-6.667v-.5.5zm6.167 4a.5.5 0 101 0h-1zm-7.5.834H4v1h1.333v-1zm-1.333 0a.833.833 0 01-.59-.244l-.707.707c.344.344.81.537 1.297.537v-1zm-.59-.244a.833.833 0 01-.244-.59h-1c0 .487.194.953.537 1.297l.708-.707zm-.244-.59V4h-1v5.333h1zm0-5.333c0-.22.088-.433.245-.59l-.708-.706c-.343.344-.536.81-.536 1.296h1zm.245-.59A.833.833 0 014 3.168v-1c-.486 0-.953.193-1.297.537l.708.707zM4 3.168h5.333v-1H4v1zm5.333 0c.221 0 .433.088.59.244l.707-.707a1.833 1.833 0 00-1.297-.537v1zm.59.244a.833.833 0 01.243.59h1c0-.487-.193-.953-.537-1.297l-.707.707zm.243.59v1.332h1V4h-1zm-.833 8.832H6.666v1h2.667v-1zm-2.667 0a.833.833 0 01-.589-.244l-.707.707c.344.344.81.537 1.296.537v-1zm-.589-.244A.833.833 0 015.833 12h-1c0 1.013.821 1.833 1.833 1.833v-1zM12.832 12c0 .46-.373.833-.833.833v1c1.012 0 1.833-.82 1.833-1.833h-1zM12 5.833c.46 0 .833.374.833.834h1c0-1.013-.82-1.834-1.833-1.834v1zm-5.333-1c-1.013 0-1.834.821-1.834 1.834h1c0-.46.373-.834.833-.834v-1z" />
    </svg>
  );

  return (
    <div className={Style.NFTWalletCard}>
      {nfts.map(({ tokenId, metadata }, i) => (
        <div
          className={`${Style.NFTWalletCard_box} ${flippedCards[i] ? Style.flipped : ""
            }`}
          key={i + 1}
        >
          <div className={Style.NFTWalletCard_box_front}>
            <div className={Style.NFTWalletCard_box_img}>
              <div className={Style.NFTWalletCard_box_img_content}>
                {isImage(metadata.animation_url) ? (
                  <Image
                    src={metadata.image_url}
                    alt={metadata.name}
                    width={300}
                    height={300}
                    style={{ objectFit: "cover" }}
                    className={Style.NFTWalletCard_box_img_img}
                  />
                ) : (
                  <VideoPlayer
                    videoSrc={metadata.animation_url} type="video/mp4"
                    isMuted={true}
                    hoverPlay={true}
                    autoPlay={false}
                    loop={true}
                    videoStyles={{
                      width: "100%",
                      height: "300px",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                    hoverGrow={true}
                  />
                )}
              </div>
            </div>

            <div className={Style.NFTWalletCard_box_info}>
              <div className={Style.NFTWalletCard_box_info_details}>
                <h3>{metadata.name ? metadata.name : "NO DATA AVAILABLE"}</h3>
                <small>ID: {tokenId ? tokenId : "NO DATA AVAILABLE"}</small>
                <ButtonSprite
                  btnURL=""
                  btnSize="size1"
                  btnText="details"
                  fontSize="default"
                  paddingLeft="default"
                  paddingRight="default"
                  playSound="yes"
                  isResponsive={true}
                  maxWidth="120px"
                  onClick={() => handleClick(i)}
                />
              </div>
            </div>
          </div>

          <div className={Style.NFTWalletCard_box_back}>
            <h3>COLLECTION</h3>
            <p>
              {metadata.collection ? metadata.collection : "MEDALS of HONOR"}
            </p>

            <h3>MEDAL</h3>
            <p>{metadata.name ? metadata.name : "NO DATA AVAILABLE"}</p>

            <h3>CONTRACT</h3>
            <p>
              <span
                className={Style.NFTWalletCard_box_contract}
                title="Copy to Clipboard"
              >
                {mohContractAddress && formatAddress(mohContractAddress)}
                <CopyIcon />
              </span>
            </p>

            <h3>DESCRIPTION</h3>
            <p>
              {metadata.description
                ? metadata.description
                : "NO DATA AVAILABLE"}
            </p>
            <ButtonSprite
              btnURL=""
              btnSize="size1"
              btnText="back"
              fontSize="default"
              paddingLeft="default"
              paddingRight="default"
              playSound="yes"
              isResponsive={true}
              maxWidth="120px"
              onClick={() => handleClick(i)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default NFTWalletCard;
