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

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import distributeCA_ABI from "../../Context/distributeCA_ABI.json";
import mohCA_ABI from "../../Context/mohCA_ABI.json";
import xdripCA_ABI from "../../Context/xdripCA_ABI.json";
import styles from "./Distribute.module.css"; // Import the CSS module
import Web3 from "web3";

const DistributeRevShare = ({ onBack }) => {
  const [holdersInfo, setHoldersInfo] = useState([]);
  const [status, setStatus] = useState("");
  const [contractBalance, setContractBalance] = useState("0");
  const [depositAmount, setDepositAmount] = useState("");
  const [distributePercentage, setDistributePercentage] = useState(20); // Default percentage
  const [newPercentage, setNewPercentage] = useState("");
  const [distributeContract, setDistributeContract] = useState(null);
  const [mohContract, setMohContract] = useState(null);
  const [xdripBalance, setXdripBalance] = useState(null);

  const XdRiPContractAddress = xdripCA_ABI.address;
  const XdRiPContractABI = xdripCA_ABI.abi;
  const web3 = new Web3("https://bsc-dataseed1.binance.org/");
  
  const XdRiPContract = new web3.eth.Contract(XdRiPContractABI, XdRiPContractAddress);



  
  useEffect(() => {
    const initializeContracts = async () => {
      try {
        if (!window.ethereum) {
          setStatus("Please install a web3 wallet");
          return;
        }

        await window.ethereum.request({ method: "eth_requestAccounts" });

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const mohInstance = new ethers.Contract(mohCA_ABI.address, mohCA_ABI.abi, signer);
        setMohContract(mohInstance);

        const distributeInstance = new ethers.Contract(distributeCA_ABI.address, distributeCA_ABI.abi, signer);
        setDistributeContract(distributeInstance);

        const xdripInstance = new ethers.Contract(
            xdripCA_ABI.address, 
            xdripCA_ABI.abi, 
            signer
          );
          setXdripContract(xdripInstance);

        const balance = await provider.getBalance(distributeCA_ABI.address);
        setContractBalance(ethers.utils.formatEther(balance));

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
  
      // Fetch holders and medals
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
            console.warn(`Token ID ${tokenId} not found: ${error.message}`);
            break; 
          }
        }
        await delay(100); 
      }
  
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
  
        const fullRamps = Math.min(...medalOrder.map((tier) => tierCounts[tier]));
        totalWeight += fullRamps * DOTWeights["LEGENDARY"]; // Add weight for full ramps
  
        const remainingMedals = medalOrder.filter((tier) => tierCounts[tier] > fullRamps);
        if (remainingMedals.length > 0) {
          const highestRemainingTier = remainingMedals[remainingMedals.length - 1];
          totalWeight += DOTWeights[highestRemainingTier];
        }
  
        console.log(`Address: ${address}, Tier Counts:`, tierCounts);
        console.log(`Address: ${address}, Full Ramps: ${fullRamps}, Total Weight: ${totalWeight}`);
  
        return {
          address,
          weight: totalWeight,
          medals: data.medals, // Pass medals for display
        };
      });
  
      /* based on full wallet regardles */
      const updatedHolders = [];
      for (const holder of holders) {
        const xdripBalance = await fetchXDRIPBalance(holder.address);
  
        // revshare bonus based on XdRiP balance as percentage of total supply
        // add a revbonus percent of their current distribution
        const xdripPercentage = (xdripBalance / 1e9) * 100; // 1B is the total supply of XdRiP
        let revshareBonus = 0;
  
        if (xdripPercentage >= 1.48) {
            revshareBonus = 15; 
          } else if (xdripPercentage >= 1.25) {
            revshareBonus = 10; 
          } else if (xdripPercentage >= 1) {
            revshareBonus = 7; 
          } else if (xdripPercentage >= 0.75) {
            revshareBonus = 5; 
          } else if (xdripPercentage >= 0.5) {
            revshareBonus = 2; 
          } else {
            revshareBonus = 0; 
          }
  
        
        const finalWeight = holder.weight > 0 ? holder.weight + holder.weight * (revshareBonus / 100) : 0;
  
        updatedHolders.push({
          ...holder,
          xdripBalance,
          revshareBonus,
          finalWeight,
        });
      }
      
      setHoldersInfo(updatedHolders);
      setStatus("Medal holders, weights, and XdRiP balances fetched successfully.");
    } catch (error) {
      console.error("Error fetching Medal holders:", error);
      setStatus("Error fetching Medal holders.");
    }
  };


      /* // based on orig docs 
      const updatedHolders = [];
      for (const holder of holders) {
          const xdripBalance = await fetchXDRIPBalance(holder.address);
          const xdripPercentage = (xdripBalance / 1e9) * 100;
          const ownedTiers = holder.medals.map((medal) => medal.name);
          const highestOwnedTier = Math.max(
              ...ownedTiers.map((tier) => medalOrder.indexOf(tier))
          );

          let revshareBonus = 0;

          // Check bonus eligibility based on highest owned tier and XdRiP percentage
          if (highestOwnedTier >= medalOrder.indexOf("LEGENDARY") && xdripPercentage >= 1.48) {
              revshareBonus = 15; // 1.48% with LEGENDARY or higher
          } else if (highestOwnedTier >= medalOrder.indexOf("EPIC") && xdripPercentage >= 1.25) {
              revshareBonus = 10; // 1.25% with EPIC or higher
          } else if (highestOwnedTier >= medalOrder.indexOf("RARE") && xdripPercentage >= 1) {
              revshareBonus = 7; // 1% with RARE or higher
          } else if (highestOwnedTier >= medalOrder.indexOf("UNCOMMON") && xdripPercentage >= 0.75) {
              revshareBonus = 5; // 0.75% with UNCOMMON or higher
          } else if (highestOwnedTier >= medalOrder.indexOf("COMMON") && xdripPercentage >= 0.5) {
              revshareBonus = 2; // 0.5% with COMMON or higher
          }

          // Apply the XdRiP bonus to the total weight
          const finalWeight = holder.weight > 0 ? holder.weight + holder.weight * (revshareBonus / 100) : 0;

          updatedHolders.push({
              ...holder,
              xdripBalance,
              revshareBonus,
              finalWeight,
          });
      }

  */

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
    const start = address.substring(0, 6);
    const end = address.substring(address.length - 4);
    return `${start}...${end}`;
  };



  const [newMOHContract, setNewMOHContract] = useState(""); // Input for the new MOH contract address
