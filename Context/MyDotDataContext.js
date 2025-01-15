import React, { createContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import { useAddress } from "@thirdweb-dev/react";
import mohCA_ABI from "./mohCA_ABI.json";
export const MyDotDataContext = createContext();
const MyDotData = ({ children }) => {
  const address = useAddress();
  const [dots, setDots] = useState([]);
  const bscRpcUrl = "https://data-seed-prebsc-1-s1.binance.org:8545/";

  
  const fetchDots = async () => {
    if (!address) {
      console.warn("No address provided. Skipping fetchDots.");
      return;
    }
    
    console.log(`Fetching dots for address: ${address}`);
    
    const web3 = new Web3(bscRpcUrl);
    const mohABI = mohCA_ABI.abi;
    const mohContractAddress = mohCA_ABI.address;
    const mohDotContract = new web3.eth.Contract(mohABI, mohContractAddress);
  
    try {
      const tokenCount = await mohDotContract.methods.balanceOf(address).call();
      console.log(`Token count for address ${address}: ${tokenCount}`);
  
      if (tokenCount === "0") {
        console.warn("No tokens found for this address.");
        setDots([]);
        return;
      }
  
      const tokenIds = await Promise.all(
        Array.from({ length: tokenCount }).map((_, i) =>
          mohDotContract.methods.tokenOfOwnerByIndex(address, i).call()
        )
      );
  
      console.log("Fetched token IDs:", tokenIds);
  

      const fetchedDots = await Promise.all(
        tokenIds.map(async (tokenId) => {
          try {
            const tokenURI = await mohDotContract.methods.tokenURI(tokenId).call();
            const response = await fetch(tokenURI);
            const metadata = await response.json();
            console.log(`Fetched metadata for token ID ${tokenId}:`, metadata);
            return { tokenId, metadata, contractAddress: mohContractAddress };
          } catch (err) {
            console.error(`Error fetching data for token ID ${tokenId}:`, err);
            return null;
          }
        })
      );  
      setDots(fetchedDots.filter(Boolean));
      console.log("Fetched dots:", fetchedDots);
    } catch (err) {
      console.error("Error fetching dots:", err);
    }
  };


  useEffect(() => {
    if (address) {
      fetchDots();
    }
  }, [address]);



  const renderMedia = (metadata) => {
    if (!metadata || !metadata.animation_url) {
      return <p>No media found</p>;
    }



    const fileExtension = metadata.animation_url.split('.').pop().toLowerCase();
    if (['mp4', 'webm', 'ogg'].includes(fileExtension)) {
      return <video src={metadata.animation_url} alt="video" width="300" controls autoPlay muted loop />;
    } else if (['gif'].includes(fileExtension)) {
      return <img src={metadata.animation_url} playsInline autoPlay alt="DOT animation" />;
    } else {
      return <p>Unsupported file type: {fileExtension}</p>;
    }
  };



  return (
    <MyDotDataContext.Provider value={{ dots, renderMedia, fetchDots }}>
      {children}
    </MyDotDataContext.Provider>
  );
};
export default MyDotData;
