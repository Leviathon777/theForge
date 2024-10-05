import xdripCA_ABI from "../../Context/xdripCA_ABI.json";

const XdRiPContractAddress = xdripCA_ABI.address;
const XdRiPContractABI = xdripCA_ABI.abi;
const apiKey = "YZZQWS695IET6W79SZSP2PX4BZ4MTC6F4Z";

const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider);

const XdRiPContract = new web3.eth.Contract(XdRiPContractABI, XdRiPContractAddress);

// Function to check for reward distribution
async function checkRewardDistribution() {
  try {
    // Retrieve the necessary information from the XdRiP contract
    const storageSlot = web3.utils.soliditySha3("lastRewardBlock").substring(2, 10);
    const data = `0x${storageSlot}`;
    const result = await web3.eth.getStorageAt(XdRiPContractAddress, data);

    // Convert the result to a number
    const lastRewardBlock = web3.utils.hexToNumber(result);

    const currentBlock = await web3.eth.getBlockNumber();

    // Compare the block numbers to check if a reward distribution has occurred
    if (currentBlock > lastRewardBlock) {
      // Reward distribution has occurred
      console.log('Reward distribution: Distributed');
    } else {
      console.log('Reward distribution: Not yet distributed');
    }
  } catch (error) {
    console.error('Error retrieving reward distribution:', error);
  }
}

// Call the function to check reward distribution
export default checkRewardDistribution();