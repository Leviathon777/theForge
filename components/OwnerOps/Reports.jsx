// Reports.jsx
/*
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ethers } from "ethers";
import { useAddress, ConnectWallet } from "@thirdweb-dev/react";

import Web3 from "web3";

import mohCA_ABI from "../../Context/mohCA_ABI.json";
import distributeCA_ABI from "../../Context/distributeCA_ABI.json";
import xdripCA_ABI from "../../Context/xdripCA_ABI.json";

import styles from "./Reports.module.css";
import { toast } from "react-toastify";


const Reports = ({ onClose }) => {
    const address = useAddress();
    const [status, setStatus] = useState("");
    const [mohContract, setMohContract] = useState(null);
    const [distributeContract, setDistributeContract] = useState(null);
    const [xdripContract, setXdripContract] = useState(null);


    const [ownerOpsData, setOwnerOpsData] = useState({
        owner: "",
        contractBalance: "",
        padronesPercentage: "",
        operatingCostsPercentage: "",
        operatingTasca: "",
        padronesList: [],
        supplyDetails: {
            common: "",
            uncommon: "",
            rare: "",
            epic: "",
            legendary: "",
            eternal: "",
        },
    });

    const [holdersInfo, setHoldersInfo] = useState([]);
    const [fundsDistributedEvents, setFundsDistributedEvents] = useState([]);
    const [investorPaidEvents, setInvestorPaidEvents] = useState([]);

    useEffect(() => {
        const init = async () => {
            if (!window.ethereum) {
                setStatus("Please install MetaMask to use this feature.");
                return;
            }

            try {
                setStatus("Initializing contracts (MOH + Distribute with signer, XdRiP with Web3) ...");

                // Request accounts to get signer
                await window.ethereum.request({ method: "eth_requestAccounts" });

                // Ethers provider + signer
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();

                // 1) MOH contract (signer-based or read-only—your choice)
                const mohInstance = new ethers.Contract(
                    mohCA_ABI.address,
                    mohCA_ABI.abi,
                    signer
                );
                setMohContract(mohInstance);

                // 2) Distribute contract with same signer (like DistributeRevShare)
                const distInstance = new ethers.Contract(
                    distributeCA_ABI.address,
                    distributeCA_ABI.abi,
                    signer
                );
                setDistributeContract(distInstance);

                // 3) XdRiP with Web3 read-only
                const web3 = new Web3("https://bsc-dataseed1.binance.org/");
                const xdripInstance = new web3.eth.Contract(
                    xdripCA_ABI.abi,
                    xdripCA_ABI.address
                );
                setXdripContract(xdripInstance);

                setStatus("All contracts initialized successfully.");
            } catch (err) {
                console.error("Init error:", err);
                setStatus("Error initializing contracts. See console for details.");
            }
        };

        init();
    }, []);


    const shortenAddress = (addr) =>
        addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

    const copyToClipboard = useCallback((text) => {
        navigator.clipboard
            .writeText(text)
            .then(() => toast.success("Copied to clipboard!"))
            .catch(() => toast.error("Failed to copy."));
    }, []);


    const fetchOwnerOpsData = useCallback(async () => {
        if (!mohContract) {
            setStatus("MOH contract not loaded yet.");
            return;
        }

        try {
            setStatus("Fetching OwnerOps–style data...");
            const provider = mohContract.provider;

            // 1) Contract Owner
            const owner = await mohContract.titolare();

            // 2) Contract Balance (BNB) for MOH
            const balance = await provider.getBalance(mohCA_ABI.address);

            // 3) Padrones & Operating costs
            const [pPct, oPct] = await Promise.all([
                mohContract.padronesPercentage(),
                mohContract.operatingCostsPercentage(),
            ]);

            // 4) Operating Tasca
            const opTasca = await mohContract.operatingTasca();

            // 5) Padrone Tascas
            const padronesList = [];
            for (let i = 0; i < 10; i++) {
                try {
                    const padrone = await mohContract.padroneTascas(i);
                    if (!padrone || padrone === ethers.constants.AddressZero) {
                        break;
                    }
                    padronesList.push(padrone);
                } catch (err) {
                    break;
                }
            }


            const supply = await mohContract.getforgedCounts();
            const supplyDetails = {
                common: `${supply.commonforged}/${supply.commonRemaining}`,
                uncommon: `${supply.uncommonforged}/${supply.uncommonRemaining}`,
                rare: `${supply.rareforged}/${supply.rareRemaining}`,
                epic: `${supply.epicforged}/${supply.epicRemaining}`,
                legendary: `${supply.legendaryforged}/${supply.legendaryRemaining}`,
                eternal: `${supply.eternalforged}/${supply.eternalRemaining}`,
            };

            setOwnerOpsData({
                owner,
                contractBalance: ethers.utils.formatEther(balance),
                padronesPercentage: `${ethers.utils.formatUnits(pPct, 2)}%`,
                operatingCostsPercentage: `${ethers.utils.formatUnits(oPct, 2)}%`,
                operatingTasca: opTasca,
                padronesList,
                supplyDetails,
            });

            setStatus("OwnerOps data fetched successfully.");
        } catch (error) {
            console.error("Error fetching OwnerOps data:", error);
            setStatus("Error fetching OwnerOps data.");
        }
    }, [mohContract]);


    const fetchHoldersData = useCallback(async () => {
        if (!mohContract || !xdripContract) {
            setStatus("MOH or XdRiP contract not loaded yet.");
            return;
        }

        try {
            setStatus("Fetching Medal holders from 1..20000 (full ramp)...");
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

            for (const range of tokenRanges) {
                for (let tokenId = range.start; tokenId <= range.end; tokenId++) {
                    try {
                        const tokenOwner = await mohContract.ownerOf(tokenId);
                        if (!tokenOwner) continue;

                        if (!holderMap[tokenOwner]) {
                            holderMap[tokenOwner] = { medals: [] };
                        }
                        holderMap[tokenOwner].medals.push({ tokenId, name: range.name });
                    } catch (err) {
                        // token not minted
                        break;
                    }
                }
            }


            const web3 = new Web3("https://bsc-dataseed1.binance.org/");
            const fetchXDRIPBalance = async (addr) => {
                try {
                    const rawBal = await xdripContract.methods.balanceOf(addr).call();
                    return parseFloat(web3.utils.fromWei(rawBal, "gwei"));
                } catch {
                    return 0;
                }
            };

            const updatedHolders = [];
            for (const [ownerAddr, data] of Object.entries(holderMap)) {
                const tierCounts = { COMMON: 0, UNCOMMON: 0, RARE: 0, EPIC: 0, LEGENDARY: 0 };
                data.medals.forEach((m) => {
                    tierCounts[m.name]++;
                });

                // full ramps = min across all 5 tiers
                const fullRamps = Math.min(...medalOrder.map((t) => tierCounts[t]));
                let totalWeight = 0;
                totalWeight += fullRamps * DOTWeights.LEGENDARY;

                const leftoverTiers = medalOrder.filter((t) => tierCounts[t] > fullRamps);
                if (leftoverTiers.length > 0) {
                    const highestLeftoverTier = leftoverTiers[leftoverTiers.length - 1];
                    totalWeight += DOTWeights[highestLeftoverTier];
                }
                // XdRiP
                const xdripBal = await fetchXDRIPBalance(ownerAddr);

                // revshare bonus
                let revshareBonus = 0;
                if (xdripBal >= 1.48) revshareBonus = 15;
                else if (xdripBal >= 1.25) revshareBonus = 10;
                else if (xdripBal >= 1.0) revshareBonus = 7;
                else if (xdripBal >= 0.75) revshareBonus = 5;
                else if (xdripBal >= 0.5) revshareBonus = 2;

                const finalWeight =
                    totalWeight > 0 ? totalWeight + totalWeight * (revshareBonus / 100) : 0;

                updatedHolders.push({
                    address: ownerAddr,
                    medals: data.medals,
                    totalWeight,
                    xdripBalance: xdripBal.toFixed(2),
                    revshareBonus,
                    finalWeight: finalWeight.toFixed(2),
                });
            }

            setHoldersInfo(updatedHolders);
            setStatus("Holders data fetched successfully.");
        } catch (err) {
            console.error("Error fetching holders data:", err);
            setStatus("Error fetching holders data.");
        }
    }, [mohContract, xdripContract]);

    const fetchDistributionEventsORG = useCallback(async () => {
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

            const investorFilter = distributeContract.filters.FundsDeposited();
            const investorEvents = await distributeContract.queryFilter(investorFilter, 0, "latest");
            const investorPaid = investorEvents.map((event) => ({
                investor: event.args.investor,
                amount: ethers.utils.formatEther(event.args.amount),
                blockNumber: event.blockNumber,
            }));

            setFundsDistributedEvents(fundsDistributed);
            setInvestorPaidEvents(investorPaid);

            setStatus("Distribution events fetched successfully.");
        } catch (error) {
            console.error("Error fetching distribution events:", error);
            setStatus("Error fetching distribution events.");
        }
    }, [distributeContract]);


    const fetchDistributionEvents = useCallback(async () => {
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
            setFundsDistributedEvents(fundsDistributed);
            setInvestorPaidEvents(investorPaid);
            setStatus("Events fetched successfully.");
        } catch (error) {
            console.error("Error fetching distribution events:", error);
            setStatus("Error fetching distribution events. See console for details.");
        }
    }, [distributeContract]);

    useEffect(() => {
        const initContracts = async () => {
            try {
                if (!window.ethereum) {
                    setStatus("MetaMask is required to use this feature.");
                    return;
                }
                await window.ethereum.request({ method: "eth_requestAccounts" });
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const distInstance = new ethers.Contract(
                    distributeCA_ABI.address,
                    distributeCA_ABI.abi,
                    signer
                );
                setDistributeContract(distInstance);
                setStatus("Contracts initialized successfully.");
            } catch (err) {
                console.error("Error initializing contracts:", err);
                setStatus("Error initializing contracts.");
            }
        };
        initContracts();
    }, []);


    const renderOwnerOpsSection = () => {
        const {
            owner,
            contractBalance,
            padronesPercentage,
            operatingCostsPercentage,
            operatingTasca,
            padronesList,
            supplyDetails,
        } = ownerOpsData;

        if (!owner) {
            return (
                <button onClick={fetchOwnerOpsData} className={styles.button}>
                    Fetch OwnerOps Data
                </button>
            );
        }

        return (
            <div className={styles.reportBox}>
                <h3>Owner & Contract Operations</h3>
                <p>
                    <strong>Owner Address: </strong>
                    <span className={styles.copyableAddress} onClick={() => copyToClipboard(owner)}>
                        {shortenAddress(owner)}
                    </span>
                </p>
                <p>
                    <strong>Contract Balance: </strong>
                    {contractBalance} BNB
                </p>
                <p>
                    <strong>Padrones Percentage: </strong>
                    {padronesPercentage}
                </p>
                <p>
                    <strong>Operating Costs Percentage: </strong>
                    {operatingCostsPercentage}
                </p>
                <p>
                    <strong>Operating Wallet: </strong>
                    <span className={styles.copyableAddress} onClick={() => copyToClipboard(operatingTasca)}>
                        {shortenAddress(operatingTasca)}
                    </span>
                </p>


                <div className={styles.padronesSection}>
                    <h4>Padrones List</h4>
                    {padronesList && padronesList.length > 0 ? (
                        <ul>
                            {padronesList.map((pAddr, idx) => (
                                <li key={idx}>
                                    <span className={styles.copyable} onClick={() => copyToClipboard(pAddr)}>
                                        {shortenAddress(pAddr)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No padrones found.</p>
                    )}
                </div>


                <div className={styles.supplySection}>
                    <h4>Supply Details</h4>
                    {Object.entries(supplyDetails).map(([tier, supply]) => (
                        <p key={tier}>
                            <strong>{tier.toUpperCase()}:</strong> {supply}
                        </p>
                    ))}
                </div>
            </div>
        );
    };


    const renderHoldersSection = () => {
        if (holdersInfo.length === 0) {
            return (
                <button onClick={fetchHoldersData} className={styles.button}>
                    Fetch Holders Info
                </button>
            );
        }

        return (
            <div className={styles.reportBox}>
                <h3>Medal Holders & Weights</h3>
                <button onClick={fetchHoldersData} className={styles.buttonSmall}>
                    Refresh
                </button>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Holder</th>
                                <th>Medals Owned</th>
                                <th>Total Weight</th>
                                <th>XdRiP Balance</th>
                                <th>Bonus (%)</th>
                                <th>Final Weight</th>
                            </tr>
                        </thead>
                        <tbody>
                            {holdersInfo.map((h, idx) => (
                                <tr key={idx}>
                                    <td>
                                        <span
                                            className={styles.copyableAddress}
                                            onClick={() => copyToClipboard(h.address)}
                                        >
                                            {shortenAddress(h.address)}
                                        </span>
                                    </td>
                                    <td>
                                        {h.medals.map((m) => `${m.name} (#${m.tokenId})`).join(", ")}
                                    </td>
                                    <td>{h.totalWeight}</td>
                                    <td>{h.xdripBalance}</td>
                                    <td>{h.revshareBonus}</td>
                                    <td>{h.finalWeight}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };


    const renderDistributeEventsSection = () => {
        if (!fundsDistributedEvents.length && !investorPaidEvents.length) {
            return (
                <button onClick={fetchDistributionEvents} className={styles.button}>
                    Fetch Distribution Events
                </button>
            );
        }

        return (
            <div className={styles.reportBox}>
                <h3>Revenue Distribution Events</h3>
                <button onClick={fetchDistributionEvents} className={styles.buttonSmall}>
                    Refresh
                </button>


                <div className={styles.subSection}>
                    <h4>FundsDistributed</h4>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Total Distributed (BNB)</th>
                                <th>Date/Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fundsDistributedEvents.map((evt, i) => (
                                <tr key={i}>
                                    <td>{evt.totalDistributed}</td>
                                    <td>{evt.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


                <div className={styles.subSection}>
                    <h4>investorPaid Breakdown</h4>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Investor</th>
                                <th>Amount (BNB)</th>
                                <th>Date/Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {investorPaidEvents.map((evt, i) => (
                                <tr key={i}>
                                    <td
                                        className={styles.copyableAddress}
                                        onClick={() => copyToClipboard(evt.investor)}
                                    >
                                        {shortenAddress(evt.investor)}
                                    </td>
                                    <td>{evt.amount}</td>
                                    <td>{evt.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };


    return (
        <div className={styles.container}>


            <div className={styles.header}>
                <h2 className={styles.title}>Reports</h2>
                <button
                    onClick={onClose}
                    className={styles.closeButton}
                    title="Close Reports"
                >
                    &times;
                </button>
            </div>

            <div className={styles.connectWallet}>
                <ConnectWallet className={styles.connectWalletBtn} />
            </div>

            <p className={styles.status}>{status}</p>

            {!address ? (
                <div className={styles.prompt}>
                    <p>Please connect your wallet to view reports.</p>
                </div>
            ) : (
                <div className={styles.reportsContainer}>
                    <div className={styles.reportSection}>{renderOwnerOpsSection()}</div>

                    <div className={styles.reportSection}>{renderHoldersSection()}</div>

                    <div className={styles.reportSection}>{renderDistributeEventsSection()}</div>

                    <div className={styles.reportBox}>
                        <h3>Funds Distributed</h3>
                        {fundsDistributedEvents.length === 0 ? (
                            <p>No FundsDistributed events found.</p>
                        ) : (
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Total Distributed (BNB)</th>
                                        <th>Block Number</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fundsDistributedEvents.map((event, index) => (
                                        <tr key={index}>
                                            <td>{event.totalDistributed}</td>
                                            <td>{event.blockNumber}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;
*/

