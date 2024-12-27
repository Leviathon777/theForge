import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAddress, useSigner } from "@thirdweb-dev/react";
import mohCA_ABI from "../../Context/mohCA_ABI.json";
import distributeCA_ABI from "../../Context/distributeCA_ABI.json";
import styles from "./Reports.module.css";

const Reports = ({ onClose }) => {
  const address = useAddress();
  const signer = useSigner();

  const [ownerOpsReport, setOwnerOpsReport] = useState(null);
  const [distributeRevReport, setDistributeRevReport] = useState([]);
  const [holdersInfo, setHoldersInfo] = useState([]);
  const [status, setStatus] = useState("");
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });

  const [mohContract, setMohContract] = useState(null);
  const [distributeContract, setDistributeContract] = useState(null);

  useEffect(() => {
    if (signer) {
      const mohInstance = new ethers.Contract(
        mohCA_ABI.address,
        mohCA_ABI.abi,
        signer
      );
      const distributeInstance = new ethers.Contract(
        distributeCA_ABI.address,
        distributeCA_ABI.abi,
        signer
      );
      setMohContract(mohInstance);
      setDistributeContract(distributeInstance);
      setStatus("Contracts initialized successfully.");
    } else {
      setStatus("Waiting for signer...");
    }
  }, [signer]);

  const generateOwnerOpsReport = async () => {
    if (!mohContract) {
      setStatus("MOH contract not loaded. Connect your wallet.");
      return;
    }

    try {
      setStatus("Generating Owner Operations Report...");
      const [
        owner,
        padronesPercentage,
        operatingCostsPercentage,
        operatingTasca,
        totalTokensMinted,
      ] = await Promise.all([
        mohContract.titolare(),
        mohContract.padronesPercentage(),
        mohContract.operatingCostsPercentage(),
        mohContract.operatingTasca(),
        mohContract.totalSupply(),
      ]);

      const balance = await signer.getBalance();

      setOwnerOpsReport({
        owner,
        balance: ethers.utils.formatEther(balance),
        padronesPercentage: `${padronesPercentage}%`,
        operatingCostsPercentage: `${operatingCostsPercentage}%`,
        operatingTasca,
        totalTokensMinted: totalTokensMinted.toString(),
      });

      setStatus("Owner Operations Report generated successfully.");
    } catch (error) {
      console.error("Error generating OwnerOps report:", error);
      setStatus("Error generating Owner Operations Report.");
    }
  };

  const fetchHoldersInfo = async () => {
    if (!mohContract) return;

    try {
      setStatus("Fetching Holders Information...");
      const holders = [];
      const totalSupply = await mohContract.totalSupply();

      for (let tokenId = 1; tokenId <= totalSupply; tokenId++) {
        const owner = await mohContract.ownerOf(tokenId);
        holders.push(owner);
      }

      const holderCounts = holders.reduce((acc, holder) => {
        acc[holder] = (acc[holder] || 0) + 1;
        return acc;
      }, {});

      const holdersData = Object.entries(holderCounts).map(([address, count]) => ({
        address,
        count,
      }));

      setHoldersInfo(holdersData);
      setStatus("Holders Information fetched successfully.");
    } catch (error) {
      console.error("Error fetching holders info:", error);
      setStatus("Error fetching Holders Information.");
    }
  };

  const generateDistributeRevReport = async () => {
    if (!distributeContract) {
      setStatus("Distribution contract not loaded. Connect your wallet.");
      return;
    }

    try {
      setStatus("Generating Distributor Revenue Report...");
      const filter = distributeContract.filters.RevenueDistributed();
      const events = await distributeContract.queryFilter(filter);

      const { start, end } = dateRange;
      const startTimestamp = Math.floor(new Date(start).getTime() / 1000);
      const endTimestamp = Math.floor(new Date(end).getTime() / 1000);

      const filteredEvents = await Promise.all(
        events.map(async (event) => {
          const block = await distributeContract.provider.getBlock(event.blockNumber);
          if (block.timestamp >= startTimestamp && block.timestamp <= endTimestamp) {
            return {
              to: event.args.to,
              amount: ethers.utils.formatEther(event.args.amount),
              date: new Date(block.timestamp * 1000).toLocaleDateString(),
            };
          }
          return null;
        })
      ).then((results) => results.filter((event) => event !== null));

      setDistributeRevReport(filteredEvents);
      setStatus("Distributor Revenue Report generated successfully.");
    } catch (error) {
      console.error("Error generating Distributor Revenue Report:", error);
      setStatus("Error generating Distributor Revenue Report.");
    }
  };

  const shortenAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Reports</h2>
      <p className={styles.status}>{status}</p>

      <div className={styles.reportSection}>
        <h3>Owner Operations Report</h3>
        {ownerOpsReport ? (
          <div>
            <p><strong>Owner Address:</strong> {shortenAddress(ownerOpsReport.owner)}</p>
            <p><strong>Contract Balance:</strong> {ownerOpsReport.balance} BNB</p>
            <p><strong>Total Tokens Minted:</strong> {ownerOpsReport.totalTokensMinted}</p>
            <p><strong>Padrones Percentage:</strong> {ownerOpsReport.padronesPercentage}</p>
            <p><strong>Operating Costs Percentage:</strong> {ownerOpsReport.operatingCostsPercentage}</p>
          </div>
        ) : (
          <button onClick={generateOwnerOpsReport} className={styles.button}>
            Generate Owner Operations Report
          </button>
        )}
      </div>

      <div className={styles.reportSection}>
        <h3>Holders Information</h3>
        <button onClick={fetchHoldersInfo} className={styles.button}>
          Fetch Holders Information
        </button>
        {holdersInfo.length > 0 && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Address</th>
                <th>Tokens Held</th>
              </tr>
            </thead>
            <tbody>
              {holdersInfo.map((holder, index) => (
                <tr key={index}>
                  <td>{shortenAddress(holder.address)}</td>
                  <td>{holder.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className={styles.reportSection}>
        <h3>Distributor Revenue Report</h3>
        <div>
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

      <button onClick={onClose} className={styles.button}>
        Close
      </button>
    </div>
  );
};

export default Reports;
