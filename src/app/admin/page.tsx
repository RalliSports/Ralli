/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ToastProvider, useToast } from '../../components/ui/toast'
import { Dropdown, SportsDropdown } from '../../components/ui/dropdown'
import { useSessionToken } from '@/hooks/use-session'

// Types for the admin panel
interface Stat {
  id: string
  name: string
  description: string
  customId: number
  createdAt: string
}

interface Player {
  id: string
  name: string
  sport: string
  team: string
  jerseyNumber: string
  position: string
  avatar: string
}

interface Line {
  id: string
  createdAt: string
  athleteId: string
  statId: string
  matchupId: string
  predictedValue: string
  actualValue: string
  isHigher: boolean
  stat: {
    id: string
    customId: number
    name: string
    description: string
    createdAt: Date
  }
  matchup: {
    id: string
    homeTeam: string
    awayTeam: string
    gameDate: Date
    status: string
    scoreHome: number
    scoreAway: number
    createdAt: Date
  }
  athlete: {
    id: string
    name: string
    team: string
    position: string
    jerseyNumber: number
    age: number
    picture: string
    createdAt: Date
  }
}

interface Game {
  id: string
  title: string
  sport: string
  participants: number
  maxParticipants: number
  buyIn: number
  prizePool: number
  legs: number
  timeLeft: string
  status: 'waiting' | 'active' | 'completed'
  host: { name: string; avatar: string }
}

export default function AdminPage() {
  return (
    <ToastProvider>
      <AdminPageContent />
    </ToastProvider>
  )
}

