'use client'

import { Environment, ParaProvider } from '@getpara/react-sdk'
import '@getpara/react-sdk/styles.css'

export function ParaSDKProvider({ children }: { children: React.ReactNode }) {
  return (
    <ParaProvider
      paraClientConfig={{
        apiKey: process.env.NEXT_PUBLIC_PARA_API_KEY || '',
        env: Environment.BETA,
      }}
    >
      {children}
    </ParaProvider>
  )
}