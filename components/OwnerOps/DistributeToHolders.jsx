import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ethers } from "ethers";
import distributeCA_ABI from "../../Context/distributeCA_ABI.json";
import mohCA_ABI from "../../Context/mohCA_ABI.json";
import xdripCA_ABI from "../../Context/xdripCA_ABI.json";
import styles from "./Distribute.module.css"; // Import your CSS module
import Web3 from "web3";
import {
  useAddress,
  ConnectWallet,
  useSigner,
} from "@thirdweb-dev/react";

const DistributeRevShare = ({ onBack }) => {
  const [holdersInfo, setHoldersInfo] = useState([]);
  const [status, setStatus] = useState("");
  const [contractBalance, setContractBalance] = useState("0");
  const [depositAmount, setDepositAmount] = useState("");
  const [distributePercentage, setDistributePercentage] = useState(20); // Default percentage
  const [newPercentage, setNewPercentage] = useState("");
  const [setDistributeContract] = useState(null);
  const [setMohContract] = useState(null);
  const [currentMOHContract, setCurrentMOHContract] = useState("Fetching...");
  const [newMOHContract, setNewMOHContract] = useState(""); // For updating MOH contract in UI
  const [fundsDistributedEvents, setFundsDistributedEvents] = useState([]);
  const [fundsDepositedEvents, setFundsDepositedEvents] = useState([]);
  const [investorPaidEvents, setInvestorPaidEvents] = useState([]);

  // Setup Web3 for XdRiP calls.
  const web3 = new Web3("https://bsc-dataseed1.binance.org/");
  const XdRiPContractAddress = xdripCA_ABI.address;
  const XdRiPContractABI = xdripCA_ABI.abi;
  const XdRiPContract = new web3.eth.Contract(XdRiPContractABI, XdRiPContractAddress);



const address = useAddress();
  const signer = useSigner();

  const mohContract = useMemo(() => {
    return signer
      ? new ethers.Contract(
          mohCA_ABI.address,
          mohCA_ABI.abi,
          signer
        )
      : null;
  }, [signer]);

  const distributeContract = useMemo(() => {
    return signer
      ? new ethers.Contract(
        distributeCA_ABI.address,
        distributeCA_ABI.abi,
          signer
        )
      : null;
  }, [signer]);


  useEffect(() => {
    const initializeContracts = async () => {
      try {
        if (!window.ethereum) {
          setStatus("Please install a web3 wallet");
          return;
        }
        // Request wallet access (ensure wallet is on testnet for MOH/Distribution)
        await window.ethereum.request({ method: "eth_requestAccounts" });
        
        // *** Use dedicated testnet RPC for MOH and Distribution contracts ***
        const TESTNET_RPC = "https://data-seed-prebsc-1-s1.binance.org:8545/";
        const testnetProvider = new ethers.providers.JsonRpcProvider(TESTNET_RPC);
        const testnetSigner = testnetProvider.getSigner();
  
        
        

        

        setDistributeContract(distributeInstance);
  
        // Get testnet contract balance (optional example)
        const balance = await testnetProvider.getBalance(distributeCA_ABI.address);
        console.log("Testnet contract balance:", ethers.utils.formatEther(balance));
  
        setStatus("Contracts initialized successfully on testnet.");
  
        // *** XdRiP is still handled via your existing mainnet Web3 instance ***
        // (Your current code instantiates XdRiP like this:)
        // const web3 = new Web3("https://bsc-dataseed1.binance.org/");
        // const XdRiPContract = new web3.eth.Contract(xdripCA_ABI.abi, xdripCA_ABI.address);
        // (This remains unchanged.)
        
      } catch (error) {
        console.error("Error initializing contracts:", error);
        setStatus("Error initializing contracts. See console for details.");
      }
    };
  
    initializeContracts();
  }, []);
  

  // Function to fetch the XdRiP balance for an address using Web3
  const fetchXDRIPBalance = async (address) => {
    try {
      const balance = await XdRiPContract.methods.balanceOf(address).call();
      const formattedBalance = web3.utils.fromWei(balance, "gwei");
      return parseFloat(formattedBalance);
    } catch (error) {
      console.error("Error retrieving XDRIP balance:", error);
      return 0;
    }
  };

  // Function to fetch the balance of the distribution contract
  const fetchContractBalance = async () => {
    if (!distributeContract) return;
    try {
      const balance = await distributeContract.provider.getBalance(distributeCA_ABI.address);
      setContractBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error("Error fetching balance:", error);
      setStatus("Error fetching balance.");
    }
  };

  // Fetch holders info and compute final weight (baseWeight plus bonus)
  const fetchHoldersInfo = async () => {
    if (!mohContract) {
      setStatus("MOH contract not loaded.");
      return;
    }

    try {
      setStatus("Fetching Medal holders...");
      const holderMap = {};

      const DOTWeights = {
        COMMON: 10,
        UNCOMMON: 25,
        RARE: 45,
        EPIC: 70,
        LEGENDARY: 110,
      };

      const medalOrder = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY"];
      const tokenRanges = [
        { start: 1, end: 10000, weight: DOTWeights.COMMON, name: "COMMON" },
        { start: 10001, end: 15000, weight: DOTWeights.UNCOMMON, name: "UNCOMMON" },
        { start: 15001, end: 17500, weight: DOTWeights.RARE, name: "RARE" },
        { start: 17501, end: 18500, weight: DOTWeights.EPIC, name: "EPIC" },
        { start: 18501, end: 20000, weight: DOTWeights.LEGENDARY, name: "LEGENDARY" },
      ];

      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      // Loop through token ranges to build holderMap
      for (const range of tokenRanges) {
        for (let tokenId = range.start; tokenId <= range.end; tokenId++) {
          try {
            const owner = await mohContract.ownerOf(tokenId);
            if (owner) {
              if (!holderMap[owner]) {
                holderMap[owner] = { medals: [] };
              }
              holderMap[owner].medals.push({ tokenId, name: range.name });
            }
          } catch (error) {
            // If the token doesn't exist, we skip further tokens in this range
            console.warn(`Token ID ${tokenId} not found: ${error.message}`);
            break;
          }
          await delay(100); // Slight delay to avoid rate limits
        }
      }

      // Process holders and calculate weights
      const holders = Object.entries(holderMap).map(([address, data]) => {
        let totalWeight = 0;
        const tierCounts = medalOrder.reduce((counts, tier) => {
          counts[tier] = 0;
          return counts;
        }, {});

        data.medals.forEach((medal) => {
          if (tierCounts[medal.name] !== undefined) {
            tierCounts[medal.name]++;
          }
        });

        // Calculate full ramps (using the smallest count among tiers)
        const fullRamps = Math.min(...medalOrder.map((tier) => tierCounts[tier]));
        totalWeight += fullRamps * DOTWeights["LEGENDARY"];

        // Add the weight for the highest tier that has extra medals
        const remainingMedals = medalOrder.filter((tier) => tierCounts[tier] > fullRamps);
        if (remainingMedals.length > 0) {
          const highestRemainingTier = remainingMedals[remainingMedals.length - 1];
          totalWeight += DOTWeights[highestRemainingTier];
        }

        console.log(`Address: ${address}, Tier Counts:`, tierCounts);
        console.log(`Address: ${address}, Full Ramps: ${fullRamps}, Total Weight: ${totalWeight}`);

        return { address, weight: totalWeight, medals: data.medals };
      });

      // For each holder, get XdRiP balance and compute revshare bonus
      const updatedHolders = [];
      for (const holder of holders) {
        const xdripBal = await fetchXDRIPBalance(holder.address);
        // Compute percentage (example: total supply assumed to be 1e9)
        const xdripPercentage = (xdripBal / 1e9) * 100;
        let revshareBonus = 0;
        if (xdripPercentage >= 1.48) revshareBonus = 15;
        else if (xdripPercentage >= 1.25) revshareBonus = 10;
        else if (xdripPercentage >= 1) revshareBonus = 7;
        else if (xdripPercentage >= 0.75) revshareBonus = 5;
        else if (xdripPercentage >= 0.5) revshareBonus = 2;

        console.log("XdRiP percentage:", xdripPercentage);

        // Compute scaled bonus and final weight
        const scaledBonus = holder.weight * (revshareBonus / 100);
        const finalWeight = holder.weight + scaledBonus;
        const bonusAmount = scaledBonus; // This value represents the bonus portion

        updatedHolders.push({
          ...holder,
          xdripBalance: xdripBal,
          revshareBonus,
          bonusAmount,      // For display
          scaledBonus,      // Scaled value used on-chain
          finalWeight,      // Final computed weight
        });
      }

      setHoldersInfo(updatedHolders);
      setStatus("Medal holders, weights, and XdRiP balances fetched successfully.");
    } catch (error) {
      console.error("Error fetching Medal holders:", error);
      setStatus("Error fetching Medal holders.");
    }
  };

  // Update bonus weights on-chain and then trigger revenue distribution
  const updateBonusWeightsAndDistribute = async () => {
    if (!distributeContract) {
      setStatus("Distribution contract not loaded.");
      return;
    }
    if (holdersInfo.length === 0) {
      setStatus("No holders info available.");
      return;
    }
    try {
      const addresses = [];
      const bonusValues = [];
      holdersInfo.forEach((holder) => {
        addresses.push(holder.address);
        bonusValues.push(holder.scaledBonus); // scaledBonus preserves the percentage bonus
      });
      
      setStatus("Updating bonus weights on-chain...");
      let tx = await distributeContract.updateXdRiPWeights(addresses, bonusValues);
      await tx.wait();

      console.log("Addresses being sent:", addresses);
      console.log("Bonus weights being sent:", bonusValues);
  
      setStatus("Bonus weights updated. Distributing revenue...");
      tx = await distributeContract.distributeRevenue();
      await tx.wait();
      setStatus("Revenue distributed successfully!");
      fetchContractBalance();
    } catch (error) {
      console.error("Error updating bonus weights and distributing:", error);
      setStatus("Error updating bonus weights or distributing revenue.");
    }
  };

  const distributeRevenue = async () => {
    if (!distributeContract) {
      setStatus("Distribution contract not loaded.");
      return;
    }
    try {
      setStatus("Distributing revenue...");
      const tx = await distributeContract.distributeRevenue();
      await tx.wait();
      setStatus("Revenue distributed successfully!");
      fetchContractBalance();
    } catch (error) {
      console.error("Error distributing revenue:", error);
      setStatus("Error distributing revenue.");
    }
  };

  const updateDistributionPercentage = async () => {
    if (!distributeContract) {
      setStatus("Distribution contract not loaded.");
      return;
    }
    const parsedPercentage = parseInt(newPercentage, 10);
    if (isNaN(parsedPercentage) || parsedPercentage <= 0 || parsedPercentage > 100) {
      setStatus("Enter a valid percentage (1-100).");
      return;
    }
    try {
      setStatus("Updating distribution percentage...");
      const tx = await distributeContract.updateDistributionPercentage(parsedPercentage);
      await tx.wait();
      setDistributePercentage(parsedPercentage);
      setNewPercentage("");
      setStatus("Distribution percentage updated successfully.");
    } catch (error) {
      console.error("Error updating distribution percentage:", error);
      setStatus("Error updating distribution percentage.");
    }
  };

  const handleDepositFunds = async () => {
    if (!distributeContract) {
      setStatus("Distribution contract not loaded.");
      return;
    }
    try {
      setStatus("Depositing funds...");
      const signer = distributeContract.provider.getSigner();
      const tx = await signer.sendTransaction({
        to: distributeCA_ABI.address,
        value: ethers.utils.parseEther(depositAmount),
      });
      await tx.wait();
      setDepositAmount("");
      setStatus(`${depositAmount} BNB deposited successfully.`);
      fetchContractBalance();
    } catch (error) {
      console.error("Error depositing funds:", error);
      setStatus("Error depositing funds.");
    }
  };

  const shortenAddress = (address) => {
    if (!address) return "";
    return address.substring(0, 6) + "..." + address.substring(address.length - 4);
  };

  // Update the MOH contract address in the distribution contract
  const fetchCurrentMOHContract = async () => {
    try {
      if (!distributeContract) {
        setStatus("Distribute contract not initialized.");
        return;
      }
      const currentAddress = await distributeContract.mohContract();
      setCurrentMOHContract(currentAddress);
    } catch (error) {
      console.error("Error fetching current MOH contract address:", error);
      setCurrentMOHContract("Error fetching address");
    }
  };

  const updateMOHContractInDistribute = async () => {
    try {
      if (!ethers.utils.isAddress(newMOHContract)) {
        setStatus("Invalid Ethereum address.");
        return;
      }
      setStatus("Updating MOH contract in the Distribute Contract...");
      const tx = await distributeContract.updateMOHContract(newMOHContract);
      await tx.wait();
      const updatedAddress = await distributeContract.mohContract();
      setCurrentMOHContract(updatedAddress);
      setStatus("MOH contract updated successfully.");
      setNewMOHContract("");
    } catch (error) {
      console.error("Error updating MOH contract:", error);
      setStatus("Failed to update MOH contract. Check permissions.");
    }
  };

  useEffect(() => {
    fetchCurrentMOHContract();
  }, [distributeContract]);

  // Fetch events related to revenue distribution
  const fetchAndDisplayEvents = async () => {
    if (!distributeContract) {
      setStatus("Distribute contract not loaded.");
      return;
    }
    try {
      setStatus("Fetching events...");
      const startBlock = 46846649; // Replace with your deployment block
      const latestBlock = await distributeContract.provider.getBlockNumber();
      
      // FundsDistributed events
      const fundsFilter = distributeContract.filters.FundsDistributed();
      const fundsEvents = await distributeContract.queryFilter(fundsFilter, startBlock, latestBlock);
      const fundsDistributed = fundsEvents.map((event) => ({
        totalDistributed: ethers.utils.formatEther(event.args.totalDistributed.toString()),
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash,
      }));

      // FundsDeposited events
      const depositFilter = distributeContract.filters.FundsDeposited();
      const depositEvents = await distributeContract.queryFilter(depositFilter, startBlock, latestBlock);
      const fundsDeposited = depositEvents.map((event) => ({
        depositor: event.args.depositor,
        amount: ethers.utils.formatEther(event.args.amount.toString()),
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash,
      }));

      // InvestorPaid events
      const investorFilter = distributeContract.filters.investorPaid();
      const investorEvents = await distributeContract.queryFilter(investorFilter, startBlock, latestBlock);
      const investorPaid = investorEvents.map((event) => ({
        investor: event.args.investor,
        amount: ethers.utils.formatEther(event.args.amount.toString()),
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash,
      }));

      console.log("FundsDistributed Events:", fundsDistributed);
      console.log("FundsDeposited Events:", fundsDeposited);
      console.log("InvestorPaid Events:", investorPaid);
      setFundsDistributedEvents(fundsDistributed);
      setFundsDepositedEvents(fundsDeposited);
      setInvestorPaidEvents(investorPaid);
      setStatus("Events fetched successfully.");
    } catch (error) {
      console.error("Error fetching events:", error);
      setStatus("Error fetching events. Check console for details.");
    }
  };

  // Example of fetching XdRiP Transfer events via Web3
  const fetchXDRIPTransferEvents = async () => {
    try {
      console.log("Fetching XDRIP Transfer events with Web3...");
      const XdRiPContractInstance = new web3.eth.Contract(XdRiPContractABI, XdRiPContractAddress);
      const events = await XdRiPContractInstance.getPastEvents("Transfer", {
        fromBlock: 0,
        toBlock: "latest",
      });
      if (events.length === 0) {
        console.log("No Transfer events found for XDRIP.");
      } else {
        events.slice(0, 5).forEach((evt, idx) => {
          console.log(`Transfer event #${idx}`, {
            from: evt.returnValues.from,
            to: evt.returnValues.to,
            amount: evt.returnValues.value,
            blockNumber: evt.blockNumber,
            txHash: evt.transactionHash,
          });
        });
        console.log(`Total Transfer events found: ${events.length}`);
      }
    } catch (error) {
      console.error("Error fetching XDRIP Transfer events with Web3:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Revenue Distribution</h2>
      <p className={styles.status}>{status}</p>

      <div className={styles.buttonSection}>
        <button onClick={fetchHoldersInfo} className={styles.button}>
          Fetch Medal Holders
        </button>
        <button
          onClick={distributeRevenue}
          disabled={!holdersInfo.length}
          className={styles.button}
        >
          Distribute Revenue
        </button>
      </div>

      <button onClick={fetchXDRIPTransferEvents}>Fetch XDRIP Transfer Events</button>

      <div className={styles.inputGroup}>
        <input
          type="text"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          placeholder="Deposit Amount in BNB"
          className={styles.input}
        />
        <button onClick={handleDepositFunds} className={styles.buttonSmall}>
          Deposit Funds
        </button>
      </div>

      <div className={styles.infoSection}>
        <p>
          <strong>Available Balance:</strong> {contractBalance} BNB
        </p>
        <p>
          <strong>Current Distribution Percentage:</strong> {distributePercentage}%
        </p>
      </div>

      <div className={styles.inputGroup}>
        <input
          type="number"
          value={newPercentage}
          onChange={(e) => setNewPercentage(e.target.value)}
          placeholder="Set New Percentage"
          className={styles.input}
        />
        <button onClick={updateDistributionPercentage} className={styles.buttonSmall}>
          Update Percentage
        </button>
      </div>

      <div className={styles.section}>
        <h2 className={styles.subheading}>Update MOH Contract</h2>
        <div className={styles.updateMOHContract}>
          <p>
            <strong>Current MOH Contract:</strong>{" "}
            <span
              className={styles.copyableAddress}
              onClick={() => navigator.clipboard.writeText(currentMOHContract)}
              title={`Click to copy ${currentMOHContract}`}
            >
              {shortenAddress(currentMOHContract)}
            </span>
          </p>
          <input
            type="text"
            value={newMOHContract}
            onChange={(e) => setNewMOHContract(e.target.value)}
            placeholder="Enter new MOH contract address"
            className={styles.input}
          />
          <button onClick={updateMOHContractInDistribute} className={styles.updatePercentagesBtn}>
            Update MOH Contract
          </button>
        </div>
      </div>

      <button onClick={fetchAndDisplayEvents} className={styles.button}>
        Fetch Distribution Events
      </button>

      {fundsDistributedEvents.length > 0 && (
        <div className={styles.tableContainer}>
          <h3>FundsDistributed Events</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Total Distributed (BNB)</th>
                <th>Block Number</th>
                <th>Transaction Hash</th>
              </tr>
            </thead>
            <tbody>
              {fundsDistributedEvents.map((event, index) => (
                <tr key={index}>
                  <td>{event.totalDistributed}</td>
                  <td>{event.blockNumber}</td>
                  <td>
                    <a
                      href={`https://testnet.bscscan.com/tx/${event.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {event.transactionHash.substring(0, 10)}...
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {fundsDepositedEvents.length > 0 && (
        <div className={styles.tableContainer}>
          <h3>FundsDeposited Events</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Depositor</th>
                <th>Amount (BNB)</th>
                <th>Block Number</th>
                <th>Transaction Hash</th>
              </tr>
            </thead>
            <tbody>
              {fundsDepositedEvents.map((event, index) => (
                <tr key={index}>
                  <td>{shortenAddress(event.depositor)}</td>
                  <td>{event.amount}</td>
                  <td>{event.blockNumber}</td>
                  <td>
                    <a
                      href={`https://testnet.bscscan.com/tx/${event.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {event.transactionHash.substring(0, 10)}...
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {investorPaidEvents.length > 0 && (
        <div className={styles.tableContainer}>
          <h3>InvestorPaid Events</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Investor</th>
                <th>Amount (BNB)</th>
                <th>Block Number</th>
                <th>Transaction Hash</th>
              </tr>
            </thead>
            <tbody>
              {investorPaidEvents.map((event, index) => (
                <tr key={index}>
                  <td>{event.investor}</td>
                  <td>{event.amount}</td>
                  <td>{event.blockNumber}</td>
                  <td>
                    <a
                      href={`https://testnet.bscscan.com/tx/${event.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {event.transactionHash.substring(0, 10)}...
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button onClick={onBack} className={styles.backButton} aria-label="Back to Owner Operations">
        &larr; Back
      </button>

      {holdersInfo.length > 0 && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Holder Address</th>
                <th className={styles.th}>Final Weight</th>
                <th className={styles.th}>Medals Owned</th>
                <th className={styles.th}>XdRiP Balance</th>
                <th className={styles.th}>Revshare Bonus (%)</th>
              </tr>
            </thead>
            <tbody>
              {holdersInfo.map((holder, index) => (
                <tr key={index} className={styles.tr}>
                  <td className={styles.td}>
                    <span className={styles.copyableAddress}>{shortenAddress(holder.address)}</span>
                  </td>
                  <td className={styles.td}>{holder.finalWeight}</td>
                  <td className={styles.td}>
                    {holder.medals.map((medal, i) => (
                      <div key={i} style={{ marginBottom: "4px" }}>
                        {medal.name} (Token ID: {medal.tokenId})
                      </div>
                    ))}
                  </td>
                  <td className={styles.td}>{holder.xdripBalance}</td>
                  <td className={styles.td}>{holder.revshareBonus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DistributeRevShare;
