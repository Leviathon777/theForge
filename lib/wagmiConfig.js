import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { bsc, bscTestnet } from "@reown/appkit/networks";
import { cookieStorage, createStorage, http } from "wagmi";

const WALLET_CONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

const RPC_ENDPOINTS = {
  [bsc.id]: "https://bsc-dataseed1.binance.org/",
  [bscTestnet.id]: "https://data-seed-prebsc-1-s1.binance.org:8545/",
};

// BSC Mainnet is the primary network
export const appKitNetworks = [bsc, bscTestnet];

export const wagmiAdapter = new WagmiAdapter({
  projectId: WALLET_CONNECT_PROJECT_ID,
  networks: appKitNetworks,
  transports: {
    [bsc.id]: http(RPC_ENDPOINTS[bsc.id]),
    [bscTestnet.id]: http(RPC_ENDPOINTS[bscTestnet.id]),
  },
  storage: createStorage({
    storage: typeof window !== "undefined" ? cookieStorage : undefined,
  }),
  ssr: true,
});
