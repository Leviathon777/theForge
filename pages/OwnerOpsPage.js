import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useSigner, useAddress, ConnectWallet } from '@thirdweb-dev/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../styles/ownerOps.module.css';
import mohCA_ABI from '../Context/mohCA_ABI.json';

const OwnerOpsPage = () => {
  const signer = useSigner();
  const address = useAddress();
  const [isOwner, setIsOwner] = useState(false);
  const [distributionStatus, setDistributionStatus] = useState(null);
  
  // Distribution Percentages
  const [operatingPercentage, setOperatingPercentage] = useState(10); // 10%
  const [revenueSharePercentage, setRevenueSharePercentage] = useState(8); // 8%
  const [marketingPercentage, setMarketingPercentage] = useState(5); // 5%
  const [taxPercentage, setTaxPercentage] = useState(5); // 5%
  const [profitPercentage, setProfitPercentage] = useState(10); // 10%
  
  // Owner Wallets
  const [ownerWallets, setOwnerWallets] = useState([]);
  
  // Distribution Wallets Addresses
  const [distributionWallets, setDistributionWallets] = useState({
    operatingWallet: '',
    revenueShareWallet: '',
    marketingWallet: '',
    taxWallet: '',
    profitWallet: '',
    netEarningsWallet: '',
  });
  
  // Wallet Balances
  const [walletBalances, setWalletBalances] = useState({
    operatingWallet: '',
    revenueShareWallet: '',
    marketingWallet: '',
    taxWallet: '',
    profitWallet: '',
    netEarningsWallet: '',
    owner1: '',
    owner2: '',
    owner3: '',
    owner4: '',
  });

  // Distribution Amounts
  const [distributionAmounts, setDistributionAmounts] = useState({
    operating: '0.00',
    revenueShare: '0.00',
    marketing: '0.00',
    tax: '0.00',
    profit: '0.00',
    netEarnings: '0.00',
    owner1: '0.00',
    owner2: '0.00',
    owner3: '0.00',
    owner4: '0.00',
  });

  // Mint Prices
  const [prices, setPrices] = useState({
    common: '0.5',
    uncommon: '1',
    rare: '1.5',
    epic: '2',
    legendary: '2.5',
    eternal: '200',
  });


  const fetchContract = () => {
    if (!signer) return null;
    return new ethers.Contract(mohCA_ABI.address, mohCA_ABI.abi, signer);
  };

  useEffect(() => {
    const checkOwner = async () => {
      if (!signer || !address) {
        toast.warn('Please connect your wallet to access this page.');
        return;
      }
      try {
        const contract = fetchContract();
        if (!contract) throw new Error('Contract not initialized.');
        
        const contractOwner = await contract.owner();
        if (address.toLowerCase() === contractOwner.toLowerCase()) {
          setIsOwner(true);
          await fetchOwnerWallets(contract);
          await fetchDistributionWallets(contract);
        } else {
          setIsOwner(false);
          toast.error('Access Denied: You are not authorized.');
        }
      } catch (error) {
        console.error('Error checking ownership:', error);
        toast.error('An error occurred while checking authorization.');
      }
    };

    if (signer && address) {
      checkOwner();
    }
  }, [signer, address]);

  
  const fetchOwnerWallets = async (contract) => {
    try {
      const owners = [];
      const ownerCount = 4; 
      for (let i = 0; i < ownerCount; i++) {
        const wallet = await contract.ownerWallets(i);
        owners.push(wallet);
      }
      setOwnerWallets(owners);
    } catch (error) {
      console.error('Error fetching owner wallets:', error);
      toast.error('Failed to load owner wallets.');
    }
  };

  
  const fetchDistributionWallets = async (contract) => {
    try {
      const operatingWallet = await contract.operatingWallet();
      const revenueShareWallet = await contract.revenueShareWallet();
      const marketingWallet = await contract.marketingWallet();
      const taxWallet = await contract.taxWallet();
      const profitWallet = await contract.profitWallet();
      const netEarningsWallet = await contract.netEarningsWallet();

      setDistributionWallets({
        operatingWallet,
        revenueShareWallet,
        marketingWallet,
        taxWallet,
        profitWallet,
        netEarningsWallet,
      });
    } catch (error) {
      console.error('Error fetching distribution wallets:', error);
      toast.error('Failed to load distribution wallets.');
    }
  };

  
  const fetchWalletBalances = async () => {
    const contract = fetchContract();
    if (!contract) return;
    try {
      const balances = {};

      for (const [key, wallet] of Object.entries(distributionWallets)) {
        const balance = await contract.provider.getBalance(wallet);
        balances[key] = ethers.utils.formatEther(balance);
      }

      for (let i = 0; i < ownerWallets.length; i++) {
        const wallet = ownerWallets[i];
        const balance = await contract.provider.getBalance(wallet);
        balances[`owner${i + 1}`] = ethers.utils.formatEther(balance);
      }

      setWalletBalances(balances);
    } catch (error) {
      console.error('Error fetching wallet balances:', error);
      toast.error('Failed to load wallet balances.');
    }
  };

  const fetchDistributionAmounts = async () => {
    const contract = fetchContract();
    if (!contract) return;
    try {
      const totalBalance = await contract.provider.getBalance(contract.address);
      const totalBalanceEther = parseFloat(ethers.utils.formatEther(totalBalance));
      const operatingAmount = (operatingPercentage / 100) * totalBalanceEther;
      const revenueShareAmount = (revenueSharePercentage / 100) * totalBalanceEther;
      const marketingAmount = (marketingPercentage / 100) * totalBalanceEther;
      const taxAmount = (taxPercentage / 100) * totalBalanceEther;
      const profitAmount = (profitPercentage / 100) * totalBalanceEther;
      const netEarningsAmount = totalBalanceEther - (operatingAmount + revenueShareAmount + marketingAmount + taxAmount + profitAmount);

      // owners share based on ownersShare (40% of total)
      const ownersShare = (40 / 100) * totalBalanceEther; // 40%
      const eachOwnerShare = ownersShare / ownerWallets.length;

      setDistributionAmounts({
        operating: operatingAmount.toFixed(4),
        revenueShare: revenueShareAmount.toFixed(4),
        marketing: marketingAmount.toFixed(4),
        tax: taxAmount.toFixed(4),
        profit: profitAmount.toFixed(4),
        netEarnings: netEarningsAmount.toFixed(4),
        owner1: eachOwnerShare.toFixed(4),
        owner2: eachOwnerShare.toFixed(4),
        owner3: eachOwnerShare.toFixed(4),
        owner4: eachOwnerShare.toFixed(4),
      });
    } catch (error) {
      console.error('Error fetching distribution amounts:', error);
      toast.error('Failed to load distribution amounts.');
    }
  };


  useEffect(() => {
    const loadData = async () => {
      if (isOwner && ownerWallets.length > 0 && Object.values(distributionWallets).every(wallet => wallet !== '')) {
        await fetchWalletBalances();
        await fetchDistributionAmounts();
      }
    };
    loadData();
  }, [isOwner, ownerWallets, distributionWallets]);


  useEffect(() => {
    const interval = setInterval(() => {
      if (isOwner && ownerWallets.length > 0 && Object.values(distributionWallets).every(wallet => wallet !== '')) {
        fetchWalletBalances();
        fetchDistributionAmounts();
      }
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [isOwner, ownerWallets, distributionWallets]);


  const updatePercentages = async () => {
    const contract = fetchContract();
    if (!contract) return;
    try {
      // Validate that gross allocations sum to 60%
      const totalGross = operatingPercentage + marketingPercentage + taxPercentage + 40; // 40% for owners
      if (totalGross !== 60) {
        toast.error('Gross allocations must total 60%.');
        return;
      }

      // Validate that net allocations sum to 100%
      const totalNet = revenueSharePercentage + marketingProfitsPercentage + profitPercentage + taxOnNetPercentage;
      if (totalNet !== 100) {
        toast.error('Net allocations must total 100%.');
        return;
      }

      // Update Gross Allocations
      const tx1 = await contract.setGrossAllocations(
        40, // ownersPercentage
        operatingPercentage,
        marketingPercentage,
        taxPercentage
      );
      await tx1.wait();

      // Update Net Allocations
      const tx2 = await contract.setNetAllocations(
        revenueSharePercentage,
        marketingProfitsPercentage,
        profitPercentage,
        taxOnNetPercentage
      );
      await tx2.wait();

      toast.success('Distribution percentages updated successfully.');
      await fetchDistributionAmounts();
      await fetchWalletBalances();
    } catch (error) {
      console.error('Error updating percentages:', error);
      toast.error('Failed to update distribution percentages.');
    }
  };

  // Function to Update Mint Prices
  const updateMintPrices = async () => {
    const contract = fetchContract();
    if (!contract) return;
    try {
      const txs = [
        contract.setCommonPrice(ethers.utils.parseEther(prices.common)),
        contract.setUncommonPrice(ethers.utils.parseEther(prices.uncommon)),
        contract.setRarePrice(ethers.utils.parseEther(prices.rare)),
        contract.setEpicPrice(ethers.utils.parseEther(prices.epic)),
        contract.setLegendaryPrice(ethers.utils.parseEther(prices.legendary)),
        contract.setEternalPrice(ethers.utils.parseEther(prices.eternal)),
      ];

      // Wait for all transactions to be mined
      await Promise.all(txs.map(tx => tx.wait()));
      toast.success('Mint prices updated successfully.');
      await fetchDistributionAmounts();
      await fetchWalletBalances();
    } catch (error) {
      console.error('Error updating mint prices:', error);
      toast.error('Failed to update mint prices.');
    }
  };

  // Function to Distribute Funds to Holders
  const distributeToHolders = async () => {
    const contract = fetchContract();
    if (!contract) return;
    try {
      const tx = await contract.distributeToHolders();
      await tx.wait();
      toast.success('Funds distributed to holders successfully.');
      setDistributionStatus('Completed');
      await fetchWalletBalances();
      await fetchDistributionAmounts();
    } catch (error) {
      console.error('Error distributing funds to holders:', error);
      toast.error('Failed to distribute funds to holders.');
      setDistributionStatus('Failed');
    }
  };

  return (
    <div className={styles.background}>
      <h1 className={styles.heading}>Owner Operations</h1>
      <ToastContainer position="top-center" />
      <ConnectWallet />

      {isOwner ? (
        <>
          {/* Wallet Balances */}
          <h3>Wallet Balances</h3>
          <ul>
            {ownerWallets.map((wallet, index) => (
              <li key={wallet}>
                Owner {index + 1}: {wallet} - {walletBalances[`owner${index + 1}`] || 'Loading...'} ETH
              </li>
            ))}
            <li>Operating Wallet: {walletBalances.operatingWallet || 'Loading...'} ETH</li>
            <li>Revenue Share Wallet: {walletBalances.revenueShareWallet || 'Loading...'} ETH</li>
            <li>Marketing Wallet: {walletBalances.marketingWallet || 'Loading...'} ETH</li>
            <li>Tax Wallet: {walletBalances.taxWallet || 'Loading...'} ETH</li>
            <li>Profit Wallet: {walletBalances.profitWallet || 'Loading...'} ETH</li>
            <li>Net Earnings Wallet: {walletBalances.netEarningsWallet || 'Loading...'} ETH</li>
          </ul>

          {/* Current Owner Wallets */}
          <h3>Current Owner Wallets</h3>
          <ul>
            {ownerWallets.map(wallet => (
              <li key={wallet}>{wallet}</li>
            ))}
          </ul>

          {/* Live Distribution Amounts */}
          <h3>Live Distribution Amounts</h3>
          <ul>
            <li>Operating: {distributionAmounts.operating} ETH</li>
            <li>Revenue Share: {distributionAmounts.revenueShare} ETH</li>
            <li>Marketing: {distributionAmounts.marketing} ETH</li>
            <li>Tax: {distributionAmounts.tax} ETH</li>
            <li>Profit: {distributionAmounts.profit} ETH</li>
            <li>Net Earnings: {distributionAmounts.netEarnings} ETH</li>
            <li>Owner 1 Share: {distributionAmounts.owner1} ETH</li>
            <li>Owner 2 Share: {distributionAmounts.owner2} ETH</li>
            <li>Owner 3 Share: {distributionAmounts.owner3} ETH</li>
            <li>Owner 4 Share: {distributionAmounts.owner4} ETH</li>
          </ul>

          {/* Update Mint Prices */}
          <h3>Update Mint Prices (ETH)</h3>
          {Object.keys(prices).map((tier) => (
            <div key={tier} className={styles.inputGroup}>
              <label>{`${tier.charAt(0).toUpperCase() + tier.slice(1)} Price:`}</label>
              <input
                type="number"
                step="0.01"
                value={prices[tier]}
                onChange={(e) => setPrices({ ...prices, [tier]: e.target.value })}
              />
            </div>
          ))}
          <button onClick={updateMintPrices} className={styles.updateBtn}>Update Mint Prices</button>

          {/* Update Distribution Percentages */}
          <h3>Update Distribution Percentages</h3>
          <div className={styles.inputGroup}>
            <label>Operating Percentage:</label>
            <input
              type="number"
              value={operatingPercentage}
              onChange={(e) => setOperatingPercentage(parseInt(e.target.value))}
              max={100}
              min={0}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Revenue Share Percentage:</label>
            <input
              type="number"
              value={revenueSharePercentage}
              onChange={(e) => setRevenueSharePercentage(parseInt(e.target.value))}
              max={100}
              min={0}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Marketing Percentage:</label>
            <input
              type="number"
              value={marketingPercentage}
              onChange={(e) => setMarketingPercentage(parseInt(e.target.value))}
              max={100}
              min={0}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Tax Percentage:</label>
            <input
              type="number"
              value={taxPercentage}
              onChange={(e) => setTaxPercentage(parseInt(e.target.value))}
              max={100}
              min={0}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Profit Percentage:</label>
            <input
              type="number"
              value={profitPercentage}
              onChange={(e) => setProfitPercentage(parseInt(e.target.value))}
              max={100}
              min={0}
            />
          </div>
          <button onClick={updatePercentages} className={styles.updateBtn}>Update Percentages</button>

          {/* Distribute to Holders */}
          <h3>Distribute Funds to Holders</h3>
          <button onClick={distributeToHolders} className={styles.distributeBtn}>Distribute to Holders</button>
          <p>Status: {distributionStatus || 'Pending'}</p>
        </>
      ) : (
        <p>You must be the deployer (contract owner) to access this page.</p>
      )}
    </div>
  );
};

export default OwnerOpsPage;