function AdminPageContent() {
  const { session } = useSessionToken()

  const { addToast } = useToast()
  const [activeTab, setActiveTab] = useState<'stats' | 'lines' | 'players' | 'resolve-lines' | 'resolve-games'>('stats')

  // Sport configurations
  const sports = [
    {
      name: 'NBA',
      code: '03XXX',
      icon: '🏀',
      color: 'from-[#00CED1] to-[#FFAB91]',
    },
    {
      name: 'NFL',
      code: '01XXX',
      icon: '🏈',
      color: 'from-[#FFAB91] to-[#00CED1]',
    },
    {
      name: 'Soccer',
      code: '04XXX',
      icon: '⚽',
      color: 'from-[#00CED1] to-[#FFAB91]',
    },
    {
      name: 'Baseball',
      code: '02XXX',
      icon: '⚾',
      color: 'from-[#FFAB91] to-[#00CED1]',
    },
  ]

  // Mock data for players
  const [players, setPlayers] = useState<Player[]>([
    {
      id: '1',
      name: 'LeBron James',
      sport: 'NBA',
      team: 'LAL',
      jerseyNumber: '23',
      position: 'SF',
      avatar: 'LJ',
    },
    {
      id: '2',
      name: 'Josh Allen',
      sport: 'NFL',
      team: 'BUF',
      jerseyNumber: '17',
      position: 'QB',
      avatar: 'JA',
    },
    {
      id: '3',
      name: 'Lionel Messi',
      sport: 'Soccer',
      team: 'MIA',
      jerseyNumber: '10',
      position: 'FW',
      avatar: 'LM',
    },
  ])

  // Mock data for lines
  const [lines, setLines] = useState<Line[]>([])

  useEffect(() => {
    const fetchLines = async () => {
      const response = await fetch('/api/read-lines', {
        method: 'GET',
        headers: {
          'x-para-session': session || '',
        },
      })
      const data = await response.json()
      console.log(data, 'data')
      setLines(data)
    }
    fetchLines()
  }, [])

  // Mock data for games (using existing lobby structure)
  const [games, setGames] = useState<Game[]>([
    {
      id: '1',
      title: '🔥 NBA Sunday Showdown',
      sport: 'NBA',
      participants: 9,
      maxParticipants: 12,
      buyIn: 25,
      prizePool: 280,
      legs: 4,
      timeLeft: '2h 15m',
      status: 'active',
      host: { name: 'Jack Sturt', avatar: 'JS' },
    },
    {
      id: '2',
      title: 'Monday Night Football',
      sport: 'NFL',
      participants: 11,
      maxParticipants: 12,
      buyIn: 50,
      prizePool: 580,
      legs: 5,
      timeLeft: '45m',
      status: 'active',
      host: { name: 'Mike Chen', avatar: 'MC' },
    },
  ])

  const timeNow = new Date()

  const [stats, setStats] = useState<Stat[]>([])

  useEffect(() => {
    const fetchStats = async () => {
      const response = await fetch('/api/read-stats', {
        method: 'GET',
        headers: {
          'x-para-session': session || '',
        },
      })
      const data = await response.json()
      console.log(data, 'data')
      setStats(data)
    }
    fetchStats()
  }, [])

  // Form states
  const [newStat, setNewStat] = useState({
    name: '',
    description: '',
    customId: 0,
  })

  const [newPlayer, setNewPlayer] = useState({
    name: '',
    sport: '',
    team: '',
    jerseyNumber: '',
    position: '',
  })

  const [newLine, setNewLine] = useState({
    playerId: '',
    statTypeId: '',
    value: '',
    gameTime: '',
    gameDate: '',
    overOdds: '',
    underOdds: '',
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSport, setSelectedSport] = useState('all')

  // Resolution state for lines
  const [resolvingLine, setResolvingLine] = useState<string | null>(null)
  const [resolutionData, setResolutionData] = useState({
    actualValue: '',
    resolutionReason: '',
  })

  const handleCreateStat = async () => {
    if (!newStat.name || !newStat.description || !newStat.customId) {
      addToast('Please fill in all fields', 'error')
      return
    }

    setNewStat({
      name: '',
      description: '',
      customId: 0,
    })

    const apiData = {
      name: newStat.name,
      description: newStat.description,
      customId: newStat.customId,
    }
    const response = await fetch('/api/create-stat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-para-session': session || '',
      },
      body: JSON.stringify(apiData),
    })
    const result = await response.json()
    console.log(result, 'result')
    addToast('Stat type created successfully!', 'success')
  }

  const handleCreatePlayer = () => {
    if (!newPlayer.name || !newPlayer.sport || !newPlayer.team || !newPlayer.jerseyNumber || !newPlayer.position) {
      addToast('Please fill in all fields', 'error')
      return
    }

    const player: Player = {
      id: String(players.length + 1),
      name: newPlayer.name,
      sport: newPlayer.sport,
      team: newPlayer.team,
      jerseyNumber: newPlayer.jerseyNumber,
      position: newPlayer.position,
      avatar: newPlayer.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase(),
    }

    setPlayers([...players, player])
    setNewPlayer({
      name: '',
      sport: '',
      team: '',
      jerseyNumber: '',
      position: '',
    })
    addToast('Player added successfully!', 'success')
  }

  const handleCreateLine = async () => {
    // if (
    //   !newLine.playerId ||
    //   !newLine.statTypeId ||
    //   !newLine.value ||
    //   !newLine.gameTime ||
    //   !newLine.gameDate ||
    //   !newLine.overOdds ||
    //   !newLine.underOdds
    // ) {
    //   addToast("Please fill in all fields", "error");
    //   return;
    // }

    // const player = players.find((p) => p.id === newLine.playerId);
    // const statType = statTypes.find((st) => st.id === newLine.statTypeId);
    // if (!player || !statType) return;

    // // Parse the date
    // const gameDate = new Date(newLine.gameDate);
    // if (isNaN(gameDate.getTime())) {
    //   addToast("Please enter a valid date and time", "error");
    //   return;
    // }

    // const line: Line = {
    //   id: String(lines.length + 1),
    //   playerId: newLine.playerId,
    //   playerName: player.name,
    //   statTypeId: newLine.statTypeId,
    //   statName: statType.name,
    //   value: parseFloat(newLine.value),
    //   sport: player.sport,
    //   gameTime: newLine.gameTime,
    //   gameDate: gameDate,
    //   status: "active",
    //   overOdds: newLine.overOdds,
    //   underOdds: newLine.underOdds,
    // };

    // setLines([...lines, line]);
    // setNewLine({
    //   playerId: "",
    //   statTypeId: "",
    //   value: "",
    //   gameTime: "",
    //   gameDate: "",
    //   overOdds: "",
    //   underOdds: "",
    // });

    const apiData = {
      athleteId: '17b27fd9-8ebe-4ce7-9e84-cb34714386a6',
      statId: '550e8401-e29b-41d4-a716-446655440018',
      matchupId: '550e8400-e29b-41d4-a716-446655440050',
      predictedValue: 10.5,
    }
    const response = await fetch('/api/create-line', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-para-session': session || '',
      },
      body: JSON.stringify(apiData),
    })

    const result = await response.json()
    console.log(result, 'result')

    addToast('Line created successfully!', 'success')
  }

  const handleResolveLine = async (
    lineId: string,
    actualValue: number,
    // result: 'over' | 'under' | 'cancel',
    // resolutionReason?: string,
  ) => {
    // if (result === 'cancel') {
    //   setLines(
    //     lines.map((line) =>
    //       line.id === lineId
    //         ? {
    //             ...line,
    //             status: 'cancelled',
    //             resolutionReason: resolutionReason || 'Cancelled by admin',
    //           }
    //         : line,
    //     ),
    //   )
    //   addToast('Line cancelled successfully!', 'success')
    //   return
    // }

    // const line = lines.find((l) => l.id === lineId)
    // if (!line) return

    // // Validation logic
    // const shouldBeOver = actualValue > line.value
    // const shouldBeUnder = actualValue < line.value
    // const isPush = actualValue === line.value

    // if (isPush) {
    //   addToast(
    //     `Actual value ${actualValue} equals line value ${line.value}. This should be a push, not resolved as ${result.toUpperCase()}`,
    //     'error',
    //   )
    //   return
    // }

    // if (result === 'over' && !shouldBeOver) {
    //   addToast(
    //     `Error: Actual value ${actualValue} is under the line value ${line.value}. Cannot resolve as OVER.`,
    //     'error',
    //   )
    //   return
    // }

    // if (result === 'under' && !shouldBeUnder) {
    //   addToast(
    //     `Error: Actual value ${actualValue} is over the line value ${line.value}. Cannot resolve as UNDER.`,
    //     'error',
    //   )
    //   return
    // }

    // setLines(
    //   lines.map((l) =>
    //     l.id === lineId
    //       ? {
    //           ...l,
    //           status: 'resolved',
    //           actualValue,
    //           resolutionReason:
    //             resolutionReason || `Resolved as ${result.toUpperCase()}: actual ${actualValue} vs line ${line.value}`,
    //         }
    //       : l,
    //   ),
    // )

    const apiData = {
      lineId: 'a2fcf50b-c67c-481e-8658-e4fb2ad9cd95',
      actualValue: 12,
    }
    const response = await fetch('/api/resolve-line', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-para-session': session || '',
      },
      body: JSON.stringify(apiData),
    })

    const result = await response.json()
    console.log(result, 'result')

    addToast(`Line resolved as ${result.toUpperCase()} successfully!`, 'success')
  }

  const handleResolveGame = (gameId: string, action: 'end' | 'cancel') => {
    setGames(
      games.map((game) =>
        game.id === gameId
          ? {
              ...game,
              status: action === 'end' ? 'completed' : ('cancelled' as any),
            }
          : game,
      ),
    )
    const message = action === 'end' ? 'Game ended successfully!' : 'Game cancelled successfully!'
    addToast(message, 'success')
  }

  // Filter functions
  console.log(lines, 'lines')
  const filteredLines = lines.filter((line) => {
    const matchesSearch =
      line.athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      line.stat.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSport = selectedSport === 'all' || line.matchup.homeTeam === selectedSport
    return matchesSearch && matchesSport
  })

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSport = selectedSport === 'all' || game.sport === selectedSport
    return matchesSearch && matchesSport
  })

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Enhanced Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-md border-b border-slate-700/50 shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Back Button + Title */}
          <div className="flex items-center space-x-3">
            <Link
              href="/main"
              className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-white">
              <span className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] bg-clip-text text-transparent">
                Admin Panel
              </span>
            </h1>
          </div>

          {/* Right: Status or Info */}
          <div className="flex items-center space-x-3">
            {/* Connect Wallet Button */}

            {/* Admin Access Indicator */}
            {/* <div className="bg-gradient-to-r from-[#00CED1]/20 to-[#FFAB91]/20 border border-[#00CED1]/30 rounded-xl px-4 py-2 backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-lg flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="font-bold text-sm bg-gradient-to-r from-[#00CED1] to-[#FFAB91] bg-clip-text text-transparent">
                  Admin Access
                </span>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-20">
        <div className="max-w-6xl mx-auto pt-6">
          {/* Tab Navigation */}
          <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-3 shadow-2xl mb-6">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'stats', name: 'Stat Types', icon: '📊' },
                { id: 'players', name: 'Players', icon: '👤' },
                { id: 'lines', name: 'Create Lines', icon: '📈' },
                { id: 'resolve-lines', name: 'Resolve Lines', icon: '✅' },
                { id: 'resolve-games', name: 'Resolve Games', icon: '🎮' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white shadow-lg'
                      : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white border border-slate-700/50'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>{' '}
          {/* Tab Content */}
          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create New Stat Type Form */}
              <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-3 flex items-center justify-center">
                    <span className="text-lg">➕</span>
                  </span>
                  Create Stat Type
                </h2>{' '}
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Stat Name</label>
                    <input
                      type="text"
                      value={newStat.name}
                      onChange={(e) => setNewStat({ ...newStat, name: e.target.value })}
                      placeholder="e.g., Points, Assists, Goals"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Description</label>
                    <textarea
                      value={newStat.description}
                      onChange={(e) =>
                        setNewStat({
                          ...newStat,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe what this stat measures..."
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Custom ID</label>
                    <input
                      type="text"
                      value={newStat.customId}
                      onChange={(e) =>
                        setNewStat({
                          ...newStat,
                          customId: parseInt(e.target.value),
                        })
                      }
                      placeholder="e.g., 00001-00001"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all font-mono"
                    />
                    <p className="text-slate-400 text-xs mt-1">
                      Enter the specific numerical ID (e.g., 00001-00001) or leave blank to auto-generate
                    </p>
                  </div>

                  <button
                    onClick={handleCreateStat}
                    className="w-full bg-gradient-to-r from-[#00CED1] to-[#FFAB91] hover:from-[#00CED1]/90 hover:to-[#FFAB91]/90 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                  >
                    Create Stat Type
                  </button>
                </div>
              </div>

              {/* Existing Stat Types */}
              <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-[#FFAB91] to-[#00CED1] rounded-full mr-3 flex items-center justify-center">
                    <span className="text-lg">📋</span>
                  </span>
                  Existing Stats
                </h2>

                {/* Search and Filter */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search stat types..."
                      className="w-full px-4 py-3 pl-11 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {stats
                    .filter((stat) => {
                      const matchesSearch =
                        stat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        stat.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        stat.customId.toString().includes(searchTerm.toLowerCase())
                      return matchesSearch
                    })
                    .map((stat) => (
                      <div
                        key={stat.id}
                        className="bg-slate-700/30 rounded-xl p-4 hover:bg-slate-700/50 transition-all duration-200 border border-slate-600/20 hover:border-[#00CED1]/30"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="flex-1">
                                <h4 className="text-white font-semibold text-lg">{stat.name}</h4>
                                <div className="flex items-center space-x-2">
                                  {/* <span className="text-[#00CED1] text-sm font-medium">{stat.sport}</span> */}
                                  <span className="text-slate-400">•</span>
                                  <span className="text-[#FFAB91] font-mono text-sm">{stat.customId}</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed mb-3 pl-13">{stat.description}</p>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <button className="p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors group">
                              <svg
                                className="w-4 h-4 text-slate-400 group-hover:text-[#00CED1]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button className="p-2 bg-slate-800/50 hover:bg-red-500/20 rounded-lg transition-colors group">
                              <svg
                                className="w-4 h-4 text-slate-400 group-hover:text-red-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  {stats.filter((stat) => {
                    const matchesSearch =
                      stat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      stat.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      stat.customId.toString().includes(searchTerm.toLowerCase())
                    return matchesSearch
                  }).length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-slate-400 mb-2"></div>
                      <p className="text-slate-400">No stat types found matching your criteria</p>
                      <p className="text-slate-500 text-sm mt-1">Try adjusting your search or filter</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {activeTab === 'players' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add New Player Form */}
              <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-3 flex items-center justify-center">
                    <span className="text-lg">👤</span>
                  </span>
                  Add New Player
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Player Name</label>
                    <input
                      type="text"
                      value={newPlayer.name}
                      onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                      placeholder="e.g., LeBron James"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Sport</label>
                    <SportsDropdown
                      value={newPlayer.sport}
                      onChange={(value) => setNewPlayer({ ...newPlayer, sport: value })}
                      includeAll={false}
                      placeholder="Select Sport"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">Team</label>
                      <input
                        type="text"
                        value={newPlayer.team}
                        onChange={(e) => setNewPlayer({ ...newPlayer, team: e.target.value })}
                        placeholder="e.g., LAL"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Jersey #</label>
                      <input
                        type="text"
                        value={newPlayer.jerseyNumber}
                        onChange={(e) =>
                          setNewPlayer({
                            ...newPlayer,
                            jerseyNumber: e.target.value,
                          })
                        }
                        placeholder="e.g., 23"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Position</label>
                    <input
                      type="text"
                      value={newPlayer.position}
                      onChange={(e) => setNewPlayer({ ...newPlayer, position: e.target.value })}
                      placeholder="e.g., SF, QB, FW"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                    />
                  </div>

                  <button
                    onClick={handleCreatePlayer}
                    className="w-full bg-gradient-to-r from-[#00CED1] to-[#FFAB91] hover:from-[#00CED1]/90 hover:to-[#FFAB91]/90 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                  >
                    Add Player
                  </button>
                </div>
              </div>

              {/* Existing Players */}
              <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-[#FFAB91] to-[#00CED1] rounded-full mr-3 flex items-center justify-center">
                    <span className="text-lg">👥</span>
                  </span>
                  Existing Players
                </h2>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {players.map((player) => (
                    <div
                      key={player.id}
                      className="bg-slate-700/30 rounded-xl p-4 hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">{player.avatar}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold">{player.name}</h4>
                          <div className="flex items-center space-x-2 text-sm">
                            <span className="text-lg">{sports.find((s) => s.name === player.sport)?.icon}</span>
                            <span className="text-slate-300">{player.team}</span>
                            <span className="text-slate-400">#{player.jerseyNumber}</span>
                            <span className="text-slate-400">{player.position}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === 'lines' && (
            <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-3 flex items-center justify-center">
                  <span className="text-lg">📈</span>
                </span>
                Create New Line
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Select Player</label>
                    <Dropdown
                      value={newLine.playerId}
                      onChange={(value) => setNewLine({ ...newLine, playerId: value })}
                      placeholder="Select a player"
                      options={[
                        { value: '', label: 'Select a player', disabled: true },
                        ...players.map((player) => ({
                          value: player.id,
                          label: `${player.name} (${player.team})`,
                          icon: sports.find((s) => s.name === player.sport)?.icon,
                        })),
                      ]}
                      searchable={true}
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Select Stat Type</label>
                    <Dropdown
                      value={newLine.statTypeId}
                      onChange={(value) => setNewLine({ ...newLine, statTypeId: value })}
                      placeholder="Select stat type"
                      options={[
                        {
                          value: '',
                          label: 'Select stat type',
                          disabled: true,
                        },
                        ...stats.map((stat) => ({
                          value: stat.id,
                          label: `${stat.name} (${stat.customId})`,
                          icon: '📊',
                        })),
                      ]}
                      searchable={true}
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Line Value</label>
                    <input
                      type="number"
                      step="0.5"
                      value={newLine.value}
                      onChange={(e) => setNewLine({ ...newLine, value: e.target.value })}
                      placeholder="e.g., 28.5"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Game Date & Time</label>
                    <input
                      type="datetime-local"
                      value={newLine.gameDate}
                      onChange={(e) => setNewLine({ ...newLine, gameDate: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Game Description</label>
                    <input
                      type="text"
                      value={newLine.gameTime}
                      onChange={(e) => setNewLine({ ...newLine, gameTime: e.target.value })}
                      placeholder="e.g., Lakers vs Warriors - 4th Quarter"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-2">Over Odds</label>
                      <input
                        type="text"
                        value={newLine.overOdds}
                        onChange={(e) => setNewLine({ ...newLine, overOdds: e.target.value })}
                        placeholder="e.g., +110"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Under Odds</label>
                      <input
                        type="text"
                        value={newLine.underOdds}
                        onChange={(e) => setNewLine({ ...newLine, underOdds: e.target.value })}
                        placeholder="e.g., -130"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleCreateLine}
                    className="w-full bg-gradient-to-r from-[#00CED1] to-[#FFAB91] hover:from-[#00CED1]/90 hover:to-[#FFAB91]/90 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                  >
                    Create Line
                  </button>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'resolve-lines' && (
            <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-3 flex items-center justify-center">
                  <span className="text-lg">✅</span>
                </span>
                Resolve Lines
              </h2>

              {/* Search and Filter */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by player or stat name..."
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                  />
                </div>

                <div>
                  <SportsDropdown
                    value={selectedSport}
                    onChange={setSelectedSport}
                    includeAll={true}
                    placeholder="Filter by sport"
                  />
                </div>
              </div>

              {/* Lines List */}
              <div className="space-y-4">
                {filteredLines.map((line) => (
                  <div
                    key={line.id}
                    className="bg-slate-700/30 rounded-xl p-6 hover:bg-slate-700/50 transition-colors border border-slate-600/20"
                  >
                    <div className="space-y-4">
                      {/* Line Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{sports.find((s) => s.name === line.sport)?.icon}</span>
                          <h4 className="text-white font-semibold text-lg">{line.playerName}</h4>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              line.createdAt > timeNow.toISOString()
                                ? 'bg-[#00CED1]/20 text-[#00CED1] border border-[#00CED1]/30'
                                : !!line.actualValue
                                  ? 'bg-[#FFAB91]/20 text-[#FFAB91] border border-[#FFAB91]/30'
                                  : 'bg-red-500/20 text-red-400 border border-red-400/30'
                            }`}
                          >
                            {line.createdAt > timeNow.toISOString()
                              ? 'Pending'
                              : !!line.actualValue
                                ? 'Resolved'
                                : 'Cancelled'}
                          </span>
                        </div>
                        <div
                          key={line.athlete.id}
                          className="bg-slate-700/30 rounded-xl p-4 hover:bg-slate-700/50 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-full flex items-center justify-center overflow-hidden">
                              <Image
                                src={line.athlete.picture}
                                alt={line.athlete.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover rounded-full"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white font-semibold">{line.athlete.name}</h4>
                              <div className="flex items-center space-x-2 text-sm">
                                <span className="text-slate-300">{line.athlete.team}</span>
                                <span className="text-slate-400">#{line.athlete.jerseyNumber}</span>
                                <span className="text-slate-400">{line.athlete.position}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-slate-400">Line Value</div>
                          <div className="text-xl font-bold text-[#FFAB91]">{line.predictedValue}</div>
                        </div>
                      </div>

                      {/* Line Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-800/30 rounded-lg">
                        <div>
                          <div className="text-sm text-slate-400">Stat Type</div>
                          <div className="text-white font-semibold">{line.stat.name}</div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-400">Game</div>
                          <div className="text-white font-semibold">
                            {line.matchup.homeTeam} vs {line.matchup.awayTeam}
                          </div>
                        </div>
                      </div>

                      {/* Resolution Status or Input */}
                      {!!line.actualValue && (
                        <div className="p-4 bg-gradient-to-r from-[#FFAB91]/10 to-[#00CED1]/10 border border-[#FFAB91]/30 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm text-slate-300">Resolved Value</div>
                              <div className="text-lg font-bold text-[#FFAB91]">
                                {line.actualValue} (Line was {line.predictedValue})
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-slate-300">Result</div>
                              <div
                                className={`font-bold ${
                                  line.actualValue! > line.predictedValue ? 'text-[#00CED1]' : 'text-[#FFAB91]'
                                }`}
                              >
                                {line.actualValue! > line.predictedValue
                                  ? 'OVER'
                                  : line.actualValue! < line.predictedValue
                                    ? 'UNDER'
                                    : 'PUSH'}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {!line.actualValue && (
                        <div className="border-t border-slate-600/30 pt-4">
                          {resolvingLine === line.id ? (
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-white font-semibold mb-2">
                                    Actual {line.stat.name} Value
                                  </label>
                                  <input
                                    type="number"
                                    step="0.1"
                                    value={resolutionData.actualValue}
                                    onChange={(e) =>
                                      setResolutionData({
                                        ...resolutionData,
                                        actualValue: e.target.value,
                                      })
                                    }
                                    placeholder={`e.g., ${line.predictedValue}`}
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                                  />
                                  <div className="mt-1 text-sm text-slate-400">Line value: {line.value}</div>
                                </div>
                                <div>
                                  <label className="block text-white font-semibold mb-2">
                                    Resolution Reason (Optional)
                                  </label>
                                  <input
                                    type="text"
                                    value={resolutionData.resolutionReason}
                                    onChange={(e) =>
                                      setResolutionData({
                                        ...resolutionData,
                                        resolutionReason: e.target.value,
                                      })
                                    }
                                    placeholder="e.g., Official stats, injury, etc."
                                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                                  />
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-3">
                                <button
                                  onClick={() => {
                                    const actualValue = parseFloat(resolutionData.actualValue)
                                    if (isNaN(actualValue)) {
                                      addToast('Please enter a valid actual value', 'error')
                                      return
                                    }
                                    handleResolveLine(line.id, actualValue)
                                    setResolvingLine(null)
                                    setResolutionData({
                                      actualValue: '',
                                      resolutionReason: '',
                                    })
                                  }}
                                  disabled={!resolutionData.actualValue}
                                  className="px-6 py-3 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] hover:from-[#00CED1]/90 hover:to-[#FFAB91]/90 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Auto Resolve
                                </button>
                                <button
                                  onClick={() => {
                                    handleResolveLine(line.id, 0)
                                    setResolvingLine(null)
                                    setResolutionData({
                                      actualValue: '',
                                      resolutionReason: '',
                                    })
                                  }}
                                  className="px-4 py-3 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-xl transition-colors"
                                >
                                  Cancel Line
                                </button>
                                <button
                                  onClick={() => {
                                    setResolvingLine(null)
                                    setResolutionData({
                                      actualValue: '',
                                      resolutionReason: '',
                                    })
                                  }}
                                  className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors"
                                >
                                  Close
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex space-x-3">
                              <button
                                onClick={() => setResolvingLine(line.id)}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] hover:from-[#00CED1]/90 hover:to-[#FFAB91]/90 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
                              >
                                Resolve Line
                              </button>
                              <button
                                onClick={() => {
                                  handleResolveLine(line.id, 0)
                                }}
                                className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-xl transition-colors"
                              >
                                Quick Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'resolve-games' && (
            <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-3 flex items-center justify-center">
                  <span className="text-lg">🎮</span>
                </span>
                Resolve Games
              </h2>

              {/* Search and Filter */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by game title..."
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                  />
                </div>

                <div>
                  <SportsDropdown
                    value={selectedSport}
                    onChange={setSelectedSport}
                    includeAll={true}
                    placeholder="Filter by sport"
                  />
                </div>
              </div>

              {/* Games List */}
              <div className="space-y-4">
                {filteredGames.map((game) => (
                  <div key={game.id} className="bg-slate-700/30 rounded-xl p-4 hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-lg">{sports.find((s) => s.name === game.sport)?.icon}</span>
                          <h4 className="text-white font-semibold">{game.title}</h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              game.status === 'active'
                                ? 'bg-[#00CED1]/20 text-[#00CED1]'
                                : game.status === 'waiting'
                                  ? 'bg-yellow-500/20 text-[#FFAB91]'
                                  : 'bg-[#FFAB91]/20 text-[#FFAB91]'
                            }`}
                          >
                            {game.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-slate-400 mb-2">
                          <span>
                            Players: {game.participants}/{game.maxParticipants}
                          </span>
                          <span>Buy-in: ${game.buyIn}</span>
                          <span>Pool: ${game.prizePool}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="text-slate-300">Host:</span>
                          <span className="text-[#FFAB91]">{game.host.name}</span>
                          <span className="text-slate-400">• {game.timeLeft} remaining</span>
                        </div>
                      </div>

                      {game.status === 'active' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleResolveGame(game.id, 'end')}
                            className="px-4 py-2 bg-[#00CED1] hover:bg-[#00CED1]/90 text-white font-semibold rounded-lg transition-colors"
                          >
                            End Game
                          </button>
                          <button
                            onClick={() => handleResolveGame(game.id, 'cancel')}
                            className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
