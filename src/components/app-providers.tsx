// components/app-providers.tsx
'use client'

import { ThemeProvider } from '@/components/theme-provider'
import { ReactQueryProvider } from './react-query-provider'
import { ClusterProvider } from '@/components/cluster/cluster-data-access'
import { SolanaProvider } from '@/components/solana/solana-provider'
import { Providers } from './para-provider'
import React from 'react'

export function AppProviders({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ReactQueryProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <Providers>
        <ClusterProvider>
            <SolanaProvider>{children}</SolanaProvider>
        </ClusterProvider>
        </Providers>
      </ThemeProvider>
    </ReactQueryProvider>
  )
}
