"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Environment, ExternalWallet, ParaProvider } from "@getpara/react-sdk";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import "@getpara/react-sdk/styles.css";

const queryClient = new QueryClient();



export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <ParaProvider
        paraClientConfig={{
          apiKey: process.env.NEXT_PUBLIC_PARA_API_KEY || "",
          env: Environment.BETA,
        }}
        config={{
          appName: "TradeTalk",
        }}
        paraModalConfig={{
          logo: "https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png",
          oAuthMethods: ["GOOGLE", "TWITTER", "DISCORD"],
        }}
        externalWalletConfig={{
          appUrl: "http://localhost:3000/", // <-- Replace with your app's real URL
          wallets: [ExternalWallet.BACKPACK, ExternalWallet.PHANTOM],
          solanaConnector: {
            config: {
              endpoint: "https://api.devnet.solana.com", // <-- Use your desired cluster
              chain: WalletAdapterNetwork.Devnet, // Devnet | Mainnet | Testnet
            },
          },
        }}
      >
        {children}
      </ParaProvider>
    </QueryClientProvider>
  );
}
