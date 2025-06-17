import { AppHero } from '@/components/app-hero'

const featuredBets = [
  { sport: 'NFL', match: 'Chiefs vs Bills', odds: '2.1x', category: '🏈 FOOTBALL' },
  { sport: 'NBA', match: 'Lakers vs Warriors', odds: '1.8x', category: '🏀 BASKETBALL' },
  { sport: 'Premier League', match: 'Arsenal vs Chelsea', odds: '2.5x', category: '⚽ SOCCER' },
  { sport: 'Tennis', match: 'Djokovic vs Nadal', odds: '1.9x', category: '🎾 TENNIS' },
  { sport: 'UFC', match: 'Main Event Tonight', odds: '3.2x', category: '🥊 MMA' },
]

export function DashboardFeature() {
  return (
    <div>
      
      <div className="max-w-6xl mx-auto py-12 px-6 lg:px-8 mt-30">

        {/* Live Betting Heat */}
        <div className="mb-16 text-center">
          <h2 className="text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-teal-500 to-orange-300 animate-pulse">
            🔥 LIVE BETTING HEAT 🔥
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            Real-time odds that move faster than the speed of thought
          </p>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredBets.map((bet, index) => (
              <div
                key={index}
                className="group relative overflow-hidden p-8 bg-gradient-to-br from-stone-100 via-orange-50 to-teal-50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500 hover:shadow-teal-500/30 border border-teal-200/40 dark:border-teal-700/40"
              >
                {/* Animated glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-200/20 via-teal-200/20 to-stone-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 bg-orange-200/40 dark:bg-orange-300/20 px-3 py-1 rounded-full border border-orange-300/50">
                      {bet.category}
                    </span>
                    <div className="text-right">
                      <div className="text-3xl font-black text-teal-600 dark:text-teal-400 animate-bounce">
                        {bet.odds}
                      </div>
                      <div className="text-xs text-teal-500 dark:text-teal-300">ODDS</div>
                    </div>
                  </div>
                  
                  <h3 className="font-black text-2xl text-slate-800 dark:text-stone-100 mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {bet.match}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-stone-300 mb-6 font-medium">
                    {bet.sport}
                  </p>
                  
                  <button className="w-full bg-gradient-to-r from-orange-300 via-teal-400 to-stone-200 hover:from-orange-400 hover:via-teal-500 hover:to-stone-300 text-slate-800 py-4 px-6 rounded-xl transition-all duration-300 font-black text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    🚀 BET NOW
                  </button>
                </div>
                
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-orange-300/60 to-transparent opacity-50"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Epic Stats Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-stone-100 via-teal-50 to-orange-50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 rounded-3xl p-12 text-slate-800 dark:text-stone-100 text-center shadow-2xl border border-teal-200/40 dark:border-teal-700/40">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-300 via-teal-400 to-stone-200 animate-pulse"></div>
            <div className="absolute inset-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 40 40"
                className="w-full h-full opacity-10 animate-pulse"
              >
                <g fill="currentColor" fillOpacity="0.1">
                  <path d="M20 20c0 11.046-8.954 20-20 20s-20-8.954-20-20 8.954-20 20-20 20 8.954 20 20z" />
                </g>
              </svg>
            </div>
          </div>
          
          <div className="relative z-10">
            <h3 className="text-4xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-teal-500 to-orange-300">
              ⚡ PLATFORM DOMINATION ⚡
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="group transform hover:scale-110 transition-all duration-300">
                <div className="text-6xl font-black text-orange-500 dark:text-orange-400 mb-2 group-hover:animate-bounce">
                  $2.4M
                </div>
                <div className="text-xl font-bold text-orange-600 dark:text-orange-300 mb-1">TOTAL VOLUME</div>
                <div className="text-sm text-slate-600 dark:text-stone-300">💰 Crushing records daily</div>
              </div>
              
              <div className="group transform hover:scale-110 transition-all duration-300">
                <div className="text-6xl font-black text-teal-600 dark:text-teal-400 mb-2 group-hover:animate-bounce">
                  8,432
                </div>
                <div className="text-xl font-bold text-teal-700 dark:text-teal-300 mb-1">ACTIVE DEGENERATES</div>
                <div className="text-sm text-slate-600 dark:text-stone-300">🎮 Living their best life</div>
              </div>
              
              <div className="group transform hover:scale-110 transition-all duration-300">
                <div className="text-6xl font-black text-orange-600 dark:text-orange-400 mb-2 group-hover:animate-bounce">
                  156
                </div>
                <div className="text-xl font-bold text-orange-700 dark:text-orange-300 mb-1">LIVE EVENTS</div>
                <div className="text-sm text-slate-600 dark:text-stone-300">🔥 Non-stop action</div>
              </div>
            </div>
            
            <div className="mt-12">
              <button className="bg-gradient-to-r from-orange-300 via-teal-400 to-stone-200 hover:from-orange-400 hover:via-teal-500 hover:to-stone-300 text-slate-800 font-black text-2xl py-6 px-16 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-teal-500/40 transform hover:scale-105 hover:-translate-y-2">
                🎯 START WINNING NOW 🎯
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}