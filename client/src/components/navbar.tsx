import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "wouter";
import {
  Search,
  User,
  Menu,
  X,
  Play,
  Home,
  Calendar,
  Trophy,
  Activity,
  MessageCircle,
  Send,
  Users,
  LogIn,
  LogOut,
  UserPlus,
  Star,
  Globe,
  BarChart3,
} from "lucide-react";

// Discord and Telegram SVG icons
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Match } from "@/types/api";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface NavbarProps {
  hideSearchOnDesktop?: boolean;
  hideSearchOnMobile?: boolean;
}

function Navbar({
  hideSearchOnDesktop = false,
  hideSearchOnMobile = false,
}: NavbarProps) {
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Separate state for desktop and mobile search
  const [desktopSearchQuery, setDesktopSearchQuery] = useState("");
  const [desktopSearchResults, setDesktopSearchResults] = useState<Match[]>([]);
  const [desktopIsSearching, setDesktopIsSearching] = useState(false);
  const [showDesktopSearchDropdown, setShowDesktopSearchDropdown] =
    useState(false);

  // Mobile search state
  const [isMobileSearchPopupOpen, setIsMobileSearchPopupOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [mobileSearchResults, setMobileSearchResults] = useState<Match[]>([]);
  const [mobileIsSearching, setMobileIsSearching] = useState(false);
  const [showMobileSearchDropdown, setShowMobileSearchDropdown] =
    useState(false);

  // Refs to prevent blur conflicts
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);

  const { data: allMatches = [] } = useQuery({
    queryKey: ["/api/matches/all-today/popular"],
    queryFn: () => api.getPopularTodayMatches(),
    enabled: desktopSearchQuery.length > 0 || mobileSearchQuery.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Desktop search effect
  useEffect(() => {
    if (desktopSearchQuery.trim().length === 0) {
      setDesktopSearchResults([]);
      setDesktopIsSearching(false);
      setShowDesktopSearchDropdown(false);
      return;
    }

    setDesktopIsSearching(true);
    const timeoutId = setTimeout(() => {
      if (allMatches.length > 0) {
        const filtered = allMatches.filter(
          (match) =>
            match.title
              .toLowerCase()
              .includes(desktopSearchQuery.toLowerCase()) ||
            match.category
              .toLowerCase()
              .includes(desktopSearchQuery.toLowerCase()) ||
            match.teams?.home?.name
              ?.toLowerCase()
              .includes(desktopSearchQuery.toLowerCase()) ||
            match.teams?.away?.name
              ?.toLowerCase()
              .includes(desktopSearchQuery.toLowerCase()),
        );
        setDesktopSearchResults(filtered.slice(0, 5));
        setShowDesktopSearchDropdown(true);
      }
      setDesktopIsSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [desktopSearchQuery, allMatches.length]);

  // Mobile search effect
  useEffect(() => {
    if (mobileSearchQuery.trim().length === 0) {
      setMobileSearchResults([]);
      setMobileIsSearching(false);
      setShowMobileSearchDropdown(false);
      return;
    }

    setMobileIsSearching(true);
    const timeoutId = setTimeout(() => {
      if (allMatches.length > 0) {
        const filtered = allMatches.filter(
          (match) =>
            match.title
              .toLowerCase()
              .includes(mobileSearchQuery.toLowerCase()) ||
            match.category
              .toLowerCase()
              .includes(mobileSearchQuery.toLowerCase()) ||
            match.teams?.home?.name
              ?.toLowerCase()
              .includes(mobileSearchQuery.toLowerCase()) ||
            match.teams?.away?.name
              ?.toLowerCase()
              .includes(mobileSearchQuery.toLowerCase()),
        );
        setMobileSearchResults(filtered.slice(0, 5));
        setShowMobileSearchDropdown(true);
      }
      setMobileIsSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [mobileSearchQuery, allMatches.length]);

  // Desktop search handlers
  const handleDesktopSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (desktopSearchResults.length > 0) {
        setLocation(`/match/${desktopSearchResults[0].id}?source=streamed`);
        setDesktopSearchQuery("");
        setShowDesktopSearchDropdown(false);
      }
    },
    [desktopSearchResults, setLocation],
  );

  const handleDesktopMatchSelect = useCallback(
    (match: Match) => {
      setShowDesktopSearchDropdown(false);
      setDesktopSearchQuery("");
      setLocation(`/match/${match.id}?source=streamed`);
    },
    [setLocation],
  );

  // Mobile search handlers
  const handleMobileSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (mobileSearchQuery.trim() && mobileSearchResults.length > 0) {
        setLocation(`/match/${mobileSearchResults[0].id}?source=streamed`);
        setMobileSearchQuery("");
        setShowMobileSearchDropdown(false);
        setIsMobileMenuOpen(false);
        setIsMobileSearchPopupOpen(false);
      }
    },
    [mobileSearchQuery, mobileSearchResults, setLocation],
  );

  const handleMobileSearchMatchSelect = useCallback(
    (match: Match) => {
      setLocation(`/match/${encodeURIComponent(match.id)}?source=streamed`);
      setMobileSearchQuery("");
      setShowMobileSearchDropdown(false);
      setIsMobileSearchPopupOpen(false);
      setIsMobileMenuOpen(false);
    },
    [setLocation],
  );

  // Close desktop search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(event.target as Node)
      ) {
        setShowDesktopSearchDropdown(false);
      }
    };

    if (showDesktopSearchDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showDesktopSearchDropdown]);


  const navigation = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Blog", href: "https://blog.sportsbite.cc/", external: true }
];


  const isActive = (href: string) => location === href;

  const handleDesktopSearchInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setDesktopSearchQuery(value);
    setShowDesktopSearchDropdown(value.length > 0);
  };

  const handleMobileSearchInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setMobileSearchQuery(value);
    setShowMobileSearchDropdown(value.length > 0);
  };

  const isMobile = useIsMobile();
  const { currentUser, logout } = useAuth();

  return (
    <nav className="glassmorphism md:sticky md:top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center"
            data-testid="logo-link"
            aria-label="Go to Sportsbite homepage"
          >
            <img
              src="/logo.png"
              alt="V - Free Live Sports Streaming"
              className="h-7 sm:h-8 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
        
        <div className="hidden md:flex">
  {navigation.map((item) =>
    item.href.startsWith("http") ? (
      <a
        key={item.name}
        href={item.href}
        className={`px-3 py-2 text-sm font-medium transition-colors ${
          isActive(item.href)
            ? "text-foreground"
            : "text-muted-foreground hover:text-white"
        }`}
        data-testid={`nav-${item.name.toLowerCase()}`}
        title={`Go to ${item.name} page - ${item.name}`}
        aria-label={`Navigate to ${item.name} page`}
      >
        {item.name}
      </a>
    ) : (
      <Link
        key={item.name}
        href={item.href}
        className={`px-3 py-2 text-sm font-medium transition-colors ${
          isActive(item.href)
            ? "text-foreground"
            : "text-muted-foreground hover:text-white"
        }`}
        data-testid={`nav-${item.name.toLowerCase()}`}
        title={`Go to ${item.name} page - ${item.name}`}
        aria-label={`Navigate to ${item.name} page`}
      >
        {item.name}
      </Link>
    )
  )}
</div>



          {/* Social Icons and Search */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Social Media Icons */}
            <div className="flex items-center space-x-3">
              <a
                href="https://discord.gg/Qg7uRXWAhU"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors p-2 rounded-lg hover:bg-accent/10"
                title="Join our Discord community"
                aria-label="Join our Discord community"
              >
                <DiscordIcon className="h-5 w-5" />
              </a>
              <a
                href="https://t.me/+Zo7CoigxqRczMjRk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors p-2 rounded-lg hover:bg-accent/10"
                title="Follow us on Telegram"
                aria-label="Follow us on Telegram"
              >
                <TelegramIcon className="h-5 w-5" />
              </a>
            </div>

            {/* Desktop Search */}
            <div className="relative" ref={desktopSearchRef}>
              <form onSubmit={handleDesktopSearchSubmit}>
                <Input
                  ref={desktopInputRef}
                  type="text"
                  placeholder="🔍 Search live matches, teams..."
                  value={desktopSearchQuery}
                  onChange={handleDesktopSearchInputChange}
                  className="bg-muted border-border w-64 pr-10 focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  data-testid="search-input"
                  onFocus={() =>
                    desktopSearchQuery.length > 0 &&
                    setShowDesktopSearchDropdown(true)
                  }
                  title="Search for live sports matches - Football, Basketball, Tennis & more"
                  aria-label="Search for live sports matches"
                />
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </form>

              {/* Desktop Search Results Dropdown */}
              {showDesktopSearchDropdown && desktopSearchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                  <div className="p-2 text-xs text-muted-foreground border-b border-border bg-muted/30">
                    Click to view match details
                  </div>
                  {desktopSearchResults.map((match: Match) => (
                    <div
                      key={match.id}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDesktopMatchSelect(match);
                      }}
                      className="p-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0 transition-colors"
                      title={`${match.title} - ${match.category} live stream`}
                      aria-label={`View details for ${match.title} in ${match.category}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">
                            {match.title}
                          </div>
                          <div className="text-xs text-muted-foreground capitalize">
                            {match.category}
                          </div>
                        </div>
                        {match.popular && (
                          <div className="text-xs text-accent px-1.5 py-0.5 bg-accent/10 rounded-full flex-shrink-0">
                            Popular
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="hidden lg:flex text-muted-foreground hover:text-foreground"
                    title="Explore sports categories - Football, Basketball, Cricket and more"
                    aria-label="Explore sports categories"
                  >
                    Sports
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="hidden lg:block glassmorphism border-border"
                >
                  <DropdownMenuItem asChild>
                    <Link
                      href="/"
                      className="flex items-center"
                      title="Sportsbite - Free Live Sports Streaming Home"
                      aria-label="Go to Sportsbite homepage - Free live sports streaming"
                    >
                      <Home className="mr-2 h-4 w-4" />
                      Home
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="https://sportsbite.cc/"
                      className="flex items-center"
                      title="Sports Schedule - Live & Upcoming Matches"
                      aria-label="View sports schedule with live and upcoming matches"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      All Schedule
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/sports"
                      className="flex items-center"
                      title="All Sports Categories - Football, Basketball, Cricket & More"
                      aria-label="Browse all sports categories including football, basketball, cricket"
                    >
                      <Trophy className="mr-2 h-4 w-4" />
                      Sports
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/schedule/basketball"
                      className="flex items-center"
                      title="Basketball Live Streams and Schedule"
                      aria-label="View basketball live streams and schedule"
                    >
                      Basketball Schedule
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/schedule/football"
                      className="flex items-center"
                      title="Football Live Streams and Schedule"
                      aria-label="View football live streams and schedule"
                    >
                      Football Schedule
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/schedule/american-football"
                      className="flex items-center"
                      title="NFL Live Streams and Schedule"
                      aria-label="View NFL live streams and schedule"
                    >
                      NFL Schedule
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/schedule/boxing"
                      className="flex items-center"
                      title="Boxing Live Streams and Schedule"
                      aria-label="View boxing live streams and schedule"
                    >
                      Fighting Schedule
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/schedule/tennis"
                      className="flex items-center"
                      title="Tennis Live Streams and Schedule"
                      aria-label="View tennis live streams and schedule"
                    >
                      Tennis Schedule
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/schedule/cricket"
                      className="flex items-center"
                      title="Cricket Live Streams and Schedule"
                      aria-label="View cricket live streams and schedule"
                    >
                      Cricket Schedule
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/schedule/golf"
                      className="flex items-center"
                      title="Golf Live Streams and Schedule"
                      aria-label="View golf live streams and schedule"
                    >
                      Golf Schedule
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/schedule/motorsports"
                      className="flex items-center"
                      title="Motorsports Live Streams and Schedule"
                      aria-label="View motorsports live streams and schedule"
                    >
                      Motorsports Schedule
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/status"
                      className="flex items-center"
                      title="Check Live Stream Status"
                      aria-label="Check live stream status"
                    >
                      <Activity className="mr-2 h-4 w-4" />
                      Status
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="hidden lg:flex text-muted-foreground hover:text-foreground"
                    title="More information and legal pages"
                    aria-label="More information and legal pages"
                  >
                    More Info
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="hidden lg:block glassmorphism border-border"
                >
                  <DropdownMenuItem asChild>
                    <Link
                      href="/about-us"
                      className="flex items-center"
                      title="About Us"
                      aria-label="Learn about Sportsbite"
                    >
                      <Users className="mr-2 h-4 w-4" />
                      About Us
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/contact-us"
                      className="flex items-center"
                      title="Contact Support"
                      aria-label="Contact support team"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Contact Us
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/privacy-policy"
                      className="flex items-center"
                      title="Privacy Policy"
                      aria-label="View our privacy policy"
                    >
                      Privacy Policy
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/terms-of-service"
                      className="flex items-center"
                      title="Terms of Service"
                      aria-label="Read our terms of service"
                    >
                      Terms of Service
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/copyright-disclaimer"
                      className="flex items-center"
                      title="Copyright Disclaimer"
                      aria-label="Read our copyright disclaimer"
                    >
                      Copyright Disclaimer
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Authentication Section */}
              <div className="flex items-center gap-2">
                {currentUser ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-8 w-8 rounded-full"
                        onClick={(e) => e.preventDefault()} // Prevent default to avoid conflicts
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={currentUser?.photoURL || ""}
                            alt={currentUser?.displayName || "User"}
                          />
                          <AvatarFallback>
                            {currentUser?.displayName?.[0]?.toUpperCase() ||
                              currentUser?.email?.[0]?.toUpperCase() ||
                              "U"}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56"
                      align="end"
                      forceMount
                    >
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          {currentUser.displayName && (
                            <p className="font-medium">
                              {currentUser.displayName}
                            </p>
                          )}
                          <p className="w-[200px] truncate text-sm text-muted-foreground">
                            {currentUser.email}
                          </p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" className="flex items-center">
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild></DropdownMenuItem>
                      <DropdownMenuItem asChild></DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onSelect={(event) => {
                          event.preventDefault();
                          logout();
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setLocation("/login")}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </Button>
                    <Button size="sm" onClick={() => setLocation("/register")}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile social icons, search, profile and menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Social Media Icons for Mobile Header */}
            <a
              href="https://discord.gg/Qg7uRXWAhU"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent transition-colors p-2 rounded-lg hover:bg-accent/10"
              title="Join our Discord community"
              aria-label="Join our Discord community"
            >
              <DiscordIcon className="h-5 w-5" />
            </a>
            <a
              href="https://t.me/+Zo7CoigxqRczMjRk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent transition-colors p-2 rounded-lg hover:bg-accent/10"
              title="Follow us on Telegram"
              aria-label="Follow us on Telegram"
            >
              <TelegramIcon className="h-5 w-5" />
            </a>

            {/* Mobile Profile Icon */}
            {currentUser ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/dashboard")}
                className="p-2"
                title="View Dashboard"
                aria-label="View your dashboard"
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={currentUser.photoURL || ""}
                    alt={currentUser.displayName || currentUser.email || ""}
                  />
                  <AvatarFallback className="text-xs">
                    {currentUser.displayName
                      ? currentUser.displayName.charAt(0).toUpperCase()
                      : currentUser.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/login")}
                className="p-2"
                title="Sign In"
                aria-label="Sign in to your account"
              >
                <User className="h-5 w-5" />
              </Button>
            )}

            {/* Mobile Search Icon */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileSearchPopupOpen(true)}
              className="p-2 relative group"
              title="Search Live Matches - Football, Basketball, Tennis & more"
              aria-label="Search for live sports matches"
            >
              <Search className="h-5 w-5 group-active:scale-95 transition-transform" />
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-accent text-accent-foreground text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-lg border border-accent/20">
                🔍 Search Sports
              </div>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="mobile-menu-button"
              title="Toggle mobile menu"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
     
     {isMobileMenuOpen && (
  <div className="md:hidden" data-testid="mobile-menu">
    <div className="px-2 pt-2 pb-3 space-y-1">
      {navigation.map((item) =>
        item.href.startsWith("http") ? (
          <a
            key={item.name}
            href={item.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-3 py-2 text-base font-medium ${
              isActive(item.href)
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
            data-testid={`mobile-nav-${item.name.toLowerCase()}`}
            title={`Go to ${item.name} page - ${item.name}`}
            aria-label={`Navigate to ${item.name} page`}
          >
            {item.name}
          </a>
        ) : (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`block px-3 py-2 text-base font-medium ${
              isActive(item.href)
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
            data-testid={`mobile-nav-${item.name.toLowerCase()}`}
            title={`Go to ${item.name} page - ${item.name}`}
            aria-label={`Navigate to ${item.name} page`}
          >
            {item.name}
          </Link>
        )
      )}

      <div className="border-t border-border my-2"></div>

      {/* More Info Section */}
      <div className="px-3 py-2">
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">
          More Info
        </h3>
        <div className="space-y-1">
          <Link
            href="/about-us"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            About Us
          </Link>
          <Link
            href="/contact-us"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            Contact Us
          </Link>
          <Link
            href="/privacy-policy"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-of-service"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            Terms of Service
          </Link>
          <Link
            href="/copyright-disclaimer"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            Copyright Disclaimer
          </Link>
        </div>
      </div>
    </div>
  </div>
)}


      {/* Mobile Search Dialog */}
      <Dialog
        open={isMobileSearchPopupOpen}
        onOpenChange={setIsMobileSearchPopupOpen}
      >
        <DialogContent className="w-full h-full max-w-none max-h-none m-0 p-0 border-0 rounded-none bg-background/98 backdrop-blur-lg">
          <div className="flex flex-col h-full">
            {/* Enhanced Header with Gradient */}
            <div className="relative bg-gradient-to-r from-accent/20 via-primary/10 to-accent/20 p-4 pb-6">
              <div className="absolute inset-0 bg-background/40 backdrop-blur-sm"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                      <Search className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-foreground">
                        Discover Sports
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Find live matches instantly
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileSearchPopupOpen(false)}
                    className="w-8 h-8 rounded-full hover:bg-background/80"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Advanced Search Bar */}
                <form onSubmit={handleMobileSearchSubmit} className="relative">
                  <div className="relative group">
                    <div className="absolute inset-0 rounded-2xl blur-sm group-focus-within:blur-md transition-all"></div>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Search teams, leagues, or sports..."
                        value={mobileSearchQuery}
                        onChange={handleMobileSearchInputChange}
                        className="w-full h-14 pl-14 pr-20 text-base border border-border/50 rounded-2xl focus:border-accent/50 focus:ring-2 focus:ring-accent/25 transition-all shadow-lg"
                        data-testid="mobile-advanced-search"
                        autoFocus
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <Search className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        {mobileIsSearching && (
                          <div className="w-4 h-4 animate-spin rounded-full border-2 border-accent border-t-transparent"></div>
                        )}
                        {mobileSearchQuery && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setMobileSearchQuery("");
                              setShowMobileSearchDropdown(false);
                            }}
                            className="w-6 h-6 rounded-full p-0 hover:bg-muted/60"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </form>

                {/* Quick Filter Chips */}
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                  {[
                    "⚽ Football",
                    "🏀 Basketball",
                    "🎾 Tennis",
                    "🏏 Cricket",
                    "🏈 NFL",
                    "⚾ Baseball",
                  ].map((sport) => (
                    <button
                      key={sport}
                      onClick={() => {
                        const sportName = sport.split(" ")[1].toLowerCase();
                        setMobileSearchQuery(sportName);
                        setShowMobileSearchDropdown(true);
                      }}
                      className="flex-shrink-0 px-4 py-2 bg-background/60 hover:bg-accent/20 active:bg-accent/30 text-sm rounded-full border border-border/30 transition-all touch-manipulation"
                    >
                      {sport}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Results Header */}
              {(mobileSearchQuery || mobileSearchResults.length > 0) && (
                <div className="px-4 py-3 bg-muted/20 border-b border-border/30">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">
                      {mobileSearchQuery
                        ? `Results for "${mobileSearchQuery}"`
                        : "Search Results"}
                    </p>
                    {mobileSearchResults.length > 0 && (
                      <p className="text-xs text-muted-foreground bg-accent/10 px-2 py-1 rounded-full">
                        {mobileSearchResults.length} found
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Scrollable Results */}
              <div className="flex-1 overflow-y-auto">
                {showMobileSearchDropdown && mobileSearchResults.length > 0 && (
                  <div className="p-4 space-y-3">
                    {mobileSearchResults.map((match: Match, index) => (
                      <div
                        key={match.id}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleMobileSearchMatchSelect(match);
                        }}
                        className="group relative bg-card hover:bg-accent/5 active:bg-accent/10 border border-border/50 rounded-xl p-4 transition-all duration-300 touch-manipulation shadow-sm hover:shadow-md active:scale-[0.98] cursor-pointer"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-start gap-4">
                          {/* Match Icon */}
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                            <div className="text-xl">
                              {match.category === "football"
                                ? "⚽"
                                : match.category === "basketball"
                                  ? "🏀"
                                  : match.category === "tennis"
                                    ? "🎾"
                                    : match.category === "cricket"
                                      ? "🏏"
                                      : match.category === "american-football"
                                        ? "🏈"
                                        : match.category === "baseball"
                                          ? "⚾"
                                          : "🏆"}
                            </div>
                          </div>

                          {/* Match Details */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-accent transition-colors">
                              {match.title}
                            </h3>

                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 py-1 bg-muted/40 rounded-md">
                                {match.category}
                              </span>
                              {match.popular && (
                                <span className="text-xs font-medium text-accent px-2 py-1 bg-accent/15 rounded-md flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-current" />
                                  Popular
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Play className="h-3 w-3" />
                                  <span>
                                    {match.sources?.length || 0} streams
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Globe className="h-3 w-3" />
                                  <span>Live</span>
                                </div>
                              </div>
                              <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                                <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Enhanced Loading State */}
                {mobileIsSearching && (
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-4 border-accent/20"></div>
                      <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-accent border-t-transparent animate-spin"></div>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">
                      Searching Sports
                    </h3>
                    <p className="text-sm text-muted-foreground text-center">
                      Finding the best matches for you...
                    </p>
                    <div className="flex gap-1 mt-4">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-accent rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Enhanced No Results */}
                {mobileSearchQuery.length > 0 &&
                  !mobileIsSearching &&
                  mobileSearchResults.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-muted/40 to-muted/20 flex items-center justify-center mb-4">
                        <Search className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        No matches found
                      </h3>
                      <p className="text-sm text-muted-foreground text-center mb-6 max-w-xs">
                        Try searching for team names, leagues, or different
                        sports
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {["Football", "Basketball", "Tennis", "Cricket"].map(
                          (sport) => (
                            <button
                              key={sport}
                              onClick={() => {
                                setMobileSearchQuery(sport.toLowerCase());
                                setShowMobileSearchDropdown(true);
                              }}
                              className="px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent text-sm rounded-full transition-colors"
                            >
                              Try {sport}
                            </button>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                {/* Enhanced Welcome State */}
                {mobileSearchQuery.length === 0 && (
                  <div className="p-6 space-y-6">
                    {/* Welcome Section */}
                    <div className="text-center py-8">
                      <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full flex items-center justify-center">
                        <Search className="h-12 w-12 text-accent" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        Discover Live Sports
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                        Search thousands of live matches from football to
                        tennis, basketball to cricket
                      </p>
                    </div>

                    {/* Popular Sports Grid */}
                    <div>
                      <h4 className="text-base font-semibold text-foreground mb-3">
                        Popular Sports
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          {
                            name: "Football",
                            icon: "⚽",
                            color: "from-green-500/20 to-green-600/20",
                          },
                          {
                            name: "Basketball",
                            icon: "🏀",
                            color: "from-orange-500/20 to-orange-600/20",
                          },
                          {
                            name: "Tennis",
                            icon: "🎾",
                            color: "from-yellow-500/20 to-yellow-600/20",
                          },
                          {
                            name: "Cricket",
                            icon: "🏏",
                            color: "from-blue-500/20 to-blue-600/20",
                          },
                        ].map((sport) => (
                          <button
                            key={sport.name}
                            onClick={() => {
                              setMobileSearchQuery(sport.name.toLowerCase());
                              setShowMobileSearchDropdown(true);
                            }}
                            className={`p-4 bg-gradient-to-br ${sport.color} hover:scale-105 active:scale-95 rounded-xl border border-border/30 transition-all touch-manipulation`}
                          >
                            <div className="text-2xl mb-2">{sport.icon}</div>
                            <div className="text-sm font-medium text-foreground">
                              {sport.name}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Recent Searches or Trending */}
                    <div>
                      <h4 className="text-base font-semibold text-foreground mb-3">
                        Quick Searches
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Premier League",
                          "NBA",
                          "Champions League",
                          "La Liga",
                          "ATP Tour",
                          "IPL",
                        ].map((term) => (
                          <button
                            key={term}
                            onClick={() => {
                              setMobileSearchQuery(term.toLowerCase());
                              setShowMobileSearchDropdown(true);
                            }}
                            className="px-3 py-2 bg-muted/40 hover:bg-accent/20 active:bg-accent/30 text-sm rounded-full border border-border/30 transition-all touch-manipulation"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  );
}

export default Navbar;
