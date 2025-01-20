import React, { useEffect, useState } from "react";
import { useAddress } from "@thirdweb-dev/react";
import Web3 from "web3";
import xdripCA_ABI from "../../Context/xdripCA_ABI.json";

// Replace with the correct network URL
const web3 = new Web3("https://bsc-dataseed.binance.org/");  

const XdRiPContractAddress = xdripCA_ABI.address;
const XdRiPContractABI = xdripCA_ABI.abi;
const XdRiPContract = new web3.eth.Contract(XdRiPContractABI, XdRiPContractAddress);

const XdRiPRewardsChecker = () => {
  const address = useAddress();
  const [xdripBalance, setXdripBalance] = useState(null);
  const [rewardStatus, setRewardStatus] = useState(null);

  const checkRewardDistribution = async () => {
    try {
      const lastRewardBlock = await XdRiPContract.methods.lastRewardBlock().call();
      const currentBlock = await web3.eth.getBlockNumber();
       if (currentBlock > lastRewardBlock) {
        setRewardStatus("Distributed");
      } else {
        setRewardStatus("Not yet distributed");
      }
    } catch (error) {
      console.error("Error retrieving reward distribution:", error);
      setRewardStatus("Error checking distribution");
    }
  };

  const fetchXDRIPBalance = async () => {
    try {
      const balance = await XdRiPContract.methods.balanceOf(address).call();
      const formattedBalance = web3.utils.fromWei(balance, "ether");
      setXdripBalance(formattedBalance);
    } catch (error) {
      console.error("Error retrieving XDRIP balance:", error);
      setXdripBalance("Error fetching balance");
    }
  };

  useEffect(() => {
    if (address) {
      checkRewardDistribution();
      fetchXDRIPBalance();
    }
  }, [address]);

  return (
    <div>
      {address ? (
        <div>
          <p>Connected Wallet: {address}</p>
          <p>Reward Distribution Status: {rewardStatus || "Checking..."}</p>
          <p>XDRIP Balance: {xdripBalance !== null ? `${xdripBalance} XDRIP` : "Loading..."}</p>
        </div>
      ) : (
        <p>Please connect your wallet to view your rewards and XDRIP balance.</p>
      )}
    </div>
  );
};

export default XdRiPRewardsChecker;