const [currentMOHContract, setCurrentMOHContract] = useState("Fetching..."); // Display the current MOH contract address

// Fetch the current MOH contract address from the Distribute Contract
const fetchCurrentMOHContract = async () => {
  try {
    if (!distributeContract) {
      setStatus("Distribute contract not initialized.");
      return;
    }
    const currentAddress = await distributeContract.mohContract(); // Fetch the current MOH contract
    setCurrentMOHContract(currentAddress);
  } catch (error) {
    console.error("Error fetching current MOH contract address:", error);
    setCurrentMOHContract("Error fetching address");
  }
};

// Update MOH contract in the Distribute Contract
const updateMOHContractInDistribute = async () => {
  try {
    if (!ethers.utils.isAddress(newMOHContract)) {
      setStatus("Invalid Ethereum address.");
      return;
    }

    setStatus("Updating MOH contract in the Distribute Contract...");
    const tx = await distributeContract.updateMOHContract(newMOHContract); // Call the method
    await tx.wait();

    // Fetch the updated address to update the UI
    const updatedAddress = await distributeContract.mohContract();
    setCurrentMOHContract(updatedAddress);

    setStatus("MOH contract updated successfully.");
    setNewMOHContract(""); // Clear input field
  } catch (error) {
    console.error("Error updating MOH contract in the Distribute Contract:", error);
    setStatus("Failed to update MOH contract. Check permissions.");
  }
};

// Fetch current MOH contract address when the component mounts
useEffect(() => {
  fetchCurrentMOHContract();
}, [distributeContract]);



  const fetchEvents = async () => {
  if (!distributeContract) {
    setStatus("Distribute contract not loaded.");
    return;
  }

  try {
    setStatus("Fetching distribution events...");

    // Fetch FundsDistributed events
    const fundsFilter = distributeContract.filters.FundsDistributed();
    const fundsEvents = await distributeContract.queryFilter(fundsFilter, 0, "latest");
    const fundsDistributed = fundsEvents.map((event) => ({
      totalDistributed: ethers.utils.formatEther(event.args.totalDistributed),
      blockNumber: event.blockNumber,
    }));

    // Fetch investorPaid events
    const investorFilter = distributeContract.filters.investorPaid();
    const investorEvents = await distributeContract.queryFilter(investorFilter, 0, "latest");
    const investorPaid = investorEvents.map((event) => ({
      investor: event.args.investor,
      amount: ethers.utils.formatEther(event.args.amount),
      blockNumber: event.blockNumber,
    }));

    console.log("FundsDistributed:", fundsDistributed);
    console.log("InvestorPaid:", investorPaid);

    setStatus("Events fetched successfully!");
  } catch (error) {
    console.error("Error fetching events:", error);
    setStatus("Error fetching events. Check console.");
  }
};


