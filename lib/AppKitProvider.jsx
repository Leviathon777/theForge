import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { wagmiAdapter, appKitNetworks } from "./wagmiConfig";
import { createAppKit } from "@reown/appkit/react";

const WALLET_CONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

// Initialize AppKit
createAppKit({
  adapters: [wagmiAdapter],
  networks: appKitNetworks,
  defaultNetwork: appKitNetworks[0],
  projectId: WALLET_CONNECT_PROJECT_ID,
  metadata: {
    name: "Medals of Honor",
    description: "Medals of Honor Digital Ownership Token Collection",
    url: typeof window !== "undefined" ? window.location.origin : "https://medalsofhonor.io",
    icons: ["/img/mohwallet-logo.png"],
  },
  features: {
    analytics: false,
    email: false,
    socials: [],
    onramp: false,
    swaps: false,
  },
  featuredWalletIds: [
    "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // MetaMask
    "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0", // Trust Wallet
  ],
  allWallets: "SHOW",
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#255ff4",
    "--w3m-border-radius-master": "2px",
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const AppKitProvider = ({ children }) => {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
};
