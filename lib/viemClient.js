import { createPublicClient, http } from "viem";
import { bsc } from "viem/chains";

// Read-only public client for BSC — replaces web3.js and ethers read providers
export const publicClient = createPublicClient({
  chain: bsc,
  transport: http("https://bsc-dataseed1.binance.org/"),
});
