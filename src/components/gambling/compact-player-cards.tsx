"use client";

import { useState } from "react";

export default function CompactPlayerCards() {
  const players = [
    {
      id: 1,
      name: "Patrick Mahomes",
      team: "KC",
      position: "QB",
      status: "probable",
      avatar: "PM",
      matchup: "vs BUF",
      stats: [
        {
          type: "Passing Yards",
          line: 285.5,
          icon: "🏈",
        },
        {
          type: "Passing TDs",
          line: 2.5,
          icon: "🎯",
        },
        {
          type: "Completions",
          line: 24.5,
          icon: "✅",
        },
        {
          type: "Interceptions",
          line: 0.5,
          icon: "❌",
        },
      ],
    },
    {
      id: 2,
      name: "Josh Allen",
      team: "BUF",
      position: "QB",
      status: "confirmed",
      avatar: "JA",
      matchup: "@ KC",
      stats: [
        {
          type: "Passing Yards",
          line: 275.5,
          icon: "🏈",
        },
        {
          type: "Rushing Yards",
          line: 45.5,
          icon: "🏃",
        },
        {
          type: "Total TDs",
          line: 2.5,
          icon: "🎯",
        },
        {
          type: "Completions",
          line: 22.5,
          icon: "✅",
        },
      ],
    },
    {
      id: 3,
      name: "Cooper Kupp",
      team: "LAR",
      position: "WR",
      status: "questionable",
      avatar: "CK",
      matchup: "vs SEA",
      stats: [
        {
          type: "Receiving Yards",
          line: 95.5,
          icon: "🙌",
        },
        {
          type: "Receptions",
          line: 7.5,
          icon: "🤝",
        },
        {
          type: "Receiving TDs",
          line: 0.5,
          icon: "🎯",
        },
        {
          type: "Longest Reception",
          line: 28.5,
          icon: "📏",
        },
      ],
    },
    {
      id: 4,
      name: "Derrick Henry",
      team: "TEN",
      position: "RB",
      status: "confirmed",
      avatar: "DH",
      matchup: "@ JAX",
      stats: [
        {
          type: "Rushing Yards",
          line: 125.5,
          icon: "🏃",
        },
        {
          type: "Rushing TDs",
          line: 1.5,
          icon: "🎯",
        },
        {
          type: "Carries",
          line: 22.5,
          icon: "⚡",
        },
        {
          type: "Receiving Yards",
          line: 15.5,
          icon: "🙌",
        },
      ],
    },
    {
      id: 5,
      name: "Travis Kelce",
      team: "KC",
      position: "TE",
      status: "probable",
      avatar: "TK",
      matchup: "vs BUF",
      stats: [
        {
          type: "Receiving Yards",
          line: 75.5,
          icon: "🙌",
        },
        {
          type: "Receptions",
          line: 6.5,
          icon: "🤝",
        },
        {
          type: "Receiving TDs",
          line: 0.5,
          icon: "🎯",
        },
        {
          type: "Targets",
          line: 8.5,
          icon: "🎪",
        },
      ],
    },
    {
      id: 6,
      name: "Ja'Marr Chase",
      team: "CIN",
      position: "WR",
      status: "confirmed",
      avatar: "JC",
      matchup: "vs PIT",
      stats: [
        {
          type: "Receiving Yards",
          line: 88.5,
          icon: "🙌",
        },
        {
          type: "Receptions",
          line: 6.5,
          icon: "🤝",
        },
        {
          type: "Receiving TDs",
          line: 0.5,
          icon: "🎯",
        },
        {
          type: "Longest Reception",
          line: 32.5,
          icon: "📏",
        },
      ],
    },
  ];

  const [currentStatIndex, setCurrentStatIndex] = useState<{
    [key: number]: number;
  }>({});

  const getPositionColor = (position: string) => {
    switch (position) {
      case "QB":
        return "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400";
      case "RB":
        return "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400";
      case "WR":
        return "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400";
      case "TE":
        return "from-orange-500/20 to-amber-500/20 border-orange-500/30 text-orange-400";
      default:
        return "from-slate-500/20 to-slate-600/20 border-slate-500/30 text-slate-400";
    }
  };

  const nextStat = (playerId: number, stats: any[]) => {
    const current = currentStatIndex[playerId] || 0;
    const next = (current + 1) % stats.length;
    setCurrentStatIndex((prev) => ({ ...prev, [playerId]: next }));
  };

  const prevStat = (playerId: number, stats: any[]) => {
    const current = currentStatIndex[playerId] || 0;
    const prevIndex = current === 0 ? stats.length - 1 : current - 1;
    setCurrentStatIndex((prev) => ({ ...prev, [playerId]: prevIndex }));
  };

  const handleTouchStart = (e: React.TouchEvent, playerId: number) => {
    const touch = e.touches[0];
    (e.target as any).startX = touch.clientX;
  };

  const handleTouchEnd = (
    e: React.TouchEvent,
    playerId: number,
    stats: any[]
  ) => {
    const touch = e.changedTouches[0];
    const startX = (e.target as any).startX;
    const endX = touch.clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      // Minimum swipe distance
      if (diff > 0) {
        nextStat(playerId, stats);
      } else {
        prevStat(playerId, stats);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {players.map((player) => {
        const currentIndex = currentStatIndex[player.id] || 0;
        const currentStat = player.stats[currentIndex];

        return (
          <div
            key={player.id}
            className="group relative bg-gradient-to-br from-slate-800/98 to-slate-900/98 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/40 shadow-2xl hover:shadow-[#00CED1]/25 transition-all duration-500 hover:scale-[1.03] hover:border-slate-600/60 overflow-hidden"
          >
            {/* Enhanced Background Pattern */}
            <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.08] transition-opacity duration-500">
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-[#FFAB91] to-[#00CED1] rounded-full blur-2xl"></div>
            </div>

            {/* Subtle Inner Glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01] group-hover:from-white/[0.04] group-hover:to-white/[0.02] transition-all duration-500"></div>

            {/* Enhanced Compact Header */}
            <div className="relative z-10 flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-2xl flex items-center justify-center shadow-xl shadow-[#00CED1]/20 group-hover:scale-110 group-hover:shadow-[#00CED1]/30 transition-all duration-500">
                    <span className="text-white font-bold text-lg tracking-tight">
                      {player.avatar}
                    </span>
                  </div>
                  <div
                    className={`absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full border-2 border-slate-800 flex items-center justify-center shadow-lg transition-all duration-300 ${
                      player.status === "confirmed"
                        ? "bg-emerald-500 shadow-emerald-500/30"
                        : player.status === "probable"
                          ? "bg-yellow-500 shadow-yellow-500/30"
                          : "bg-orange-500 shadow-orange-500/30"
                    }`}
                  >
                    {player.status === "confirmed" ? (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : player.status === "probable" ? (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-bold text-lg truncate mb-1.5">
                    {player.name}
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-slate-300 font-semibold text-base">
                      {player.team}
                    </span>
                    <div
                      className={`px-3 py-1.5 bg-gradient-to-r ${getPositionColor(
                        player.position
                      )} border rounded-full text-sm font-bold shadow-sm`}
                    >
                      {player.position}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-slate-400 text-base text-right font-medium">
                {player.matchup}
              </div>
            </div>

            {/* Enhanced Swipeable Stat Prediction Section */}
            <div className="relative z-10 mb-6">
              <div
                className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-5 border border-slate-700/40 cursor-pointer touch-pan-y shadow-inner hover:border-slate-600/50 transition-all duration-300"
                onTouchStart={(e) => handleTouchStart(e, player.id)}
                onTouchEnd={(e) => handleTouchEnd(e, player.id, player.stats)}
              >
                {/* Redesigned Stat Navigation */}
                <div className="flex items-center justify-between mb-5">
                  <button
                    onClick={() => prevStat(player.id, player.stats)}
                    className="group w-10 h-10 bg-gradient-to-r from-slate-700/60 to-slate-600/60 hover:from-[#00CED1]/30 hover:to-[#00CED1]/20 rounded-full flex items-center justify-center transition-all duration-400 hover:scale-110 shadow-lg backdrop-blur-sm border border-slate-600/40 hover:border-[#00CED1]/50"
                  >
                    <svg
                      className="w-5 h-5 text-slate-300 group-hover:text-[#00CED1] transition-colors duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <div className="flex items-center space-x-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#00CED1]/20 to-[#FFAB91]/20 rounded-2xl flex items-center justify-center shadow-xl border border-[#00CED1]/30 backdrop-blur-sm">
                      <span className="text-2xl filter drop-shadow-sm">
                        {currentStat.icon}
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="text-white/90 font-semibold text-base mb-2 tracking-wide uppercase">
                        {currentStat.type}
                      </div>
                      <div className="text-[#00CED1] font-bold text-3xl tracking-tight drop-shadow-sm">
                        {currentStat.line}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => nextStat(player.id, player.stats)}
                    className="group w-10 h-10 bg-gradient-to-r from-slate-700/60 to-slate-600/60 hover:from-[#00CED1]/30 hover:to-[#00CED1]/20 rounded-full flex items-center justify-center transition-all duration-400 hover:scale-110 shadow-lg backdrop-blur-sm border border-slate-600/40 hover:border-[#00CED1]/50"
                  >
                    <svg
                      className="w-5 h-5 text-slate-300 group-hover:text-[#00CED1] transition-colors duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>

                {/* Redesigned Stat Indicator Dots */}
                <div className="flex justify-center space-x-2 mb-5">
                  {player.stats.map((_, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        setCurrentStatIndex((prev) => ({
                          ...prev,
                          [player.id]: index,
                        }))
                      }
                      className={`relative transition-all duration-400 ${
                        index === currentIndex
                          ? "w-8 h-3 bg-[#00CED1] rounded-full shadow-lg shadow-[#00CED1]/50"
                          : "w-3 h-3 bg-slate-500/60 hover:bg-slate-400/80 rounded-full hover:scale-125"
                      }`}
                    >
                      {index === currentIndex && (
                        <div className="absolute inset-0 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full animate-pulse"></div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Completely Redesigned Higher/Lower Buttons */}
                <div className="flex space-x-4">
                  <button className="group/higher flex-1 relative overflow-hidden bg-gradient-to-br from-emerald-500/15 via-emerald-500/10 to-emerald-600/5 border border-emerald-400/30 rounded-2xl p-5 hover:from-emerald-500/25 hover:via-emerald-500/20 hover:to-emerald-600/15 hover:border-emerald-400/50 transition-all duration-400 hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/20">
                    {/* Background Animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/5 to-transparent opacity-0 group-hover/higher:opacity-100 transition-opacity duration-500 animate-pulse"></div>

                    {/* Arrow Icon */}
                    <div className="relative z-10 flex flex-col items-center space-y-3">
                      <div className="w-10 h-10 bg-gradient-to-t from-emerald-500/20 to-emerald-400/30 rounded-xl flex items-center justify-center group-hover/higher:scale-110 transition-transform duration-300 shadow-inner">
                        <svg
                          className="w-6 h-6 text-emerald-400 group-hover/higher:text-emerald-300 transition-colors duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                          />
                        </svg>
                      </div>
                      <span className="text-emerald-400 group-hover/higher:text-emerald-300 font-bold text-base tracking-widest transition-colors duration-300">
                        HIGHER
                      </span>
                    </div>
                  </button>

                  <button className="group/lower flex-1 relative overflow-hidden bg-gradient-to-br from-red-500/15 via-red-500/10 to-red-600/5 border border-red-400/30 rounded-2xl p-5 hover:from-red-500/25 hover:via-red-500/20 hover:to-red-600/15 hover:border-red-400/50 transition-all duration-400 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/20">
                    {/* Background Animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400/5 to-transparent opacity-0 group-hover/lower:opacity-100 transition-opacity duration-500 animate-pulse"></div>

                    {/* Arrow Icon */}
                    <div className="relative z-10 flex flex-col items-center space-y-3">
                      <div className="w-10 h-10 bg-gradient-to-b from-red-500/20 to-red-400/30 rounded-xl flex items-center justify-center group-hover/lower:scale-110 transition-transform duration-300 shadow-inner">
                        <svg
                          className="w-6 h-6 text-red-400 group-hover/lower:text-red-300 transition-colors duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          />
                        </svg>
                      </div>
                      <span className="text-red-400 group-hover/lower:text-red-300 font-bold text-base tracking-widest transition-colors duration-300">
                        LOWER
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Compact Action Button */}
            <div className="relative z-10">
              <button className="w-full bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white font-bold py-3.5 rounded-2xl hover:shadow-xl hover:shadow-[#00CED1]/25 transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2.5 group/action relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover/action:opacity-100 transition-opacity duration-300"></div>
                <svg
                  className="w-5 h-5 relative z-10 group-hover/action:scale-110 transition-transform duration-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-bold tracking-wide relative z-10">
                  Add Player
                </span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
