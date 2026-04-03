import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { publicClient } from "../lib/viemClient";
import { formatEther } from "viem";

export const MOHProviderContext = React.createContext();

export const MOHProvider = ({ children }) => {
  const { address, isConnected } = useAccount();
  const [currentAccount, setCurrentAccount] = useState("");
  const [accountBalance, setAccountBalance] = useState("");

  useEffect(() => {
    if (address) {
      setCurrentAccount(address);
      updateBalance();
    }
  }, [address]);

  const updateBalance = async () => {
    if (address) {
      try {
        const balance = await publicClient.getBalance({ address });
        setAccountBalance(formatEther(balance));
      } catch (err) {
        console.error("Error fetching balance:", err);
      }
    }
  };

  const checkIfWalletConnected = async () => {
    if (address) {
      setCurrentAccount(address);
      updateBalance();
    }
  };

  useEffect(() => {
    if (isConnected) {
      checkIfWalletConnected();
    }
  }, [isConnected]);

  const handleConnect = async () => {
    // Connection handled by Reown AppKit modal
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
