import React, { useState, useEffect } from 'react';
import { useAddress, useSigner } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import ABI and Contract Address
import mohCA_ABI from '../Context/mohCA_ABI.json';

const OwnerOps = () => {
  const [operatingWallet, setOperatingWallet] = useState('');
  const [revenueShareWallet, setRevenueShareWallet] = useState('');
  const [marketingWallet, setMarketingWallet] = useState('');
  const [giveawaysWallet, setGiveawaysWallet] = useState('');
  const [profitWallet, setProfitWallet] = useState('');
  const [commonPrice, setCommonPrice] = useState('');
  const [uncommonPrice, setUncommonPrice] = useState('');
  const [rarePrice, setRarePrice] = useState('');
  const [epicPrice, setEpicPrice] = useState('');
  const [legendaryPrice, setLegendaryPrice] = useState('');
  const [eternalPrice, setEternalPrice] = useState('');
  const [operatingPercentage, setOperatingPercentage] = useState('');
  const [revenueSharePercentage, setRevenueSharePercentage] = useState('');
  const [marketingPercentage, setMarketingPercentage] = useState('');
  const [giveawaysPercentage, setGiveawaysPercentage] = useState('');
  const [profitPercentage, setProfitPercentage] = useState('');
  const [contractURI, setContractURI] = useState('');
  const [balance, setBalance] = useState('0');

  const address = useAddress();
  const signer = useSigner();

  // Use the address directly from mohCA_ABI
  const contractAddress = mohCA_ABI.address;
  const contractABI = mohCA_ABI.abi;

  // Initialize the contract with ethers.js
  const contract = signer ? new ethers.Contract(contractAddress, contractABI, signer) : null;

  // Fetch Contract Balance
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        if (contract && signer) {
          const provider = signer.provider;
          const contractBalance = await provider.getBalance(contractAddress);
          setBalance(ethers.utils.formatEther(contractBalance));
        }
      } catch (error) {
        console.error('Error fetching contract balance:', error);
        toast.error('Error fetching contract balance.');
      }
    };

    fetchBalance();
  }, [contract, signer]);

  // Update Wallet Addresses
  const handleUpdateWallets = async () => {
    try {
      const tx = await contract.updateDistributionWallets(
        operatingWallet,
        revenueShareWallet,
        marketingWallet,
        giveawaysWallet,
        profitWallet
      );
      await tx.wait();
      toast.success('Wallet addresses updated successfully!');
    } catch (error) {
      console.error('Error updating wallet addresses:', error);
      toast.error('Error updating wallet addresses.');
    }
  };

  // Update Mint Prices
  const handleUpdatePrices = async () => {
    try {
      const tx1 = await contract.setCommonPrice(ethers.utils.parseEther(commonPrice));
      const tx2 = await contract.setUncommonPrice(ethers.utils.parseEther(uncommonPrice));
      const tx3 = await contract.setRarePrice(ethers.utils.parseEther(rarePrice));
      const tx4 = await contract.setEpicPrice(ethers.utils.parseEther(epicPrice));
      const tx5 = await contract.setLegendaryPrice(ethers.utils.parseEther(legendaryPrice));
      const tx6 = await contract.setEternalPrice(ethers.utils.parseEther(eternalPrice));

      await Promise.all([tx1.wait(), tx2.wait(), tx3.wait(), tx4.wait(), tx5.wait(), tx6.wait()]);
      toast.success('Mint prices updated successfully!');
    } catch (error) {
      console.error('Error updating mint prices:', error);
      toast.error('Error updating mint prices.');
    }
  };

  // Update Distribution Percentages
  const handleUpdatePercentages = async () => {
    try {
      const tx = await contract.setPercentages(
        parseInt(operatingPercentage),
        parseInt(revenueSharePercentage),
        parseInt(marketingPercentage),
        parseInt(giveawaysPercentage),
        parseInt(profitPercentage)
      );
      await tx.wait();
      toast.success('Distribution percentages updated successfully!');
    } catch (error) {
      console.error('Error updating percentages:', error);
      toast.error('Error updating percentages.');
    }
  };

  // Withdraw Contract Balance
  const handleWithdraw = async () => {
    try {
      const tx = await contract.withdraw();
      await tx.wait();
      toast.success('Contract balance withdrawn successfully!');
    } catch (error) {
      console.error('Error withdrawing balance:', error);
      toast.error('Error withdrawing balance.');
    }
  };

  // Update Contract URI
  const handleUpdateContractURI = async () => {
    try {
      const tx = await contract.setContractURI(contractURI);
      await tx.wait();
      toast.success('Contract URI updated successfully!');
    } catch (error) {
      console.error('Error updating contract URI:', error);
      toast.error('Error updating contract URI.');
    }
  };

  return (
    <div>
      <h2>Owner Operations</h2>
      <div>
        <h3>Contract Balance: {balance} ETH</h3>
        <button onClick={handleWithdraw}>Withdraw Balance</button>
      </div>

      <div>
        <h3>Update Wallet Addresses</h3>
        <input type="text" placeholder="Operating Wallet" value={operatingWallet} onChange={(e) => setOperatingWallet(e.target.value)} />
        <input type="text" placeholder="Revenue Share Wallet" value={revenueShareWallet} onChange={(e) => setRevenueShareWallet(e.target.value)} />
        <input type="text" placeholder="Marketing Wallet" value={marketingWallet} onChange={(e) => setMarketingWallet(e.target.value)} />
        <input type="text" placeholder="Giveaways Wallet" value={giveawaysWallet} onChange={(e) => setGiveawaysWallet(e.target.value)} />
        <input type="text" placeholder="Profit Wallet" value={profitWallet} onChange={(e) => setProfitWallet(e.target.value)} />
        <button onClick={handleUpdateWallets}>Update Wallets</button>
      </div>

      <div>
        <h3>Update Mint Prices (ETH)</h3>
        <input type="number" placeholder="Common Price" value={commonPrice} onChange={(e) => setCommonPrice(e.target.value)} />
        <input type="number" placeholder="Uncommon Price" value={uncommonPrice} onChange={(e) => setUncommonPrice(e.target.value)} />
        <input type="number" placeholder="Rare Price" value={rarePrice} onChange={(e) => setRarePrice(e.target.value)} />
        <input type="number" placeholder="Epic Price" value={epicPrice} onChange={(e) => setEpicPrice(e.target.value)} />
        <input type="number" placeholder="Legendary Price" value={legendaryPrice} onChange={(e) => setLegendaryPrice(e.target.value)} />
        <input type="number" placeholder="Eternal Price" value={eternalPrice} onChange={(e) => setEternalPrice(e.target.value)} />
        <button onClick={handleUpdatePrices}>Update Prices</button>
      </div>

      <div>
        <h3>Update Distribution Percentages</h3>
        <input type="number" placeholder="Operating %" value={operatingPercentage} onChange={(e) => setOperatingPercentage(e.target.value)} />
        <input type="number" placeholder="Revenue Share %" value={revenueSharePercentage} onChange={(e) => setRevenueSharePercentage(e.target.value)} />
        <input type="number" placeholder="Marketing %" value={marketingPercentage} onChange={(e) => setMarketingPercentage(e.target.value)} />
        <input type="number" placeholder="Giveaways %" value={giveawaysPercentage} onChange={(e) => setGiveawaysPercentage(e.target.value)} />
        <input type="number" placeholder="Profit %" value={profitPercentage} onChange={(e) => setProfitPercentage(e.target.value)} />
        <button onClick={handleUpdatePercentages}>Update Percentages</button>
      </div>

      <div>
        <h3>Update Contract URI</h3>
        <input type="text" placeholder="Contract URI" value={contractURI} onChange={(e) => setContractURI(e.target.value)} />
        <button onClick={handleUpdateContractURI}>Update URI</button>
      </div>
    </div>
  );
};

export default OwnerOps;
