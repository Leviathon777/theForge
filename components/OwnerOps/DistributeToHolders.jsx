import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ethers } from "ethers";
import distributeCA_ABI from "../../Context/distributeCA_ABI.json";
import mohCA_ABI from "../../Context/mohCA_ABI.json";
import replacementCA_ABI from "../../Context/replacementCA_ABI.json";
import routerCA_ABI from "../../Context/routerCA_ABI.json";
import xdripCA_ABI from "../../Context/xdripCA_ABI.json";
import styles from "./Distribute.module.css";
import { useAccount, useConfig } from "wagmi";
import { getWalletClient } from "@wagmi/core";
import { walletClientToSigner } from "../../lib/walletClientToSigner";
import { publicClient } from "../../lib/viemClient";

const DOT_WEIGHTS = {
  COMMON: 10,
  UNCOMMON: 25,
  RARE: 45,
  EPIC: 70,
  LEGENDARY: 110,
};

const MEDAL_ORDER = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY"];

const TOKEN_RANGES = [
  { start: 1, end: 10000, name: "COMMON" },
  { start: 10001, end: 15000, name: "UNCOMMON" },
  { start: 15001, end: 17500, name: "RARE" },
  { start: 17501, end: 18500, name: "EPIC" },
  { start: 18501, end: 20000, name: "LEGENDARY" },
];

const TIER_COLORS = {
  COMMON: "#8B7355",
  UNCOMMON: "#4A90D9",
  RARE: "#9B59B6",
  EPIC: "#E67E22",
  LEGENDARY: "#F1C40F",
};

