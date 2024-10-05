import React from "react";
import Image from "next/image";
import { MdVerified } from "react-icons/md";
import Style from "../MOHDetailsPage/MedalDetailsModal.module.css";
import founder1 from "../img/founder1.jpg";
import founder2 from "../img/founder2.jpg";
import founder3 from "../img/founder3.jpg";
import founder4 from "../img/founder4.jpg";
import founder5 from "../img/founder5.jpg";
import { MdClose } from "react-icons/md";
import mohCA_ABI from "../Context/mohCA_ABI.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MedalDetailsModal = ({ medal, onClose }) => {
  /*const contractAddress = "0x9264115fB1b2aE47199Ff529608Bcbf8770c83fD";
  const bscScanUrl = `https://testnet.bscscan.com/address/${contractAddress}`;*/

  const mohContractAddress = mohCA_ABI.address;

  const images = {
    founder1,
    founder2,
    founder3,
    founder4,
    founder5,
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
      <path d="M5.333 11.167a.5.5 0 100-1v1zM2.666 9.333h-.5.5zM4 2.667v-.5.5zm5.333 0v-.5.5zm.833 2.666a.5.5 0 001 0h-1zm-.833 8.5a.5.5 0 100-1v1zm-4-1.833h-.5.5zm1.333-6.667v-.5.5zm6.167 4a.5.5 0 101 0h-1zm-7.5.834H4v1h1.333v-1zm-1.333 0a.833.833 0 01-.59-.244l-.707.707c.344.344.81.537 1.297.537v-1zm-.59-.244a.833.833 0 01-.244-.59h-1c0 .487.194.953.537 1.297l.708-.707zm-.244-.59V4h-1v5.333h1zm0-5.333c0-.22.088-.433.245-.59l-.708-.706c-.343.344-.536.81-.536 1.296h1zm.245-.59A.833.833 0 014 3.168v-1c-.486 0-.953.193-1.297.537l.708.707zM4 3.168h5.333v-1H4v1zm5.333 0c.221 0 .433.088.59.244l.707-.707a1.833 1.833 0 00-1.297-.537v1zm.59.244a.833.833 0 01.243.59h1c0-.487-.193-.953-.537-1.297l-.707.707zm.243.59v1.332h1V4h-1zm-.833 8.832H6.666v1h2.667v-1zm-2.667 0a.833.833 0 01-.589-.244l-.707.707c.344.344.81.537 1.296.537v-1zm-.589-.244A.833.833 0 015.833 12h-1c0 .486.193.953.537 1.296l.707-.707zM5.833 12V6.667h-1V12h1zm0-5.333c0-.221.088-.433.244-.59L5.37 5.37c-.344.344-.537.81-.537 1.297h1zm.244-.59a.833.833 0 01.59-.244v-1c-.487 0-.953.194-1.297.537l.707.707zm.59-.244H12v-1H6.667v1zm5.333 0c.22 0 .433.088.59.244l.706-.707A1.833 1.833 0 0012 4.833v1zm.59.244a.833.833 0 01.243.59h1c0-.486-.193-.953-.537-1.297l-.707.707zm.243.59v2.666h1V6.667h-1zm0 0V12h1V6.667h-1zM12 12.833H6.667v1H12v-1zm-5.333 0A.833.833 0 015.833 12h-1c0 1.013.821 1.833 1.833 1.833v-1zM12.832 12c0 .46-.373.833-.833.833v1c1.012 0 1.833-.82 1.833-1.833h-1zM12 5.833c.46 0 .833.374.833.834h1c0-1.013-.82-1.834-1.833-1.834v1zm-5.333-1c-1.013 0-1.834.821-1.834 1.834h1c0-.46.373-.834.833-.834v-1z" />
    </svg>
  );

  return (
    <div className={Style.MedalDetailsModal}>
      <div className={Style.MedalDetailsModal_content}>
        <div className={Style.MedalDetailsModal_body}>
          <div className={Style.MedalDetailsModal_profile}>
            <div className={Style.MedalDetailsModal_video}>
              <video
                src={medal.nftVideo}
                alt="NFT Video"
                width="100%"
                height="100%"
                controls
                className={Style.MedalDetailsModal_video}
              />
            </div>
            <div className={Style.MedalDetailsModal_details}>
              <div className={Style.MedalDetailsModal_header}>
                <h1>
                  {medal.title} MEDAL LEVEL {medal.id}
                </h1>
                <button
                  className={Style.MedalDetailsModal_closeButton}
                  onClick={onClose}
                >
                  <MdClose size={30} />
                </button>
              </div>
              <div className={Style.MedalDetailsModal_scroll_container}>
                <div className={Style.MedalDetailsModal_video_clone}>
                  <video
                    src={medal.nftVideo}
                    alt="NFT Video"
                    width="100%"
                    height="100%"
                    controls
                  />
                </div>
                <div className={Style.MedalDetailsModal_profile_left_info}>
                  <p style={{ marginBottom: "0.5rem", marginTop: "0" }}>
                    CREATOR XDRIP OFFICIAL
                  </p>
                  <div className={Style.MedalDetailsModal_foundingMembers}>
                    {[1, 3, 4, 5, 2].map((index) => (
                      <div
                        key={index}
                        className={Style.MedalDetailsModal_foundingMember}
                      >
                        <Image
                          src={images[`founder${index}`]}
                          alt={`Founder ${index}`}
                          width={100}
                          height={100}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className={Style.MedalDetailsModal_profile_right_info}>
                  <p>COLLECTION</p>
                  <span>
                    {medal.collection} <MdVerified />
                  </span>
                  <div className={Style.MedalDetailsModal_price}>
                    <p>FORGE PRICE</p>
                    <span>{medal.price}</span>
                  </div>

                  <div className={Style.MedalDetailsModal_contractAddress}>
                    <p>CONTRACT ADDRESS</p>
                    <span
                      className={
                        Style.MedalDetailsModal_contractAddress_address
                      }
                      title="Copy to Clipboard"
                    >
                      {mohContractAddress && formatAddress(mohContractAddress)}
                      <CopyIcon />
                    </span>
                    {/*<a
                      href={bscScanUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={Style.MedalDetailsModal_contractAddress_link}
                    >
                      {contractAddress}
                    </a>*/}
                    <p className={Style.MedalDetailsModal_notes}>
                      <small> Cooldown period is 30 days per tier </small>
                      <br />
                      <br />
                      <small>
                        {" "}
                        Excluding the COMMON, you must own each previous tier
                        for the required cooldown to be eligible to forge the
                        next{" "}
                      </small>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={Style.MedalDetailsModal_biding}>
            <div className={Style.MedalDetailsModal_biding_timer}>
              <div className={Style.MedalDetailsModal_biding_timer_item}>
                <p>NFT DESCRIPTION</p>
                <span>{medal.description}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedalDetailsModal;
