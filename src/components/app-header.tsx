'use client'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { ThemeSelect } from '@/components/theme-select'
import { ClusterUiSelect } from './cluster/cluster-ui'
import { ParaButton } from './para-modal'

export function AppHeader({ links = [] }: { links: { label: string; path: string }[] }) {
  const pathname = usePathname()
  const [showMenu, setShowMenu] = useState(false)

  function isActive(path: string) {
    return path === '/' ? pathname === '/' : pathname.startsWith(path)
  }

  return (
    <header className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-7xl">
      <div className="relative px-6 py-4 bg-gradient-to-r from-orange-200/95 via-teal-400/95 to-yellow-100/95 backdrop-blur-xl rounded-3xl border border-teal-300/30 shadow-2xl shadow-teal-500/20">
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-300/20 via-teal-300/20 to-yellow-200/20 animate-pulse rounded-3xl"></div>
      
        <div className="relative mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-8">
          <Link className="group flex items-center gap-3 hover:scale-105 transition-all duration-300" href="/">
            <div className="relative">
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-orange-600 to-yellow-700 group-hover:from-teal-500 group-hover:via-orange-500 group-hover:to-yellow-600 transition-all duration-300">
                🎯 RALLI
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-400/30 via-orange-400/30 to-yellow-400/30 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center">
            <nav className="flex gap-2">
              {links.map(({ label, path }) => (
                <Link
                  key={path}
                  className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                    isActive(path)
                      ? 'text-white bg-gradient-to-r from-teal-600 to-orange-600 shadow-lg shadow-teal-500/30'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-white/40 backdrop-blur-sm'
                  }`}
                  href={path}
                >
                  {/* Active indicator */}
                  {isActive(path) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-orange-600 to-yellow-600 rounded-xl blur-sm opacity-50 animate-pulse"></div>
                  )}
                  <span className="relative z-10">{label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden text-gray-700 hover:bg-white/40 hover:scale-110 transition-all duration-300 rounded-xl p-3" 
          onClick={() => setShowMenu(!showMenu)}
        >
          <div className="relative">
            {showMenu ? (
              <X className="h-6 w-6 transform rotate-180 transition-transform duration-300" />
            ) : (
              <Menu className="h-6 w-6 transition-transform duration-300" />
            )}
          </div>
        </Button>

        {/* Desktop Controls */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-3 p-2 bg-white/30 backdrop-blur-sm rounded-2xl border border-teal-300/40">
            <ParaButton />
            <div className="w-px h-6 bg-teal-400/40"></div>
            <ClusterUiSelect />
            <div className="w-px h-6 bg-teal-400/40"></div>
            <ThemeSelect />
          </div>
          
          {/* CTA Button */}
          <Button className="bg-gradient-to-r from-teal-500 via-orange-500 to-yellow-500 hover:from-teal-600 hover:via-orange-600 hover:to-yellow-600 text-white font-black px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300">
            🚀 START BETTING
          </Button>
        </div>

        {/* Mobile Menu Overlay */}
        {showMenu && (
          <>
            {/* Backdrop */}
            <div 
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
              onClick={() => setShowMenu(false)}
            ></div>
            
            {/* Menu Panel */}
            <div className="lg:hidden fixed inset-x-4 top-28 bg-gradient-to-br from-orange-200/98 via-teal-300/98 to-yellow-100/98 backdrop-blur-xl rounded-3xl border border-teal-300/40 shadow-2xl animate-in slide-in-from-top duration-300">
              <div className="p-8">
                {/* Mobile Navigation */}
                <nav className="mb-8">
                  <ul className="space-y-3">
                    {links.map(({ label, path }) => (
                      <li key={path}>
                        <Link
                          className={`block px-6 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                            isActive(path)
                              ? 'text-white bg-gradient-to-r from-teal-600 to-orange-600 shadow-lg shadow-teal-500/30'
                              : 'text-gray-700 hover:text-gray-900 hover:bg-white/40'
                          }`}
                          href={path}
                          onClick={() => setShowMenu(false)}
                        >
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                
                {/* Mobile Controls */}
                <div className="space-y-4 pt-6 border-t border-teal-400/30">
                  <div className="grid grid-cols-3 gap-3">
                    <ParaButton />
                    <ClusterUiSelect />
                    <ThemeSelect />
                  </div>
                  
                  {/* Mobile CTA */}
                  <Button className="w-full bg-gradient-to-r from-teal-500 via-orange-500 to-yellow-500 hover:from-teal-600 hover:via-orange-600 hover:to-yellow-600 text-white font-black py-4 rounded-2xl shadow-lg text-lg">
                    🚀 START BETTING NOW
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
        </div>
      </div>
    </header>
  )
}
