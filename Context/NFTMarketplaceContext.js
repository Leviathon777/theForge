import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
//import marketplaceCA_ABI from "./marketplaceCA_ABI.json";
import mohCA_ABI from "./mohCA_ABI.json";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import Web3 from 'web3';
//import { firebaseApp, db } from '../firebase/config';
//import { addNFT, sellNFT, addCreateTransactionToFirebase, addSellTransactionToFirebase, addVideoNFT, addCreateVideoTransactionToFirebase } from '../firebase/services';
//import { addAudioNFT, addCreateAudioTransactionToFirebase } from '../firebase/xechoServices';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { useRouter } from "next/router";
import { ethers } from "ethers";
import { useSDK, useConnect, useAddress, useConnectionStatus } from "@thirdweb-dev/react";
//import { uploadToIPFS, uploadJSONToIPFS , fetchJSONFromPinata, fetchMetadataFromPinata, fetchAudioMetadataFromPinata, fetchVideoMetadataFromPinata} from "../pages/api/pinataUpload";
import axios from 'axios';
const web3 = new Web3(Web3.givenProvider);
//const NFTMarketplaceAddress = marketplaceCA_ABI.address;
//const NFTMarketplaceABI = marketplaceCA_ABI.abi;
const MohAddress = mohCA_ABI.address;
const MohABI = mohCA_ABI.abi;
// we use thirdweb for wallets 
const connectingWithSmartContract = async () => {
  try {
    const sdk = new ThirdwebSDK();
    await sdk.connect();
    const signer = sdk.getSigner();
    const contract = fetchMarketplaceContract(signer);
    return contract;
  } catch (error) {
    console.log("Something went wrong while connecting with contract", error);
  }
};
const fetchMarketplaceContract = (signerOrProvider) =>
  new ethers.Contract(
    NFTMarketplaceAddress,
    NFTMarketplaceABI,
    signerOrProvider
  );
const fetchMohContract = (signerOrProvider) =>
  new ethers.Contract(MohAddress, MohABI, signerOrProvider);
export const NFTMarketplaceContext = React.createContext();
export const NFTMarketplaceProvider = ({ children }) => {
  const titleData = "Discover, collect, and sell NFTs";
  const sdk = useSDK();
  const connect = useConnect();
  const address = useAddress();
  const connectionStatus = useConnectionStatus();
  const [error, setError] = useState("");
  const [openError, setOpenError] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");
  const [accountBalance, setAccountBalance] = useState("");
  const [nfts, setNfts] = useState([]);
  const [searchNavQuery, setSearchNavQuery] = useState("");
  const router = useRouter();
  const disconnectWallet = () => {
    setCurrentAccount(null);
  };
  useEffect(() => {
    if (address) {
      setCurrentAccount(address);
      updateBalance();
    }
  }, [address]);
  const updateBalance = async () => {
    if (sdk.provider && currentAccount) {
      const ethProvider = new ethers.providers.Web3Provider(sdk.provider);
      const getBalance = await ethProvider.getBalance(currentAccount);
      const bal = ethers.utils.formatEther(getBalance);
      setAccountBalance(bal);
    }
  };
  const checkIfWalletConnected = async () => {
    if (address) {
      setCurrentAccount(address);
      updateBalance();
    } else {
      console.log("No account");
    }
  };
  useEffect(() => {
    if (connectionStatus === "connected") {
      checkIfWalletConnected();
    }
  }, [connectionStatus]);
  const handleConnect = async () => {
    await connect();
  };
/**********************************************************************************************************
  CREATE NFT - CREATING AN IMAGE NFT THRU THE UPLOAD NFT COMPONENT 
***********************************************************************************************************/


  return (
<NFTMarketplaceContext.Provider
  value={{
    
    handleConnect,
    checkIfWalletConnected,
    
   
  }}
>
  {children}
</NFTMarketplaceContext.Provider>

  );
};