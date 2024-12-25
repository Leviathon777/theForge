/* works 
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import distributeCA_ABI from "../../Context/distributeCA_ABI.json";
import mohCA_ABI from "../../Context/mohCA_ABI.json";

const DistributeRevShare = () => {
  const [holdersInfo, setHoldersInfo] = useState([]);
  const [status, setStatus] = useState("");
  const [distributeContract, setDistributeContract] = useState(null);
  const [mohContract, setMohContract] = useState(null);

  // Initialize the contracts using a provider
  useEffect(() => {
    const initializeContracts = async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/");


        // MOH Contract
        const mohInstance = new ethers.Contract(
          mohCA_ABI.address,
          mohCA_ABI.abi,
          provider
        );
        setMohContract(mohInstance);

        // Distribution Contract
        const distributeInstance = new ethers.Contract(
          distributeCA_ABI.address,
          distributeCA_ABI.abi,
          provider
        );
        setDistributeContract(distributeInstance);

        setStatus("Contracts initialized successfully.");
        console.log("MOH Contract:", mohInstance);
        console.log("Distribute Contract:", distributeInstance);
      } catch (error) {
        console.error("Error initializing contracts:", error);
        setStatus("Error initializing contracts. See console for details.");
      }
    };

    initializeContracts();
  }, []);

  // Fetch holders and token weights
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchHoldersInfo = async () => {
  if (!mohContract) {
    setStatus("MOH contract not loaded.");
    return;
  }

  try {
    setStatus("Fetching holders and their weights...");
    const holderMap = {};

    // Token ID ranges and weights
    const tokenRanges = [
      { start: 1, end: 10000, weight: 1 }, // Common
      { start: 10001, end: 15000, weight: 2 }, // Uncommon
      { start: 15001, end: 17500, weight: 3 }, // Rare
      { start: 17501, end: 18500, weight: 4 }, // Epic
      { start: 18501, end: 20000, weight: 5 }, // Legendary
    ];

    for (const range of tokenRanges) {
      for (let tokenId = range.start; tokenId <= range.end; tokenId++) {
        try {
          const owner = await mohContract.ownerOf(tokenId);
          if (owner) {
            if (holderMap[owner]) {
              holderMap[owner] += range.weight;
            } else {
              holderMap[owner] = range.weight;
            }
          }
        } catch (error) {
          console.warn(`Token ID ${tokenId} not found: ${error.message}`);
          break; // Stop further queries in this range if a gap is found
        }
        await delay(100); // Delay between requests
      }
    }

    const holders = Object.entries(holderMap).map(([address, weight]) => ({
      address,
      weight,
    }));
    setHoldersInfo(holders);
    setStatus("Holders and weights fetched successfully.");
  } catch (error) {
    console.error("Error fetching holders:", error);
    setStatus("Error fetching holders.");
  }
};


  // Distribution function placeholder (optional, for when needed)
  const distributeRevenue = async () => {
    if (!distributeContract) {
      setStatus("Distribution contract not loaded.");
      console.error("Distribution contract is not available.");
      return;
    }

    try {
      setStatus("Distributing revenue...");
      const tx = await distributeContract.distributeRevenue();
      await tx.wait();
      setStatus("Revenue distributed successfully!");
    } catch (error) {
      console.error("Error distributing revenue:", error);
      setStatus("Error distributing revenue.");
    }
  };

  return (
    <div>
      <h2>Revenue Distribution</h2>
      <button onClick={fetchHoldersInfo}>Fetch Holders</button>
      <button onClick={distributeRevenue} disabled={!holdersInfo.length}>
        Distribute Revenue
      </button>
      <p>Status: {status}</p>
      {holdersInfo.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Holder Address</th>
              <th>Total Weight</th>
            </tr>
          </thead>
          <tbody>
            {holdersInfo.map((holder, index) => (
              <tr key={index}>
                <td>{holder.address}</td>
                <td>{holder.weight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DistributeRevShare;
*/

