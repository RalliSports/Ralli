"use client";
import { Card } from "@/components/ui/card";
import { Activity, CircleX, Check, Hourglass } from "lucide-react";
import React from "react";

interface Bet {
  status: "WON" | "LOST" | "PENDING";
  matchup: string;
  selection: string;
  type: string;
  date: string;
  stake: number;
  odds: number;
  payout: number;
  profit: number;
  icon?: React.ReactNode;
}

const BetHistoryCard: React.FC<{ bet: Bet }> = ({ bet }) => {
  const isWon = bet.status === "WON";
  const isLost = bet.status === "LOST";
  const isPending = bet.status === "PENDING";

  return (
    <Card className="bg-slate-800 border-slate-700 p-6 relative rounded-2xl">
      {/* Status indicator dot */}
      <div
        className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
          isWon ? "bg-green-500" : isLost ? "bg-red-500" : "bg-yellow-500"
        }`}
      />

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-slate-700 rounded-2xl flex items-center justify-center">
          {bet.icon || <Activity className="text-2xl" />}
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold text-lg">{bet.matchup}</h3>
          <p className="text-slate-400 text-sm">{bet.selection}</p>
        </div>
      </div>

      {/* Bet type and date */}
      <div className="flex items-center gap-4 mb-6">
        <span className="bg-[#00CED1]/40 text-white px-3 py-1 rounded-xl text-sm font-medium">
          {bet.type}
        </span>
        <span className="text-slate-400 text-sm">{bet.date}</span>
      </div>

      {/* Stats row */}
      <div className="bg-slate-700/50 rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-slate-400 text-sm mb-1">STAKE</p>
            <p className="text-white font-semibold text-xl">${bet.stake}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm mb-1">ODDS</p>
            <p className="text-white font-semibold text-xl">{bet.odds}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm mb-1">PAYOUT</p>
            <p className="text-green-400 font-semibold text-xl">${bet.payout}</p>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="flex items-center justify-between">
        <div
          className={`px-4 py-2 rounded-2xl flex items-center gap-2 ${
            isWon
              ? "bg-green-900/50 border border-green-700"
              : isLost
              ? "bg-red-900/50 border border-red-700"
              : "bg-yellow-900/50 border border-yellow-700"
          }`}
        >
          {isWon && <Check size={16} className="text-green-400" />}
          {isLost && <CircleX size={16} className="text-red-400" />}
          {isPending && <Hourglass size={16} className="text-yellow-400" />}
          <span
            className={`font-medium text-sm ${
              isWon
                ? "text-green-400"
                : isLost
                ? "text-red-400"
                : "text-yellow-400"
            }`}
          >
            {bet.status}
          </span>
        </div>

        {(isWon || isLost) && (
          <div className="text-right bg-slate-700/30 px-4 py-2 rounded-2xl">
            <p className="text-slate-400 text-sm">PROFIT</p>
            <p
              className={`font-semibold text-lg ${
                isWon ? "text-green-400" : "text-red-400"
              }`}
            >
              {isWon ? "+" : "-"}${bet.profit}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default BetHistoryCard;