import { useState, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Match, Sport } from "@/types/api";
import Navbar from "@/components/navbar";
import { MatchCard } from "@/components/match-card";
import { SectionSkeleton } from "@/components/loading-skeleton";
import { useLocation } from "wouter";
import { format, parseISO, isToday, isTomorrow, isYesterday } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Star, Home, Calendar, Search, Globe, Users } from "lucide-react";
import { SocialShare } from "@/components/social-share";
import { useFavorites } from "@/hooks/use-favorites";
import { useAuth } from "@/contexts/AuthContext";
import { SportsSidebar } from "@/components/sports-sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Trophy,
  CircleDot,
  Circle,
  Egg,
  Target,
  Car,
  Zap,
  Gamepad2,
} from "lucide-react";

// Import Star icon

const MATCHES_PER_PAGE = 25;
const MOBILE_MATCHES_PER_PAGE = 12;

export default function Schedule() {
  const [, setLocation] = useLocation();
  const [selectedSport, setSelectedSport] = useState("all");
  const [showLiveOnly, setShowLiveOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentMobilePage, setCurrentMobilePage] = useState(1);
  const [favoriteMatches, setFavoriteMatches] = useState<Match[]>([]);
  const isMobile = useIsMobile();

  // Favorites hook must be called at top level unconditionally
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { currentUser } = useAuth();

  // Homepage SEO
  useEffect(() => {
    document.title = "Sportsbite - Football Live Streams, Free Sports & NBA TV";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Stream football live stream HD and free sports streaming on Sportsbite. Enjoy soccer games today, nba, cricket, and live football TV anytime.",
      );
    }

    const canonical =
      document.querySelector('link[rel="canonical"]') ||
      document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    canonical.setAttribute("href", "https://sportsbite.cc");
    if (!document.querySelector('link[rel="canonical"]')) {
      document.head.appendChild(canonical);
    }
  }, []);

  const { data: sports = [], isLoading: sportsLoading } = useQuery({
    queryKey: ["/api/sports"],
    queryFn: () => api.getSports(),
    enabled: true,
  });

  const { data: allMatches = [], isLoading: matchesLoading } = useQuery({
    queryKey: [
      "/api/matches",
      selectedSport === "all" ? "all-today-popular" : selectedSport,
    ],
    queryFn: () =>
      selectedSport === "all"
        ? api.getPopularTodayMatches()
        : api.getPopularMatches(selectedSport),
    enabled: !showLiveOnly,
  });

  const { data: liveMatches = [], isLoading: liveMatchesLoading } = useQuery({
    queryKey: ["/api/matches/live-popular"],
    queryFn: () => api.getPopularLiveMatches(),
    enabled: showLiveOnly,
  });

  const handleMatchClick = (match: Match) => {
    if (!match?.id) {
      console.error("Invalid match ID:", match);
      return;
    }
    console.log("Navigating to match:", match.id, match.title);
    // Encode the match ID properly for URL safety
    const encodedId = encodeURIComponent(match.id);
    setLocation(`/match/${encodedId}?source=streamed`);
  };

  const handleSportChange = (sportId: string) => {
    setSelectedSport(sportId);
    setShowLiveOnly(false);
    setCurrentPage(1);
    setCurrentMobilePage(1);
  };

  const handleLiveToggle = () => {
    setShowLiveOnly(!showLiveOnly);
    setSelectedSport("all");
    setCurrentPage(1);
    setCurrentMobilePage(1);
  };

  // Get current matches based on filter
  const currentMatchesData = showLiveOnly ? liveMatches : allMatches;
  const isCurrentlyLoading = showLiveOnly ? liveMatchesLoading : matchesLoading;

  // Filter out favorite matches from main events section
  const nonFavoriteMatches = currentMatchesData.filter(
    (match) => !favorites.includes(match.id),
  );

  // Desktop/Tablet pagination - use filtered matches
  const totalPages = Math.ceil(nonFavoriteMatches.length / MATCHES_PER_PAGE);
  const startIndex = (currentPage - 1) * MATCHES_PER_PAGE;
  const endIndex = startIndex + MATCHES_PER_PAGE;
  const currentMatches = nonFavoriteMatches.slice(startIndex, endIndex);

  // Mobile pagination - use filtered matches
  const totalMobilePages = Math.ceil(
    nonFavoriteMatches.length / MOBILE_MATCHES_PER_PAGE,
  );
  const mobileStartIndex = (currentMobilePage - 1) * MOBILE_MATCHES_PER_PAGE;
  const mobileMatches = nonFavoriteMatches.slice(
    mobileStartIndex,
    mobileStartIndex + MOBILE_MATCHES_PER_PAGE,
  );

  const goToMobilePage = (page: number) => {
    setCurrentMobilePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset mobile page when data changes
  useEffect(() => {
    if (
      isMobile &&
      currentMobilePage > totalMobilePages &&
      totalMobilePages > 0
    ) {
      setCurrentMobilePage(1);
    }
  }, [totalMobilePages, currentMobilePage, isMobile]);

  // Filter favorite matches from current data
  useEffect(() => {
    if (currentUser && favorites.length > 0 && currentMatchesData.length > 0) {
      const filtered = currentMatchesData.filter((match) =>
        favorites.includes(match.id),
      );
      setFavoriteMatches(filtered);
    } else {
      setFavoriteMatches([]);
    }
  }, [currentUser, favorites, currentMatchesData]);

  if (sportsLoading || isCurrentlyLoading) {
    return (
      <div className="min-h-screen bg-[#04110e]">
        {" "}
        {/* Set background color here */}
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="skeleton h-8 w-48 rounded mb-6"></div>
          <SectionSkeleton />
          <SectionSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="bg-[#04110e] min-h-screen text-white">
      <Navbar />

      {/* Layout with Sidebar for Desktop */}
      <div className="flex min-h-screen">
        {/* Left Sidebar - Desktop Only */}
        {!isMobile && (
          <SportsSidebar
            sports={sports}
            selectedSport={selectedSport}
            onSportSelect={setSelectedSport}
            showLiveOnly={showLiveOnly}
            onLiveToggle={handleLiveToggle}
            className="fixed left-0 top-16 bottom-0 z-40"
          />
        )}

        {/* Main Content */}
        <main
          className={`flex-1 ${!isMobile ? "ml-64" : ""} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6`}
        >
          <div className="mb-6">
            <SocialShare />

            <h1 className="text-2xl font-bold text-foreground mb-2 py-3">
              {showLiveOnly ? "Live Matches" : "Sports Schedule"}
            </h1>
            <p className="text-muted-foreground">
              {showLiveOnly
                ? "Currently live sports matches"
                : "Upcoming and live sports matches"}
            </p>
          </div>

          {/* Sport Filter Chips - Mobile Only */}
          <div className="mb-6 md:hidden">
            <div className="flex flex-wrap gap-2 p-2 glassmorphism rounded-xl border border-white/10 bg-black/20 backdrop-blur-lg">
              {/* Live Button */}
              <button
                onClick={handleLiveToggle}
                className={`group relative flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 backdrop-blur-md ${
                  showLiveOnly
                    ? "bg-red-500/30 text-red-300 border border-red-400/40 shadow-md shadow-red-500/20"
                    : "bg-white/5 text-muted-foreground border border-white/10 hover:bg-red-500/15 hover:border-red-400/30"
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${showLiveOnly ? "bg-red-300 animate-pulse" : "bg-red-500/60"}`}
                ></div>
                <span className="text-xs">Live</span>
              </button>

              {/* All Sports Button */}
              <button
                onClick={() => handleSportChange("all")}
                className={`group relative flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 backdrop-blur-md ${
                  selectedSport === "all" && !showLiveOnly
                    ? "bg-accent/30 text-accent border border-accent/40 shadow-md shadow-accent/20"
                    : "bg-white/5 text-muted-foreground border border-white/10 hover:bg-accent/15 hover:border-accent/30"
                }`}
              >
                <span className="text-sm">🏆</span>
                <span className="text-xs">All</span>
              </button>

              {/* Individual Sport Buttons */}
              {sports.map((sport: Sport) => {
                const getSportIcon = (sportId: string) => {
                  const icons: { [key: string]: JSX.Element } = {
                    basketball: (
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M12 3c0 6 0 18 0 18"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M3 12c6 0 18 0 18 0"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M5.6 5.6c4.8 4.8 8.8 8.8 8.8 8.8"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                        <path
                          d="M18.4 5.6c-4.8 4.8-8.8 8.8-8.8 8.8"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                      </svg>
                    ),
                    football: (
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <polygon
                          points="12,6.5 14.5,11.5 9.5,11.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                        <polygon
                          points="12,17.5 14.5,12.5 9.5,12.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                      </svg>
                    ),
                    "american-football": (
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <ellipse
                          cx="12"
                          cy="12"
                          rx="9"
                          ry="6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M8 12h8"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M10 10v4"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                        <path
                          d="M12 10v4"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                        <path
                          d="M14 10v4"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                      </svg>
                    ),
                    hockey: (
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          d="M3 12h18"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                        />
                        <circle
                          cx="6"
                          cy="8"
                          r="2"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M4 10l4-2"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                        />
                        <circle
                          cx="18"
                          cy="16"
                          r="2"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M16 14l4 2"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                        />
                      </svg>
                    ),
                    baseball: (
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M8.5 8.5c1.5-1.5 3-1.5 4.5 0s1.5 3 0 4.5-3 1.5-4.5 0-1.5-3 0-4.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                        <path
                          d="M10 6l4 4"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                        <path
                          d="M14 6l-4 4"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                        <path
                          d="M6 10l4 4"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                        <path
                          d="M10 18l4-4"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                      </svg>
                    ),
                    "motor-sports": (
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v5c0 .6.4 1 1 1h2"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <circle
                          cx="7"
                          cy="17"
                          r="2"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M9 17h6"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <circle
                          cx="17"
                          cy="17"
                          r="2"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    ),
                    fight: (
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          d="M12 8h.01"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                        />
                        <path
                          d="M19 12c0-3.866-3.134-7-7-7s-7 3.134-7 7 3.134 7 7 7 7-3.134 7-7"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                        />
                        <path
                          d="M9 15l6-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                        />
                        <path
                          d="M15 15h.01"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                        />
                      </svg>
                    ),
                    boxing: (
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          d="M12 8h.01"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                        />
                        <path
                          d="M19 12c0-3.866-3.134-7-7-7s-7 3.134-7 7 3.134 7 7 7 7-3.134 7-7"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                        />
                        <path
                          d="M9 15l6-6"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                        />
                        <path
                          d="M15 15h.01"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                        />
                      </svg>
                    ),
                    tennis: (
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M12 3c-5 0-9 4-9 9s4 9 9 9s-4-9-9-9"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          fill="none"
                        />
                        <path
                          d="M12 21c5 0 9-4 9-9s-4-9-9-9"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          fill="none"
                        />
                        <path
                          d="M8 8l8 8"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                        <path
                          d="M16 8l-8 8"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                      </svg>
                    ),
                    rugby: (
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <ellipse
                          cx="12"
                          cy="12"
                          rx="6"
                          ry="9"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M12 3v18"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M6 7h12"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                        <path
                          d="M6 12h12"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M6 17h12"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                      </svg>
                    ),
                    golf: (
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          d="M12 2v16"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                        />
                        <path d="M12 2l6 4-6 2V2z" fill="currentColor" />
                        <circle
                          cx="12"
                          cy="20"
                          r="2"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M8 18h8"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                      </svg>
                    ),
                    billiards: (
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <circle
                          cx="8"
                          cy="8"
                          r="3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <circle
                          cx="16"
                          cy="16"
                          r="3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M8 8l8 8"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <circle cx="8" cy="8" r="1" fill="currentColor" />
                        <circle cx="16" cy="16" r="1" fill="currentColor" />
                      </svg>
                    ),
                    afl: (
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <ellipse
                          cx="12"
                          cy="12"
                          rx="6"
                          ry="9"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M12 3v18"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M8 8h8"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                        <path
                          d="M6 12h12"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M8 16h8"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                      </svg>
                    ),
                    darts: (
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                        <circle cx="12" cy="12" r="1" fill="currentColor" />
                        <path
                          d="M12 3v2"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                        <path
                          d="M21 12h-2"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                        <path
                          d="M12 21v-2"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                        <path
                          d="M3 12h2"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                      </svg>
                    ),
                    cricket: (
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          d="M12 2v20"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                        />
                        <path
                          d="M8 4h8v16H8z"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <circle
                          cx="12"
                          cy="6"
                          r="1.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                        <path
                          d="M10 8h4"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                        <path
                          d="M10 10h4"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                        <path
                          d="M10 12h4"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                      </svg>
                    ),
                  };
                  return icons[sportId] || <Trophy className="h-4 w-4" />;
                };

                return (
                  <button
                    key={sport.id}
                    onClick={() => handleSportChange(sport.id)}
                    className={`group relative flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 backdrop-blur-md whitespace-nowrap ${
                      selectedSport === sport.id && !showLiveOnly
                        ? "bg-accent/30 text-accent border border-accent/40 shadow-md shadow-accent/20"
                        : "bg-white/5 text-muted-foreground border border-white/10 hover:bg-accent/15 hover:border-accent/30"
                    }`}
                  >
                    {getSportIcon(sport.id)}
                    <span className="text-xs truncate max-w-[60px]">
                      {sport.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Favorite Events Section - Only show if user is logged in and has favorites */}
          {currentUser && favoriteMatches.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Star className="h-5 w-5 text-accent" />
                  Your Favorite Events
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocation("/favorites")}
                  className="text-accent hover:text-accent/80"
                >
                  View All
                </Button>
              </div>

              {/* Desktop Favorites Grid */}
              <div className="hidden md:block">
                <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-5 gap-4 mb-4">
                  {favoriteMatches.slice(0, 5).map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      onClick={() => handleMatchClick(match)}
                      isFavorite={true}
                      onFavoriteToggle={() => toggleFavorite(match.id)}
                      showFavorite={true}
                    />
                  ))}
                </div>
              </div>

              {/* Mobile Favorites Grid */}
              <div className="block md:hidden">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {favoriteMatches.slice(0, 4).map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      onClick={() => handleMatchClick(match)}
                      isFavorite={true}
                      onFavoriteToggle={() => toggleFavorite(match.id)}
                      showFavorite={true}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {nonFavoriteMatches.length === 0 && favoriteMatches.length === 0 ? (
            <div className="glassmorphism p-8 rounded-lg text-center">
              <p className="text-muted-foreground">
                {showLiveOnly
                  ? "No live matches at the moment"
                  : "No matches scheduled"}
              </p>
            </div>
          ) : (
            <>
              {/* Main Events Section Header */}
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-foreground">
                  {showLiveOnly ? "All Live Matches" : "All Matches"}
                </h2>
              </div>

              {/* Desktop/Tablet Grid (5 columns) */}
              <div className="hidden md:block">
                <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-5 gap-4 mb-8">
                  {currentMatches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      onClick={() => handleMatchClick(match)}
                      isFavorite={isFavorite(match.id)}
                      onFavoriteToggle={() => toggleFavorite(match.id)}
                      showFavorite={true}
                    />
                  ))}
                </div>

                {/* Desktop Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="glassmorphism"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex space-x-1">
                      {Array.from(
                        { length: Math.min(totalPages, 7) },
                        (_, i) => {
                          let page;
                          if (totalPages <= 7) {
                            page = i + 1;
                          } else if (currentPage <= 4) {
                            page = i + 1;
                          } else if (currentPage >= totalPages - 3) {
                            page = totalPages - 6 + i;
                          } else {
                            page = currentPage - 3 + i;
                          }

                          return (
                            <Button
                              key={page}
                              variant={
                                currentPage === page ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => goToPage(page)}
                              className={
                                currentPage === page
                                  ? "bg-primary"
                                  : "glassmorphism"
                              }
                            >
                              {page}
                            </Button>
                          );
                        },
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="glassmorphism"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Results Info */}
                <div className="text-center mt-4 text-sm text-muted-foreground">
                  Showing {startIndex + 1}-
                  {Math.min(endIndex, nonFavoriteMatches.length)} of{" "}
                  {nonFavoriteMatches.length} matches
                </div>
              </div>

              {/* About Us Section - Desktop */}
              <div className="mt-16 mb-8 hidden md:block">
                <div className="glassmorphism rounded-xl p-8 border border-white/10">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                      About Sportsbite
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                      Your premier destination for free live sports streaming,
                      bringing you closer to the action from anywhere in the
                      world.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Globe className="h-6 w-6 text-accent" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Global Coverage
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Access live sports from leagues and tournaments
                        worldwide, available 24/7.
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Users className="h-6 w-6 text-accent" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">
                        Free for Everyone
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        No subscriptions, no hidden fees. All streams are
                        completely free to watch.
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Star className="h-6 w-6 text-accent" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">
                        HD Quality
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        High-definition streams with multiple sources for the
                        best viewing experience.
                      </p>
                    </div>
                  </div>

                  <div className="text-center mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setLocation("/about-us")}
                      className="glassmorphism border-accent text-accent"
                    >
                      Learn More About Us
                    </Button>
                  </div>
                </div>
              </div>

              {/* Mobile Grid (2 columns) with Infinite Scroll */}
              <div className="block md:hidden">
                <div className="grid grid-cols-2 gap-3">
                  {mobileMatches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      onClick={() => handleMatchClick(match)}
                      isFavorite={isFavorite(match.id)}
                      onFavoriteToggle={() => toggleFavorite(match.id)}
                      showFavorite={true}
                    />
                  ))}
                </div>

                {/* Mobile Pagination Controls */}
                {totalMobilePages > 1 && (
                  <div className="flex flex-col items-center space-y-4 mt-6">
                    {/* Page Info */}
                    <div className="text-sm text-muted-foreground">
                      Page {currentMobilePage} of {totalMobilePages} (
                      {nonFavoriteMatches.length} matches)
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => goToMobilePage(currentMobilePage - 1)}
                        disabled={currentMobilePage === 1}
                        className="glassmorphism hover:bg-primary/20"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>

                      {/* Page Numbers */}
                      <div className="flex space-x-1">
                        {Array.from(
                          { length: Math.min(5, totalMobilePages) },
                          (_, index) => {
                            let pageNum;
                            if (totalMobilePages <= 5) {
                              pageNum = index + 1;
                            } else if (currentMobilePage <= 3) {
                              pageNum = index + 1;
                            } else if (
                              currentMobilePage >=
                              totalMobilePages - 2
                            ) {
                              pageNum = totalMobilePages - 4 + index;
                            } else {
                              pageNum = currentMobilePage - 2 + index;
                            }

                            return (
                              <Button
                                key={pageNum}
                                variant={
                                  currentMobilePage === pageNum
                                    ? "default"
                                    : "ghost"
                                }
                                size="sm"
                                onClick={() => goToMobilePage(pageNum)}
                                className={
                                  currentMobilePage === pageNum
                                    ? "bg-primary text-primary-foreground"
                                    : "glassmorphism hover:bg-primary/20"
                                }
                              >
                                {pageNum}
                              </Button>
                            );
                          },
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => goToMobilePage(currentMobilePage + 1)}
                        disabled={currentMobilePage === totalMobilePages}
                        className="glassmorphism hover:bg-primary/20"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* About Us Section - Mobile */}
                <div className="mt-12 mb-8 block md:hidden">
                  <div className="glassmorphism rounded-xl p-6 border border-white/10">
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-bold text-foreground mb-3">
                        About Us
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Your premier destination for free live sports streaming
                        worldwide.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center">
                        <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <Globe className="h-5 w-5 text-accent" />
                        </div>
                        <h3 className="font-medium text-foreground text-sm mb-1">
                          Global Coverage
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          24/7 worldwide sports
                        </p>
                      </div>

                      <div className="text-center">
                        <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <Users className="h-5 w-5 text-accent" />
                        </div>
                        <h3 className="font-medium text-foreground text-sm mb-1">
                          Always Free
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          No fees or subscriptions
                        </p>
                      </div>
                    </div>

                    <div className="text-center">
                      <Button
                        variant="outline"
                        onClick={() => setLocation("/about-us")}
                        className="glassmorphism border-accent text-accent w-full"
                        size="sm"
                      >
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