/* works better

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import distributeCA_ABI from "../../Context/distributeCA_ABI.json";
import mohCA_ABI from "../../Context/mohCA_ABI.json";

const DistributeRevShare = () => {
  const [holdersInfo, setHoldersInfo] = useState([]);
  const [status, setStatus] = useState("");
  const [distributeContract, setDistributeContract] = useState(null);
  const [mohContract, setMohContract] = useState(null);

  // Initialize the contracts using a provider
  useEffect(() => {
    const initializeContracts = async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/");

        // MOH Contract
        const mohInstance = new ethers.Contract(
          mohCA_ABI.address,
          mohCA_ABI.abi,
          provider
        );
        setMohContract(mohInstance);

        // Distribution Contract
        const distributeInstance = new ethers.Contract(
          distributeCA_ABI.address,
          distributeCA_ABI.abi,
          provider
        );
        setDistributeContract(distributeInstance);

        setStatus("Contracts initialized successfully.");
      } catch (error) {
        console.error("Error initializing contracts:", error);
        setStatus("Error initializing contracts. See console for details.");
      }
    };

    initializeContracts();
  }, []);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Fetch holders and token weights
  const fetchHoldersInfo = async () => {
    if (!mohContract) {
      setStatus("MOH contract not loaded.");
      return;
    }

    try {
      setStatus("Fetching holders, weights, and medal details...");
      const holderMap = {};

      // Token ID ranges and weights
      const tokenRanges = [
        { start: 1, end: 10000, weight: 1, name: "Common" },
        { start: 10001, end: 15000, weight: 2, name: "Uncommon" },
        { start: 15001, end: 17500, weight: 3, name: "Rare" },
        { start: 17501, end: 18500, weight: 4, name: "Epic" },
        { start: 18501, end: 20000, weight: 5, name: "Legendary" },
      ];

      for (const range of tokenRanges) {
        for (let tokenId = range.start; tokenId <= range.end; tokenId++) {
          try {
            const owner = await mohContract.ownerOf(tokenId);
            if (owner) {
              if (!holderMap[owner]) {
                holderMap[owner] = { weight: 0, medals: [] };
              }
              holderMap[owner].weight += range.weight;
              holderMap[owner].medals.push({ tokenId, name: range.name });
            }
          } catch (error) {
            console.warn(`Token ID ${tokenId} not found: ${error.message}`);
            break; // Stop further queries in this range if a gap is found
          }
          await delay(100); // Delay between requests
        }
      }

      const holders = Object.entries(holderMap).map(([address, data]) => ({
        address,
        weight: data.weight,
        medals: data.medals,
      }));
      setHoldersInfo(holders);
      setStatus("Holders, weights, and medal details fetched successfully.");
    } catch (error) {
      console.error("Error fetching holders:", error);
      setStatus("Error fetching holders.");
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Revenue Distribution</h2>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button onClick={fetchHoldersInfo} style={{ marginRight: "10px" }}>
          Fetch Holders
        </button>
        <p>Status: {status}</p>
      </div>
      {holdersInfo.length > 0 && (
        <table style={{ margin: "0 auto", borderCollapse: "collapse", width: "80%" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "left" }}>
                Holder Address
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
                Total Weight
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "left" }}>
                Medals Owned
              </th>
            </tr>
          </thead>
          <tbody>
            {holdersInfo.map((holder, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {holder.address}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
                  {holder.weight}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {holder.medals.map((medal, i) => (
                    <div key={i} style={{ marginBottom: "4px" }}>
                      {medal.name} (Token ID: {medal.tokenId})
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DistributeRevShare;
*/


