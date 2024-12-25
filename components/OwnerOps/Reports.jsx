import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import mohCA_ABI from "../../Context/mohCA_ABI.json";
import distributeCA_ABI from "../../Context/distributeCA_ABI.json";
import styles from "./Reports.module.css"; // Import the CSS module
import { useAddress, useSigner } from "@thirdweb-dev/react";

const Reports = () => {
  const address = useAddress();
  const signer = useSigner();
  const [ownerOpsReport, setOwnerOpsReport] = useState(null);
  const [distributeRevReport, setDistributeRevReport] = useState([]);
  const [status, setStatus] = useState("");
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split("T")[0], // Format YYYY-MM-DD
    end: new Date().toISOString().split("T")[0],
  });

  const mohContract = signer
    ? new ethers.Contract(
        mohCA_ABI.address,
        mohCA_ABI.abi,
        signer
      )
    : null;

  const distributeContract = signer
    ? new ethers.Contract(
        distributeCA_ABI.address,
        distributeCA_ABI.abi,
        signer
      )
    : null;

  useEffect(() => {
    if (mohContract) {
      generateOwnerOpsReport();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mohContract, signer]);

  const generateOwnerOpsReport = async () => {
    try {
      setStatus("Generating Owner Operations Report...");
      const owner = await mohContract.titolare();
      const balance = await signer.getBalance();
      const padronesPercentage = await mohContract.padronesPercentage();
      const operatingCostsPercentage = await mohContract.operatingCostsPercentage();
      const operatingTasca = await mohContract.operatingTasca();

      // Fetch sales based on forged counts
      const forgedCounts = await mohContract.getforgedCounts();
      const prices = await fetchPrices();

      // Calculate sales in BNB
      const sales = {
        common: parseFloat(ethers.utils.formatEther(forgedCounts.common)) * parseFloat(prices.common),
        uncommon: parseFloat(ethers.utils.formatEther(forgedCounts.uncommon)) * parseFloat(prices.uncommon),
        rare: parseFloat(ethers.utils.formatEther(forgedCounts.rare)) * parseFloat(prices.rare),
        epic: parseFloat(ethers.utils.formatEther(forgedCounts.epic)) * parseFloat(prices.epic),
        legendary: parseFloat(ethers.utils.formatEther(forgedCounts.legendary)) * parseFloat(prices.legendary),
        eternal: parseFloat(ethers.utils.formatEther(forgedCounts.eternal)) * parseFloat(prices.eternal),
      };

      setOwnerOpsReport({
        owner,
        balance: ethers.utils.formatEther(balance),
        padronesPercentage: `${padronesPercentage}%`,
        operatingCostsPercentage: `${operatingCostsPercentage}%`,
        operatingTasca,
        sales,
      });
      setStatus("Owner Operations Report generated successfully.");
    } catch (error) {
      console.error("Error generating OwnerOps report:", error);
      setStatus("Error generating Owner Operations Report.");
    }
  };

  const fetchPrices = async () => {
    try {
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
    } catch (error) {
      console.error("Error fetching prices:", error);
      return {};
    }
  };

  const handleDateChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value,
    });
  };

  const generateDistributeRevReport = async () => {
    if (!distributeContract) {
      setStatus("Distribution contract not loaded.");
      return;
    }

    try {
      setStatus("Generating Distributor Revenue Report...");
      const { start, end } = dateRange;

      // Convert dates to timestamps
      const startTimestamp = Math.floor(new Date(start).getTime() / 1000);
      const endTimestamp = Math.floor(new Date(end).getTime() / 1000);

      // Assuming the distributeContract has an event for RevenueDistribution with timestamp
      // This implementation might vary based on the actual contract events
      const filter = distributeContract.filters.RevenueDistributed();
      const events = await distributeContract.queryFilter(filter);

      // Filter events based on the date range
      const filteredEvents = events.filter(async (event) => {
        const block = await distributeContract.provider.getBlock(event.blockNumber);
        return block.timestamp >= startTimestamp && block.timestamp <= endTimestamp;
      });

      const report = await Promise.all(
        filteredEvents.map(async (event) => {
          const { args, blockNumber } = event;
          const block = await distributeContract.provider.getBlock(blockNumber);
          return {
            to: args.to,
            amount: ethers.utils.formatEther(args.amount),
            date: new Date(block.timestamp * 1000).toLocaleDateString(),
          };
        })
      );

      setDistributeRevReport(report);
      setStatus("Distributor Revenue Report generated successfully.");
    } catch (error) {
      console.error("Error generating Distributor Revenue Report:", error);
      setStatus("Error generating Distributor Revenue Report.");
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
      <h2 className={styles.heading}>Reports</h2>
      <p className={styles.status}>{status}</p>

      {/* Owner Operations Report */}
      <div className={styles.reportSection}>
        <h3>Owner Operations Report</h3>
        {ownerOpsReport ? (
          <div className={styles.reportContent}>
            <p>
              <strong>Owner Address:</strong>{" "}
              <span className={styles.copyableAddress}>
                {shortenAddress(ownerOpsReport.owner)}
              </span>
            </p>
            <p>
              <strong>Contract Balance:</strong> {ownerOpsReport.balance} BNB
            </p>
            <p>
              <strong>Padrones Percentage:</strong> {ownerOpsReport.padronesPercentage}
            </p>
            <p>
              <strong>Operating Costs Percentage:</strong> {ownerOpsReport.operatingCostsPercentage}
            </p>
            <p>
              <strong>Operating Wallet:</strong>{" "}
              <span className={styles.copyableAddress}>
                {shortenAddress(ownerOpsReport.operatingTasca)}
              </span>
            </p>
            <h4>Sales Based on Forged Counts:</h4>
            <ul>
              {Object.entries(ownerOpsReport.sales).map(([tier, amount]) => (
                <li key={tier}>
                  <strong>{tier.charAt(0).toUpperCase() + tier.slice(1)}:</strong> {amount} BNB
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <button onClick={generateOwnerOpsReport} className={styles.button}>
            Generate Owner Operations Report
          </button>
        )}
      </div>

      {/* Distributor Revenue Report */}
      <div className={styles.reportSection}>
        <h3>Distributor Revenue Report</h3>
        <div className={styles.dateFilter}>
          <label>
            Start Date:
            <input
              type="date"
              name="start"
              value={dateRange.start}
              onChange={handleDateChange}
              className={styles.input}
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              name="end"
              value={dateRange.end}
              onChange={handleDateChange}
              className={styles.input}
            />
          </label>
          <button onClick={generateDistributeRevReport} className={styles.button}>
            Generate Distributor Revenue Report
          </button>
        </div>
        {distributeRevReport.length > 0 && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Recipient</th>
                <th>Amount (BNB)</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {distributeRevReport.map((record, index) => (
                <tr key={index}>
                  <td>{shortenAddress(record.to)}</td>
                  <td>{record.amount}</td>
                  <td>{record.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Reports;
