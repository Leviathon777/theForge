import React, { useState, useEffect, useCallback } from "react";
import { useAccount, useConfig } from "wagmi";
import { getWalletClient } from "@wagmi/core";
import { walletClientToSigner } from "../../lib/walletClientToSigner";
import { publicClient } from "../../lib/viemClient";
import { ethers } from "ethers";
import mohCA_ABI from "../../Context/mohCA_ABI.json";
import ipfsHashes from "../../Context/ipfsHashes.js";
import { getForger, logMedalPurchase, sendReceiptEmail, trackDetailedTransaction } from "../../supabase/forgeServices.js";
import styles from "./ForgeCheckoutModal.module.css";

const MohAddress = mohCA_ABI.address;
const MohABI = mohCA_ABI.abi;
const fetchMohContract = (signer) => new ethers.Contract(MohAddress, MohABI, signer);

const PREREQUISITE_MAP = {
  COMMON: { required: null, minBalance: 0 },
  UNCOMMON: { required: "COMMON", minBalance: 1 },
  RARE: { required: "UNCOMMON", minBalance: 2 },
  EPIC: { required: "RARE", minBalance: 3 },
  LEGENDARY: { required: "EPIC", minBalance: 4 },
  ETERNAL: { required: null, minBalance: 0 },
};

const FORGE_FUNCTIONS = {
  COMMON: "forgeCommon",
  UNCOMMON: "forgeUncommon",
  RARE: "forgeRare",
  EPIC: "forgeEpic",
  LEGENDARY: "forgeLegendary",
  ETERNAL: "forgeEternal",
};

