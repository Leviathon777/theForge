/* works 
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAddress, ConnectWallet, useSigner } from "@thirdweb-dev/react";
import DistributeRevShare from "../../components/OwnerOps/DistributeToHolders";
import mohCA_ABI from "../../Context/mohCA_ABI.json";

const OwnerOps = () => {
  const address = useAddress(); // Get the connected wallet address
  const signer = useSigner(); // Get the signer to interact with the contract
  const [status, setStatus] = useState(""); // Status messages
  const [contractInfo, setContractInfo] = useState({
    owner: "Fetching...",
    padronesPercentage: "Fetching...",
    operatingCostsPercentage: "Fetching...",
  });
  const [contractBalance, setContractBalance] = useState("Fetching...");
  const [allocation, setAllocation] = useState({
    padronesPercentage: "",
    operatingCostsPercentage: "",
  });
  const [showDistributePage, setShowDistributePage] = useState(false);

  // Contract initialization
  const mohContract = signer
    ? new ethers.Contract(mohCA_ABI.address, mohCA_ABI.abi, signer)
    : null;

  useEffect(() => {
    const fetchContractDetails = async () => {
      if (!mohContract) {
        setStatus("Contract not initialized. Connect your wallet.");
        return;
      }

      try {
        setStatus("Fetching contract details...");
        const [owner, padronesPercentage, operatingCostsPercentage, balance] =
          await Promise.all([
            mohContract.titolare(),
            mohContract.padronesPercentage(),
            mohContract.operatingCostsPercentage(),
            signer.getBalance(),
          ]);

        setContractInfo({
          owner,
          padronesPercentage: padronesPercentage.toString(),
          operatingCostsPercentage: operatingCostsPercentage.toString(),
        });

        setContractBalance(ethers.utils.formatEther(balance));
        setStatus("Contract details fetched successfully.");
      } catch (error) {
        console.error("Error fetching contract details:", error);
        setStatus("Error fetching contract details.");
      }
    };

    fetchContractDetails();
  }, [mohContract]);

  const updateAllocation = async () => {
    if (!mohContract) {
      setStatus("Contract not initialized. Connect your wallet.");
      return;
    }

    try {
      setStatus("Updating allocation percentages...");
      const tx = await mohContract.setAllocationValue(
        parseInt(allocation.padronesPercentage),
        parseInt(allocation.operatingCostsPercentage)
      );
      await tx.wait();
      setStatus("Allocation percentages updated successfully.");
    } catch (error) {
      console.error("Error updating allocation percentages:", error);
      setStatus("Error updating allocation percentages.");
    }
  };

  const handleOpenDistributePage = () => {
    setShowDistributePage(true);
  };

  const handleBackToOps = () => {
    setShowDistributePage(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Owner Operations</h1>
      <p style={{ textAlign: "center", color: "gray" }}>Status: {status}</p>

      {!address ? (
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <ConnectWallet />
        </div>
      ) : (
        <>
  
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <p>
              <strong>Connected Wallet:</strong> {address}
            </p>
            <p>
              <strong>Wallet Balance:</strong> {contractBalance} ETH
            </p>
          </div>

          {!showDistributePage ? (
            <>
              
              <div style={{ marginBottom: "20px" }}>
                <h2>Contract Details</h2>
                <p>
                  <strong>Owner Address:</strong> {contractInfo.owner}
                </p>
                <p>
                  <strong>Padrones Percentage:</strong>{" "}
                  {contractInfo.padronesPercentage}%
                </p>
                <p>
                  <strong>Operating Costs Percentage:</strong>{" "}
                  {contractInfo.operatingCostsPercentage}%
                </p>
              </div>

              
              <div style={{ marginBottom: "20px" }}>
                <h2>Update Allocation Percentages</h2>
                <label>
                  Padrones Percentage:
                  <input
                    type="number"
                    value={allocation.padronesPercentage}
                    onChange={(e) =>
                      setAllocation({
                        ...allocation,
                        padronesPercentage: e.target.value,
                      })
                    }
                    style={{ marginLeft: "10px", marginBottom: "10px" }}
                  />
                </label>
                <br />
                <label>
                  Operating Costs Percentage:
                  <input
                    type="number"
                    value={allocation.operatingCostsPercentage}
                    onChange={(e) =>
                      setAllocation({
                        ...allocation,
                        operatingCostsPercentage: e.target.value,
                      })
                    }
                    style={{ marginLeft: "10px" }}
                  />
                </label>
                <br />
                <button
                  onClick={updateAllocation}
                  style={{
                    marginTop: "10px",
                    padding: "10px 20px",
                    backgroundColor: "blue",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Update Percentages
                </button>
              </div>

              
              <div>
                <h2>Distribute Revenue</h2>
                <button
                  onClick={handleOpenDistributePage}
                  style={{
                    marginTop: "10px",
                    padding: "10px 20px",
                    backgroundColor: "green",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Open Distribute Revenue Page
                </button>
              </div>
            </>
          ) : (
            <DistributeRevShare onBack={handleBackToOps} />
          )}
        </>
      )}
    </div>
  );
};

export default OwnerOps;
*/


