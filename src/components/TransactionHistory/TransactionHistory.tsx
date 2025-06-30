'use client'

import React, { useState } from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import BetHistoryCard from './Components/BetHistoryCard'
import SwitchTabs from './Components/SwitchTabs'
import { Activity, ReceiptText, Search, BarChartBig } from 'lucide-react'

interface Bet {
  id: string
  status: 'WON' | 'LOST' | 'PENDING'
  matchup: string
  selection: string
  type: string
  date: string
  stake: number
  odds: number
  payout: number
  profit: number
  icon?: React.ReactNode
}

interface TransactionHistoryProps {
  bets: Bet[]
  transactions?: React.ReactNode
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ bets, transactions }) => {
  const [activeTab, setActiveTab] = useState('betHistory')

  const TABS = [
    {
      id: 'betHistory',
      label: 'Bet History',
      icon: <Activity />,
      badge: bets.length > 0 ? bets.length.toString() : '0',
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: <ReceiptText />,
      badge: transactions ? React.Children.count(transactions).toString() : '0',
    },
  ]

  const renderContent = () => {
    if (activeTab === 'betHistory') {
      return (
        <div className="flex flex-col gap-4 mt-6">
          {bets.map((bet) => (
            <BetHistoryCard key={bet.id} bet={bet} />
          ))}
        </div>
      )
    }

    if (activeTab === 'transactions') {
      return (
        <div className="mt-6">
          {transactions || (
            <Card className="bg-slate-800 border-slate-700 p-6 text-slate-300 text-center">
              <p>No transactions available.</p>
            </Card>
          )}
        </div>
      )
    }

    return null
  }

  const totalProfit = bets.reduce((sum, b) => sum + b.profit, 0)
  const totalBets = bets.length

  return (
    <div className="p-6 space-y-6 bg-[#212c3ff2]/50 rounded-2xl shadow-lg">
      {/* Header Section */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        {/* Left: Icon + Title */}
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-3 rounded-xl">
            <ReceiptText className="text-white w-6 h-6" />
          </div>
          <div className="min-w-0">
            <h2 className="text-white sm:text-2xl text-lg font-bold leading-snug break-words">Transaction History</h2>
            <p className="text-slate-400 text-sm break-words">Track your bets and payments</p>
          </div>
        </div>

        {/* Right: Stats */}
        <div className="flex items-center gap-3 ml-auto">
          <div className="rounded-xl bg-[rgba(0,255,200,0.05)] border border-[rgba(0,255,200,0.2)] px-4 py-2 text-center min-w-[100px]">
            <p className="text-emerald-400 font-bold sm:text-lg text-xs">+${totalProfit.toFixed(0)}</p>
            <p className="text-slate-400 text-xs">This Month</p>
          </div>
          <div className="rounded-xl bg-[rgba(0,255,255,0.05)] border border-[rgba(0,255,255,0.2)] px-4 py-2 text-center min-w-[80px]">
            <p className="text-cyan-300 font-bold sm:text-lg text-xs">{totalBets}</p>
            <p className="text-slate-400 text-xs">Total Bets</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <SwitchTabs tabs={TABS} defaultTab="betHistory" onTabChange={setActiveTab} />

      {/* Tab Content */}
      {renderContent()}

      {/* Footer */}
      <div className="flex justify-between items-center mt-8 flex-wrap gap-4">
        <p className="text-slate-500 text-sm whitespace-nowrap">Last 30 days of betting activity</p>
        <div className="flex gap-3">
          {/* Filter Button */}
          <button className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-slate-700/50 text-sm font-medium text-white hover:bg-white/5 transition">
            <Search className="w-4 h-4" />
            Filter
          </button>

          {/* Export Button */}
          <button className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-slate-700/50 text-sm font-medium text-white hover:bg-white/5 transition">
            <BarChartBig className="w-4 h-4" />
            Export History
          </button>
        </div>
      </div>
    </div>
  )
}

export default TransactionHistory
