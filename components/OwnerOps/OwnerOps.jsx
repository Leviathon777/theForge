import React, { useState, useEffect, useMemo } from "react";
import { ethers } from "ethers";
import { useAccount, useConfig } from "wagmi";
import { getWalletClient } from "@wagmi/core";
import { walletClientToSigner } from "../../lib/walletClientToSigner";
import DistributeRevShare from "./DistributeToHolders";
import mohCA_ABI from "../../Context/mohCA_ABI.json";
import replacementCA_ABI from "../../Context/replacementCA_ABI.json";
import distributeCA_ABI from "../../Context/distributeCA_ABI.json";
import routerCA_ABI from "../../Context/routerCA_ABI.json";
import styles from "./OwnerOps.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OwnerOps = () => {
  const { address, isConnected } = useAccount();
  const wagmiConfig = useConfig();
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    if (isConnected) {
      getWalletClient(wagmiConfig).then((wc) => {
        setSigner(walletClientToSigner(wc));
      }).catch(() => setSigner(null));
    } else {
      setSigner(null);
    }
  }, [isConnected, wagmiConfig]);
  const [status, setStatus] = useState("");
  const [contractInfo, setContractInfo] = useState({
    owner: "Fetching...",
    padronesPercentage: "Fetching...",
    operatingCostsPercentage: "Fetching...",
  });
  const [contractBalance, setContractBalance] = useState("Fetching...");
  const [distBalance, setDistBalance] = useState("Fetching...");
  const [allocation, setAllocation] = useState({
    padronesPercentage: "",
    operatingCostsPercentage: "",
  });
  const [supplyDetails, setSupplyDetails] = useState(null);
  const [replacementSupply, setReplacementSupply] = useState("0");
  const [stolenCount, setStolenCount] = useState("0");
  const [activeView, setActiveView] = useState("dashboard");

  const mohContract = useMemo(
    () =>
      signer
        ? new ethers.Contract(mohCA_ABI.address, mohCA_ABI.abi, signer)
        : null,
    [signer]
  );

  const distributeContract = useMemo(
    () =>
      signer
        ? new ethers.Contract(
            distributeCA_ABI.address,
            distributeCA_ABI.abi,
            signer
          )
        : null,
    [signer]
  );

  const readProvider = useMemo(
    () => new ethers.providers.JsonRpcProvider("https://bsc-dataseed1.binance.org/"),
    []
  );

  const replacementRead = useMemo(
    () =>
      new ethers.Contract(
        replacementCA_ABI.address,
        replacementCA_ABI.abi,
        readProvider
      ),
    [readProvider]
  );

  const routerRead = useMemo(
    () =>
      new ethers.Contract(
        routerCA_ABI.address,
        routerCA_ABI.abi,
        readProvider
      ),
    [readProvider]
  );

  useEffect(() => {
    const fetchAll = async () => {
      if (!mohContract || !signer || !isAuthorized) {
        if (!isAuthorized && address) {
          setStatus("Unauthorized wallet.");
        } else {
          setStatus("Connect your wallet.");
        }
        return;
      }

      try {
        setStatus("Fetching contract details...");

        const [owner, padPct, opPct, walletBal, distBal, supply, replSupply, stolen] =
          await Promise.all([
            mohContract.titolare(),
            mohContract.padronesPercentage(),
            mohContract.operatingCostsPercentage(),
            signer.getBalance(),
            readProvider.getBalance(distributeCA_ABI.address),
            mohContract.getforgedCounts(),
            replacementRead.totalSupply(),
            routerRead.getStolenCount(),
          ]);

        setContractInfo({
          owner,
          padronesPercentage: padPct.toString(),
          operatingCostsPercentage: opPct.toString(),
        });
        setContractBalance(ethers.utils.formatEther(walletBal));
        setDistBalance(ethers.utils.formatEther(distBal));
        setReplacementSupply(replSupply.toString());
        setStolenCount(stolen.toString());

        setSupplyDetails({
          commonForged: supply.commonforged?.toString() || "0",
          commonRemaining: supply.commonRemaining?.toString() || "0",
          uncommonForged: supply.uncommonforged?.toString() || "0",
          uncommonRemaining: supply.uncommonRemaining?.toString() || "0",
          rareForged: supply.rareforged?.toString() || "0",
          rareRemaining: supply.rareRemaining?.toString() || "0",
          epicForged: supply.epicforged?.toString() || "0",
          epicRemaining: supply.epicRemaining?.toString() || "0",
          legendaryForged: supply.legendaryforged?.toString() || "0",
          legendaryRemaining: supply.legendaryRemaining?.toString() || "0",
          eternalForged: supply.eternalforged?.toString() || "0",
          eternalRemaining: supply.eternalRemaining?.toString() || "0",
        });

        setStatus("Connected");
      } catch (error) {
        console.error("Error fetching contract details:", error);
        setStatus("Error fetching contract details.");
      }
    };

    fetchAll();
  }, [mohContract, signer]);

  const updateAllocation = async () => {
    if (!mohContract) {
      setStatus("Contract not initialized.");
      return;
    }
    try {
      setStatus("Updating allocation percentages...");
      const tx = await mohContract.setAllocationValue(
        parseInt(allocation.padronesPercentage),
        parseInt(allocation.operatingCostsPercentage)
      );
      await tx.wait();
      setStatus("Allocation percentages updated.");
      toast.success("Allocation updated!");
    } catch (error) {
      console.error("Error updating allocation:", error);
      setStatus("Error updating allocation.");
    }
  };

  const shortenAddress = (addr) => {
    if (!addr) return "";
    return addr.substring(0, 6) + "..." + addr.substring(addr.length - 4);
  };

  // --- Authorization Check ---
  const authorizedAddresses = (process.env.NEXT_PUBLIC_OWNER_ADDRESSES || "")
    .split(",")
    .map((addr) => addr.trim().toLowerCase())
    .filter(Boolean);

  const isAuthorized = address && authorizedAddresses.includes(address.toLowerCase());

  if (!address) {
    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>Owner Operations</h1>
        <div className={styles.connectWalletSection}>
          <appkit-button />
        </div>
        <p className={styles.connectWalletPrompt}>
          Connect your wallet to access admin operations.
        </p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className={styles.container}>
        <h1 className={styles.heading}>Access Denied</h1>
        <p className={styles.connectWalletPrompt}>
          This wallet is not authorized for owner operations.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ToastContainer theme="dark" />
      <h1 className={styles.heading}>Owner Operations</h1>
      <p className={styles.status}>Status: {status}</p>

      <div className={styles.walletInfo}>
        <p>
          <strong>Wallet:</strong>{" "}
          <span
            className={styles.copyableAddress}
            onClick={() => navigator.clipboard.writeText(address)}
            title="Click to copy"
          >
            {shortenAddress(address)}
          </span>
        </p>
        <p>
          <strong>Wallet Balance:</strong> {contractBalance} BNB
        </p>
        <p>
          <strong>Distribution Balance:</strong> {distBalance} BNB
        </p>
        <p>
          <strong>Replacement DOTs:</strong> {replacementSupply} minted
        </p>
        <p>
          <strong>Stolen Flags:</strong> {stolenCount}
        </p>
      </div>

      {activeView === "dashboard" && (
        <div className={styles.sectionsContainer}>
          {/* Contract Details */}
          <div className={styles.section}>
            <h2 className={styles.subheading}>Contract Details</h2>
            <p>
              <strong>Owner:</strong>{" "}
              <span
                className={styles.copyableAddress}
                onClick={() =>
                  navigator.clipboard.writeText(contractInfo.owner)
                }
              >
                {shortenAddress(contractInfo.owner)}
              </span>
            </p>
            <p>
              <strong>Padrones %:</strong> {contractInfo.padronesPercentage}%
            </p>
            <p>
              <strong>Operating Costs %:</strong>{" "}
              {contractInfo.operatingCostsPercentage}%
            </p>
          </div>

          {/* Contract Addresses */}
          <div className={styles.section}>
            <h2 className={styles.subheading}>Contracts</h2>
            <p>
              <strong>Original MOH:</strong>{" "}
              <span className={styles.copyableAddress} onClick={() => navigator.clipboard.writeText(mohCA_ABI.address)}>
                {shortenAddress(mohCA_ABI.address)}
              </span>
            </p>
            <p>
              <strong>Replacement DOTs:</strong>{" "}
              <span className={styles.copyableAddress} onClick={() => navigator.clipboard.writeText(replacementCA_ABI.address)}>
                {shortenAddress(replacementCA_ABI.address)}
              </span>
            </p>
            <p>
              <strong>Distribution:</strong>{" "}
              <span className={styles.copyableAddress} onClick={() => navigator.clipboard.writeText(distributeCA_ABI.address)}>
                {shortenAddress(distributeCA_ABI.address)}
              </span>
            </p>
            <p>
              <strong>Router:</strong>{" "}
              <span className={styles.copyableAddress} onClick={() => navigator.clipboard.writeText(routerCA_ABI.address)}>
                {shortenAddress(routerCA_ABI.address)}
              </span>
            </p>
          </div>

          {/* Supply Details */}
          {supplyDetails && (
            <div className={styles.section}>
              <h2 className={styles.subheading}>Medal Supply</h2>
              {[
                ["Common", supplyDetails.commonForged, supplyDetails.commonRemaining],
                ["Uncommon", supplyDetails.uncommonForged, supplyDetails.uncommonRemaining],
                ["Rare", supplyDetails.rareForged, supplyDetails.rareRemaining],
                ["Epic", supplyDetails.epicForged, supplyDetails.epicRemaining],
                ["Legendary", supplyDetails.legendaryForged, supplyDetails.legendaryRemaining],
                ["Eternal", supplyDetails.eternalForged, supplyDetails.eternalRemaining],
              ].map(([tier, forged, remaining]) => (
                <p key={tier}>
                  <strong>{tier}:</strong> {forged} forged / {remaining} remaining
                </p>
              ))}
            </div>
          )}

          {/* Allocation Update */}
          <div className={styles.section}>
            <h2 className={styles.subheading}>Update Allocation</h2>
            <div className={styles.allocationForm}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Padrones %</label>
                <input
                  type="number"
                  className={styles.input}
                  value={allocation.padronesPercentage}
                  onChange={(e) =>
                    setAllocation({
                      ...allocation,
                      padronesPercentage: e.target.value,
                    })
                  }
                  placeholder="e.g. 80"
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Operating Costs %</label>
                <input
                  type="number"
                  className={styles.input}
                  value={allocation.operatingCostsPercentage}
                  onChange={(e) =>
                    setAllocation({
                      ...allocation,
                      operatingCostsPercentage: e.target.value,
                    })
                  }
                  placeholder="e.g. 20"
                />
              </div>
              <button onClick={updateAllocation} className={styles.updatePercentagesBtn}>
                Update Percentages
              </button>
            </div>
          </div>

          {/* Distribution Button */}
          <div className={styles.section}>
            <h2 className={styles.subheading}>Revenue Distribution</h2>
            <p style={{ marginBottom: "15px", color: "#c9c9c9" }}>
              Fetch holders from both Original MOH and Replacement DOTs contracts,
              calculate weights with XdRiP bonuses, handle stolen token routing,
              and distribute revenue.
            </p>
            <button
              onClick={() => setActiveView("distribute")}
              className={styles.distributeButton}
            >
              Open Distribution Console
            </button>
          </div>
        </div>
      )}

      {activeView === "distribute" && (
        <DistributeRevShare onBack={() => setActiveView("dashboard")} />
      )}
    </div>
  );
};

export default OwnerOps;