/* WORKS 
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAddress, useSigner, useMetamask } from "@thirdweb-dev/react";
import distributeCA_ABI from "../../Context/distributeCA_ABI.json";
import mohCA_ABI from "../../Context/mohCA_ABI.json";

const DistributeRevShare = () => {
  const [holdersInfo, setHoldersInfo] = useState([]);
  const [status, setStatus] = useState("");
  const [contractBalance, setContractBalance] = useState("0");
  const [depositAmount, setDepositAmount] = useState("");
  const [distributePercentage, setDistributePercentage] = useState(20); // Default percentage
  const [newPercentage, setNewPercentage] = useState("");
  const [distributeContract, setDistributeContract] = useState(null);
  const [mohContract, setMohContract] = useState(null);

  const address = useAddress();
  const signer = useSigner();
  const connectWithMetamask = useMetamask();

  useEffect(() => {
    const initializeContracts = async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/");

        // Initialize MOH Contract
        const mohInstance = new ethers.Contract(
          mohCA_ABI.address,
          mohCA_ABI.abi,
          provider
        );
        setMohContract(mohInstance);

        // Initialize Distribution Contract
        const distributeInstance = new ethers.Contract(
          distributeCA_ABI.address,
          distributeCA_ABI.abi,
          provider
        );
        setDistributeContract(distributeInstance);

        // Fetch initial contract balance
        const balance = await provider.getBalance(distributeCA_ABI.address);
        setContractBalance(ethers.utils.formatEther(balance));

        // Fetch current distribution percentage
        const currentPercentage = await distributeInstance.getDistributionPercentage();
        setDistributePercentage(currentPercentage.toNumber());

        setStatus("Contracts initialized successfully.");
      } catch (error) {
        console.error("Error initializing contracts:", error);
        setStatus("Error initializing contracts. See console for details.");
      }
    };

    initializeContracts();
  }, []);

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

  const handleDepositFunds = async () => {
    if (!signer) {
      setStatus("Connect your wallet to deposit funds.");
      return;
    }
    try {
      setStatus("Depositing funds...");
      const tx = await signer.sendTransaction({
        to: distributeCA_ABI.address,
        value: ethers.utils.parseEther(depositAmount),
      });
      await tx.wait();
      setDepositAmount(""); // Clear the input
      setStatus("Funds deposited successfully.");
      fetchContractBalance(); // Update balance
    } catch (error) {
      console.error("Error depositing funds:", error);
      setStatus("Error depositing funds.");
    }
  };

  const updateDistributionPercentage = async () => {
    if (!distributeContract || !signer) {
      setStatus("Distribution contract or signer not loaded.");
      return;
    }
    try {
      setStatus("Updating distribution percentage...");
      const distributeContractWithSigner = distributeContract.connect(signer);
      const tx = await distributeContractWithSigner.setDistributionPercentage(newPercentage);
      await tx.wait();
      setDistributePercentage(newPercentage);
      setNewPercentage(""); // Clear input
      setStatus("Distribution percentage updated successfully.");
    } catch (error) {
      console.error("Error updating percentage:", error);
      setStatus("Error updating distribution percentage.");
    }
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const fetchHoldersInfo = async () => {
    if (!mohContract) {
      setStatus("MOH contract not loaded.");
      return;
    }
  
    try {
      setStatus("Fetching holders and highest weights...");
      const holderMap = {};
  
      // Token ID ranges and their respective weights
      const tokenRanges = [
        { start: 1, end: 10000, weight: 1, name: "Common" },
        { start: 10001, end: 15000, weight: 2, name: "Uncommon" },
        { start: 15001, end: 17500, weight: 3, name: "Rare" },
        { start: 17501, end: 18500, weight: 4, name: "Epic" },
        { start: 18501, end: 20000, weight: 5, name: "Legendary" },
      ];
  
      for (const range of tokenRanges) {
        for (let tokenId = range.start; tokenId <= range.end; tokenId++) {
          try {
            const owner = await mohContract.ownerOf(tokenId);
            if (owner) {
              // Update holder's weight to the maximum of the current and previous weights
              if (!holderMap[owner]) {
                holderMap[owner] = { weight: range.weight, medals: [] };
              } else if (range.weight > holderMap[owner].weight) {
                holderMap[owner].weight = range.weight; // Keep the highest weight
              }
              holderMap[owner].medals.push({ tokenId, name: range.name });
            }
          } catch (error) {
            console.warn(`Token ID ${tokenId} not found: ${error.message}`);
            break; // Stop further queries in this range if a gap is found
          }
          await delay(100);
        }
      }
  
      const holders = Object.entries(holderMap).map(([address, data]) => ({
        address,
        weight: data.weight,
        medals: data.medals,
      }));
      setHoldersInfo(holders);
      setStatus("Holders and highest weights fetched successfully.");
    } catch (error) {
      console.error("Error fetching holders:", error);
      setStatus("Error fetching holders.");
    }
  };
  

  const distributeRevenue = async () => {
    if (!distributeContract || !signer) {
      setStatus("Distribution contract or signer not loaded.");
      return;
    }
  
    try {
      setStatus("Connecting signer...");
      // Connect the distributeContract with the signer
      const distributeContractWithSigner = distributeContract.connect(signer);
  
      setStatus("Distributing revenue...");
      const tx = await distributeContractWithSigner.distributeRevenue(); // Call distributeRevenue
      await tx.wait();
  
      setStatus("Revenue distributed successfully!");
      fetchContractBalance(); // Update the contract balance
    } catch (error) {
      console.error("Error distributing revenue:", error);
      setStatus(`Error distributing revenue: ${error.message}`);
    }
  };
  
  

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Revenue Distribution</h2>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <p>Contract Balance: {contractBalance} BNB</p>
        <p>Current Distribution Percentage: {distributePercentage}%</p>
        {address ? (
          <>
            <button onClick={fetchHoldersInfo} style={{ marginRight: "10px" }}>
              Fetch Holders
            </button>
            <button
              onClick={distributeRevenue}
              disabled={!holdersInfo.length || !address}
              style={{ marginRight: "10px" }}
            >
              Distribute Revenue
            </button>
            <div style={{ marginTop: "20px" }}>
              <input
                type="text"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Deposit Amount in BNB"
              />
              <button onClick={handleDepositFunds}>Deposit Funds</button>
            </div>
            <div style={{ marginTop: "20px" }}>
              <input
                type="number"
                value={newPercentage}
                onChange={(e) => setNewPercentage(e.target.value)}
                placeholder="Set New Percentage"
              />
              <button onClick={updateDistributionPercentage}>Update Percentage</button>
            </div>
          </>
        ) : (
          <button onClick={connectWithMetamask} style={{ marginRight: "10px" }}>
            Connect Wallet
          </button>
        )}
        <p>Status: {status}</p>
      </div>
      {holdersInfo.length > 0 && (
        <table
          style={{ margin: "0 auto", borderCollapse: "collapse", width: "80%" }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "left" }}>
                Holder Address
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}>
                Total Weight
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px", textAlign: "left" }}>
                Medals Owned
              </th>
            </tr>
          </thead>
          <tbody>
            {holdersInfo.map((holder, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {holder.address}
                </td>
                <td
                  style={{ border: "1px solid #ccc", padding: "8px", textAlign: "center" }}
                >
                  {holder.weight}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {holder.medals.map((medal, i) => (
                    <div key={i} style={{ marginBottom: "4px" }}>
                      {medal.name} (Token ID: {medal.tokenId})
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DistributeRevShare;
*/

