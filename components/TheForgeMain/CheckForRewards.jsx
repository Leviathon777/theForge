import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { publicClient } from "../../lib/viemClient";
import xdripCA_ABI from "../../Context/xdripCA_ABI.json";

const XdRiPContractAddress = xdripCA_ABI.address;
const XdRiPContractABI = xdripCA_ABI.abi;

const XdRiPRewardsChecker = () => {
  const { address } = useAccount();
  const [xdripBalance, setXdripBalance] = useState(null);
  const [rewardStatus, setRewardStatus] = useState(null);

  const checkRewardDistribution = async () => {
    try {
      const lastRewardBlock = await publicClient.readContract({
        address: XdRiPContractAddress,
        abi: XdRiPContractABI,
        functionName: "lastRewardBlock",
      });
      const currentBlock = await publicClient.getBlockNumber();
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
      const balance = await publicClient.readContract({
        address: XdRiPContractAddress,
        abi: XdRiPContractABI,
        functionName: "balanceOf",
        args: [address],
      });
      const formattedBalance = (Number(balance) / 1e18).toString();
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
