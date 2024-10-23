import React, { useState, useEffect } from "react";
import { useAddress, useMetamask, useDisconnect } from "@thirdweb-dev/react"; // Thirdweb hooks
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Web3 from "web3";
import mohCA_ABI from "../Context/mohCA_ABI.json"; // Ensure correct path
import Styles from "./MOHDashboard.module.css"; // Ensure correct path

const MOHDashboard = () => {
  const address = useAddress();  // Get wallet address
  const connectWithMetamask = useMetamask();  // Connect with MetaMask
  const disconnect = useDisconnect();  // Disconnect wallet

  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(false);

  // Admin Function States
  const [percentages, setPercentages] = useState({
    operatingPercentage: "",
    revenueSharePercentage: "",
    marketingPercentage: "",
    giveawaysPercentage: "",
    profitPercentage: "",
  });

  const [wallets, setWallets] = useState({
    operatingWallet: "",
    revenueShareWallet: "",
    marketingWallet: "",
    giveawaysWallet: "",
    profitWallet: "",
  });

  const [prices, setPrices] = useState({
    commonPrice: "",
    uncommonPrice: "",
    rarePrice: "",
    epicPrice: "",
    legendaryPrice: "",
    eternalPrice: "",
  });

  // Initialize Web3 and Contract
  useEffect(() => {
    if (address) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      const contractInstance = new web3Instance.eth.Contract(
        mohCA_ABI.abi,
        mohCA_ABI.address
      );
      setContract(contractInstance);
    }
  }, [address]);

  // Fetch the current values from the contract and populate fields
  useEffect(() => {
    const fetchData = async () => {
      if (contract && address) {
        try {
          // Fetch current percentages
          const operatingPercentage = await contract.methods.operatingPercentage().call();
          const revenueSharePercentage = await contract.methods.revenueSharePercentage().call();
          const marketingPercentage = await contract.methods.marketingPercentage().call();
          const giveawaysPercentage = await contract.methods.giveawaysPercentage().call();
          const profitPercentage = await contract.methods.profitPercentage().call();

          setPercentages({
            operatingPercentage,
            revenueSharePercentage,
            marketingPercentage,
            giveawaysPercentage,
            profitPercentage,
          });

          // Fetch current distribution wallets
          const operatingWallet = await contract.methods.operatingWallet().call();
          const revenueShareWallet = await contract.methods.revenueShareWallet().call();
          const marketingWallet = await contract.methods.marketingWallet().call();
          const giveawaysWallet = await contract.methods.giveawaysWallet().call();
          const profitWallet = await contract.methods.profitWallet().call();

          setWallets({
            operatingWallet,
            revenueShareWallet,
            marketingWallet,
            giveawaysWallet,
            profitWallet,
          });

          // Fetch current prices
          const commonPrice = Web3.utils.fromWei(await contract.methods.commonPrice().call(), "ether");
          const uncommonPrice = Web3.utils.fromWei(await contract.methods.uncommonPrice().call(), "ether");
          const rarePrice = Web3.utils.fromWei(await contract.methods.rarePrice().call(), "ether");
          const epicPrice = Web3.utils.fromWei(await contract.methods.epicPrice().call(), "ether");
          const legendaryPrice = Web3.utils.fromWei(await contract.methods.legendaryPrice().call(), "ether");
          const eternalPrice = Web3.utils.fromWei(await contract.methods.eternalPrice().call(), "ether");

          setPrices({
            commonPrice,
            uncommonPrice,
            rarePrice,
            epicPrice,
            legendaryPrice,
            eternalPrice,
          });
        } catch (error) {
          console.error("Error fetching data from contract:", error);
          toast.error("Error fetching contract data.");
        }
      }
    };

    if (contract) {
      fetchData();
    }
  }, [contract, address]);

  // Check if user is the owner
  useEffect(() => {
    const checkIfOwner = async () => {
      if (contract && address) {
        const owner = await contract.methods.owner().call();
        setIsOwner(owner.toLowerCase() === address.toLowerCase());
      }
    };
    checkIfOwner();
  }, [contract, address]);

  // Handle Input Changes for Percentages, Wallets, and Prices
  const handleInputChange = (e, stateUpdater) => {
    stateUpdater((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Update Percentages Function
  const updatePercentages = async () => {
    const {
      operatingPercentage,
      revenueSharePercentage,
      marketingPercentage,
      giveawaysPercentage,
      profitPercentage,
    } = percentages;

    const total =
      parseInt(operatingPercentage, 10) +
      parseInt(revenueSharePercentage, 10) +
      parseInt(marketingPercentage, 10) +
      parseInt(giveawaysPercentage, 10) +
      parseInt(profitPercentage, 10);

    if (total !== 100) {
      toast.error("Total percentages must add up to 100.");
      return;
    }

    try {
      setLoading(true);
      await contract.methods
        .setPercentages(
          parseInt(operatingPercentage, 10),
          parseInt(revenueSharePercentage, 10),
          parseInt(marketingPercentage, 10),
          parseInt(giveawaysPercentage, 10),
          parseInt(profitPercentage, 10)
        )
        .send({ from: address });
      toast.success("Percentages updated successfully!");
    } catch (error) {
      console.error("Error updating percentages:", error);
      toast.error("Failed to update percentages.");
    }
    setLoading(false);
  };

  // Update Distribution Wallets Function
  const updateDistributionWallets = async () => {
    const {
      operatingWallet,
      revenueShareWallet,
      marketingWallet,
      giveawaysWallet,
      profitWallet,
    } = wallets;

    try {
      setLoading(true);
      await contract.methods
        .updateDistributionWallets(
          operatingWallet,
          revenueShareWallet,
          marketingWallet,
          giveawaysWallet,
          profitWallet
        )
        .send({ from: address });
      toast.success("Distribution wallets updated successfully!");
    } catch (error) {
      console.error("Error updating distribution wallets:", error);
      toast.error("Failed to update distribution wallets.");
    }
    setLoading(false);
  };

  // Update Prices Function
  const updatePrices = async () => {
    const {
      commonPrice,
      uncommonPrice,
      rarePrice,
      epicPrice,
      legendaryPrice,
      eternalPrice,
    } = prices;

    try {
      setLoading(true);
      // Convert ETH to Wei
      const commonPriceWei = web3.utils.toWei(commonPrice, "ether");
      const uncommonPriceWei = web3.utils.toWei(uncommonPrice, "ether");
      const rarePriceWei = web3.utils.toWei(rarePrice, "ether");
      const epicPriceWei = web3.utils.toWei(epicPrice, "ether");
      const legendaryPriceWei = web3.utils.toWei(legendaryPrice, "ether");
      const eternalPriceWei = web3.utils.toWei(eternalPrice, "ether");

      // Update each price individually
      await contract.methods.setCommonPrice(commonPriceWei).send({
        from: address,
      });
      await contract.methods.setUncommonPrice(uncommonPriceWei).send({
        from: address,
      });
      await contract.methods.setRarePrice(rarePriceWei).send({
        from: address,
      });
      await contract.methods.setEpicPrice(epicPriceWei).send({
        from: address,
      });
      await contract.methods.setLegendaryPrice(legendaryPriceWei).send({
        from: address,
      });
      await contract.methods.setEternalPrice(eternalPriceWei).send({
        from: address,
      });

      toast.success("Prices updated successfully!");
    } catch (error) {
      console.error("Error updating prices:", error);
      toast.error("Failed to update prices.");
    }
    setLoading(false);
  };

  // Withdraw Funds Function
  const withdrawFunds = async () => {
    try {
      setLoading(true);
      await contract.methods.withdraw().send({ from: address });
      toast.success("Funds withdrawn successfully!");
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      toast.error("Failed to withdraw funds.");
    }
    setLoading(false);
  };

  return (
    <div className={Styles.dashboardContainer}>
      <h1>The Forge - NFT Admin Panel</h1>

      {/* Wallet Connection Section */}
      <div className={Styles.walletStatus}>
        <button
          className={Styles.connectWalletBtn}
          onClick={address ? disconnect : connectWithMetamask}
          disabled={loading}
        >
          {address ? "Disconnect Wallet" : "Connect Wallet"}
        </button>
        <p className={Styles.walletAddress}>{address || "Not connected"}</p>
      </div>

      {/* Admin Panel */}
      {isOwner && (
        <div className={Styles.adminContainer}>
          <h2>Admin Functions</h2>

          {/* Update Percentages */}
          <div className={Styles.functionSection}>
            <h3>Set Distribution Percentages</h3>
            <div className={Styles.inputGroup}>
              <label>Operating Percentage:</label>
              <input
                type="number"
                name="operatingPercentage"
                value={percentages.operatingPercentage}
                onChange={(e) => handleInputChange(e, setPercentages)}
                min="0"
                max="100"
              />
            </div>
            <div className={Styles.inputGroup}>
              <label>Revenue Share Percentage:</label>
              <input
                type="number"
                name="revenueSharePercentage"
                value={percentages.revenueSharePercentage}
                onChange={(e) => handleInputChange(e, setPercentages)}
                min="0"
                max="100"
              />
            </div>
            <div className={Styles.inputGroup}>
              <label>Marketing Percentage:</label>
              <input
                type="number"
                name="marketingPercentage"
                value={percentages.marketingPercentage}
                onChange={(e) => handleInputChange(e, setPercentages)}
                min="0"
                max="100"
              />
            </div>
            <div className={Styles.inputGroup}>
              <label>Giveaways Percentage:</label>
              <input
                type="number"
                name="giveawaysPercentage"
                value={percentages.giveawaysPercentage}
                onChange={(e) => handleInputChange(e, setPercentages)}
                min="0"
                max="100"
              />
            </div>
            <div className={Styles.inputGroup}>
              <label>Profit Percentage:</label>
              <input
                type="number"
                name="profitPercentage"
                value={percentages.profitPercentage}
                onChange={(e) => handleInputChange(e, setPercentages)}
                min="0"
                max="100"
              />
            </div>
            <button
              className={Styles.submitButton}
              onClick={updatePercentages}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Percentages"}
            </button>
          </div>

          {/* Update Distribution Wallets */}
          <div className={Styles.functionSection}>
            <h3>Update Distribution Wallets</h3>
            <div className={Styles.inputGroup}>
              <label>Operating Wallet:</label>
              <input
                type="text"
                name="operatingWallet"
                value={wallets.operatingWallet}
                onChange={(e) => handleInputChange(e, setWallets)}
                placeholder="0x..."
              />
            </div>
            <div className={Styles.inputGroup}>
              <label>Revenue Share Wallet:</label>
              <input
                type="text"
                name="revenueShareWallet"
                value={wallets.revenueShareWallet}
                onChange={(e) => handleInputChange(e, setWallets)}
                placeholder="0x..."
              />
            </div>
            <div className={Styles.inputGroup}>
              <label>Marketing Wallet:</label>
              <input
                type="text"
                name="marketingWallet"
                value={wallets.marketingWallet}
                onChange={(e) => handleInputChange(e, setWallets)}
                placeholder="0x..."
              />
            </div>
            <div className={Styles.inputGroup}>
              <label>Giveaways Wallet:</label>
              <input
                type="text"
                name="giveawaysWallet"
                value={wallets.giveawaysWallet}
                onChange={(e) => handleInputChange(e, setWallets)}
                placeholder="0x..."
              />
            </div>
            <div className={Styles.inputGroup}>
              <label>Profit Wallet:</label>
              <input
                type="text"
                name="profitWallet"
                value={wallets.profitWallet}
                onChange={(e) => handleInputChange(e, setWallets)}
                placeholder="0x..."
              />
            </div>
            <button
              className={Styles.submitButton}
              onClick={updateDistributionWallets}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Wallets"}
            </button>
          </div>

          {/* Update Prices */}
          <div className={Styles.functionSection}>
            <h3>Set Mint Prices (in ETH)</h3>
            <div className={Styles.inputGroup}>
              <label>Common Price:</label>
              <input
                type="number"
                name="commonPrice"
                value={prices.commonPrice}
                onChange={(e) => handleInputChange(e, setPrices)}
                min="0"
                step="0.01"
                placeholder="e.g., 0.1"
              />
            </div>
            <div className={Styles.inputGroup}>
              <label>Uncommon Price:</label>
              <input
                type="number"
                name="uncommonPrice"
                value={prices.uncommonPrice}
                onChange={(e) => handleInputChange(e, setPrices)}
                min="0"
                step="0.01"
                placeholder="e.g., 0.2"
              />
            </div>
            <div className={Styles.inputGroup}>
              <label>Rare Price:</label>
              <input
                type="number"
                name="rarePrice"
                value={prices.rarePrice}
                onChange={(e) => handleInputChange(e, setPrices)}
                min="0"
                step="0.01"
                placeholder="e.g., 0.3"
              />
            </div>
            <div className={Styles.inputGroup}>
              <label>Epic Price:</label>
              <input
                type="number"
                name="epicPrice"
                value={prices.epicPrice}
                onChange={(e) => handleInputChange(e, setPrices)}
                min="0"
                step="0.01"
                placeholder="e.g., 0.4"
              />
            </div>
            <div className={Styles.inputGroup}>
              <label>Legendary Price:</label>
              <input
                type="number"
                name="legendaryPrice"
                value={prices.legendaryPrice}
                onChange={(e) => handleInputChange(e, setPrices)}
                min="0"
                step="0.01"
                placeholder="e.g., 0.5"
              />
            </div>
            <div className={Styles.inputGroup}>
              <label>Eternal Price:</label>
              <input
                type="number"
                name="eternalPrice"
                value={prices.eternalPrice}
                onChange={(e) => handleInputChange(e, setPrices)}
                min="0"
                step="0.01"
                placeholder="e.g., 0.6"
              />
            </div>
            <button
              className={Styles.submitButton}
              onClick={updatePrices}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Prices"}
            </button>
          </div>

          {/* Withdraw Funds */}
          <div className={Styles.functionSection}>
            <h3>Withdraw Funds</h3>
            <button
              className={Styles.withdrawButton}
              onClick={withdrawFunds}
              disabled={loading}
            >
              {loading ? "Withdrawing..." : "Withdraw Funds"}
            </button>
          </div>
        </div>
      )}

      {/* Feedback for Non-Owners */}
      {!isOwner && address && (
        <p className={Styles.notOwnerText}>
          You are not authorized to view this dashboard.
        </p>
      )}

      <ToastContainer position="top-center" />
    </div>
  );
};

export default MOHDashboard;