/* works good
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ethers } from "ethers";
import {
  useAddress,
  ConnectWallet,
  useSigner,
} from "@thirdweb-dev/react";
import DistributeRevShare from "./DistributeToHolders"; // Updated path if needed
import mohCA_ABI from "../../Context/mohCA_ABI.json"; // Ensure this path is correct
import styles from "./OwnerOps.module.css"; // Import CSS module

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const OwnerOps = () => {
  const address = useAddress();
  const signer = useSigner();
  const [status, setStatus] = useState("");
  const [contractInfo, setContractInfo] = useState({
  owner: "Fetching...",
  padronesPercentage: "80%",
  operatingCostsPercentage: "20%",
  operatingTasca: "Fetching...",
});

  const [contractBalance, setContractBalance] = useState("Fetching...");
  const [prices, setPrices] = useState({
    common: "",
    uncommon: "",
    rare: "",
    epic: "",
    legendary: "",
    eternal: "",
  });
  const [supplyDetails, setSupplyDetails] = useState({
    common: "",
    uncommon: "",
    rare: "",
    epic: "",
    legendary: "",
    eternal: "",
  });
  const [padrones, setPadrones] = useState([]); // List of padrones
  const [newPadrone, setNewPadrone] = useState("");
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [showDistributePage, setShowDistributePage] = useState(false);

  const mohContract = signer
    ? new ethers.Contract(
        mohCA_ABI.address,
        mohCA_ABI.abi,
        signer
      )
    : null;

  useEffect(() => {
    const fetchContractDetails = async () => {
      if (!mohContract) {
        setStatus("Contract not initialized. Connect your wallet.");
        return;
      }

      try {
        setStatus("Connected");
        const [owner, balance, pricing, supply] = await Promise.all([
          mohContract.titolare(),
          signer.getBalance(),
          fetchPrices(),
          mohContract.getforgedCounts(),
        ]);

        const padronesList = await fetchPadronesList();

        setContractInfo({
          owner,
          padronesPercentage: "80%", 
          operatingCostsPercentage: "20%", 
        });

        setContractBalance(ethers.utils.formatEther(balance));
        setPrices(pricing);
        setSupplyDetails(formatSupply(supply));
        setPadrones(padronesList);
        setStatus("Contract details fetched successfully.");
      } catch (error) {
        console.error("Error fetching contract details:", error);
        setStatus("Error fetching contract details.");
      }
    };

    const fetchPrices = async () => {
      const [
        common,
        uncommon,
        rare,
        epic,
        legendary,
        eternal,
      ] = await Promise.all([
        mohContract.commonPrice(),
        mohContract.uncommonPrice(),
        mohContract.rarePrice(),
        mohContract.epicPrice(),
        mohContract.legendaryPrice(),
        mohContract.eternalPrice(),
      ]);
      return {
        common: ethers.utils.formatEther(common),
        uncommon: ethers.utils.formatEther(uncommon),
        rare: ethers.utils.formatEther(rare),
        epic: ethers.utils.formatEther(epic),
        legendary: ethers.utils.formatEther(legendary),
        eternal: ethers.utils.formatEther(eternal),
      };
    };

    const fetchPadronesList = async () => {
      const padronesList = [];
      const maxPadrones = 10; // Set a reasonable maximum to prevent infinite loops
      for (let i = 0; i < maxPadrones; i++) {
        try {
          const padrone = await mohContract.padroneTascas(i);
          if (
            padrone === ethers.constants.AddressZero ||
            padrone === null ||
            padrone === undefined
          ) {
            break;
          }
          padronesList.push(padrone);
        } catch (error) {

          break;
        }
      }
      return padronesList;
    };

    const formatSupply = (supply) => {
      return {
        common: `${supply.commonforged}/${supply.commonRemaining}`,
        uncommon: `${supply.uncommonforged}/${supply.uncommonRemaining}`,
        rare: `${supply.rareforged}/${supply.rareRemaining}`,
        epic: `${supply.epicforged}/${supply.epicRemaining}`,
        legendary: `${supply.legendaryforged}/${supply.legendaryRemaining}`,
        eternal: `${supply.eternalforged}/${supply.eternalRemaining}`,
      };
    };

    fetchContractDetails();
  }, [mohContract, signer]);

  const shortenAddress = (address) => {
    if (!address) return "";
    const start = address.substring(0, 6);
    const end = address.substring(address.length - 4);
    return `${start}. . . . . ${end}`;
  };

  const updatePrice = async (tier, price) => {
    try {
      if (!price || isNaN(price) || Number(price) <= 0) {
        setStatus("Please enter a valid price.");
        return;
      }

      setStatus(`Updating ${tier} price...`);
      const tx = await mohContract[`set${capitalize(tier)}Price`](
        ethers.utils.parseEther(price)
      );
      await tx.wait();
      setStatus(`${capitalize(tier)} price updated successfully.`);
      
      // Refresh prices after update
      const updatedPrices = await fetchPrices();
      setPrices(updatedPrices);
    } catch (error) {
      console.error(`Error updating ${tier} price:`, error);
      setStatus(`Error updating ${tier} price.`);
    }
  };

  const fetchPrices = async () => {
    const [
      common,
      uncommon,
      rare,
      epic,
      legendary,
      eternal,
    ] = await Promise.all([
      mohContract.commonPrice(),
      mohContract.uncommonPrice(),
      mohContract.rarePrice(),
      mohContract.epicPrice(),
      mohContract.legendaryPrice(),
      mohContract.eternalPrice(),
    ]);
    return {
      common: ethers.utils.formatEther(common),
      uncommon: ethers.utils.formatEther(uncommon),
      rare: ethers.utils.formatEther(rare),
      epic: ethers.utils.formatEther(epic),
      legendary: ethers.utils.formatEther(legendary),
      eternal: ethers.utils.formatEther(eternal),
    };
  };

  const addPadrone = async () => {
    try {
      if (!ethers.utils.isAddress(newPadrone)) {
        setStatus("Invalid Ethereum address.");
        return;
      }

      setStatus(`Adding padrone ${newPadrone}...`);
      const tx = await mohContract.updatePadrone(newPadrone, true);
      await tx.wait();
      setStatus(`Padrone ${newPadrone} added successfully.`);
      setPadrones([...padrones, newPadrone]);
      setNewPadrone(""); // Clear input
    } catch (error) {
      console.error("Error adding padrone:", error);
      setStatus("Error adding padrone. Ensure you have the required permissions.");
    }
  };

  const removePadrone = async () => {
    try {
      if (!ethers.utils.isAddress(newPadrone)) {
        setStatus("Invalid Ethereum address.");
        return;
      }

      if (!padrones.includes(newPadrone)) {
        setStatus("Address is not a current padrone.");
        return;
      }

      setStatus(`Removing padrone ${newPadrone}...`);
      const tx = await mohContract.updatePadrone(newPadrone, false);
      await tx.wait();
      setStatus(`Padrone ${newPadrone} removed successfully.`);
      setPadrones(padrones.filter((addr) => addr !== newPadrone));
      setNewPadrone(""); // Clear input
    } catch (error) {
      console.error("Error removing padrone:", error);
      setStatus("Error removing padrone. Ensure you have the required permissions.");
    }
  };

  const toggleAccordion = (section) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const copyToClipboard = useCallback((text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Copied to clipboard"))
      .catch(() => toast.error("Could not copy text"));
  }, []);



  // Handler functions for Distribute Revenue
  const handleOpenDistributePage = () => setShowDistributePage(true);
  const handleBackToOps = () => setShowDistributePage(false);

  // **Added: Function to Update Percentages**
  const [newPadronesPercentage, setNewPadronesPercentage] = useState("");
  const [newOperatingCostsPercentage, setNewOperatingCostsPercentage] = useState("");

  const updatePercentages = async () => {
    try {
      const padronesPct = parseInt(newPadronesPercentage);
      const operatingCostsPct = parseInt(newOperatingCostsPercentage);

      if (
        isNaN(padronesPct) ||
        isNaN(operatingCostsPct) ||
        padronesPct < 0 ||
        operatingCostsPct < 0 ||
        padronesPct + operatingCostsPct !== 100
      ) {
        setStatus("Please enter valid percentages that add up to 100.");
        return;
      }

      setStatus("Updating allocation percentages...");
      const tx = await mohContract.setAllocationValue(
        padronesPct,
        operatingCostsPct
      );
      await tx.wait();
      setStatus("Allocation percentages updated successfully.");

      // Refresh contract info
      setContractInfo({
        ...contractInfo,
        padronesPercentage: `${padronesPct}%`,
        operatingCostsPercentage: `${operatingCostsPct}%`,
      });

      // Clear input fields
      setNewPadronesPercentage("");
      setNewOperatingCostsPercentage("");
    } catch (error) {
      console.error("Error updating percentages:", error);
      setStatus("Error updating percentages. Ensure you have the required permissions.");
    }
  };




  
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Owner Operations</h1>
      <p className={styles.status}>{status}</p>

      <div className={styles.connectWalletSection}>
        <ConnectWallet className={styles.connectWalletBtn} />
      </div>

      {!address ? (
        <div className={styles.connectWalletPrompt}>
          <p>Please connect your wallet to access owner operations.</p>
        </div>
      ) : (
        <>
          <div className={styles.walletInfo}>
            <p>
              <strong>Connected Wallet: </strong>{" "}
              <span
                className={styles.copyableAddress}
                onClick={() => copyToClipboard(address)}
                //title="Click to copy full address"
                title={`Click to copy ${address}`}
              >
                {shortenAddress(address)}
              </span>
            </p>
            <p>
              <strong>Wallet Balance:</strong> {contractBalance} BNB
            </p>
          </div>

          {!showDistributePage ? (
            <div className={styles.sectionsContainer}>
  
              <div className={styles.section}>
                <h2 className={styles.subheading}>Contract Details</h2>
                <p>
                  <strong>Owner Address:</strong>{" "}
                  <span
                    className={styles.copyableAddress}
                    onClick={() => copyToClipboard(contractInfo.owner)}
                    //title="Click to copy full address"
                    title={`Click to copy ${contractInfo.owner}`}
                  >
                    {shortenAddress(contractInfo.owner)}
                  </span>
                </p>
  
                <p>
                  <strong>Contract Address:</strong>{" "}
                  <span
                    className={styles.copyableAddress}
                    onClick={() => copyToClipboard(mohCA_ABI.address)}
                    title={`Click to copy ${mohCA_ABI.address}`}
                  >
                    {shortenAddress(mohCA_ABI.address)}
                  </span>
                </p>
                <p>
                  <strong>Padrones Percentage:</strong>{" "}
                  {contractInfo.padronesPercentage}
                </p>
                <p>
                  <strong>Operating Costs Percentage:</strong>{" "}
                  {contractInfo.operatingCostsPercentage}%
                </p>
              </div>

  
              <div className={styles.section}>
                <h2 className={styles.subheading}>Manage Padrones</h2>
                <div className={styles.padronesList}>
                  <h3>Current Padrones:</h3>
                  {padrones.length > 0 ? (
                    <ul className={styles.padroneList}>
                      {padrones.map((padrone, index) => (
                        <li key={index} className={styles.padroneItem}>
                          <span
                            className={styles.copyableAddress}
                            onClick={() => copyToClipboard(padrone)}
                            title={`Click to copy ${padrone}`}
                          >
                            {shortenAddress(padrone)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No padrones found.</p>
                  )}
                </div>
                <div className={styles.managePadrone}>
                  <input
                    type="text"
                    value={newPadrone}
                    onChange={(e) => setNewPadrone(e.target.value)}
                    placeholder="Enter padrone address"
                    className={styles.input}
                  />
                  <div className={styles.padroneActions}>
                    <button
                      onClick={addPadrone}
                      className={styles.buttonAdd}
                    >
                      Add Padrone
                    </button>
                    <button
                      onClick={removePadrone}
                      className={styles.buttonRemove}
                    >
                      Remove Padrone
                    </button>
                  </div>
                </div>
              </div>

  
              <div className={styles.section}>
                <h2
                  className={styles.subheading}
                  onClick={() => toggleAccordion("pricing")}
                >
                  Update Pricing{" "}
                  <span className={styles.accordionIcon}>
                    {activeAccordion === "pricing" ? "-" : "+"}
                  </span>
                </h2>
                {activeAccordion === "pricing" && (
                  <div className={styles.accordionContent}>
                    {Object.keys(prices).map((tier) => (
                      <div
                        key={tier}
                        className={styles.priceUpdate}
                      >
                        <label className={styles.label}>
                          {capitalize(tier)} Price (ETH):
                          <input
                            type="number"
                            step="0.0001"
                            value={prices[tier]}
                            onChange={(e) =>
                              setPrices({
                                ...prices,
                                [tier]: e.target.value,
                              })
                            }
                            className={styles.input}
                          />
                        </label>
                        <button
                          onClick={() =>
                            updatePrice(tier, prices[tier])
                          }
                          className={styles.button}
                        >
                          Update
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

  
              <div className={styles.section}>
                <h2 className={styles.subheading}>Update Allocation Percentages</h2>
                <div className={styles.allocationForm}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      Padrones Percentage (%):
                      <input
                        type="number"
                        value={newPadronesPercentage}
                        onChange={(e) => setNewPadronesPercentage(e.target.value)}
                        placeholder="80"
                        className={styles.input}
                      />
                    </label>
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      Operating Costs Percentage (%):
                      <input
                        type="number"
                        value={newOperatingCostsPercentage}
                        onChange={(e) => setNewOperatingCostsPercentage(e.target.value)}
                        placeholder="20"
                        className={styles.input}
                      />
                    </label>
                  </div>
                  <button
                    onClick={updatePercentages}
                    className={styles.updatePercentagesBtn}
                  >
                    Update Percentages
                  </button>
                </div>
              </div>

  
<div
  className={styles.section}
  title={Object.entries(supplyDetails)
    .map(([tier, supply]) => {

      const [forged] = supply.split("/");
      return `${forged} ${capitalize(tier)}`;
    })
    .join(", ")}
>
  <h2 className={styles.subheading}>Supply Details</h2>
  {Object.entries(supplyDetails).map(([tier, supply]) => (
    <p key={tier}>
      <strong>{capitalize(tier)} :</strong> {supply}
    </p>
  ))}
</div>


  
              <div className={styles.section}>
                <h2 className={styles.subheading}>Distribute Revenue Shares</h2>
                <button
                  onClick={handleOpenDistributePage}
                  className={styles.button}
                >
                  Revenue Share Options
                </button>
              </div>
            </div>
          ) : (
            
            <DistributeRevShare onBack={handleBackToOps} />
          
          )}
        </>
      )}
    </div>
  );
};

export default OwnerOps;
*/