const ForgeCheckoutModal = ({ medal, bnbPrice, onClose }) => {
  const { address, isConnected } = useAccount();
  const wagmiConfig = useConfig();

  const [signer, setSigner] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [bnbBalance, setBnbBalance] = useState(null);
  const [medalBalance, setMedalBalance] = useState(null);
  const [txState, setTxState] = useState("idle"); // idle | validating | pending | confirming | success | error
  const [txHash, setTxHash] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const priceNum = parseFloat(medal.price);
  const priceUsd = bnbPrice ? (priceNum * bnbPrice).toFixed(0) : "---";
  const ipfsHash = ipfsHashes.find((h) => h.title === medal.title)?.url;

  // Get signer when wallet connects
  useEffect(() => {
    if (isConnected) {
      getWalletClient(wagmiConfig)
        .then((wc) => setSigner(walletClientToSigner(wc)))
        .catch(() => setSigner(null));
    } else {
      setSigner(null);
    }
  }, [isConnected, wagmiConfig]);

  // Fetch user profile + balances when address available
  useEffect(() => {
    if (!address) return;

    const fetchData = async () => {
      try {
        const [user, balance] = await Promise.all([
          getForger(address),
          publicClient.getBalance({ address }),
        ]);
        setUserInfo(user);
        setBnbBalance(parseFloat(ethers.utils.formatEther(balance.toString())));
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    const fetchMedalBalance = async () => {
      try {
        const bal = await publicClient.readContract({
          address: MohAddress,
          abi: MohABI,
          functionName: "balanceOf",
          args: [address],
        });
        setMedalBalance(Number(bal));
      } catch (err) {
        console.error("Error fetching medal balance:", err);
      }
    };

    fetchData();
    fetchMedalBalance();
  }, [address]);

  // Validation
  const getValidation = useCallback(() => {
    if (!isConnected) return { canForge: false, message: null };
    if (!userInfo) return { canForge: false, type: "warning", message: "Complete your investor profile before forging." };
    if (bnbBalance !== null && bnbBalance < priceNum) {
      return { canForge: false, type: "error", message: `Insufficient BNB balance. You need ${priceNum} BNB but have ${bnbBalance.toFixed(4)} BNB.` };
    }
    const prereq = PREREQUISITE_MAP[medal.title];
    if (prereq.required && medalBalance !== null && medalBalance < prereq.minBalance) {
      return { canForge: false, type: "error", message: `You must own a ${prereq.required} medal to forge ${medal.title}.` };
    }
    if (medal.title === "ETERNAL" && userInfo?.kyc?.kycStatus !== "approved") {
      return { canForge: false, type: "warning", message: "KYC approval is required for the Eternal Medal." };
    }
    if (medal.available === 0) {
      return { canForge: false, type: "error", message: "This medal tier is fully forged. No supply remaining." };
    }
    return { canForge: true, message: null };
  }, [isConnected, userInfo, bnbBalance, medalBalance, medal, priceNum]);

  const validation = getValidation();

  // Forge handler
  const handleForge = async () => {
    if (!signer || !address || !ipfsHash) return;

    setTxState("validating");
    setErrorMsg(null);

    try {
      const contract = fetchMohContract(signer);
      const price = ethers.utils.parseUnits(priceNum.toString(), "ether");
      const forgeFn = contract[FORGE_FUNCTIONS[medal.title]];

      // Estimate gas
      let gasLimit;
      try {
        const est = await contract.estimateGas[FORGE_FUNCTIONS[medal.title]](ipfsHash, { value: price });
        gasLimit = est.add(ethers.BigNumber.from(10000));
      } catch {
        gasLimit = ethers.BigNumber.from(990000);
      }

      setTxState("pending");

      // Store pending forge for recovery
      localStorage.setItem("pendingForge", JSON.stringify({
        medalType: medal.title, ipfsHash, address, startedAt: Date.now(),
      }));

      const tx = await forgeFn(ipfsHash, { value: price, gasLimit });
      setTxHash(tx.hash);
      setTxState("confirming");

      const receipt = await tx.wait();

      if (receipt.status === 1) {
        setTxState("success");
        localStorage.removeItem("pendingForge");

        // Post-forge logging (fire and forget)
        const revenueAccess = medal.revenueShare;
        const xdripBonus = medal.xdripBonus;
        Promise.all([
          logMedalPurchase(address, medal.title, priceNum.toString(), tx.hash, revenueAccess, xdripBonus),
          userInfo?.email
            ? sendReceiptEmail(address, userInfo.email, userInfo.fullName || "", medal.title, priceNum.toString(), tx.hash)
            : Promise.resolve(),
          trackDetailedTransaction(address, medal.title, {
            transactionHash: receipt.transactionHash,
            status: "Success",
            blockNumber: receipt.blockNumber,
            timestamp: new Date(),
            action: `Forge ${medal.title}`,
            from: address,
            to: MohAddress,
            valueBNB: ethers.utils.formatEther(price),
            gasUsed: receipt.gasUsed?.toNumber(),
            revenuePercent: revenueAccess,
            xdripBonusPercent: xdripBonus,
          }),
        ]).catch((e) => console.error("Post-forge logging error:", e));
      } else {
        setTxState("error");
        setErrorMsg("Transaction reverted on-chain. Please try again.");
      }
    } catch (error) {
      setTxState("error");
      if (error.code === 4001 || error.message?.includes("User rejected")) {
        setErrorMsg("Transaction cancelled.");
      } else if (error.data?.message) {
        const msg = error.data.message.includes("revert")
          ? error.data.message.split("revert ")[1]
          : error.data.message;
        setErrorMsg(msg);
      } else {
        setErrorMsg(error.message || "Forging failed. Please try again.");
      }
    }
  };

  // Close on escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && txState !== "pending" && txState !== "confirming") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [txState, onClose]);

  return (
    <div className={styles.overlay} onClick={(e) => {
      if (e.target === e.currentTarget && txState !== "pending" && txState !== "confirming") onClose();
    }}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose} disabled={txState === "pending" || txState === "confirming"}>
          &times;
        </button>

        {/* Header — Medal info */}
        <div className={styles.header}>
          <img src={medal.image} alt={medal.title} className={styles.medalImage} />
          <div className={styles.headerText}>
            <div className={styles.tierLabel}>Medal of Honor</div>
            <h2 className={styles.medalTitle}>{medal.title}</h2>
            <div className={styles.priceRow}>
              <span className={styles.priceBnb}>{medal.price} BNB</span>
              <span className={styles.priceUsd}>(~${priceUsd} USD)</span>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Available</span>
            <span className={styles.statValue}>{medal.available.toLocaleString()}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Revenue Weight</span>
            <span className={styles.statValue}>{medal.revenueShare}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>XdRiP Bonus</span>
            <span className={styles.statValue}>{medal.xdripBonus}</span>
          </div>
        </div>

        <div className={styles.body}>
          {/* Not connected state */}
          {!isConnected && (
            <div className={styles.walletSection}>
              <p className={styles.walletPrompt}>Connect your wallet to forge this medal</p>
              <appkit-button />
            </div>
          )}

          {/* Connected — show checkout */}
          {isConnected && txState === "idle" && (
            <>
              {validation.message && (
                <div className={`${styles.validationMsg} ${styles[validation.type]}`}>
                  {validation.message}
                </div>
              )}

              <div className={styles.summary}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Medal</span>
                  <span className={styles.summaryValue}>{medal.title}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Price</span>
                  <span className={styles.summaryValue}>{medal.price} BNB</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Network</span>
                  <span className={styles.summaryValue}>BNB Smart Chain</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Est. Gas</span>
                  <span className={styles.summaryValue}>~0.003 BNB</span>
                </div>
                <hr className={styles.summaryDivider} />
                <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                  <span className={styles.summaryLabel}>Total</span>
                  <span className={styles.summaryValue}>~{(priceNum + 0.003).toFixed(3)} BNB</span>
                </div>
              </div>

              <button
                className={styles.forgeBtn}
                onClick={handleForge}
                disabled={!validation.canForge || !signer}
              >
                Confirm &amp; Forge
              </button>

              <p className={styles.footerNote}>
                By confirming, your wallet will prompt you to approve the transaction.
                This action is irreversible once confirmed on-chain.
              </p>
            </>
          )}

          {/* Validating */}
          {txState === "validating" && (
            <div className={styles.txStatus}>
              <div className={styles.spinner} />
              <p className={styles.txStatusText}>Validating prerequisites...</p>
            </div>
          )}

          {/* Pending wallet approval */}
          {txState === "pending" && (
            <div className={styles.txStatus}>
              <div className={styles.spinner} />
              <p className={styles.txStatusText}>Approve the transaction in your wallet...</p>
            </div>
          )}

          {/* Confirming on chain */}
          {txState === "confirming" && (
            <div className={styles.txStatus}>
              <div className={styles.spinner} />
              <p className={styles.txStatusText}>Transaction submitted. Waiting for confirmation...</p>
              {txHash && (
                <a
                  href={`https://bscscan.com/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.txHash}
                >
                  View on BscScan
                </a>
              )}
            </div>
          )}

          {/* Success */}
          {txState === "success" && (
            <div className={styles.txStatus}>
              <div className={styles.successIcon}>&#10003;</div>
              <p className={styles.successText}>{medal.title} Medal Forged!</p>
              <p className={styles.successSub}>Your medal has been minted to your wallet.</p>
              {txHash && (
                <a
                  href={`https://bscscan.com/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.txHash}
                >
                  View transaction on BscScan
                </a>
              )}
              <button className={styles.forgeBtn} onClick={onClose} style={{ marginTop: "1.5rem" }}>
                Done
              </button>
            </div>
          )}

          {/* Error */}
          {txState === "error" && (
            <div className={styles.txStatus}>
              <div className={`${styles.validationMsg} ${styles.error}`}>
                {errorMsg || "Something went wrong."}
              </div>
              <button className={styles.forgeBtn} onClick={() => { setTxState("idle"); setErrorMsg(null); }}>
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgeCheckoutModal;
