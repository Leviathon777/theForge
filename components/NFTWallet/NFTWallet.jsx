import React, { useContext } from "react";
import Style from "./NFTWallet.module.css";
import NFTWalletCard from "./NFTWalletCard/NFTWalletCard";
import MyNFTData, { MyNFTDataContext } from '../../Context/MyNFTDataContext';

const NFTWallet = () => {
  const { nfts } = useContext(MyNFTDataContext);
  const renderMedia = (url, metadata) => {
    if (!url) {
      return <p>No media found</p>;
    }
    const fileExtension = url.split('.').pop().toLowerCase();
    if (['mp4', 'webm', 'ogg'].includes(fileExtension)) {
      return (
        <video autoPlay={true} controls={true} loop={true} muted={true} width={300} height={300} controlsList="nodownload" style={{ objectFit: "cover" }} className={Style.NFTWalletCard_box_img_vid}>
           <source src={metadata.animation_url} type="video/mp4" />      
        </video>
      );
    } else if (['mp3', 'wav', 'ogg'].includes(fileExtension)) {
      return <audio src={url} controls />;
    } else {
      return <img src={url} alt="NFT" width="150" />;
    }
  };
  return (
    <div className={Style.nft_wallet}>
      <NFTWalletCard nfts={nfts} renderMedia={renderMedia} />
    </div>
  );
};
export default NFTWallet;