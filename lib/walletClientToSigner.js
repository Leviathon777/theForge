import { ethers } from "ethers";

/**
 * Convert a viem WalletClient to an ethers5 Signer.
 * This bridges wagmi's wallet client with existing ethers.Contract code.
 */
export function walletClientToSigner(walletClient) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new ethers.providers.Web3Provider(transport, network);
  return provider.getSigner(account.address);
}