// Reports.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ethers } from "ethers";
import { useAddress, ConnectWallet } from "@thirdweb-dev/react";
import Web3 from "web3";

import mohCA_ABI from "../../Context/mohCA_ABI.json";
import distributeCA_ABI from "../../Context/distributeCA_ABI.json";
import xdripCA_ABI from "../../Context/xdripCA_ABI.json";

import styles from "./Reports.module.css";
import { toast } from "react-toastify";

const Reports = ({ onClose }) => {
  const address = useAddress();
  const [status, setStatus] = useState("");

  // Contract states
  const [mohContract, setMohContract] = useState(null);
  const [distributeContract, setDistributeContract] = useState(null);
  const [xdripContract, setXdripContract] = useState(null);

  // Data states
  const [ownerOpsData, setOwnerOpsData] = useState({
    owner: "",
    contractBalance: "",
    padronesPercentage: "",
    operatingCostsPercentage: "",
    operatingTasca: "",
    padronesList: [],
    supplyDetails: {
      common: "",
      uncommon: "",
      rare: "",
      epic: "",
      legendary: "",
      eternal: "",
    },
  });
  const [holdersInfo, setHoldersInfo] = useState([]);
  const [fundsDistributedEvents, setFundsDistributedEvents] = useState([]);
  const [investorPaidEvents, setInvestorPaidEvents] = useState([]);

  // BNB->USD price
  const [bnbToUsd, setBnbToUsd] = useState(0);

  // For showing secondary table on a selected medal
  const [selectedMedal, setSelectedMedal] = useState(null);

  // Medal => cost in BNB
  const medalCosts = useMemo(
    () => ({
      COMMON: 0.5,
      UNCOMMON: 1,
      RARE: 1.5,
      EPIC: 2,
      LEGENDARY: 2.5,
    }),
    []
  );

  // --- 1) Fetch BNB Price from CoinGecko ---
  useEffect(() => {
    const fetchBNBPrice = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd"
        );
        const data = await response.json();
        const bnbPriceInUsd = data.binancecoin.usd;
        setBnbToUsd(bnbPriceInUsd);
      } catch (error) {
        console.error("Error fetching BNB price:", error);
      }
    };

    fetchBNBPrice();
    // Update price every 60s
    const interval = setInterval(fetchBNBPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  // --- Ethers/Web3 initializations ---
  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) {
        setStatus("Please install MetaMask to use this feature.");
        return;
      }
      try {
        setStatus("Initializing contracts (MOH + Distribute with signer, XdRiP with Web3)...");
        await window.ethereum.request({ method: "eth_requestAccounts" });

        // Ethers provider + signer
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // MOH Contract
        const mohInstance = new ethers.Contract(
          mohCA_ABI.address,
          mohCA_ABI.abi,
          signer
        );
        setMohContract(mohInstance);

        // Distribute Contract
        const distInstance = new ethers.Contract(
          distributeCA_ABI.address,
          distributeCA_ABI.abi,
          signer
        );
        setDistributeContract(distInstance);

        // XdRiP Contract (read-only)
        const web3 = new Web3("https://bsc-dataseed1.binance.org/");
        const xdripInstance = new web3.eth.Contract(
          xdripCA_ABI.abi,
          xdripCA_ABI.address
        );
        setXdripContract(xdripInstance);

        setStatus("All contracts initialized successfully.");
      } catch (err) {
        console.error("Init error:", err);
        setStatus("Error initializing contracts. See console for details.");
      }
    };

    init();
  }, []);

  // Shorten address for display
  const shortenAddress = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  // Unified address click: ctrl/cmd => open block explorer, else copy
  const handleAddressClick = useCallback((e, targetAddress) => {
    if (e.ctrlKey || e.metaKey) {
      window.open(`https://testnet.bscscan.com/address/${targetAddress}`, "_blank");
    } else {
      navigator.clipboard
        .writeText(targetAddress)
        .then(() => toast.success("Copied to clipboard!"))
        .catch(() => toast.error("Failed to copy."));
    }
  }, []);

  // --- 2) Fetch OwnerOps Data ---
  const fetchOwnerOpsData = useCallback(async () => {
    if (!mohContract) {
      setStatus("MOH contract not loaded yet.");
      return;
    }
    try {
      setStatus("Fetching OwnerOps–style data...");
      const provider = mohContract.provider;

      // 1) Contract Owner
      const owner = await mohContract.titolare();

      // 2) Contract Balance (BNB)
      const balance = await provider.getBalance(mohCA_ABI.address);

      // 3) Padrones & Operating costs
      const [pPct, oPct] = await Promise.all([
        mohContract.padronesPercentage(),
        mohContract.operatingCostsPercentage(),
      ]);

      // 4) Operating Tasca
      const opTasca = await mohContract.operatingTasca();

      // 5) Padrone Tascas
      const padronesList = [];
      for (let i = 0; i < 10; i++) {
        try {
          const padrone = await mohContract.padroneTascas(i);
          if (!padrone || padrone === ethers.constants.AddressZero) {
            break;
          }
          padronesList.push(padrone);
        } catch (err) {
          break;
        }
      }

      // 6) Supply details
      const supply = await mohContract.getforgedCounts();
      const supplyDetails = {
        common: `${supply.commonforged}/${supply.commonRemaining}`,
        uncommon: `${supply.uncommonforged}/${supply.uncommonRemaining}`,
        rare: `${supply.rareforged}/${supply.rareRemaining}`,
        epic: `${supply.epicforged}/${supply.epicRemaining}`,
        legendary: `${supply.legendaryforged}/${supply.legendaryRemaining}`,
        eternal: `${supply.eternalforged}/${supply.eternalRemaining}`,
      };

      setOwnerOpsData({
        owner,
        contractBalance: ethers.utils.formatEther(balance),
        padronesPercentage: `${(parseFloat(ethers.utils.formatUnits(pPct, 2)) * 100).toFixed(0)}%`,
        operatingCostsPercentage: `${(parseFloat(ethers.utils.formatUnits(oPct, 2)) * 100).toFixed(0)}%`,
        operatingTasca: opTasca,
        padronesList,
        supplyDetails,
      });

      setStatus("OwnerOps data fetched successfully.");
    } catch (error) {
      console.error("Error fetching OwnerOps data:", error);
      setStatus("Error fetching OwnerOps data.");
    }
  }, [mohContract]);

  // --- 3) Fetch Holders Data ---
  const fetchHoldersData = useCallback(async () => {
    if (!mohContract || !xdripContract) {
      setStatus("MOH or XdRiP contract not loaded yet.");
      return;
    }
    try {
      setStatus("Fetching Medal holders from 1..20000 (full ramp)...");
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
        { start: 1, end: 10000, name: "COMMON" },
        { start: 10001, end: 15000, name: "UNCOMMON" },
        { start: 15001, end: 17500, name: "RARE" },
        { start: 17501, end: 18500, name: "EPIC" },
        { start: 18501, end: 20000, name: "LEGENDARY" },
      ];

      // Build a map of holder => array of medals
      for (const range of tokenRanges) {
        for (let tokenId = range.start; tokenId <= range.end; tokenId++) {
          try {
            const tokenOwner = await mohContract.ownerOf(tokenId);
            if (!tokenOwner) continue;

            if (!holderMap[tokenOwner]) {
              holderMap[tokenOwner] = { medals: [] };
            }
            holderMap[tokenOwner].medals.push({ tokenId, name: range.name });
          } catch (err) {
            // token not minted
            break;
          }
        }
      }

      // XdRiP balance fetch (read-only)
      const web3 = new Web3("https://bsc-dataseed1.binance.org/");
      const fetchXDRIPBalance = async (addr) => {
        try {
          const rawBal = await xdripContract.methods.balanceOf(addr).call();
          // Adjust if your XdRiP decimals differ
          return parseFloat(web3.utils.fromWei(rawBal, "gwei"));
        } catch {
          return 0;
        }
      };

      const updatedHolders = [];
      for (const [ownerAddr, data] of Object.entries(holderMap)) {
        // Count how many of each tier
        const tierCounts = {
          COMMON: 0,
          UNCOMMON: 0,
          RARE: 0,
          EPIC: 0,
          LEGENDARY: 0,
        };
        data.medals.forEach((m) => {
          tierCounts[m.name]++;
        });

        // Ramps logic
        const fullRamps = Math.min(...medalOrder.map((t) => tierCounts[t]));
        let totalWeight = 0;
        totalWeight += fullRamps * DOTWeights.LEGENDARY;

        const leftoverTiers = medalOrder.filter((t) => tierCounts[t] > fullRamps);
        if (leftoverTiers.length > 0) {
          const highestLeftoverTier = leftoverTiers[leftoverTiers.length - 1];
          totalWeight += DOTWeights[highestLeftoverTier];
        }

        // XdRiP
        const xdripBal = await fetchXDRIPBalance(ownerAddr);

        // Revshare bonus
        let revshareBonus = 0;
        if (xdripBal >= 1.48) revshareBonus = 15;
        else if (xdripBal >= 1.25) revshareBonus = 10;
        else if (xdripBal >= 1.0) revshareBonus = 7;
        else if (xdripBal >= 0.75) revshareBonus = 5;
        else if (xdripBal >= 0.5) revshareBonus = 2;

        const finalWeight =
          totalWeight > 0 ? totalWeight + totalWeight * (revshareBonus / 100) : 0;

        // Total investment in BNB
        let investmentValueBNB = 0;
        data.medals.forEach((m) => {
          const cost = medalCosts[m.name] || 0;
          investmentValueBNB += cost;
        });

        updatedHolders.push({
          address: ownerAddr,
          medals: data.medals,
          totalWeight,
          xdripBalance: xdripBal.toFixed(2),
          revshareBonus,
          finalWeight: finalWeight.toFixed(2),
          investmentValueBNB: investmentValueBNB.toFixed(2),
        });
      }

      setHoldersInfo(updatedHolders);
      setStatus("Holders data fetched successfully.");
    } catch (err) {
      console.error("Error fetching holders data:", err);
      setStatus("Error fetching holders data.");
    }
  }, [mohContract, xdripContract, medalCosts]);

  // --- 4) Distribution events ---
  const fetchDistributionEvents = useCallback(async () => {
    if (!distributeContract) {
      setStatus("Distribute contract not loaded.");
      return;
    }
    try {
      setStatus("Fetching distribution events...");

      // FundsDistributed
      const fundsFilter = distributeContract.filters.FundsDistributed();
      const fundsEvents = await distributeContract.queryFilter(fundsFilter, 0, "latest");
      const fundsDistributed = fundsEvents.map((event) => ({
        totalDistributed: ethers.utils.formatEther(event.args.totalDistributed),
        blockNumber: event.blockNumber,
      }));

      // investorPaid
      const investorFilter = distributeContract.filters.investorPaid();
      const investorEvents = await distributeContract.queryFilter(investorFilter, 0, "latest");
      const investorPaid = investorEvents.map((event) => ({
        investor: event.args.investor,
        amount: ethers.utils.formatEther(event.args.amount),
        blockNumber: event.blockNumber,
      }));

      setFundsDistributedEvents(fundsDistributed);
      setInvestorPaidEvents(investorPaid);

      setStatus("Events fetched successfully.");
    } catch (error) {
      console.error("Error fetching distribution events:", error);
      setStatus("Error fetching distribution events. See console for details.");
    }
  }, [distributeContract]);

  // Click a medal => show details in secondary table
  const handleMedalDetails = (medal) => {
    // forging date is placeholder unless you have on-chain data
    setSelectedMedal({
      name: medal.name,
      tokenId: medal.tokenId,
      forgedOn: "N/A (placeholder)",
      priceBNB: medalCosts[medal.name] || 0,
    });
  };

  // Additional init for Distribute contract if needed
  useEffect(() => {
    const initContracts = async () => {
      try {
        if (!window.ethereum) {
          setStatus("MetaMask is required to use this feature.");
          return;
        }
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const distInstance = new ethers.Contract(
          distributeCA_ABI.address,
          distributeCA_ABI.abi,
          signer
        );
        setDistributeContract(distInstance);
        setStatus("Contracts initialized successfully.");
      } catch (err) {
        console.error("Error initializing contracts:", err);
        setStatus("Error initializing contracts.");
      }
    };
    initContracts();
  }, []);

  // --- Copy Holders Table to Clipboard ---
  const copyHoldersTable = () => {
    if (holdersInfo.length === 0) {
      toast.info("No holders info to copy.");
      return;
    }
    // Define column headers
    const headers = [
      "Holder",
      "Medals Owned",
      "Total Weight",
      "XdRiP Balance",
      "Bonus (%)",
      "Final Weight",
      "Investment (BNB)",
      "Value (USD)",
    ];
    // Map holders data into tab-separated values
    const rows = holdersInfo.map((h) => {
      // Format medals as e.g. COMMON(#1), EPIC(#120)
      const medalsStr = h.medals
        .map((m) => `${m.name}(#${m.tokenId})`)
        .join(", ");
      // Format USD value if bnbToUsd is available
      const bnbAmount = parseFloat(h.investmentValueBNB);
      const usdValue = bnbToUsd > 0 ? (bnbAmount * bnbToUsd).toFixed(2) : "0.00";

      return [
        h.address,
        medalsStr,
        h.totalWeight,
        h.xdripBalance,
        h.revshareBonus,
        h.finalWeight,
        h.investmentValueBNB,
        `$${usdValue}`,
      ].join("\t");
    });
    // Combine header and rows (separated by newline)
    const tsv = [headers.join("\t"), ...rows].join("\n");

    // Copy the TSV data to clipboard
    navigator.clipboard.writeText(tsv)
      .then(() => toast.success("Table copied to clipboard!"))
      .catch(() => toast.error("Failed to copy table."));
  };

  // --- Render sections ---
  const renderOwnerOpsSection = () => {
    const {
      owner,
      contractBalance,
      padronesPercentage,
      operatingCostsPercentage,
      operatingTasca,
      padronesList,
      supplyDetails,
    } = ownerOpsData;

    if (!owner) {
      return (
        <button onClick={fetchOwnerOpsData} className={styles.button}>
          Fetch OwnerOps Data
        </button>
      );
    }

    return (
      <div className={styles.reportBox}>
        <h3>Owner & Contract Operations</h3>
        <p>
          <strong>Owner Address: </strong>
          <span
            className={styles.copyableAddress}
            title="Click to copy or Ctrl+Click to open block explorer"
            onClick={(e) => handleAddressClick(e, owner)}
          >
            {shortenAddress(owner)}
          </span>
        </p>
        <p>
          <strong>Contract Balance: </strong>
          {contractBalance} BNB
          {bnbToUsd > 0 && (
            <span style={{ marginLeft: "8px", color: "#666" }}>
              (~${(parseFloat(contractBalance) * bnbToUsd).toFixed(2)} USD)
            </span>
          )}
        </p>
        <p>
          <strong>Padrones Percentage: </strong>
          {padronesPercentage}
        </p>
        <p>
          <strong>Operating Costs Percentage: </strong>
          {operatingCostsPercentage}
        </p>
        <p>
          <strong>Operating Wallet: </strong>
          <span
            className={styles.copyableAddress}
            title="Click to copy or Ctrl+Click to open block explorer"
            onClick={(e) => handleAddressClick(e, operatingTasca)}
          >
            {shortenAddress(operatingTasca)}
          </span>
        </p>

        <div className={styles.padronesSection}>
          <h4>Padrones List</h4>
          {padronesList && padronesList.length > 0 ? (
            <ul>
              {padronesList.map((pAddr, idx) => (
                <li key={idx}>
                  <span
                    className={styles.copyableAddress}
                    title="Click to copy or Ctrl+Click to open block explorer"
                    onClick={(e) => handleAddressClick(e, pAddr)}
                  >
                    {shortenAddress(pAddr)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No padrones found.</p>
          )}
        </div>

        <div className={styles.supplySection}>
          <h4>Supply Details</h4>
          {Object.entries(supplyDetails).map(([tier, supply]) => (
            <p key={tier}>
              <strong>{tier.toUpperCase()}:</strong> {supply}
            </p>
          ))}
        </div>
      </div>
    );
  };

  const renderHoldersSection = () => {
    if (holdersInfo.length === 0) {
      return (
        <button onClick={fetchHoldersData} className={styles.button}>
          Fetch Holders Info
        </button>
      );
    }
  
    return (
      <div className={styles.reportBox}>
        <h3>Medal Holders & Weights</h3>
        {/* Button Container for Refresh & Copy */}
        <div className={styles.buttonContainer}>
          <button onClick={fetchHoldersData} className={styles.button}>
            Refresh
          </button>
          <button onClick={copyHoldersTable} className={styles.button}>
            Export / Copy 
          </button>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Holder</th>
                <th>Medals Owned</th>
                <th>Total Weight</th>
                <th>XdRiP Balance</th>
                <th>Bonus (%)</th>
                <th>Final Weight</th>
                <th>Investment (BNB)</th>
                <th>Value (USD)</th>
              </tr>
            </thead>
            <tbody>
              {holdersInfo.map((h, idx) => {
                const bnbAmount = parseFloat(h.investmentValueBNB);
                const usdValue =
                  bnbToUsd > 0 ? (bnbAmount * bnbToUsd).toFixed(2) : "0.00";
  
                return (
                  <tr key={idx}>
                    <td>
                      <span
                        className={styles.copyableAddress}
                        title="Click to copy or Ctrl+Click to open block explorer"
                        onClick={(e) => handleAddressClick(e, h.address)}
                      >
                        {shortenAddress(h.address)}
                      </span>
                    </td>
                    <td>
                      {h.medals.map((m, i) => (
                        <React.Fragment key={m.tokenId}>
                          <span
                            className={styles.clickableMedalName}
                            style={{ cursor: "pointer" }}
                            onClick={() => handleMedalDetails(m)}
                            title={`${m.name} (#${m.tokenId})`}
                          >
                            {m.name} (#{m.tokenId})
                          </span>
                          {i < h.medals.length - 1 && ", "}
                        </React.Fragment>
                      ))}
                    </td>
                    <td>{h.totalWeight}</td>
                    <td>{h.xdripBalance}</td>
                    <td>{h.revshareBonus}</td>
                    <td>{h.finalWeight}</td>
                    <td>{h.investmentValueBNB}</td>
                    <td
                      style={{ cursor: "pointer" }}
                      title={
                        bnbToUsd > 0
                          ? `BNB Price: $${bnbToUsd.toFixed(2)}\n` +
                            `${h.investmentValueBNB} BNB = $${usdValue}`
                          : "BNB price not available"
                      }
                    >
                      {`$${usdValue}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
  
        {selectedMedal && (
          <div className={styles.medalDetails}>
            <h4>Selected Medal Details</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>TokenId</th>
                  <th>Forged On</th>
                  <th>Price (BNB)</th>
                  <th>Price (USD)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{selectedMedal.name}</td>
                  <td>#{selectedMedal.tokenId}</td>
                  <td>{selectedMedal.forgedOn}</td>
                  <td>{selectedMedal.priceBNB}</td>
                  <td
                    style={{ cursor: "pointer" }}
                    title={
                      bnbToUsd > 0
                        ? `BNB Price: $${bnbToUsd.toFixed(2)}\n` +
                          `${selectedMedal.priceBNB} BNB = $${(selectedMedal.priceBNB * bnbToUsd).toFixed(2)}`
                        : "BNB price not available"
                    }
                  >
                    {bnbToUsd > 0
                      ? `$${(selectedMedal.priceBNB * bnbToUsd).toFixed(2)}`
                      : "0.00"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderDistributeEventsSection = () => {
    if (!fundsDistributedEvents.length && !investorPaidEvents.length) {
      return (
        <button onClick={fetchDistributionEvents} className={styles.button}>
          Fetch Distribution Events
        </button>
      );
    }
    return (
      <div className={styles.reportBox}>
        <h3>Revenue Distribution Events</h3>
        <button onClick={fetchDistributionEvents} className={styles.buttonSmall}>
          Refresh
        </button>

        <div className={styles.subSection}>
          <h4>FundsDistributed</h4>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Total Distributed (BNB)</th>
                <th>Date/Time</th>
              </tr>
            </thead>
            <tbody>
              {fundsDistributedEvents.map((evt, i) => (
                <tr key={i}>
                  <td>{evt.totalDistributed}</td>
                  <td>{evt.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.subSection}>
          <h4>investorPaid Breakdown</h4>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Investor</th>
                <th>Amount (BNB)</th>
                <th>Date/Time</th>
              </tr>
            </thead>
            <tbody>
              {investorPaidEvents.map((evt, i) => (
                <tr key={i}>
                  <td
                    className={styles.copyableAddress}
                    title="Click to copy or Ctrl+Click to open block explorer"
                    onClick={(e) => handleAddressClick(e, evt.investor)}
                  >
                    {shortenAddress(evt.investor)}
                  </td>
                  <td>{evt.amount}</td>
                  <td>{evt.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Reports</h2>
        <button
          onClick={onClose}
          className={styles.closeButton}
          title="Close Reports"
        >
          &times;
        </button>
      </div>

      <div className={styles.connectWallet}>
        <ConnectWallet className={styles.connectWalletBtn} />
      </div>

      <p className={styles.status}>{status}</p>

      {!address ? (
        <div className={styles.prompt}>
          <p>Please connect your wallet to view reports.</p>
        </div>
      ) : (
        <div className={styles.reportsContainer}>
          <div className={styles.reportSection}>{renderOwnerOpsSection()}</div>
          <div className={styles.reportSection}>{renderHoldersSection()}</div>
          <div className={styles.reportSection}>{renderDistributeEventsSection()}</div>

          <div className={styles.reportBox}>
            <h3>Funds Distributed</h3>
            {fundsDistributedEvents.length === 0 ? (
              <p>No FundsDistributed events found.</p>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Total Distributed (BNB)</th>
                    <th>Block Number</th>
                  </tr>
                </thead>
                <tbody>
                  {fundsDistributedEvents.map((event, index) => (
                    <tr key={index}>
                      <td>{event.totalDistributed}</td>
                      <td>{event.blockNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;