'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface Tab {
  id: string
  label: string
  icon?: React.ReactNode
  badge?: string
}

interface SwitchTabsProps {
  tabs: Tab[]
  defaultTab?: string
  onTabChange?: (tabId: string) => void
}

const SwitchTabs: React.FC<SwitchTabsProps> = ({ tabs, defaultTab, onTabChange }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
    onTabChange?.(tabId)
  }

  return (
    <Card
      style={{
        background: 'linear-gradient(180deg, rgba(27,31,42,0.6), rgba(27,31,42,0.9))',
      }}
      className="p-2 rounded-2xl border border-white/10 shadow-inner"
    >
      <div className="flex flex-wrap sm:flex-nowrap gap-1 sm:gap-2 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const isTransactions = tab.id === 'transactions'

          // Custom gradient + glow for transactions tab
          const background = isTransactions
            ? 'linear-gradient(135deg, #FFAB91, #FF8A65)'
            : 'linear-gradient(135deg, rgba(20, 184, 166, 0.8), rgba(6, 182, 212, 0.8))'

          const boxShadow = isTransactions
            ? `
                0 0 15px 5px rgba(255, 171, 145, 0.3),
                0 0 25px 10px rgba(255, 138, 101, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
              `
            : `
                0 0 15px 5px rgba(20, 184, 166, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
              `

          return (
            <Button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              variant="ghost"
              className={`
                flex-1 min-w-[120px] relative px-3 sm:px-6 py-3 rounded-lg transition-all duration-300
                font-medium flex items-center justify-center gap-2 overflow-hidden
                ${isActive ? 'text-white' : 'text-slate-300 hover:bg-slate-700/50'}
              `}
              style={isActive ? { background, boxShadow } : {}}
            >
              {/* Side glow overlay */}
              {isActive && (
                <span
                  className="absolute inset-y-0 left-0 right-0 mx-auto w-[110%] rounded-lg pointer-events-none"
                  style={{
                    background: isTransactions
                      ? 'radial-gradient(ellipse at center, rgba(255, 171, 145, 0.25), transparent)'
                      : 'radial-gradient(ellipse at center, rgba(20, 184, 166, 0.2), transparent)',
                    filter: 'blur(6px)',
                    transform: 'scaleY(0.8)',
                  }}
                />
              )}

              {/* Icon */}
              {tab.icon && (
                <span className="shrink-0 sm:text-lg text-sm z-10 relative">{tab.icon}</span>
              )}

              {/* Label */}
              <span className="z-10 relative font-semibold">{tab.label}</span>

              {/* Badge */}
              {tab.badge && (
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold z-10 relative
                    ${isActive ? 'bg-white/20 text-white shadow-sm' : 'bg-slate-600 text-slate-200'}
                  `}
                >
                  {tab.badge}
                </span>
              )}
            </Button>
          )
        })}
      </div>
    </Card>
  )
}

export default SwitchTabs
