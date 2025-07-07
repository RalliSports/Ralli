"use client";

import PlayerDashboard from "@/components/gambling/player-dashboard";
import SelectedPlayers from "@/components/gambling/selected-players";
import StakeControls from "@/components/gambling/stake-controls";
import CategoryFilters from "@/components/gambling/category-filters";
import PlayerCards from "@/components/gambling/player-cards";
import CompactPlayerCards from "@/components/gambling/compact-player-cards";
import BetSlip from "@/components/gambling/bet-slip";
import CategoryTabs from "@/components/gambling/category-tabs";
import LiveScoreboard from "@/components/gambling/live-scoreboard";
import TrendingPlayers from "@/components/gambling/trending-players";
import OddsDisplay from "@/components/gambling/odds-display";
import UserProfileDrawer from "@/components/gambling/user-profile-drawer";
import TransactionHistory from "@/components/gambling/transaction-history";
import WalletTopUpModal from "@/components/gambling/wallet-topup-modal";
import LeaderboardComponent from "@/components/gambling/leaderboard-component";
import ReferralBonusPopup from "@/components/gambling/referral-bonus-popup";
import ChatSocialFeed from "@/components/gambling/chat-social-feed";
import GameCreation from "@/components/gambling/game-creation";
import SocialActivityFeed from "@/components/gambling/social-activity-feed-enhanced";
import LivePlayerDashboard from "@/components/gambling/live-player-dashboard";
import DynamicBetProgress from "@/components/gambling/dynamic-bet-progress";

export default function ComponentsShowcase() {
  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 border-b border-gray-700/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-slate-800 border border-slate-700 rounded-full px-6 py-3 mb-8">
              <div className="w-2 h-2 bg-[#00CED1] rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
                Component Showcase
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ralli{" "}
              <span className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] bg-clip-text text-transparent">
                Gambling Components
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Advanced gambling UI components built for modern sports betting
              experiences
            </p>
          </div>
        </div>
      </div>

      {/* Components Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        {/* Dashboard Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-4"></span>
            Player Dashboard
          </h2>
          <PlayerDashboard />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-[#FFAB91] to-[#00CED1] rounded-full mr-4"></span>
              Selected Players
            </h2>
            <SelectedPlayers />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-4"></span>
              Stake Controls
            </h2>
            <StakeControls />
          </div>
        </div>

        {/* Filters and Tabs */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="w-8 h-8 bg-gradient-to-r from-[#FFAB91] to-[#00CED1] rounded-full mr-4"></span>
            Navigation & Filters
          </h2>
          <div className="space-y-8">
            <CategoryFilters />
            <CategoryTabs />
          </div>
        </div>

        {/* Player Cards Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-4"></span>
            Player Cards
          </h2>
          <PlayerCards />
        </div>

        {/* Compact Player Cards Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="w-8 h-8 bg-gradient-to-r from-[#FFAB91] to-[#00CED1] rounded-full mr-4"></span>
            Compact Player Cards
          </h2>
          <div className="mb-4">
            <p className="text-slate-300 text-sm">
              Streamlined player cards with swipeable multiple stats, arrow
              navigation, and compact design
            </p>
          </div>
          <CompactPlayerCards />
        </div>

        {/* Bet Slip and Scoreboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-[#FFAB91] to-[#00CED1] rounded-full mr-4"></span>
              Bet Slip
            </h2>
            <BetSlip />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-4"></span>
              Live Scoreboard
            </h2>
            <LiveScoreboard />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-4"></span>
              Trending Players
            </h2>
            <TrendingPlayers />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-[#FFAB91] to-[#00CED1] rounded-full mr-4"></span>
              Odds Display
            </h2>
            <OddsDisplay />
          </div>
        </div>

        {/* User Experience Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-4"></span>
            User Experience Components
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Transaction History
              </h3>
              <TransactionHistory />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Leaderboard
              </h3>
              <LeaderboardComponent />
            </div>
          </div>
        </div>

        {/* Modals & Drawers Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="w-8 h-8 bg-gradient-to-r from-[#FFAB91] to-[#00CED1] rounded-full mr-4"></span>
            Modals & Drawers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                User Profile Drawer
              </h3>
              <UserProfileDrawer />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Wallet Top-Up Modal
              </h3>
              <WalletTopUpModal />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Referral Program
              </h3>
              <ReferralBonusPopup type="referral" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Bonus Offers
              </h3>
              <ReferralBonusPopup type="bonus" />
            </div>
          </div>
        </div>

        {/* Social & Community Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="w-8 h-8 bg-gradient-to-r from-[#FFAB91] to-[#00CED1] rounded-full mr-4"></span>
            Social & Community
          </h2>
          <ChatSocialFeed />
        </div>

        {/* Game Creation Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-4"></span>
            Multiplayer Contest Creation
          </h2>
          <div className="mb-4">
            <p className="text-slate-300 text-sm">
              Create parlay battles where players compete to get the most
              correct predictions across multiple bet legs
            </p>
          </div>
          <GameCreation />
        </div>

        {/* Social Activity Feed Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="w-8 h-8 bg-gradient-to-r from-[#FFAB91] to-[#00CED1] rounded-full mr-4"></span>
            Social Activity Feed
          </h2>
          <div className="mb-4">
            <p className="text-slate-300 text-sm">
              Stay connected with friends, discover hot lobbies, celebrate big
              wins, and follow the community action
            </p>
          </div>
          <SocialActivityFeed />
        </div>

        {/* Live Player Dashboard Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-purple-500 rounded-full mr-4"></span>
            Live Player Dashboard
          </h2>
          <div className="mb-4">
            <p className="text-slate-300 text-sm">
              Real-time tracking of your active bets, live game updates,
              enhanced player stats with current streak and global rankings
            </p>
          </div>
          <LivePlayerDashboard />
        </div>

        {/* Dynamic Bet Progress Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-4"></span>
            Dynamic Bet Progress
          </h2>
          <div className="mb-4">
            <p className="text-slate-300 text-sm">
              Real-time multi-level progress bars showing individual pick
              performance with opposing directional indicators and target
              visualization
            </p>
          </div>
          <DynamicBetProgress />
        </div>
      </div>
    </div>
  );
}
