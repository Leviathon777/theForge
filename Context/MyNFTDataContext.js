import React, { createContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import { useAddress } from "@thirdweb-dev/react";
import mohCA_ABI from "./mohCA_ABI.json";

export const MyNFTDataContext = createContext();

const MyNFTData = ({ children }) => {
  const address = useAddress();
  const [nfts, setNfts] = useState([]);
  const bscRpcUrl = "https://binance-testnet.rpc.thirdweb.com/";

  // Function to fetch NFTs
  const fetchNFTs = async () => {
    if (!address) return;

    const web3 = new Web3(bscRpcUrl);
    const mohABI = mohCA_ABI.abi;
    const mohContractAddress = mohCA_ABI.address;
    const mohnftContract = new web3.eth.Contract(mohABI, mohContractAddress);

    const fetchTokensFromContract = async (contract) => {
      const tokenCount = await contract.methods.balanceOf(address).call();
      const nftPromises = [];

      for (let i = 0; i < tokenCount; i++) {
        const tokenIdPromise = contract.methods.tokenOfOwnerByIndex(address, i).call();
        nftPromises.push(tokenIdPromise);
      }

      const tokenIds = await Promise.all(nftPromises);

      const fetchedNfts = await Promise.all(
        tokenIds.map(async (tokenId) => {
          const tokenURI = await contract.methods.tokenURI(tokenId).call();
          const response = await fetch(tokenURI);
          const metadata = await response.json();
          const contractAddress = mohContractAddress;

          return { tokenId, metadata, contractAddress };
        })
      );

      return fetchedNfts;
    };

    const nftsFromMohContract = await fetchTokensFromContract(mohnftContract);
    setNfts([...nftsFromMohContract]);
  };

  // Automatically fetch NFTs when the address changes
  useEffect(() => {
    if (address) {
      fetchNFTs(); // Fetch NFTs when the address is available
    }
  }, [address]);

  const renderMedia = (mediaUrl, metadata) => {
    if (!metadata || !metadata.animation_url) {
      return <p>No media found</p>;
    }

    const fileExtension = metadata.animation_url.split('.').pop().toLowerCase();

    if (['mp4', 'webm', 'ogg'].includes(fileExtension)) {
      return <video src={metadata.animation_url} alt="video" width="300" controls autoPlay muted loop />;
    } else if (['gif'].includes(fileExtension)) {
      return <img src={metadata.animation_url} playsInline autoPlay alt="NFT animation" />;
    } else {
      return <p>Unsupported file type: {fileExtension}</p>;
    }
  };

  return (
    <MyNFTDataContext.Provider value={{ nfts, renderMedia, fetchNFTs }}>
      {children}
    </MyNFTDataContext.Provider>
  );
};

export default MyNFTData;
