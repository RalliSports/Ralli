'use client'

import React from 'react' // Explicitly import React for ReactNode type
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthLayout, ExternalWallet, ParaProvider, Environment } from '@getpara/react-sdk'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import '@getpara/react-sdk/styles.css'
import { ENVIRONMENT, API_KEY } from '@/constants'
import { clusterApiUrl } from '@solana/web3.js'

const queryClient = new QueryClient()

const solanaNetwork = WalletAdapterNetwork.Devnet
const endpoint = clusterApiUrl(solanaNetwork)
export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <ParaProvider
        paraClientConfig={{
          apiKey: API_KEY,
          env: ENVIRONMENT,
        }}
        externalWalletConfig={{
          wallets: ['METAMASK', 'COINBASE', 'WALLETCONNECT', 'RAINBOW', 'PHANTOM', 'SOLFLARE', 'BACKPACK'],

          solanaConnector: {
            config: {
              endpoint,
              chain: solanaNetwork,
              appIdentity: {
                uri: typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : '',
              },
            },
          },
        }}
        config={{ appName: 'My Para App' }}
      >
        {children}
      </ParaProvider>
    </QueryClientProvider>
  )
}
