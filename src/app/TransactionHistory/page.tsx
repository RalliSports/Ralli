"use client";

import TransactionHistory from "@/components/TransactionHistory/TransactionHistory";
import { ReactNode } from "react";
import { Activity } from "lucide-react";
import { FaFootballBall, FaBasketballBall } from "react-icons/fa";

interface Bet {
  id: string;
  status: "WON" | "LOST" | "PENDING";
  matchup: string;
  selection: string;
  type: string;
  date: string;
  stake: number;
  odds: number;
  payout: number;
  profit: number;
  icon?: ReactNode;
}

// Random dev-only sample data
const sampleBets: Bet[] = [
  {
    id: "1",
    status: "WON",
    matchup: "Chiefs vs Bills",
    selection: "Chiefs -3.5",
    type: "SINGLE",
    date: "08/20/2024 14:30",
    stake: 100,
    odds: -110,
    payout: 190.91,
    profit: 90.91,
    icon: <FaFootballBall className="w-5 h-5 text-orange-400" />
  },
  {
    id: "2",
    status: "LOST",
    matchup: "Lakers vs Warriors",
    selection: "Lakers ML",
    type: "SINGLE",
    date: "08/18/2024 19:00",
    stake: 75,
    odds: -105,
    payout: 0,
    profit: -75,
    icon: <FaBasketballBall className="w-5 h-5 text-yellow-400" />
  },
  {
    id: "3",
    status: "PENDING",
    matchup: "Cowboys vs Giants",
    selection: "Over 47.5",
    type: "PARLAY",
    date: "08/25/2024 20:15",
    stake: 60,
    odds: 250,
    payout: 210,
    profit: 0,
    icon: <Activity className="w-5 h-5 text-slate-400" />
  },
];

export default function Page() {
  return (
    <main className="max-w-4xl mx-auto mt-36">
      <TransactionHistory bets={sampleBets} />
    </main>
  );
}
