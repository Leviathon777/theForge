import React, { createContext, useState, useEffect } from 'react';
import { useAccount } from "wagmi";
import { publicClient } from "../lib/viemClient";
import mohCA_ABI from "./mohCA_ABI.json";
import replacementCA_ABI from "./replacementCA_ABI.json";

export const MyDotDataContext = createContext();

const MyDotData = ({ children }) => {
  const { address } = useAccount();
  const [dots, setDots] = useState([]);

  const fetchDotsFromContract = async (contractABI, contractAddress, source) => {
    try {
      const tokenCount = await publicClient.readContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "balanceOf",
        args: [address],
      });
      console.log(`[${source}] Token count for ${address}: ${tokenCount}`);

      if (Number(tokenCount) === 0) {
        return [];
      }

      const tokenIds = await Promise.all(
        Array.from({ length: Number(tokenCount) }).map((_, i) =>
          publicClient.readContract({
            address: contractAddress,
            abi: contractABI,
            functionName: "tokenOfOwnerByIndex",
            args: [address, BigInt(i)],
          })
        )
      );

      console.log(`[${source}] Token IDs:`, tokenIds);

      const results = await Promise.all(
        tokenIds.map(async (tokenId) => {
          try {
            const tokenURI = await publicClient.readContract({
              address: contractAddress,
              abi: contractABI,
              functionName: "tokenURI",
              args: [tokenId],
            });
            const response = await fetch(tokenURI);
            const metadata = await response.json();
            console.log(`[${source}] Token #${tokenId} metadata:`, metadata);
            return {
              tokenId,
              metadata,
              contractAddress,
              source,
            };
          } catch (err) {
            console.error(`[${source}] Error fetching token #${tokenId}:`, err);
            return null;
          }
        })
      );

      return results.filter(Boolean);
    } catch (err) {
      console.error(`[${source}] Error fetching dots:`, err);
      return [];
    }
  };

  const fetchDots = async () => {
    if (!address) {
      console.warn("No address provided. Skipping fetchDots.");
      return;
    }

    console.log(`Fetching dots for address: ${address}`);

    // Fetch from both contracts in parallel using viem
    const [originalDots, replacementDots] = await Promise.all([
      fetchDotsFromContract(
        mohCA_ABI.abi,
        mohCA_ABI.address,
        "Original"
      ),
      fetchDotsFromContract(
        replacementCA_ABI.abi,
        replacementCA_ABI.address,
        "Replacement"
      ),
    ]);

    const allDots = [...originalDots, ...replacementDots];
    console.log(`Fetched ${originalDots.length} original + ${replacementDots.length} replacement = ${allDots.length} total dots`);

    setDots(allDots);
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