// src/components/OwnerOps/DistributeRevShare.jsx
// src/components/OwnerOps/DistributeRevShare.jsx
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import distributeCA_ABI from "../../Context/distributeCA_ABI.json";
import mohCA_ABI from "../../Context/mohCA_ABI.json";
import styles from "./Distribute.module.css"; // Import the CSS module

const DistributeRevShare = ({ onBack }) => {
  const [holdersInfo, setHoldersInfo] = useState([]);
  const [status, setStatus] = useState("");
  const [contractBalance, setContractBalance] = useState("0");
  const [depositAmount, setDepositAmount] = useState("");
  const [distributePercentage, setDistributePercentage] = useState(20); // Default percentage
  const [newPercentage, setNewPercentage] = useState("");
  const [distributeContract, setDistributeContract] = useState(null);
  const [mohContract, setMohContract] = useState(null);

  // Initialize Contracts
  useEffect(() => {
    const initializeContracts = async () => {
      try {
        if (!window.ethereum) {
          setStatus("Please install MetaMask.");
          return;
        }

        await window.ethereum.request({ method: "eth_requestAccounts" });

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // Initialize MOH Contract
        const mohInstance = new ethers.Contract(
          mohCA_ABI.address,
          mohCA_ABI.abi,
          signer
        );
        setMohContract(mohInstance);

        // Initialize Distribution Contract
        const distributeInstance = new ethers.Contract(
          distributeCA_ABI.address,
          distributeCA_ABI.abi,
          signer
        );
        setDistributeContract(distributeInstance);

        // Fetch initial contract balance
        const balance = await provider.getBalance(distributeCA_ABI.address);
        setContractBalance(ethers.utils.formatEther(balance));

        // Fetch current distribution percentage
        const currentPercentage = await distributeInstance.distributionPercentage();
        setDistributePercentage(currentPercentage.toNumber());

        setStatus("Contracts initialized successfully.");
      } catch (error) {
        console.error("Error initializing contracts:", error);
        setStatus("Error initializing contracts. See console for details.");
      }
    };

    initializeContracts();
  }, []);

  // Fetch Holders
  const fetchHoldersInfo = async () => {
    if (!mohContract) {
      setStatus("MOH contract not loaded.");
      return;
    }

    try {
      setStatus("Fetching Medal holders...");
      const holderMap = {};
      const tokenRanges = [
        { start: 1, end: 10000, weight: 1, name: "Common" },
        { start: 10001, end: 15000, weight: 2, name: "Uncommon" },
        { start: 15001, end: 17500, weight: 3, name: "Rare" },
        { start: 17501, end: 18500, weight: 4, name: "Epic" },
        { start: 18501, end: 20000, weight: 5, name: "Legendary" },
      ];

      for (const range of tokenRanges) {
        for (let tokenId = range.start; tokenId <= range.end; tokenId++) {
          try {
            const owner = await mohContract.ownerOf(tokenId);
            if (owner) {
              if (!holderMap[owner]) {
                holderMap[owner] = { weight: range.weight, medals: [] };
              } else if (range.weight > holderMap[owner].weight) {
                holderMap[owner].weight = range.weight;
              }
              holderMap[owner].medals.push({ tokenId, name: range.name });
            }
          } catch (error) {
            console.warn(`Token ID ${tokenId} not found: ${error.message}`);
            break; // Stop further queries in this range if a gap is found
          }
        }
      }

      const holders = Object.entries(holderMap).map(([address, data]) => ({
        address,
        weight: data.weight,
        medals: data.medals,
      }));
      setHoldersInfo(holders);
      setStatus("Medal holders and medal details fetched successfully.");
    } catch (error) {
      console.error("Error fetching Medal holders:", error);
      setStatus("Error fetching Medal holders.");
    }
  };

  // Distribute Revenue
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
      fetchContractBalance(); // Update the contract balance
    } catch (error) {
      console.error("Error distributing revenue:", error);
      setStatus("Error distributing revenue.");
    }
  };

  // Update Distribution Percentage
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

  // Deposit Funds
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
      setStatus("Funds deposited successfully.");
      fetchContractBalance();
    } catch (error) {
      console.error("Error depositing funds:", error);
      setStatus("Error depositing funds.");
    }
  };

  const shortenAddress = (address) => {
    if (!address) return "";
    const start = address.substring(0, 6);
    const end = address.substring(address.length - 4);
    return `${start}...${end}`;
  };


  return (
    <div className={styles.container}>
      

      {/* Heading */}
      <h2 className={styles.heading}>Revenue Distribution</h2>

      {/* Status Message */}
      <p className={styles.status}>{status}</p>

      {/* Action Buttons */}
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

      {/* Deposit Funds Section */}
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

      {/* Update Distribution Percentage Section */}
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

      {/* Contract Balance and Distribution Percentage Display */}
      <div className={styles.infoSection}>
        <p>
          <strong>Available Balance:</strong> {contractBalance} BNB
        </p>
        <p>
          <strong>Current Distribution Percentage:</strong> {distributePercentage}%
        </p>
      </div>
{/* Back Button */}
      <button
        onClick={onBack}
        className={styles.backButton}
        aria-label="Back to Owner Operations"
      >
        &larr; Back
      </button>
      {/* Holders Information Table */}
      {holdersInfo.length > 0 && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Holder Address</th>
                <th className={styles.th}>Weight</th>
                <th className={styles.th}>Medals Owned</th>
              </tr>
            </thead>
            <tbody>
              {holdersInfo.map((holder, index) => (
                <tr key={index} className={styles.tr}>
                  <td className={styles.td}>
        <span
          className={styles.copyableAddress}
          data-fulladdress={holder.address} // For tooltip
        >
          {shortenAddress(holder.address)}
        </span>
      </td>

                  <td className={styles.td}>{holder.weight}</td>
                  <td className={styles.td}>
                    {holder.medals.map((medal, i) => (
                      <div key={i} style={{ marginBottom: "4px" }}>
                        {medal.name} (Token ID: {medal.tokenId})
                      </div>
                    ))}
                  </td>
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
