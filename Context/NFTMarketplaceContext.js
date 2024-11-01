import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import mohCA_ABI from "./mohCA_ABI.json";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import Web3 from 'web3';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { useRouter } from "next/router";
import { ethers } from "ethers";
import { useSDK, useConnect, useAddress, useConnectionStatus } from "@thirdweb-dev/react";

const web3 = new Web3(Web3.givenProvider);
const MohAddress = mohCA_ABI.address;
const MohABI = mohCA_ABI.abi;

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

const fetchMohContract = (signerOrProvider) =>
  new ethers.Contract(MohAddress, MohABI, signerOrProvider);
export const MOHProviderContext = React.createContext();
export const MOHProvider = ({ children }) => {
  const titleData = "Discover, collect, and sell Dots";
  const sdk = useSDK();
  const connect = useConnect();
  const address = useAddress();
  const connectionStatus = useConnectionStatus();
  const [error, setError] = useState("");
  const [openError, setOpenError] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");
  const [accountBalance, setAccountBalance] = useState("");
  const [dots, setDots] = useState([]);
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


  return (
<MOHProviderContext.Provider
  value={{
    
    handleConnect,
    checkIfWalletConnected,
    
   
  }}
>
  {children}
</MOHProviderContext.Provider>

  );
};