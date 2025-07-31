"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

interface Athlete {
  id: string;
  name: string;
  team: string;
  position: string;
  sport: string;
  matchup: string;
  gameTime: string;
  avatar: string;
  stats: Array<{
    type: string;
    line: number;
    over: string;
    under: string;
  }>;
  trending: "up" | "down" | "hot" | "stable";
  confidence: number;
}

interface SelectedPick {
  id: string;
  athleteId: string;
  athleteName: string;
  athleteAvatar: string;
  propName: string;
  propValue: number;
  betType: "over" | "under";
  odds: string;
  sport: string;
}

function PicksContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedPicks, setSelectedPicks] = useState<SelectedPick[]>([]);
  const [selectedSport, setSelectedSport] = useState("all");
  const [bookmarkedAthletes, setBookmarkedAthletes] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Progressive loading with smooth infinite scroll
  const [displayedAthletes, setDisplayedAthletes] = useState<Athlete[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const athletesPerBatch = 8; // Show 8 at a time for nice progressive loading

  // Get game parameters from URL
  const gameId = searchParams.get("gameId") || "1";
  const legsRequired = parseInt(searchParams.get("legs") || "4");
  const buyIn = parseInt(searchParams.get("buyIn") || "25");
  const gameName = decodeURIComponent(searchParams.get("gameName") || "Game");

  // Fix hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load initial athletes when component mounts or sport changes
  useEffect(() => {
    if (mounted) {
      loadInitialAthletes();
    }
  }, [mounted, selectedSport]);

  // Smooth infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (isLoadingMore || !hasMore) return;

      const scrollPosition =
        window.innerHeight + document.documentElement.scrollTop;
      const documentHeight = document.documentElement.offsetHeight;

      // Trigger when user scrolls to 90% of the page
      if (scrollPosition >= documentHeight * 0.9) {
        loadMoreAthletes();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, isLoadingMore]);

  const getFilteredAthletes = () => {
    return selectedSport === "all"
      ? allAthletes
      : allAthletes.filter((athlete) => athlete.sport === selectedSport);
  };

  const loadInitialAthletes = () => {
    setIsLoading(true);
    setDisplayedAthletes([]);

    // Show initial loading
    setTimeout(() => {
      const filtered = getFilteredAthletes();
      const initial = filtered.slice(0, athletesPerBatch);
      setDisplayedAthletes(initial);
      setHasMore(initial.length < filtered.length);
      setIsLoading(false);
      console.log(
        `Initial load: showing ${initial.length} of ${filtered.length} athletes for ${selectedSport}`
      );
    }, 600); // Slightly longer initial load for effect
  };

  const loadMoreAthletes = () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);

    // Progressive loading with nice animation
    setTimeout(() => {
      const filtered = getFilteredAthletes();
      const currentLength = displayedAthletes.length;
      const nextBatch = filtered.slice(
        currentLength,
        currentLength + athletesPerBatch
      );

      if (nextBatch.length > 0) {
        setDisplayedAthletes((prev) => [...prev, ...nextBatch]);
        const newTotal = currentLength + nextBatch.length;
        setHasMore(newTotal < filtered.length);
        console.log(
          `Loaded more: ${nextBatch.length} athletes (${newTotal}/${filtered.length} total)`
        );
      } else {
        setHasMore(false);
      }

      setIsLoadingMore(false);
    }, 800); // Nice loading delay for smooth effect
  };

  // Mock athlete data matching main page structure
  const allAthletes: Athlete[] = [
    {
      id: "lebron-james",
      name: "LeBron James",
      team: "LAL",
      position: "SF",
      sport: "NBA",
      matchup: "vs GSW",
      gameTime: "Tonight 8:00 PM",
      avatar: "LJ",
      stats: [
        { type: "Points", line: 28.5, over: "+110", under: "-130" },
        { type: "Rebounds", line: 7.5, over: "-110", under: "-110" },
        { type: "Assists", line: 6.5, over: "+105", under: "-125" },
      ],
      trending: "up" as const,
      confidence: 85,
    },
    {
      id: "steph-curry",
      name: "Stephen Curry",
      team: "GSW",
      position: "PG",
      sport: "NBA",
      matchup: "@ LAL",
      gameTime: "Tonight 8:00 PM",
      avatar: "SC",
      stats: [
        { type: "Points", line: 31.5, over: "-115", under: "-105" },
        { type: "3-Pointers", line: 4.5, over: "+120", under: "-140" },
        { type: "Assists", line: 5.5, over: "-110", under: "-110" },
      ],
      trending: "hot" as const,
      confidence: 92,
    },
    {
      id: "josh-allen",
      name: "Josh Allen",
      team: "BUF",
      position: "QB",
      sport: "NFL",
      matchup: "vs KC",
      gameTime: "Sunday 1:00 PM",
      avatar: "JA",
      stats: [
        { type: "Passing Yards", line: 285.5, over: "-110", under: "-110" },
        { type: "Rushing Yards", line: 45.5, over: "+105", under: "-125" },
        { type: "Total TDs", line: 2.5, over: "+115", under: "-135" },
      ],
      trending: "stable" as const,
      confidence: 78,
    },
    {
      id: "patrick-mahomes",
      name: "Patrick Mahomes",
      team: "KC",
      position: "QB",
      sport: "NFL",
      matchup: "@ BUF",
      gameTime: "Sunday 1:00 PM",
      avatar: "PM",
      stats: [
        { type: "Passing Yards", line: 295.5, over: "-105", under: "-115" },
        { type: "Passing TDs", line: 2.5, over: "+110", under: "-130" },
        { type: "Completions", line: 24.5, over: "-110", under: "-110" },
      ],
      trending: "hot" as const,
      confidence: 89,
    },
    {
      id: "travis-kelce",
      name: "Travis Kelce",
      team: "KC",
      position: "TE",
      sport: "NFL",
      matchup: "@ BUF",
      gameTime: "Sunday 1:00 PM",
      avatar: "TK",
      stats: [
        { type: "Receiving Yards", line: 85.5, over: "-110", under: "-110" },
        { type: "Receptions", line: 6.5, over: "+105", under: "-125" },
        { type: "Receiving TDs", line: 0.5, over: "+150", under: "-180" },
      ],
      trending: "up" as const,
      confidence: 74,
    },
    {
      id: "messi",
      name: "Lionel Messi",
      team: "MIA",
      position: "FW",
      sport: "Soccer",
      matchup: "vs NYC",
      gameTime: "Saturday 7:30 PM",
      avatar: "LM",
      stats: [
        { type: "Goals", line: 0.5, over: "+120", under: "-140" },
        { type: "Assists", line: 0.5, over: "+105", under: "-125" },
        { type: "Shots on Target", line: 2.5, over: "-110", under: "-110" },
      ],
      trending: "hot" as const,
      confidence: 88,
    },
    // NEW ATHLETES (10 more)
    {
      id: "jayson-tatum",
      name: "Jayson Tatum",
      team: "BOS",
      position: "SF",
      sport: "NBA",
      matchup: "vs MIA",
      gameTime: "Tonight 7:30 PM",
      avatar: "JT",
      stats: [
        { type: "Points", line: 27.5, over: "+105", under: "-125" },
        { type: "Rebounds", line: 8.5, over: "-110", under: "-110" },
        { type: "3-Pointers", line: 3.5, over: "+115", under: "-135" },
      ],
      trending: "up" as const,
      confidence: 82,
    },
    {
      id: "luka-doncic",
      name: "Luka Dončić",
      team: "DAL",
      position: "PG",
      sport: "NBA",
      matchup: "@ PHX",
      gameTime: "Tonight 9:00 PM",
      avatar: "LD",
      stats: [
        { type: "Points", line: 32.5, over: "-105", under: "-115" },
        { type: "Assists", line: 8.5, over: "+100", under: "-120" },
        { type: "Rebounds", line: 9.5, over: "+110", under: "-130" },
      ],
      trending: "hot" as const,
      confidence: 91,
    },
    {
      id: "giannis-antetokounmpo",
      name: "Giannis Antetokounmpo",
      team: "MIL",
      position: "PF",
      sport: "NBA",
      matchup: "vs CHI",
      gameTime: "Tonight 8:30 PM",
      avatar: "GA",
      stats: [
        { type: "Points", line: 29.5, over: "-110", under: "-110" },
        { type: "Rebounds", line: 11.5, over: "+105", under: "-125" },
        { type: "Assists", line: 5.5, over: "+115", under: "-135" },
      ],
      trending: "up" as const,
      confidence: 87,
    },
    {
      id: "lamar-jackson-nfl",
      name: "Lamar Jackson",
      team: "BAL",
      position: "QB",
      sport: "NFL",
      matchup: "vs CIN",
      gameTime: "Sunday 4:25 PM",
      avatar: "LJ2",
      stats: [
        { type: "Passing Yards", line: 245.5, over: "+100", under: "-120" },
        { type: "Rushing Yards", line: 65.5, over: "+110", under: "-130" },
        { type: "Total TDs", line: 2.5, over: "+120", under: "-140" },
      ],
      trending: "hot" as const,
      confidence: 84,
    },
    {
      id: "tyreek-hill",
      name: "Tyreek Hill",
      team: "MIA",
      position: "WR",
      sport: "NFL",
      matchup: "@ BUF",
      gameTime: "Sunday 1:00 PM",
      avatar: "TH",
      stats: [
        { type: "Receiving Yards", line: 95.5, over: "-105", under: "-115" },
        { type: "Receptions", line: 7.5, over: "+110", under: "-130" },
        { type: "Receiving TDs", line: 0.5, over: "+140", under: "-160" },
      ],
      trending: "up" as const,
      confidence: 79,
    },
    {
      id: "cooper-kupp",
      name: "Cooper Kupp",
      team: "LAR",
      position: "WR",
      sport: "NFL",
      matchup: "vs SF",
      gameTime: "Sunday 4:05 PM",
      avatar: "CK",
      stats: [
        { type: "Receiving Yards", line: 88.5, over: "-110", under: "-110" },
        { type: "Receptions", line: 8.5, over: "+105", under: "-125" },
        { type: "Receiving TDs", line: 0.5, over: "+130", under: "-150" },
      ],
      trending: "stable" as const,
      confidence: 76,
    },
    {
      id: "derrick-henry",
      name: "Derrick Henry",
      team: "TEN",
      position: "RB",
      sport: "NFL",
      matchup: "vs HOU",
      gameTime: "Sunday 1:00 PM",
      avatar: "DH",
      stats: [
        { type: "Rushing Yards", line: 95.5, over: "+100", under: "-120" },
        { type: "Rushing TDs", line: 0.5, over: "+125", under: "-145" },
        { type: "Receptions", line: 1.5, over: "+140", under: "-160" },
      ],
      trending: "up" as const,
      confidence: 81,
    },
    {
      id: "cristiano-ronaldo",
      name: "Cristiano Ronaldo",
      team: "SAU",
      position: "FW",
      sport: "Soccer",
      matchup: "vs QAT",
      gameTime: "Saturday 3:00 PM",
      avatar: "CR",
      stats: [
        { type: "Goals", line: 0.5, over: "+110", under: "-130" },
        { type: "Shots on Target", line: 2.5, over: "+105", under: "-125" },
        { type: "Assists", line: 0.5, over: "+150", under: "-170" },
      ],
      trending: "hot" as const,
      confidence: 85,
    },
    {
      id: "kylian-mbappe",
      name: "Kylian Mbappé",
      team: "PSG",
      position: "FW",
      sport: "Soccer",
      matchup: "vs LYO",
      gameTime: "Saturday 2:00 PM",
      avatar: "KM",
      stats: [
        { type: "Goals", line: 0.5, over: "+100", under: "-120" },
        { type: "Assists", line: 0.5, over: "+130", under: "-150" },
        { type: "Shots", line: 3.5, over: "-110", under: "-110" },
      ],
      trending: "hot" as const,
      confidence: 89,
    },
    {
      id: "erling-haaland",
      name: "Erling Haaland",
      team: "MCI",
      position: "FW",
      sport: "Soccer",
      matchup: "vs ARS",
      gameTime: "Sunday 11:30 AM",
      avatar: "EH",
      stats: [
        { type: "Goals", line: 0.5, over: "+95", under: "-115" },
        { type: "Shots on Target", line: 2.5, over: "+100", under: "-120" },
        { type: "Assists", line: 0.5, over: "+180", under: "-200" },
      ],
      trending: "hot" as const,
      confidence: 90,
    },
    // Additional NBA Players (7 more to reach 10 total)
    {
      id: "kevin-durant",
      name: "Kevin Durant",
      team: "PHX",
      position: "SF",
      sport: "NBA",
      matchup: "vs DAL",
      gameTime: "Tonight 9:00 PM",
      avatar: "KD",
      stats: [
        { type: "Points", line: 26.5, over: "-110", under: "-110" },
        { type: "Rebounds", line: 6.5, over: "+110", under: "-130" },
        { type: "Assists", line: 5.5, over: "+105", under: "-125" },
      ],
      trending: "up" as const,
      confidence: 86,
    },
    {
      id: "nikola-jokic",
      name: "Nikola Jokić",
      team: "DEN",
      position: "C",
      sport: "NBA",
      matchup: "vs LAC",
      gameTime: "Tonight 10:30 PM",
      avatar: "NJ",
      stats: [
        { type: "Points", line: 24.5, over: "-105", under: "-115" },
        { type: "Rebounds", line: 12.5, over: "+100", under: "-120" },
        { type: "Assists", line: 9.5, over: "-110", under: "-110" },
      ],
      trending: "hot" as const,
      confidence: 93,
    },
    {
      id: "damian-lillard",
      name: "Damian Lillard",
      team: "MIL",
      position: "PG",
      sport: "NBA",
      matchup: "vs CHI",
      gameTime: "Tonight 8:30 PM",
      avatar: "DL",
      stats: [
        { type: "Points", line: 25.5, over: "+105", under: "-125" },
        { type: "3-Pointers", line: 3.5, over: "+115", under: "-135" },
        { type: "Assists", line: 7.5, over: "+100", under: "-120" },
      ],
      trending: "stable" as const,
      confidence: 80,
    },
    {
      id: "anthony-davis",
      name: "Anthony Davis",
      team: "LAL",
      position: "PF",
      sport: "NBA",
      matchup: "vs GSW",
      gameTime: "Tonight 8:00 PM",
      avatar: "AD",
      stats: [
        { type: "Points", line: 23.5, over: "-110", under: "-110" },
        { type: "Rebounds", line: 10.5, over: "+105", under: "-125" },
        { type: "Blocks", line: 2.5, over: "+120", under: "-140" },
      ],
      trending: "up" as const,
      confidence: 83,
    },
    {
      id: "kawhi-leonard",
      name: "Kawhi Leonard",
      team: "LAC",
      position: "SF",
      sport: "NBA",
      matchup: "@ DEN",
      gameTime: "Tonight 10:30 PM",
      avatar: "KL",
      stats: [
        { type: "Points", line: 22.5, over: "+100", under: "-120" },
        { type: "Rebounds", line: 6.5, over: "+110", under: "-130" },
        { type: "Assists", line: 4.5, over: "+115", under: "-135" },
      ],
      trending: "stable" as const,
      confidence: 77,
    },
    {
      id: "jimmy-butler",
      name: "Jimmy Butler",
      team: "MIA",
      position: "SF",
      sport: "NBA",
      matchup: "@ BOS",
      gameTime: "Tonight 7:30 PM",
      avatar: "JB",
      stats: [
        { type: "Points", line: 21.5, over: "+105", under: "-125" },
        { type: "Rebounds", line: 5.5, over: "+115", under: "-135" },
        { type: "Assists", line: 6.5, over: "+100", under: "-120" },
      ],
      trending: "up" as const,
      confidence: 81,
    },
    {
      id: "paolo-banchero",
      name: "Paolo Banchero",
      team: "ORL",
      position: "PF",
      sport: "NBA",
      matchup: "vs ATL",
      gameTime: "Tonight 7:00 PM",
      avatar: "PB",
      stats: [
        { type: "Points", line: 20.5, over: "+110", under: "-130" },
        { type: "Rebounds", line: 7.5, over: "+105", under: "-125" },
        { type: "Assists", line: 4.5, over: "+120", under: "-140" },
      ],
      trending: "hot" as const,
      confidence: 78,
    },
    // Additional NFL Players (3 more to reach 10 total)
    {
      id: "dak-prescott",
      name: "Dak Prescott",
      team: "DAL",
      position: "QB",
      sport: "NFL",
      matchup: "vs NYG",
      gameTime: "Sunday 4:25 PM",
      avatar: "DP",
      stats: [
        { type: "Passing Yards", line: 275.5, over: "-105", under: "-115" },
        { type: "Passing TDs", line: 2.5, over: "+115", under: "-135" },
        { type: "Completions", line: 23.5, over: "-110", under: "-110" },
      ],
      trending: "stable" as const,
      confidence: 75,
    },
    {
      id: "saquon-barkley",
      name: "Saquon Barkley",
      team: "PHI",
      position: "RB",
      sport: "NFL",
      matchup: "vs WAS",
      gameTime: "Sunday 1:00 PM",
      avatar: "SB",
      stats: [
        { type: "Rushing Yards", line: 85.5, over: "+105", under: "-125" },
        { type: "Rushing TDs", line: 0.5, over: "+130", under: "-150" },
        { type: "Receptions", line: 3.5, over: "+115", under: "-135" },
      ],
      trending: "up" as const,
      confidence: 82,
    },
    {
      id: "davante-adams",
      name: "Davante Adams",
      team: "NYJ",
      position: "WR",
      sport: "NFL",
      matchup: "vs NE",
      gameTime: "Sunday 1:00 PM",
      avatar: "DA",
      stats: [
        { type: "Receiving Yards", line: 78.5, over: "-110", under: "-110" },
        { type: "Receptions", line: 6.5, over: "+110", under: "-130" },
        { type: "Receiving TDs", line: 0.5, over: "+140", under: "-160" },
      ],
      trending: "stable" as const,
      confidence: 79,
    },
    // Additional Soccer Players (4 more to reach 10 total)
    {
      id: "neymar-jr",
      name: "Neymar Jr.",
      team: "AL-HILAL",
      position: "FW",
      sport: "Soccer",
      matchup: "vs AL-NASSR",
      gameTime: "Friday 2:00 PM",
      avatar: "NJ2",
      stats: [
        { type: "Goals", line: 0.5, over: "+105", under: "-125" },
        { type: "Assists", line: 0.5, over: "+140", under: "-160" },
        { type: "Dribbles", line: 4.5, over: "+100", under: "-120" },
      ],
      trending: "up" as const,
      confidence: 84,
    },
    {
      id: "kevin-de-bruyne",
      name: "Kevin De Bruyne",
      team: "MCI",
      position: "MF",
      sport: "Soccer",
      matchup: "vs ARS",
      gameTime: "Sunday 11:30 AM",
      avatar: "KDB",
      stats: [
        { type: "Assists", line: 0.5, over: "+110", under: "-130" },
        { type: "Passes", line: 65.5, over: "-105", under: "-115" },
        { type: "Shots on Target", line: 1.5, over: "+120", under: "-140" },
      ],
      trending: "hot" as const,
      confidence: 87,
    },
    {
      id: "mohamed-salah",
      name: "Mohamed Salah",
      team: "LIV",
      position: "FW",
      sport: "Soccer",
      matchup: "vs CHE",
      gameTime: "Sunday 9:00 AM",
      avatar: "MS",
      stats: [
        { type: "Goals", line: 0.5, over: "+115", under: "-135" },
        { type: "Shots", line: 3.5, over: "-110", under: "-110" },
        { type: "Assists", line: 0.5, over: "+150", under: "-170" },
      ],
      trending: "hot" as const,
      confidence: 86,
    },
    {
      id: "vinicius-jr",
      name: "Vinícius Jr.",
      team: "RMA",
      position: "FW",
      sport: "Soccer",
      matchup: "vs BAR",
      gameTime: "Saturday 3:00 PM",
      avatar: "VJ",
      stats: [
        { type: "Goals", line: 0.5, over: "+120", under: "-140" },
        { type: "Dribbles", line: 5.5, over: "+105", under: "-125" },
        { type: "Shots on Target", line: 2.5, over: "+110", under: "-130" },
      ],
      trending: "hot" as const,
      confidence: 85,
    },
  ];

  const toggleBookmark = (athleteId: string) => {
    setBookmarkedAthletes((prev) => {
      if (prev.includes(athleteId)) {
        return prev.filter((id) => id !== athleteId);
      } else if (prev.length < 50) {
        return [...prev, athleteId];
      }
      return prev;
    });
  };

  const handlePickSelection = (
    athleteId: string,
    statIndex: number,
    betType: "over" | "under"
  ) => {
    const athlete = allAthletes.find((a) => a.id === athleteId);
    if (!athlete || selectedPicks.length >= legsRequired) return;

    const stat = athlete.stats[statIndex];
    const pickId = `${athleteId}-${statIndex}-${betType}`;

    // Remove any existing pick for this athlete
    const filteredPicks = selectedPicks.filter(
      (pick) => pick.athleteId !== athleteId
    );

    const newPick: SelectedPick = {
      id: pickId,
      athleteId,
      athleteName: athlete.name,
      athleteAvatar: athlete.avatar,
      propName: stat.type,
      propValue: stat.line,
      betType,
      odds: betType === "over" ? stat.over : stat.under,
      sport: athlete.sport,
    };

    setSelectedPicks([...filteredPicks, newPick]);
  };

  const removePick = (pickId: string) => {
    setSelectedPicks((prev) => prev.filter((pick) => pick.id !== pickId));
  };

  const handleConfirmPicks = () => {
    if (selectedPicks.length !== legsRequired) return;

    // Show payment popup instead of immediately confirming
    setShowPaymentPopup(true);
  };

  const handlePaymentConfirm = () => {
    setIsPaymentProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsPaymentProcessing(false);
      setPaymentSuccess(true);

      // Show success animation then redirect
      setTimeout(() => {
        setIsConfirming(true);
        // Redirect to profile page with parlays tab active
        setTimeout(() => {
          router.push("/profile?tab=parlays");
        }, 1500);
      }, 1500);
    }, 2000);
  };

  const handlePaymentCancel = () => {
    setShowPaymentPopup(false);
    setIsPaymentProcessing(false);
    setPaymentSuccess(false);
  };

  const handleSportChange = (sportId: string) => {
    setSelectedSport(sportId);
    // loadInitialAthletes will be called automatically by the useEffect
  };

  const sportTabs = [
    { id: "all", name: "All", icon: "🏆", count: allAthletes.length },
    {
      id: "NBA",
      name: "NBA",
      icon: "🏀",
      count: allAthletes.filter((a) => a.sport === "NBA").length,
    },
    {
      id: "NFL",
      name: "NFL",
      icon: "🏈",
      count: allAthletes.filter((a) => a.sport === "NFL").length,
    },
    {
      id: "Soccer",
      name: "Soccer",
      icon: "⚽",
      count: allAthletes.filter((a) => a.sport === "Soccer").length,
    },
  ];

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-md border-b border-slate-700/50">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Back Button + Title */}
          <div className="flex items-center space-x-3">
            <Link
              href={`/join-game?id=${gameId}`}
              className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-colors"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-white">
              <span className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] bg-clip-text text-transparent">
                Make Your Picks
              </span>
            </h1>
          </div>

          {/* Right: Progress Info */}
          <div className="text-right">
            <div className="text-[#00CED1] font-bold text-lg">
              {selectedPicks.length}/{legsRequired}
            </div>
            <div className="text-slate-400 text-xs">Selected</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-20">
        {/* Game Info Header */}
        <div className="pt-6 pb-4">
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
            <div className="text-center mb-4">
              <h2 className="text-white font-bold text-xl mb-2">
                Select Your {legsRequired} Picks
              </h2>
              <p className="text-slate-400 text-sm">
                Choose player props to build your ${buyIn} parlay
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-3 text-center">
                <div className="text-slate-400 text-xs">Buy In</div>
                <div className="text-white font-bold text-lg">${buyIn}</div>
              </div>
              <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-3 text-center">
                <div className="text-slate-400 text-xs">Legs</div>
                <div className="text-[#00CED1] font-bold text-lg">
                  {legsRequired}
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-3 text-center">
                <div className="text-slate-400 text-xs">Potential</div>
                <div className="text-emerald-400 font-bold text-lg">
                  ~${Math.round(buyIn * 7.2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sport Filter Tabs */}
        <div className="mb-6">
          <div
            className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {sportTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleSportChange(tab.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  selectedSport === tab.id
                    ? "bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white shadow-lg"
                    : "bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-700/50"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
                <span className="text-xs opacity-75">({tab.count})</span>
              </button>
            ))}
          </div>
          <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </div>

        {/* Athletes Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold text-white flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] rounded-full mr-4 flex items-center justify-center">
                <span className="text-lg">📈</span>
              </span>
              Available Players
            </h3>
            <div className="text-right">
              <div className="text-[#00CED1] font-bold text-lg">
                {isLoading ? "..." : displayedAthletes.length}
                {!isLoading && hasMore && (
                  <span className="text-slate-400 text-sm">+</span>
                )}
              </div>
              <div className="text-slate-400 text-xs">
                {isLoading ? "Loading" : hasMore ? "Showing" : "All loaded"}
              </div>
            </div>
          </div>

          {/* Show athletes only when not loading */}
          {!isLoading &&
            displayedAthletes
              .filter(
                (athlete, index, array) =>
                  array.findIndex((a) => a.id === athlete.id) === index
              )
              .map((athlete) => (
                <AthletePickCard
                  key={athlete.id}
                  athlete={athlete}
                  isBookmarked={bookmarkedAthletes.includes(athlete.id)}
                  onBookmarkToggle={toggleBookmark}
                  onPickSelection={handlePickSelection}
                  selectedPick={selectedPicks.find(
                    (pick) => pick.athleteId === athlete.id
                  )}
                  isSelectionDisabled={
                    selectedPicks.length >= legsRequired &&
                    !selectedPicks.find((pick) => pick.athleteId === athlete.id)
                  }
                />
              ))}

          {/* Loading indicator for initial load */}
          {isLoading && (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00CED1] mx-auto mb-4"></div>
                <div className="text-slate-400 text-sm">
                  Loading athletes...
                </div>
              </div>
            </div>
          )}

          {/* Infinite scroll loading indicator */}
          {isLoadingMore && (
            <div className="flex justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00CED1] mx-auto mb-3"></div>
                <div className="text-slate-400 text-sm">
                  Loading more athletes...
                </div>
              </div>
            </div>
          )}

          {/* Show completion message when all loaded */}
          {!hasMore && !isLoading && displayedAthletes.length > 0 && (
            <div className="text-center py-6">
              <div className="text-slate-400 text-sm">
                🎯 You've seen all {displayedAthletes.length} available players
                for {selectedSport === "all" ? "all sports" : selectedSport}!
              </div>
            </div>
          )}

          {/* No athletes found */}
          {!isLoading && !isLoadingMore && displayedAthletes.length === 0 && (
            <div className="text-center py-12">
              <div className="text-slate-400 text-lg mb-2">🤷‍♂️</div>
              <div className="text-slate-400 text-sm">
                No athletes found for{" "}
                {selectedSport === "all" ? "all sports" : selectedSport}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Selection Cart - More compact and less obstructive */}
      {selectedPicks.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-50 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700/30 rounded-2xl p-3 shadow-2xl max-w-md mx-auto">
          <div className="flex flex-col space-y-3">
            {/* Compact Avatar Stack */}
            <div className="flex justify-center space-x-1.5 max-w-full overflow-x-auto pb-1">
              {Array.from({ length: legsRequired }).map((_, index) => {
                const pick = selectedPicks[index];

                return (
                  <div key={index} className="text-center min-w-[45px]">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative ${
                        pick
                          ? "bg-gradient-to-br from-[#00CED1] to-[#FFAB91] border-white text-white shadow-lg"
                          : "bg-slate-800/50 border-slate-600/50 text-slate-400"
                      }`}
                    >
                      {pick ? (
                        <>
                          <span className="text-xs font-bold">
                            {pick.athleteAvatar}
                          </span>
                          <button
                            onClick={() => removePick(pick.id)}
                            className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </>
                      ) : (
                        <span className="text-sm">?</span>
                      )}
                    </div>
                    {pick && (
                      <div className="text-[#00CED1] text-xs mt-0.5 font-semibold truncate max-w-[45px]">
                        {pick.propName.slice(0, 3)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Compact Confirm Button */}
            <button
              onClick={handleConfirmPicks}
              disabled={selectedPicks.length !== legsRequired || isConfirming}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                selectedPicks.length === legsRequired && !isConfirming
                  ? "bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  : isConfirming
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
                    : "bg-slate-800/50 border border-slate-600/50 text-slate-500 cursor-not-allowed"
              }`}
            >
              {isConfirming ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Selection Confirmed!</span>
                </div>
              ) : selectedPicks.length === legsRequired ? (
                `Confirm Picks • $${buyIn}`
              ) : (
                `${legsRequired - selectedPicks.length} more`
              )}
            </button>
          </div>
        </div>
      )}

      {/* Payment Popup */}
      {showPaymentPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 mx-4 w-full max-w-md shadow-2xl">
            {!paymentSuccess ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#00CED1] to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2">
                    Confirm Your Entry
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {gameName} • {selectedPicks.length} picks selected
                  </p>
                </div>

                <div className="bg-slate-700/30 rounded-xl p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-300">Buy-in Amount</span>
                    <span className="text-white font-bold text-lg">
                      ${buyIn}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-300">Picks Selected</span>
                    <span className="text-slate-400">
                      {selectedPicks.length} of {legsRequired}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Potential Payout</span>
                    <span className="text-emerald-400 font-bold">
                      ${Math.round(buyIn * 3.6)}
                    </span>
                  </div>
                </div>

                {!isPaymentProcessing ? (
                  <div className="flex gap-3">
                    <button
                      onClick={handlePaymentCancel}
                      className="flex-1 bg-slate-700/50 border border-slate-600/50 text-white font-semibold py-3 px-4 rounded-xl hover:bg-slate-600/50 transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePaymentConfirm}
                      className="flex-1 bg-gradient-to-r from-[#00CED1] to-blue-500 text-white font-bold py-3 px-4 rounded-xl hover:from-[#00CED1]/90 hover:to-blue-500/90 transition-all duration-300"
                    >
                      Pay ${buyIn}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00CED1]"></div>
                    <span className="ml-3 text-slate-300">
                      Processing payment...
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-xl mb-2">
                  Payment Successful!
                </h3>
                <p className="text-slate-400 text-sm mb-6">
                  Your picks are locked in. Good luck!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Athlete Pick Card Component
function AthletePickCard({
  athlete,
  isBookmarked,
  onBookmarkToggle,
  onPickSelection,
  selectedPick,
  isSelectionDisabled,
}: {
  athlete: Athlete;
  isBookmarked: boolean;
  onBookmarkToggle: (id: string) => void;
  onPickSelection: (
    athleteId: string,
    statIndex: number,
    betType: "over" | "under"
  ) => void;
  selectedPick?: SelectedPick;
  isSelectionDisabled: boolean;
}) {
  const [currentStatIndex, setCurrentStatIndex] = useState(0);

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
      case "SF":
        return "from-red-500/20 to-pink-500/20 border-red-500/30 text-red-400";
      case "PG":
        return "from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-400";
      case "FW":
        return "from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-400";
      default:
        return "from-slate-500/20 to-slate-600/20 border-slate-500/30 text-slate-400";
    }
  };

  const nextStat = () => {
    setCurrentStatIndex((prev) => (prev + 1) % athlete.stats.length);
  };

  const prevStat = () => {
    setCurrentStatIndex((prev) =>
      prev === 0 ? athlete.stats.length - 1 : prev - 1
    );
  };

  const currentStat = athlete.stats[currentStatIndex];
  const isThisStatSelected =
    selectedPick &&
    selectedPick.propName === currentStat.type &&
    selectedPick.propValue === currentStat.line;

  return (
    <div
      className={`group relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-xl border shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden ${
        selectedPick
          ? "border-[#00CED1] shadow-[#00CED1]/20"
          : "border-slate-700/50 hover:border-slate-600/60"
      }`}
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#00CED1]/3 via-transparent to-[#FFAB91]/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative z-10 p-5">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-3">
            {/* Player Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 backdrop-blur-lg bg-white/10 border border-white/20 rounded-xl flex items-center justify-center shadow-lg">
                {athlete.name ? (
                  <img
                    src={`/players/${athlete.name.toLowerCase().replace(/\s+/g, "-")}.png`}
                    alt={athlete.name}
                    className="w-12 h-12 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(athlete.name)}&background=0D8ABC&color=fff&size=128`;
                    }}
                  />
                ) : (
                  <span className="text-white font-bold text-lg tracking-tight">
                    {athlete.avatar}
                  </span>
                )}
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-800 bg-emerald-500"></div>
            </div>

            {/* Player Details */}
            <div className="min-w-0 flex-1">
              <h3 className="text-white font-bold text-lg mb-1 truncate">
                {athlete.name}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-slate-300 font-semibold text-sm">
                  {athlete.team}
                </span>
                <div className="text-slate-400 font-medium text-sm">
                  {athlete.matchup}
                </div>
              </div>
            </div>
          </div>

          {/* Star Bookmark Button */}
          <button
            onClick={() => onBookmarkToggle(athlete.id)}
            className={`p-2 rounded-lg transition-all duration-300 ${
              isBookmarked
                ? "text-[#FFAB91] bg-[#FFAB91]/20 border border-[#FFAB91]/40"
                : "text-slate-400 bg-slate-700/50 border border-slate-600/50 hover:text-[#FFAB91] hover:bg-[#FFAB91]/10 hover:border-[#FFAB91]/30"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill={isBookmarked ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </button>
        </div>

        {/* Horizontal Layout with Stats and Buttons */}
        <div className="flex items-center gap-4">
          {/* Stats Section */}
          <div className="flex-1 bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-5">
            {/* Stat Navigation Header */}
            <div className="flex flex-col mb-3">
              <div className="text-slate-200 font-bold text-base mb-3 tracking-wide text-center">
                {currentStat.type}
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={prevStat}
                  className="w-8 h-8 bg-gradient-to-r from-slate-700/60 to-slate-600/60 hover:from-[#00CED1]/30 hover:to-[#00CED1]/20 rounded-lg flex items-center justify-center transition-all duration-300 border border-slate-600/40 hover:border-[#00CED1]/50"
                >
                  <svg
                    className="w-4 h-4 text-slate-300 hover:text-[#00CED1] transition-colors"
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

                <div className="text-[#00CED1] font-black text-3xl tracking-tight drop-shadow-lg">
                  {currentStat.line}
                </div>

                <button
                  onClick={nextStat}
                  className="w-8 h-8 bg-gradient-to-r from-slate-700/60 to-slate-600/60 hover:from-[#00CED1]/30 hover:to-[#00CED1]/20 rounded-lg flex items-center justify-center transition-all duration-300 border border-slate-600/40 hover:border-[#00CED1]/50"
                >
                  <svg
                    className="w-4 h-4 text-slate-300 hover:text-[#00CED1] transition-colors"
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
            </div>

            {/* Progress Indicators */}
            <div className="flex justify-center space-x-2">
              {athlete.stats.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStatIndex(index)}
                  className={`transition-all duration-500 rounded-full ${
                    index === currentStatIndex
                      ? "w-6 h-1.5 bg-gradient-to-r from-[#00CED1] to-[#FFAB91] shadow-lg shadow-[#00CED1]/30"
                      : "w-1.5 h-1.5 bg-slate-600/60 hover:bg-slate-500/80 hover:scale-150 shadow-md"
                  }`}
                ></button>
              ))}
            </div>
          </div>

          {/* Over/Under Buttons */}
          <div className="flex flex-col space-y-2 min-w-[100px] flex-shrink-0">
            <button
              onClick={() =>
                onPickSelection(athlete.id, currentStatIndex, "over")
              }
              disabled={isSelectionDisabled}
              className={`rounded-xl py-2 px-4 transition-all duration-300 group shadow-lg ${
                isThisStatSelected && selectedPick?.betType === "over"
                  ? "bg-gradient-to-r from-emerald-500/50 to-emerald-600/40 border-2 border-emerald-300 shadow-emerald-500/40"
                  : isSelectionDisabled
                    ? "bg-gradient-to-r from-slate-600/25 to-slate-700/15 border-2 border-slate-500/20 cursor-not-allowed opacity-50"
                    : "bg-gradient-to-r from-emerald-500/25 to-emerald-600/15 border-2 border-emerald-400/40 hover:from-emerald-500/35 hover:to-emerald-600/25 hover:border-emerald-400/60 hover:shadow-emerald-500/20"
              }`}
            >
              <div className="flex items-center justify-center mb-1">
                <svg
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isThisStatSelected && selectedPick?.betType === "over"
                      ? "text-emerald-300 scale-110"
                      : isSelectionDisabled
                        ? "text-slate-500"
                        : "text-emerald-400 group-hover:scale-110"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </div>
              <div
                className={`font-bold text-sm transition-colors ${
                  isThisStatSelected && selectedPick?.betType === "over"
                    ? "text-emerald-200"
                    : isSelectionDisabled
                      ? "text-slate-500"
                      : "text-emerald-300 group-hover:text-emerald-200"
                }`}
              >
                OVER
              </div>
            </button>

            <button
              onClick={() =>
                onPickSelection(athlete.id, currentStatIndex, "under")
              }
              disabled={isSelectionDisabled}
              className={`rounded-xl py-2 px-4 transition-all duration-300 group shadow-lg ${
                isThisStatSelected && selectedPick?.betType === "under"
                  ? "bg-gradient-to-r from-red-500/50 to-red-600/40 border-2 border-red-300 shadow-red-500/40"
                  : isSelectionDisabled
                    ? "bg-gradient-to-r from-slate-600/25 to-slate-700/15 border-2 border-slate-500/20 cursor-not-allowed opacity-50"
                    : "bg-gradient-to-r from-red-500/25 to-red-600/15 border-2 border-red-400/40 hover:from-red-500/35 hover:to-red-600/25 hover:border-red-400/60 hover:shadow-red-500/20"
              }`}
            >
              <div className="flex items-center justify-center mb-1">
                <svg
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isThisStatSelected && selectedPick?.betType === "under"
                      ? "text-red-300 scale-110"
                      : isSelectionDisabled
                        ? "text-slate-500"
                        : "text-red-400 group-hover:scale-110"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              <div
                className={`font-bold text-sm transition-colors ${
                  isThisStatSelected && selectedPick?.betType === "under"
                    ? "text-red-200"
                    : isSelectionDisabled
                      ? "text-slate-500"
                      : "text-red-300 group-hover:text-red-200"
                }`}
              >
                UNDER
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PicksPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 p-4">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded mb-6"></div>
              <div className="space-y-4">
                <div className="h-32 bg-gray-700 rounded"></div>
                <div className="h-64 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <PicksContent />
    </Suspense>
  );
}