const fetchDistributeEvents = async (startBlock, endBlock, batchSize = 50000) => {
    const fundsDistributed = [];
    const investorPaid = [];
  
    try {
      for (let fromBlock = startBlock; fromBlock <= endBlock; fromBlock += batchSize) {
        const toBlock = Math.min(fromBlock + batchSize - 1, endBlock);
  
        console.log(`Fetching events from block ${fromBlock} to ${toBlock}...`);
  
        // Create filters explicitly for each event
        const fundsFilter = {
          address: distributeContract.address,
          topics: [distributeContract.interface.getEventTopic("***FundsDistributed")],
          fromBlock,
          toBlock,
        };
  
        const investorFilter = {
          address: distributeContract.address,
          topics: [distributeContract.interface.getEventTopic("***FundsDeposited")],
          fromBlock,
          toBlock,
        };
  
        // Fetch FundsDistributed logs
        const fundsLogs = await distributeContract.provider.getLogs(fundsFilter);
        fundsLogs.forEach((log) => {
          const parsedLog = distributeContract.interface.parseLog(log);
          fundsDistributed.push({
            totalDistributed: ethers.utils.formatEther(parsedLog.args.totalDistributed),
            blockNumber: log.blockNumber,
            transactionHash: log.transactionHash,
          });
        });
  
        // Fetch investorPaid logs
        const investorLogs = await distributeContract.provider.getLogs(investorFilter);
        investorLogs.forEach((log) => {
          const parsedLog = distributeContract.interface.parseLog(log);
          investorPaid.push({
            investor: parsedLog.args.investor,
            amount: ethers.utils.formatEther(parsedLog.args.amount),
            blockNumber: log.blockNumber,
            transactionHash: log.transactionHash,
          });
        });
  
        console.log(`Batch from ${fromBlock} to ${toBlock} fetched successfully.`);
      }
  
      return { fundsDistributed, investorPaid };
    } catch (error) {
      console.error(`Error fetching events from block ${startBlock} to ${endBlock}:`, error);
      throw error;
    }
  };
  


  const fetchAndDisplayEvents = async () => {
    if (!distributeContract) {
      setStatus("Distribute contract not loaded.");
      return;
    }
  
    try {
      setStatus("Fetching events...");
      
      const startBlock = 46846649; // Replace with your deployment block
      const latestBlock = await distributeContract.provider.getBlockNumber();
  
      // Fetch FundsDistributed events
      const fundsFilter = distributeContract.filters.FundsDistributed();
      const fundsEvents = await distributeContract.queryFilter(fundsFilter, startBlock, latestBlock);
  
      const fundsDistributed = fundsEvents.map((event) => ({
        totalDistributed: ethers.utils.formatEther(event.args.totalDistributed.toString()), // Ensure BigNumber conversion
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash,
      }));
  
      // Fetch FundsDeposited events
      const depositFilter = distributeContract.filters.FundsDeposited();
      const depositEvents = await distributeContract.queryFilter(depositFilter, startBlock, latestBlock);
  
      const fundsDeposited = depositEvents.map((event) => ({
        depositor: event.args.depositor,
        amount: ethers.utils.formatEther(event.args.amount.toString()), // Ensure BigNumber conversion
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash,
      }));
  
      // Fetch investorPaid events
      const investorFilter = distributeContract.filters.investorPaid();
      const investorEvents = await distributeContract.queryFilter(investorFilter, startBlock, latestBlock);
  
      const investorPaid = investorEvents.map((event) => ({
        investor: event.args.investor,
        amount: ethers.utils.formatEther(event.args.amount.toString()), // Ensure BigNumber conversion
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
      setStatus("Error fetching events. Check console.");
    }
  };
  
  
  const [fundsDistributedEvents, setFundsDistributedEvents] = useState([]);
  const [fundsDepositedEvents, setFundsDepositedEvents] = useState([]);
  const [investorPaidEvents, setInvestorPaidEvents] = useState([]);
  const [xdripContract2, setXdripContract] = useState(null);

  async function fetchXDRIPTransferEvents() {
    try {
      console.log("Fetching XDRIP Transfer events with Web3...");
  
      // Use the Web3 contract you created at the top:
       XdRiPContract = new web3.eth.Contract(XdRiPContractABI, XdRiPContractAddress);
  
      const events = await XdRiPContract.getPastEvents("Transfer", {
        fromBlock: 0,
        toBlock: "latest"
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
  }
  


  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Revenue Distribution</h2>
      <p className={styles.status}>{status}</p>

      <div className={styles.buttonSection}>
        <button onClick={fetchHoldersInfo} className={styles.button}>
          Fetch Medal Holders
        </button>
        <button onClick={distributeRevenue} disabled={!holdersInfo.length} className={styles.button}>
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
        <p><strong>Available Balance:</strong> {contractBalance} BNB</p>
        <p><strong>Current Distribution Percentage:</strong> {distributePercentage}%</p>
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
        onClick={() => copyToClipboard(currentMOHContract)}
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
    <button
      onClick={updateMOHContractInDistribute}
      className={styles.updatePercentagesBtn}
    >
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
                <th className={styles.th}>Weight</th>
                <th className={styles.th}>Medals Owned</th>
                <th className={styles.th}>XdRiP Balance</th>
                <th className={styles.th}>Revshare Bonus</th>
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
                  <td className={styles.td}>{holder.revshareBonus}%</td>
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
