import { useModal, useAccount, useWallet, useClient } from '@getpara/react-sdk'
import { useMemo } from 'react'
import { Wallet, Copy, CheckCircle, Zap } from 'lucide-react'

function ellipsify(address?: string, start = 4, end = 4) {
  if (!address) return ''
  if (address.length <= start + end) return address
  return `${address.slice(0, start)}...${address.slice(-end)}`
}

export function ParaButton() {
  const { openModal } = useModal()
  const { data: account } = useAccount()
  const { data: wallet } = useWallet()
  const para = useClient()

  const displayAddress = useMemo(() => {
    if (!wallet || !para) return ''
    return para.getDisplayAddress(wallet.id, {
      truncate: false,
      addressType: wallet.type,
    })
  }, [wallet, para])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (account?.isConnected && displayAddress) {
    return (
      <div className="relative group">
        {/* Connected State */}
        <button
          onClick={openModal}
          className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-teal-500/20 to-teal-400/20 hover:from-teal-500/30 hover:to-teal-400/30 border border-teal-400/40 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-teal-500/25"
        >
          {/* Status Indicator */}
          <div className="relative">
            <div className="w-3 h-3 bg-teal-400 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-3 h-3 bg-teal-400 rounded-full animate-ping opacity-75"></div>
          </div>

          {/* Wallet Icon */}
          <Wallet className="w-5 h-5 text-teal-400" />

          {/* Address Display */}
          <div className="flex flex-col items-start">
            <span className="text-sm font-bold text-teal-700">CONNECTED</span>
            <code className="text-xs text-teal-600 font-mono bg-teal-500/10 px-2 py-1 rounded-lg">
              {ellipsify(displayAddress)}
            </code>
          </div>

          {/* Copy Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              copyToClipboard(displayAddress)
            }}
            className="p-2 hover:bg-teal-500/20 rounded-lg transition-colors duration-200"
            title="Copy address"
          >
            <Copy className="w-4 h-4 text-teal-400" />
          </button>
        </button>

        {/* Hover Tooltip */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-slate-800/90 text-stone-100 text-xs px-3 py-2 rounded-lg whitespace-nowrap">
            Click to manage wallet
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative group">
      {/* Disconnected State */}
      <button
        onClick={openModal}
        className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-300 via-teal-400 to-stone-200 hover:from-orange-400 hover:via-teal-500 hover:to-stone-300 text-slate-800 font-black rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-200/30 via-teal-200/30 to-stone-100/30 animate-pulse"></div>

        {/* Lightning bolt animation */}
        <div className="relative">
          <Zap className="w-6 h-6 animate-bounce text-slate-700" />
        </div>

        {/* Button text */}
        <div className="relative flex flex-col items-start">
          <span className="text-lg font-black text-slate-800">CONNECT WALLET</span>
          <span className="text-xs opacity-80 font-medium text-slate-700">Sign in with Para</span>
        </div>

        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-300 via-teal-400 to-stone-200 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
      </button>

      {/* Hover Tooltip */}
      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-slate-800/90 text-stone-100 text-xs px-3 py-2 rounded-lg whitespace-nowrap">
          Connect to start betting
        </div>
      </div>
    </div>
  )
}
