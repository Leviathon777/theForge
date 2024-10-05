import React, { useState, useEffect, useMemo, memo } from "react";
import Style from "./NFTDetailsImg.module.css";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import ReactPlayer from "react-player";
import "react-lazy-load-image-component/src/effects/blur.css";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../firebase/config";
import { getUserProfile } from '../../firebase/services';
import MusicPlayer from '../../components/MusicPlayer';
import  audio_image2  from "../../img/audio-image2.png";
import Image from "next/image";

const NFTDetailsImg = memo(({ NFTData, nft  }) => {
  const [information, setInformation] = useState(true);
  const [details, setDetails] = useState(true);
  const [fileType, setFileType] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [muted, setMuted] = useState(false);
  const isImage = fileType.startsWith("image");
  const isAudio = fileType.startsWith("audio");


  
  useEffect(() => {
    const fetchFileType = async () => {
      try {
        let contentType;
        if (nft.image) {
          const imageResponse = await fetch(nft.image);
          contentType = imageResponse.headers.get("content-type");
        } else if (nft.track) {
          const audioResponse = await fetch(nft.track);
          contentType = audioResponse.headers.get("content-type");
        } else if (nft.video) {
          const videoResponse = await fetch(nft.video);
          contentType = videoResponse.headers.get("content-type");
        }
        setFileType(contentType || "image"); // Default to image if contentType is not available
      } catch (error) {
        console.error(error);
        setFileType("image");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchProfilePic = async () => {
      try {
        const userProfile = await getUserProfile(nft.seller);
        if (userProfile && userProfile.profilePictureUrl) {
          setProfilePic(userProfile.profilePictureUrl);
        }
      } catch (error) {
        console.error(error);
      }
    };

    Promise.all([fetchFileType(), fetchProfilePic()]).finally(() => setIsLoading(false));
  }, [nft.image, nft.track, nft.video, nft.seller]);

  const openInformation = () => setInformation(!information);
  const openDetails = () => setDetails(!details);

  const RenderDefault = () => (
    <div>
      <img
        src="default-image-thumbnail.png"
        alt="NFT"
        width={360}
        height={360}
        className={`${Style.NFTCard_box_img_img} ${isLoading ? Style.hidden : ""}`}
        controls
      />
    </div>
  );

  const RenderMedia = memo(() => {
    if (isImage) {
      return (
        <img
          src={nft.image}
          loading="lazy"
          alt="NFT"
          width={isLoading ? "360" : "100%"}
          height={isLoading ? "360" : "100%"}
          onLoad={() => setIsLoading(false)}
          onError={() => setFileType("image")}
          
          className={Style.NFTDetailsImg_box_NFT_img_img}
        />
      );
    } else if (isAudio) {
      return (
        <div className={`${Style.NFTCardTwo_box_audio}`}>
                {nft.audioImageIPFSUrl ? (
                  <img
                    src={nft.audioImageIPFSUrl}
                    alt="Default"
                    width="700"
                    effect="blur"
                    height="700"
                    objectFit="cover"
                    className={Style.bigNFTSlider_box_img_img}
                  />
                ) : (
                  <Image
                    src={audio_image2}
                    alt="NFT"
                    width="700"
                    effect="blur"
                    height="700"
                    objectFit="cover"
                    className={Style.NFTCard_box_img_img}
                    controls
                  />
                )}

                <MusicPlayer
                  src={nft.track}
                  preload={nft.metdata}
                  width="760"
                  height="450"
                  className={Style.bigNFTSlider_box_audio_player}
                  muted={muted}
                  img="../../../img/audio_image2.png"
                />
          </div>
     
      );
    } else {
      return (
        <div>
          <ReactPlayer
            url={nft.video}
            controls
            width="100%"
            height="100%"
            className={`${Style.NFTCardTwo_box_img_img}`}
            onError={() => setFileType("image")}
          />
        </div>
      );
    }
  });

  const renderFilePreview = () => {
    return isLoading ? (
      <div className={Style.loadingSkeleton}></div>
    ) : fileType ? (
      <RenderMedia />
    ) : (
      <RenderDefault />
    );
  };

  return (
    <div className={Style.NFTDetailsImg}>
      <div className={Style.NFTDetailsImg_box}>
        <div className={Style.NFTDetailsImg_box_NFT}>
          <div className={Style.NFTDetailsImg_box_NFT_img}>
            {renderFilePreview()}
          </div>
        </div>

        <div
          className={Style.NFTDetailsImg_box_description}
          onClick={() => openInformation()}
        >
          <p>ASSET CONTRACT</p>
          {information ? <FaArrowUp /> : <FaArrowDown />}
        </div>

        {information && (
          <div className={Style.NFTDetailsImg_box_description_box}>
            <p>{nft.owner ? nft.owner : nft.contract}</p>

          </div>
        )}

        <div
          className={Style.NFTDetailsImg_box_details}
          onClick={() => openDetails()}
        >
          <p>ASSETS DETAILS</p>
          {details ? <FaArrowUp /> : <FaArrowDown />}
        </div>

        {details && (
          <div className={Style.NFTDetailsImg_box_details_box}>
            <div className={Style.NFTDetailsImg_box_details_box_profile}>
              <img
                src={profilePic}
                alt="Profile Pic"
                className={Style.NFTDetailsImg_box_details_box_profile_img}
              />
              <p>{nft.seller}</p>
            </div>
            <p>
              <small>TOKEN ID:</small>
              &nbsp; &nbsp; {nft.tokenId}
            </p>
            <p>
              <small>PROPERTIES:</small>
              &nbsp; &nbsp; {nft.properties}
            </p>
            <p>
              <small>SELLER ROYALTIES:</small>
              &nbsp; &nbsp; {nft.royalties}
            </p>


          </div>
        )}
      </div>
    </div>
  );
});

export default NFTDetailsImg;