const DistributeRevShare = ({ onBack }) => {
  const [holdersInfo, setHoldersInfo] = useState([]);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("info");
  const [contractBalance, setContractBalance] = useState("0");
  const [totalDistributed, setTotalDistributed] = useState("0");
  const [distributionPct, setDistributionPct] = useState("--");
  const [mohSupply, setMohSupply] = useState("--");
  const [replSupply, setReplSupply] = useState("--");
  const [stolenCount, setStolenCount] = useState("0");
  const [depositAmount, setDepositAmount] = useState("");
  const [newPercentage, setNewPercentage] = useState("");
  const [logMessages, setLogMessages] = useState(["Initializing...\n"]);
  const [progress, setProgress] = useState({ pct: 0, text: "", visible: false });
  const [isScanning, setIsScanning] = useState(false);
  const [isDistributing, setIsDistributing] = useState(false);
  const [stolenMap, setStolenMap] = useState({});
  const [stolenRecords, setStolenRecords] = useState([]);

  // Stolen token flagging
  const [flagTokenId, setFlagTokenId] = useState("");
  const [flagThief, setFlagThief] = useState("");
  const [flagVictim, setFlagVictim] = useState("");
  const [flagReason, setFlagReason] = useState("");

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

  const readProvider = useMemo(
    () => new ethers.providers.JsonRpcProvider("https://bsc-dataseed1.binance.org/"),
    []
  );

  // XdRiP reads use viem publicClient
  // XdRiP reads via viem (no more web3)

  // Read-only contract instances
  const mohRead = useMemo(
    () => new ethers.Contract(mohCA_ABI.address, mohCA_ABI.abi, readProvider),
    [readProvider]
  );

  const replacementRead = useMemo(
    () => new ethers.Contract(replacementCA_ABI.address, replacementCA_ABI.abi, readProvider),
    [readProvider]
  );

  const routerRead = useMemo(
    () => new ethers.Contract(routerCA_ABI.address, routerCA_ABI.abi, readProvider),
    [readProvider]
  );

  // Signer-attached contracts for write operations
  const distributeContract = useMemo(
    () =>
      signer
        ? new ethers.Contract(distributeCA_ABI.address, distributeCA_ABI.abi, signer)
        : null,
    [signer]
  );

  const routerWrite = useMemo(
    () =>
      signer
        ? new ethers.Contract(routerCA_ABI.address, routerCA_ABI.abi, signer)
        : null,
    [signer]
  );

  // Logging
  const log = useCallback((msg) => {
    const time = new Date().toLocaleTimeString();
    setLogMessages((prev) => [...prev, `[${time}] ${msg}\n`]);
  }, []);

  const showStatus = useCallback((msg, type = "info") => {
    setStatus(msg);
    setStatusType(type);
  }, []);

  const shortenAddress = (addr) => {
    if (!addr) return "";
    return addr.substring(0, 6) + "..." + addr.substring(addr.length - 4);
  };

  // Refresh contract info
  const refreshInfo = useCallback(async () => {
    try {
      const [bal, pct, totalDist, supply, replSup, stolen] = await Promise.all([
        readProvider.getBalance(distributeCA_ABI.address),
        distributeContract ? distributeContract.distributionPercentage() : Promise.resolve("--"),
        distributeContract ? distributeContract.totalFundsDistributed() : Promise.resolve(0),
        mohRead.totalSupply(),
        replacementRead.totalSupply(),
        routerRead.getStolenCount(),
      ]);

      setContractBalance(ethers.utils.formatEther(bal));
      setDistributionPct(pct.toString());
      setTotalDistributed(ethers.utils.formatEther(totalDist));
      setMohSupply(supply.toString());
      setReplSupply(replSup.toString());
      setStolenCount(stolen.toString());
      log("Info refreshed. Balance: " + ethers.utils.formatEther(bal) + " BNB");
    } catch (err) {
      log("Refresh error: " + err.message);
    }
  }, [readProvider, distributeContract, mohRead, replacementRead, routerRead, log]);

  // Load stolen tokens from Router
  const loadStolenTokens = useCallback(async () => {
    try {
      const ids = await routerRead.getAllStolenTokenIds();
      const map = {};
      const records = [];

      for (const id of ids) {
        const record = await routerRead.getStolenRecord(id);
        if (record.isStolen) {
          map[id.toString()] = record.rightfulOwner;
          records.push({
            tokenId: id.toString(),
            thiefWallet: record.thiefWallet,
            rightfulOwner: record.rightfulOwner,
            reason: record.reason,
          });
          log("Stolen: Token #" + id + " -> " + shortenAddress(record.rightfulOwner));
        }
      }

      setStolenMap(map);
      setStolenRecords(records);
    } catch (err) {
      log("Error loading stolen tokens: " + err.message);
    }
  }, [routerRead, log]);

  // Initialize on mount
  useEffect(() => {
    if (distributeContract) {
      refreshInfo();
      loadStolenTokens();
    }
  }, [distributeContract]);

  // Fetch XdRiP balance
  const fetchXdripBalance = async (addr) => {
    try {
      const balance = await publicClient.readContract({
        address: xdripCA_ABI.address,
        abi: xdripCA_ABI.abi,
        functionName: "balanceOf",
        args: [addr],
      });
      const formatted = parseFloat((Number(balance) / 1e9).toString());
      return formatted;
    } catch (err) {
      log("XdRiP error for " + shortenAddress(addr) + ": " + err.message);
      return 0;
    }
  };

  // Scan a single contract for holders
  const scanContract = async (contract, label, holderMap, currentStolenMap) => {
    let tokensFound = 0;

    for (const range of TOKEN_RANGES) {
      log("Scanning " + label + " " + range.name + " (" + range.start + "-" + range.end + ")...");

      for (let tokenId = range.start; tokenId <= range.end; tokenId++) {
        try {
          let owner = await contract.ownerOf(tokenId);
          tokensFound++;

          // Router stolen check
          const idStr = tokenId.toString();
          if (currentStolenMap[idStr]) {
            const victim = currentStolenMap[idStr];
            log("! Token #" + tokenId + " STOLEN - redirect " + shortenAddress(owner) + " -> " + shortenAddress(victim));
            owner = victim;
          }

          if (!holderMap[owner]) holderMap[owner] = { medals: [] };
          holderMap[owner].medals.push({ tokenId, name: range.name, source: label });

          if (tokensFound % 5 === 0) {
            setProgress({
              visible: true,
              pct: Math.min(60, Math.floor((tokensFound / 50) * 60)),
              text: `Scanned ${tokensFound} tokens... (${label} ${range.name} #${tokenId})`,
            });
          }
        } catch {
          log(label + " " + range.name + " ended at #" + (tokenId - 1) + " (" + tokensFound + " found)");
          break;
        }
        // Small delay to avoid rate limiting
        await new Promise((r) => setTimeout(r, 50));
      }
    }

    return tokensFound;
  };

  // Scan replacement contract using tokenByIndex (sparse IDs)
  const scanReplacementContract = async (holderMap, currentStolenMap) => {
    let tokensFound = 0;
    try {
      const replSupply = await replacementRead.totalSupply();
      const replCount = Number(replSupply);
      log("Replacement contract has " + replCount + " tokens");

      for (let i = 0; i < replCount; i++) {
        try {
          const tokenId = await replacementRead.tokenByIndex(i);
          let owner = await replacementRead.ownerOf(tokenId);
          tokensFound++;

          const tokenNum = Number(tokenId);
          let tierName = "COMMON";
          for (const range of TOKEN_RANGES) {
            if (tokenNum >= range.start && tokenNum <= range.end) {
              tierName = range.name;
              break;
            }
          }

          const idStr = tokenId.toString();
          if (currentStolenMap[idStr]) {
            const victim = currentStolenMap[idStr];
            log("! Replacement #" + tokenId + " STOLEN - redirect " + shortenAddress(owner) + " -> " + shortenAddress(victim));
            owner = victim;
          }

          if (!holderMap[owner]) holderMap[owner] = { medals: [] };
          holderMap[owner].medals.push({ tokenId: tokenNum, name: tierName, source: "Replacement" });

          log("Replacement #" + tokenId + " (" + tierName + ") -> " + shortenAddress(owner));
          setProgress({
            visible: true,
            pct: 65,
            text: `Replacement token ${i + 1}/${replCount} - #${tokenId} (${tierName})`,
          });
        } catch (err) {
          log("Error reading replacement token index " + i + ": " + err.message);
        }
      }
    } catch (err) {
      log("Error scanning Replacement contract: " + err.message);
    }
    return tokensFound;
  };

  // Main fetch holders function
  const fetchHolders = async () => {
    if (!mohRead) {
      showStatus("MOH contract not loaded", "error");
      return;
    }

    setIsScanning(true);
    setHoldersInfo([]);
    const holderMap = {};

    try {
      showStatus("Fetching medal holders from both contracts...", "info");
      log("Starting holder scan (Original MOH + Replacement DOTs)...");

      // Scan Original MOH
      const originalCount = await scanContract(mohRead, "Original", holderMap, stolenMap);

      // Scan Replacement DOTs
      const replacementCount = await scanReplacementContract(holderMap, stolenMap);

      const totalTokens = originalCount + replacementCount;
      log("Scan done. " + totalTokens + " tokens, " + Object.keys(holderMap).length + " wallets");

      setProgress({ visible: true, pct: 75, text: "Calculating weights and XdRiP bonuses..." });

      // Calculate weights
      const holders = Object.entries(holderMap).map(([addr, data]) => {
        const tierCounts = {};
        MEDAL_ORDER.forEach((t) => (tierCounts[t] = 0));
        data.medals.forEach((m) => {
          if (tierCounts[m.name] !== undefined) tierCounts[m.name]++;
        });

        const fullRamps = Math.min(...MEDAL_ORDER.map((t) => tierCounts[t]));
        let weight = fullRamps * DOT_WEIGHTS.LEGENDARY;
        const remaining = MEDAL_ORDER.filter((t) => tierCounts[t] > fullRamps);
        if (remaining.length > 0) weight += DOT_WEIGHTS[remaining[remaining.length - 1]];

        return { address: addr, weight, medals: data.medals, tierCounts, fullRamps };
      });

      // XdRiP bonuses
      const updatedHolders = [];
      for (let i = 0; i < holders.length; i++) {
        const h = holders[i];
        setProgress({
          visible: true,
          pct: 80 + Math.floor((i / holders.length) * 20),
          text: "XdRiP check: " + shortenAddress(h.address),
        });

        const xdripBal = await fetchXdripBalance(h.address);
        const xdripPct = (xdripBal / 1e9) * 100;
        let bonus = 0;
        if (xdripPct >= 1.48) bonus = 15;
        else if (xdripPct >= 1.25) bonus = 10;
        else if (xdripPct >= 1) bonus = 7;
        else if (xdripPct >= 0.75) bonus = 5;
        else if (xdripPct >= 0.5) bonus = 2;

        const scaledBonus = h.weight * (bonus / 100);
        const finalWeight = h.weight + scaledBonus;
        const hasRedirected = h.medals.some((m) => stolenMap[m.tokenId.toString()]);

        updatedHolders.push({
          ...h,
          xdripBalance: xdripBal,
          xdripPct,
          revshareBonus: bonus,
          scaledBonus,
          finalWeight,
          hasRedirected,
        });

        log(
          shortenAddress(h.address) +
            ": wt=" + h.weight +
            " bonus=" + bonus +
            "% final=" + finalWeight.toFixed(1) +
            (hasRedirected ? " [REDIRECTED]" : "")
        );
      }

      setHoldersInfo(updatedHolders);
      setProgress({ visible: false, pct: 0, text: "" });
      showStatus(
        "Found " + updatedHolders.length + " holders (" + totalTokens + " tokens). Review table then distribute.",
        "success"
      );
    } catch (err) {
      showStatus("Fetch failed: " + err.message, "error");
      log("ERROR: " + err.message);
    }
    setIsScanning(false);
  };

  // 3-Step Distribution
  const updateWeightsAndDistribute = async () => {
    if (!distributeContract || holdersInfo.length === 0) return;
    setIsDistributing(true);

    const addresses = holdersInfo.map((h) => h.address);
    const weights = holdersInfo.map((h) => Math.floor(h.finalWeight));
    const bonuses = holdersInfo.map((h) => Math.floor(h.scaledBonus));

    log("=== DISTRIBUTION START ===");
    log("Holders: " + addresses.length);

    let step1ok = false;
    let step2ok = false;

    // Step 1: Update final weights
    try {
      showStatus("Step 1/3: Updating final weights... confirm in wallet", "info");
      log("Step 1: updateFinalWeights - CONFIRM IN WALLET");
      const tx = await distributeContract.updateFinalWeights(addresses, weights);
      log("Step 1 tx sent: " + tx.hash);
      showStatus("Step 1/3: Waiting for confirmation...", "info");
      await tx.wait();
      log("Step 1 complete: final weights updated");
      step1ok = true;
    } catch (err) {
      log("Step 1 error: " + (err.reason || err.message));
      showStatus("Step 1 failed: " + (err.reason || err.message), "error");
    }

    // Step 2: Update XdRiP bonus weights
    try {
      showStatus("Step 2/3: Updating XdRiP bonus weights... confirm in wallet", "info");
      log("Step 2: updateXdRiPWeights - CONFIRM IN WALLET");
      const tx = await distributeContract.updateXdRiPWeights(addresses, bonuses);
      log("Step 2 tx sent: " + tx.hash);
      showStatus("Step 2/3: Waiting for confirmation...", "info");
      await tx.wait();
      log("Step 2 complete: XdRiP weights updated");
      step2ok = true;
    } catch (err) {
      log("Step 2 error: " + (err.reason || err.message));
      showStatus("Step 2 failed: " + (err.reason || err.message), "error");
    }

    // Step 3: Distribute revenue
    try {
      showStatus("Step 3/3: Distributing revenue... confirm in wallet", "info");
      log("Step 3: distributeRevenue - CONFIRM IN WALLET");
      const tx = await distributeContract.distributeRevenue();
      log("Step 3 tx sent: " + tx.hash);
      showStatus("Step 3/3: Waiting for confirmation...", "info");
      await tx.wait();
      log("Step 3 complete: Revenue distributed!");
      showStatus(
        "Distribution complete! " +
          (step1ok ? "1 pass " : "1 fail ") +
          (step2ok ? "2 pass " : "2 fail ") +
          "3 pass",
        "success"
      );
      await refreshInfo();
    } catch (err) {
      showStatus("Step 3 FAILED: " + (err.reason || err.message), "error");
      log("Step 3 error: " + (err.reason || err.message));
    }

    setIsDistributing(false);
  };

  // Flag stolen token
  const handleFlagStolen = async () => {
    if (!routerWrite) {
      showStatus("Router not loaded", "error");
      return;
    }
    if (!flagTokenId || !flagThief || !flagVictim) {
      showStatus("Fill all stolen fields", "error");
      return;
    }
    try {
      showStatus("Flagging token #" + flagTokenId + "...", "info");
      const reason = flagReason || "Wallet compromised";
      const tx = await routerWrite.flagStolen(flagTokenId, flagThief, flagVictim, reason);
      await tx.wait();
      showStatus("Token #" + flagTokenId + " flagged", "success");
      log("Flagged #" + flagTokenId + ": " + shortenAddress(flagThief) + " -> " + shortenAddress(flagVictim));
      setFlagTokenId("");
      setFlagThief("");
      setFlagVictim("");
      setFlagReason("");
      await loadStolenTokens();
      await refreshInfo();
    } catch (err) {
      showStatus("Flag failed: " + (err.reason || err.message), "error");
      log("ERROR flag: " + (err.reason || err.message));
    }
  };

  // Deposit funds
  const handleDeposit = async () => {
    if (!depositAmount || !signer) return;
    try {
      showStatus("Depositing " + depositAmount + " BNB...", "info");
      const tx = await signer.sendTransaction({
        to: distributeCA_ABI.address,
        value: ethers.utils.parseEther(depositAmount),
      });
      await tx.wait();
      showStatus(depositAmount + " BNB deposited", "success");
      log("Deposited " + depositAmount + " BNB");
      setDepositAmount("");
      await refreshInfo();
    } catch (err) {
      showStatus("Deposit failed: " + err.message, "error");
    }
  };

  // Update distribution percentage
  const handleUpdatePercentage = async () => {
    if (!distributeContract || !newPercentage) return;
    const parsed = parseInt(newPercentage, 10);
    if (isNaN(parsed) || parsed <= 0 || parsed > 100) {
      showStatus("Enter a valid percentage (1-100).", "error");
      return;
    }
    try {
      showStatus("Updating distribution percentage...", "info");
      const tx = await distributeContract.updateDistributionPercentage(parsed);
      await tx.wait();
      setNewPercentage("");
      showStatus("Distribution percentage updated to " + parsed + "%", "success");
      await refreshInfo();
    } catch (err) {
      showStatus("Error: " + (err.reason || err.message), "error");
    }
  };

  // Compute total weight for share %
  const totalWeight = holdersInfo.reduce((sum, h) => sum + h.finalWeight, 0);

  const statusColors = {
    success: { background: "#0d2818", color: "#4CAF50", border: "1px solid #1a4a2a" },
    error: { background: "#2d0a0a", color: "#E74C3C", border: "1px solid #4a1a1a" },
    warning: { background: "#2d1f0a", color: "#F39C12", border: "1px solid #4a3a1a" },
    info: { background: "#0a1a2d", color: "#5DADE2", border: "1px solid #1a2a4a" },
  };

  return (
    <div className={styles.container}>
      <button onClick={onBack} className={styles.backButton}>
        &larr; Back to Dashboard
      </button>

      <h2 className={styles.heading}>Distribution Console</h2>

      {/* Status Bar */}
      {status && (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: "6px",
            marginBottom: "16px",
            fontSize: "13px",
            ...(statusColors[statusType] || statusColors.info),
          }}
        >
          {status}
        </div>
      )}

      {/* Info Bar */}
      <div
        style={{
          display: "flex",
          gap: "24px",
          padding: "12px 16px",
          background: "#111",
          borderRadius: "8px",
          marginBottom: "16px",
          fontSize: "13px",
          border: "1px solid #222",
          flexWrap: "wrap",
        }}
      >
        <span>Balance: <strong style={{ color: "#F1C40F" }}>{contractBalance}</strong> BNB</span>
        <span>Dist %: <strong style={{ color: "#F1C40F" }}>{distributionPct}</strong>%</span>
        <span>Total Distributed: <strong style={{ color: "#F1C40F" }}>{totalDistributed}</strong> BNB</span>
        <span>Stolen Flags: <strong style={{ color: "#F1C40F" }}>{stolenCount}</strong></span>
        <span>MOH Supply: <strong style={{ color: "#F1C40F" }}>{mohSupply} + {replSupply} repl</strong></span>
      </div>

      {/* Action Buttons */}
      <div className={styles.buttonSection}>
        <button
          onClick={fetchHolders}
          disabled={isScanning}
          className={styles.button}
        >
          {isScanning ? "Scanning..." : "Fetch Medal Holders"}
        </button>
        <button
          onClick={updateWeightsAndDistribute}
          disabled={!holdersInfo.length || isDistributing}
          className={styles.button}
          style={{ backgroundColor: "#27AE60" }}
        >
          {isDistributing ? "Distributing..." : "Update Weights & Distribute"}
        </button>
        <button onClick={refreshInfo} className={styles.button} style={{ backgroundColor: "#333" }}>
          Refresh Info
        </button>
      </div>

      {/* Progress Bar */}
      {progress.visible && (
        <div style={{ marginBottom: "16px" }}>
          <div
            style={{
              width: "100%",
              height: "6px",
              background: "#222",
              borderRadius: "3px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                background: "#F1C40F",
                borderRadius: "3px",
                width: progress.pct + "%",
                transition: "width 0.3s",
              }}
            />
          </div>
          <div style={{ fontSize: "11px", color: "#666", marginTop: "4px" }}>
            {progress.text}
          </div>
        </div>
      )}

      {/* Flag Stolen Section */}
      <div
        style={{
          background: "#111",
          border: "1px solid #E74C3C40",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "16px",
        }}
      >
        <h3 style={{ color: "#E74C3C", fontSize: "15px", marginBottom: "12px" }}>
          Flag Stolen Token
        </h3>
        <div className={styles.inputGroup} style={{ marginBottom: "8px" }}>
          <input
            className={styles.input}
            placeholder="Stolen Token ID"
            value={flagTokenId}
            onChange={(e) => setFlagTokenId(e.target.value)}
          />
          <input
            className={styles.input}
            placeholder="Thief Wallet 0x..."
            value={flagThief}
            onChange={(e) => setFlagThief(e.target.value)}
          />
          <input
            className={styles.input}
            placeholder="Victim New Wallet 0x..."
            value={flagVictim}
            onChange={(e) => setFlagVictim(e.target.value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <input
            className={styles.input}
            placeholder="Reason (e.g. wallet compromised)"
            value={flagReason}
            onChange={(e) => setFlagReason(e.target.value)}
            style={{ flex: 1 }}
          />
          <button
            onClick={handleFlagStolen}
            className={styles.buttonSmall}
            style={{ backgroundColor: "#E74C3C" }}
          >
            Flag Stolen
          </button>
        </div>
        {stolenRecords.length > 0 && (
          <div style={{ marginTop: "12px", fontSize: "12px" }}>
            {stolenRecords.map((rec) => (
              <div
                key={rec.tokenId}
                style={{
                  padding: "4px 0",
                  borderBottom: "1px solid #1a1a1a",
                }}
              >
                <span
                  style={{
                    background: "#E74C3C",
                    color: "#fff",
                    padding: "1px 6px",
                    borderRadius: "3px",
                    fontSize: "10px",
                    fontWeight: "bold",
                  }}
                >
                  STOLEN
                </span>{" "}
                Token #{rec.tokenId} — Thief: {shortenAddress(rec.thiefWallet)} -&gt; Victim:{" "}
                {shortenAddress(rec.rightfulOwner)}{" "}
                <span style={{ color: "#555" }}>({rec.reason})</span>
              </div>
            ))}
          </div>
        )}
        {stolenRecords.length === 0 && (
          <div style={{ marginTop: "8px", fontSize: "12px", color: "#555" }}>
            No stolen tokens flagged
          </div>
        )}
      </div>

      {/* Deposit Section */}
      <div
        style={{
          background: "#111",
          border: "1px solid #222",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "16px",
        }}
      >
        <h3 style={{ color: "#F1C40F", fontSize: "15px", marginBottom: "12px" }}>
          Deposit Distribution Funds
        </h3>
        <div className={styles.inputGroup}>
          <input
            className={styles.input}
            placeholder="Amount in BNB (e.g. 0.001)"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
          />
          <button onClick={handleDeposit} className={styles.buttonSmall} style={{ backgroundColor: "#F1C40F", color: "#000" }}>
            Deposit
          </button>
        </div>
      </div>

      {/* Update Distribution Percentage */}
      <div
        style={{
          background: "#111",
          border: "1px solid #222",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "16px",
        }}
      >
        <h3 style={{ color: "#F1C40F", fontSize: "15px", marginBottom: "12px" }}>
          Distribution Percentage
        </h3>
        <div className={styles.inputGroup}>
          <input
            className={styles.input}
            type="number"
            placeholder="New percentage (1-100)"
            value={newPercentage}
            onChange={(e) => setNewPercentage(e.target.value)}
          />
          <button onClick={handleUpdatePercentage} className={styles.buttonSmall}>
            Update %
          </button>
        </div>
      </div>

      {/* Holders Table */}
      {holdersInfo.length > 0 && (
        <div className={styles.tableContainer}>
          <h3 style={{ color: "#F1C40F", marginBottom: "12px" }}>
            Medal Holders &amp; Weights ({holdersInfo.length} holders)
          </h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Holder</th>
                <th className={styles.th}>DOTs</th>
                <th className={styles.th}>Ramps</th>
                <th className={styles.th}>Base Wt</th>
                <th className={styles.th}>XdRiP</th>
                <th className={styles.th}>Bonus</th>
                <th className={styles.th}>Final Wt</th>
                <th className={styles.th}>Share %</th>
                <th className={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {[...holdersInfo]
                .sort((a, b) => b.finalWeight - a.finalWeight)
                .map((h, idx) => {
                  const sharePct =
                    totalWeight > 0
                      ? ((h.finalWeight / totalWeight) * 100).toFixed(2)
                      : "0";
                  return (
                    <tr key={idx} className={styles.tr}>
                      <td className={styles.td} style={{ fontFamily: "monospace", fontSize: "11px" }}>
                        {shortenAddress(h.address)}
                      </td>
                      <td className={styles.td}>
                        {MEDAL_ORDER.map((t) => {
                          const c = h.tierCounts[t];
                          return c > 0 ? (
                            <span
                              key={t}
                              style={{
                                background: TIER_COLORS[t],
                                color: "#fff",
                                padding: "1px 6px",
                                borderRadius: "3px",
                                fontSize: "10px",
                                fontWeight: "bold",
                                display: "inline-block",
                                margin: "1px",
                              }}
                            >
                              {t.charAt(0)}:{c}
                            </span>
                          ) : null;
                        })}
                      </td>
                      <td className={styles.td}>{h.fullRamps}</td>
                      <td className={styles.td}>{h.weight}</td>
                      <td className={styles.td}>{h.xdripBalance?.toFixed(0) || "0"}</td>
                      <td className={styles.td}>{h.revshareBonus}%</td>
                      <td className={styles.td} style={{ color: "#F1C40F", fontWeight: "bold" }}>
                        {h.finalWeight.toFixed(1)}
                      </td>
                      <td className={styles.td}>{sharePct}%</td>
                      <td className={styles.td}>
                        {h.hasRedirected ? (
                          <span
                            style={{
                              background: "#27AE60",
                              color: "#fff",
                              padding: "1px 6px",
                              borderRadius: "3px",
                              fontSize: "10px",
                              fontWeight: "bold",
                            }}
                          >
                            REDIRECTED
                          </span>
                        ) : (
                          <span style={{ color: "#555", fontSize: "10px" }}>Normal</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}

      {/* Log */}
      <div
        style={{
          background: "#050505",
          border: "1px solid #222",
          borderRadius: "6px",
          padding: "12px",
          maxHeight: "300px",
          overflowY: "auto",
          fontFamily: "monospace",
          fontSize: "11px",
          color: "#888",
          marginTop: "16px",
          whiteSpace: "pre-wrap",
        }}
      >
        {logMessages.join("")}
      </div>
    </div>
  );
};

export default DistributeRevShare;