import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import {
  useAddress,
  ConnectWallet,
  useSigner,
} from "@thirdweb-dev/react";
import DistributeRevShare from "./DistributeToHolders"; 
import Reports from "./Reports"; 
import mohCA_ABI from "../../Context/mohCA_ABI.json"; 
import styles from "./OwnerOps.module.css"; 

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OwnerOps = () => {
  const address = useAddress();
  const signer = useSigner();
  const [status, setStatus] = useState("");
  const [padrones, setPadrones] = useState([]); 
  const [newPadrone, setNewPadrone] = useState("");
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [showDistributePage, setShowDistributePage] = useState(false);
  const [newOperatingTasca, setNewOperatingTasca] = useState("");
  const [showReports, setShowReports] = useState(false);
 
 const handleCloseReports = () => setShowReports(false);

  const [contractInfo, setContractInfo] = useState({
    owner: "Fetching...",
    padronesPercentage: "80%", 
    operatingCostsPercentage: "20%", 
    operatingTasca: "Fetching...",
  });
  const [contractBalance, setContractBalance] = useState("Fetching...");
  const [prices, setPrices] = useState({
    common: "",
    uncommon: "",
    rare: "",
    epic: "",
    legendary: "",
    eternal: "",
  });
  const [supplyDetails, setSupplyDetails] = useState({
    common: "",
    uncommon: "",
    rare: "",
    epic: "",
    legendary: "",
    eternal: "",
  });
  
  

  const mohContract = signer
    ? new ethers.Contract(
      mohCA_ABI.address,
      mohCA_ABI.abi,
      signer
    )
    : null;

  useEffect(() => {
    const fetchContractDetails = async () => {
      if (!mohContract) {
        setStatus("Contract not initialized. Connect your wallet.");
        return;
      }

      try {
        setStatus("Connected");
        const [owner, balance, pricing, supply, operatingTascaAddress] = await Promise.all([
          mohContract.titolare(),
          signer.getBalance(),
          fetchPrices(),
          mohContract.getforgedCounts(),
          mohContract.operatingTasca(),
        ]);

        const padronesList = await fetchPadronesList();

        setContractInfo({
          owner,
          padronesPercentage: "80%",
          operatingCostsPercentage: "20%",
          operatingTasca: operatingTascaAddress,
        });

        setContractBalance(ethers.utils.formatEther(balance));
        setPrices(pricing);
        setSupplyDetails(formatSupply(supply));
        setPadrones(padronesList);
        setStatus("Contract details fetched successfully.");
      } catch (error) {
        console.error("Error fetching contract details:", error);
        setStatus("Error fetching contract details.");
      }
    };

    const fetchPrices = async () => {
      const [
        common,
        uncommon,
        rare,
        epic,
        legendary,
        eternal,
      ] = await Promise.all([
        mohContract.commonPrice(),
        mohContract.uncommonPrice(),
        mohContract.rarePrice(),
        mohContract.epicPrice(),
        mohContract.legendaryPrice(),
        mohContract.eternalPrice(),
      ]);
      return {
        common: ethers.utils.formatEther(common),
        uncommon: ethers.utils.formatEther(uncommon),
        rare: ethers.utils.formatEther(rare),
        epic: ethers.utils.formatEther(epic),
        legendary: ethers.utils.formatEther(legendary),
        eternal: ethers.utils.formatEther(eternal),
      };
    };

    const fetchPadronesList = async () => {
      const padronesList = [];
      const maxPadrones = 10; 
      for (let i = 0; i < maxPadrones; i++) {
        try {
          const padrone = await mohContract.padroneTascas(i);
          if (
            padrone === ethers.constants.AddressZero ||
            padrone === null ||
            padrone === undefined
          ) {
            break;
          }
          padronesList.push(padrone);
        } catch (error) {
          break;
        }
      }
      return padronesList;
    };

    const formatSupply = (supply) => {
      return {
        common: `${supply.commonforged}/${supply.commonRemaining}`,
        uncommon: `${supply.uncommonforged}/${supply.uncommonRemaining}`,
        rare: `${supply.rareforged}/${supply.rareRemaining}`,
        epic: `${supply.epicforged}/${supply.epicRemaining}`,
        legendary: `${supply.legendaryforged}/${supply.legendaryRemaining}`,
        eternal: `${supply.eternalforged}/${supply.eternalRemaining}`,
      };
    };

    fetchContractDetails();
  }, [mohContract, signer]);

  const shortenAddress = (address) => {
    if (!address) return "";
    const start = address.substring(0, 6);
    const end = address.substring(address.length - 4);
    return `${start}...${end}`;
  };

  const updatePrice = async (tier, price) => {
    try {
      if (!price || isNaN(price) || Number(price) <= 0) {
        setStatus("Please enter a valid price.");
        return;
      }

      setStatus(`Updating ${tier} price...`);
      const tx = await mohContract[`set${capitalize(tier)}Price`](
        ethers.utils.parseEther(price)
      );
      await tx.wait();
      setStatus(`${capitalize(tier)} price updated successfully.`);

      // Refresh prices after update
      const updatedPrices = await fetchPrices();
      setPrices(updatedPrices);
    } catch (error) {
      console.error(`Error updating ${tier} price:`, error);
      setStatus(`Error updating ${tier} price.`);
    }
  };

  const addPadrone = async () => {
    try {
      if (!ethers.utils.isAddress(newPadrone)) {
        setStatus("Invalid Ethereum address.");
        return;
      }

      setStatus(`Adding padrone ${newPadrone}...`);
      const tx = await mohContract.updatePadrone(newPadrone, true);
      await tx.wait();
      setStatus(`Padrone ${newPadrone} added successfully.`);
      setPadrones([...padrones, newPadrone]);
      setNewPadrone(""); // Clear input
    } catch (error) {
      console.error("Error adding padrone:", error);
      setStatus("Error adding padrone. Ensure you have the required permissions.");
    }
  };

  const removePadrone = async () => {
    try {
      if (!ethers.utils.isAddress(newPadrone)) {
        setStatus("Invalid Ethereum address.");
        return;
      }

      if (!padrones.includes(newPadrone)) {
        setStatus("Address is not a current padrone.");
        return;
      }

      setStatus(`Removing padrone ${newPadrone}...`);
      const tx = await mohContract.updatePadrone(newPadrone, false);
      await tx.wait();
      setStatus(`Padrone ${newPadrone} removed successfully.`);
      setPadrones(padrones.filter((addr) => addr !== newPadrone));
      setNewPadrone(""); // Clear input
    } catch (error) {
      console.error("Error removing padrone:", error);
      setStatus("Error removing padrone. Ensure you have the required permissions.");
    }
  };

  const toggleAccordion = (section) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const copyToClipboard = useCallback((text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Copied"))
      .catch(() => toast.error("Could not copy text"));
  }, []);

  const handleOpenDistributePage = () => setShowDistributePage(true);
  const handleBackToOps = () => setShowDistributePage(false);
  const [newPadronesPercentage, setNewPadronesPercentage] = useState("");
  const [newOperatingCostsPercentage, setNewOperatingCostsPercentage] = useState("");

  const updatePercentages = async () => {
    try {
      const padronesPct = parseInt(newPadronesPercentage);
      const operatingCostsPct = parseInt(newOperatingCostsPercentage);

      if (
        isNaN(padronesPct) ||
        isNaN(operatingCostsPct) ||
        padronesPct < 0 ||
        operatingCostsPct < 0 ||
        padronesPct + operatingCostsPct !== 100
      ) {
        setStatus("Please enter valid percentages that add up to 100.");
        return;
      }

      setStatus("Updating allocation percentages...");
      const tx = await mohContract.setAllocationValue(
        padronesPct,
        operatingCostsPct
      );
      await tx.wait();
      setStatus("Allocation percentages updated successfully.");
      setContractInfo((prevInfo) => ({
        ...prevInfo,
        padronesPercentage: `${padronesPct}%`,
        operatingCostsPercentage: `${operatingCostsPct}%`,
      }));

      setNewPadronesPercentage("");
      setNewOperatingCostsPercentage("");
    } catch (error) {
      console.error("Error updating percentages:", error);
      setStatus("Error updating percentages. Ensure you have the required permissions.");
    }
  };

  
  const updateOperatingTasca = async () => {
    try {
      if (!ethers.utils.isAddress(newOperatingTasca)) {
        setStatus("Invalid Ethereum address.");
        return;
      }

      setStatus("Updating operating wallet...");
      const tx = await mohContract.updateDistributionTascas(newOperatingTasca);
      await tx.wait();
      setStatus("Operating wallet updated successfully.");
      const updatedOperatingTasca = await mohContract.operatingTasca();
      setContractInfo((prevInfo) => ({
        ...prevInfo,
        operatingTasca: updatedOperatingTasca,
      }));

      setNewOperatingTasca(""); // Clear input
    } catch (error) {
      console.error("Error updating operating wallet:", error);
      setStatus("Error updating operating wallet. Ensure you have the required permissions.");
    }
  };

  
  const isCurrentUserPadrone = padrones.includes(address);

  return (
    <div className={styles.container}>
      
      

      <div className={styles.connectWalletSection}>
        <ConnectWallet className={styles.connectWalletBtn} />
      </div>

      {/*
      <p className={styles.status}>{status}</p>
      */}

      {!address ? (
        <div className={styles.connectWalletPrompt}>
          <p>Please connect your wallet to access owner operations.</p>
        </div>
      ) : (
        <>
          <div className={styles.walletInfo}>
            <p>
              <strong>Connected Wallet: </strong>{" "}
              <span
                className={styles.copyableAddress}
                onClick={() => copyToClipboard(address)}
                title={`Click to copy ${address}`}
              >
                {shortenAddress(address)}
              </span>
            </p>
            <p>
              <strong>Wallet Balance:</strong> {contractBalance} BNB
            </p>
          </div>

          {!showDistributePage ? (
            <div className={styles.sectionsContainer}>
              
              <div className={styles.section}>
                <h2 className={styles.subheading}>Contract Details</h2>
                <p>
                  <strong>Owner Address:</strong>{" "}
                  <span
                    className={styles.copyableAddress}
                    onClick={() => copyToClipboard(contractInfo.owner)}
                    title={`Click to copy ${contractInfo.owner}`}
                  >
                    {shortenAddress(contractInfo.owner)}
                  </span>
                </p>
                <p>
                  <strong>Contract Address:</strong>{" "}
                  <span
                    className={styles.copyableAddress}
                    onClick={() => copyToClipboard(mohCA_ABI.address)}
                    title={`Click to copy ${mohCA_ABI.address}`}
                  >
                    {shortenAddress(mohCA_ABI.address)}
                  </span>
                </p>
                <p>
                  <strong>Padrones Percentage:</strong>{" "}
                  {contractInfo.padronesPercentage}
                </p>
                <p>
                  <strong>Operating Costs Percentage:</strong>{" "}
                  {contractInfo.operatingCostsPercentage}%
                </p>
                <p>
                  <strong>Operating Wallet:</strong>{" "}
                  <span
                    className={styles.copyableAddress}
                    onClick={() => copyToClipboard(contractInfo.operatingTasca)}
                    title={`Click to copy ${contractInfo.operatingTasca}`}
                  >
                    {shortenAddress(contractInfo.operatingTasca)}
                  </span>
                </p>
              </div>

             
              <div
                className={styles.section}
                title={Object.entries(supplyDetails)
                  .map(([tier, supply]) => {
                    const [forged] = supply.split("/");
                    return `${forged} ${capitalize(tier)}`;
                  })
                  .join(", ")}
              >
                <h2 className={styles.subheading}>Supply Details</h2>
                {Object.entries(supplyDetails).map(([tier, supply]) => (
                  <p key={tier}>
                    <strong>{capitalize(tier)} :</strong> {supply}
                  </p>
                ))}
              </div>

             
              <div className={styles.section}>
                <h2 className={styles.subheading}>Manage Autopay</h2>
                <div className={styles.padronesList}>
                  <h5>Current Padrone / Owners</h5>
                  {padrones.length > 0 ? (
                    <ul className={styles.padroneList}>
                      {padrones.map((padrone, index) => (
                        <li key={index} className={styles.padroneItem}>
                          <span
                            className={styles.copyableAddress}
                            onClick={() => copyToClipboard(padrone)}
                            title={`Click to copy ${padrone}`}
                          >
                            {shortenAddress(padrone)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No padrones found.</p>
                  )}
                </div>
                <div className={styles.managePadrone}>
                  <input
                    type="text"
                    value={newPadrone}
                    onChange={(e) => setNewPadrone(e.target.value)}
                    placeholder="Enter padrone address"
                    className={styles.input}
                  />
                  <div className={styles.padroneActions}>
                    <button
                      onClick={addPadrone}
                      className={styles.buttonAdd}
                    >
                      Add Padrone
                    </button>
                    <button
                      onClick={removePadrone}
                      className={styles.buttonRemove}
                    >
                      Remove Padrone
                    </button>
                  </div>
                </div>
              </div>

             <div className={styles.section}>
                <h2 className={styles.subheading}>Update Allocation Percentages</h2>
                <div className={styles.allocationForm}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      Owner / Padrone (%):
                      <input
                        type="number"
                        value={newPadronesPercentage}
                        onChange={(e) => setNewPadronesPercentage(e.target.value)}
                        placeholder="80"
                        className={styles.input}
                      />
                    </label>
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>
                      Operating Costs (%):
                      <input
                        type="number"
                        value={newOperatingCostsPercentage}
                        onChange={(e) => setNewOperatingCostsPercentage(e.target.value)}
                        placeholder="20"
                        className={styles.input}
                      />
                    </label>
                  </div>
                  <button
                    onClick={updatePercentages}
                    className={styles.updatePercentagesBtn}
                  >
                    Update Percentages
                  </button>
                </div>
              </div>

              {isCurrentUserPadrone ? (
                <div className={styles.section}>
                  <h2 className={styles.subheading}>Update Operations Wallet</h2>
                  <p>
                    <strong>Current:</strong>{" "}
                    <span
                      className={styles.copyableAddress}
                      onClick={() => copyToClipboard(contractInfo.operatingTasca)}
                      title={`Click to copy ${contractInfo.operatingTasca}`}
                    >
                      {shortenAddress(contractInfo.operatingTasca)}
                    </span>
                  </p>
                  <div className={styles.updateOperatingTasca}>
                    <input
                      type="text"
                      value={newOperatingTasca}
                      onChange={(e) => setNewOperatingTasca(e.target.value)}
                      placeholder="Enter new operating wallet address"
                      className={styles.input}
                      style={{ marginBottom: "20px" }}
                    />
                    <button
                      onClick={updateOperatingTasca}
                      className={styles.updatePercentagesBtn}
                    >
                      Update Operating Wallet
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.section}>
                  <p>You do not have permission to update the operating wallet.</p>
                </div>
              )}




              

              
              <div className={styles.section}>
                <h2
                  className={styles.subheading}
                  onClick={() => toggleAccordion("pricing")}
                >
                  Update Pricing{" "}
                  <span className={styles.accordionIcon}>
                    {activeAccordion === "pricing" ? "-" : "+"}
                  </span>
                </h2>
                {activeAccordion === "pricing" && (
                  <div className={styles.accordionContent}>
                    {Object.keys(prices).map((tier) => (
                      <div
                        key={tier}
                        className={styles.priceUpdate}
                      >
                        <label className={styles.label}>
                          {capitalize(tier)} Price (BNB):
                          <input
                            type="number"
                            step="0.0001"
                            value={prices[tier]}
                            onChange={(e) =>
                              setPrices({
                                ...prices,
                                [tier]: e.target.value,
                              })
                            }
                            className={styles.input}
                          />
                        </label>
                        <button
                          onClick={() =>
                            updatePrice(tier, prices[tier])
                          }
                          className={styles.button}
                        >
                          Update
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className={styles.section}>
                <h2 className={styles.subheading}>Distribute Revenue Shares</h2>
                <button
                  onClick={handleOpenDistributePage}
                  className={styles.button}
                >
                  Revenue Share Options
                </button>
              </div>
              <div className={styles.section}>
                <h2 className={styles.subheading}>Reports</h2>
                <button
                  onClick={() => setShowReports(true)}
                  className={styles.button}
                >
                  View Reports
                </button>
              </div>
            </div>
          ) : showReports ? (
            <Reports onClose={handleCloseReports} />
          ) : (
            <DistributeRevShare onBack={handleBackToOps} />
          )}
        </>
      )}
      
    </div>
  );
};

export default OwnerOps;
