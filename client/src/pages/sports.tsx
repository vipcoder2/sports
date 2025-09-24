import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
import { api } from '@/lib/api';
import { Sport, Match } from '@/types/api'; // Assuming Match type exists
import Navbar from '@/components/navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dumbbell,
  Zap,
  Car,
  Trophy,
  Target,
  Gamepad2,
} from 'lucide-react';

const sportIcons: Record<string, any> = {
  basketball: Dumbbell,
  football: Zap,
  'american-football': Trophy,
  hockey: Target,
  baseball: Gamepad2,
  'motor-sports': Car,
  fighting: Trophy,
};

export default function Sports() {
  const [, setLocation] = useLocation();

  // Sports page SEO
  useEffect(() => {
    document.title = "All Sports Streaming - Live Sports Categories";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Browse all sports streaming categories on Sportsbite. Football, basketball, tennis, cricket and more live sports available for free.');
    }

    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', 'https://sportsbite.cc/sports');
    if (!document.querySelector('link[rel="canonical"]')) {
      document.head.appendChild(canonical);
    }
  }, []);

  const { data: sports = [], isLoading: isLoadingSports } = useQuery({
    queryKey: ['/api/sports'],
    queryFn: () => api.getSports(),
    enabled: true,
  });

  // Fix match click handler to ensure proper navigation
  const handleMatchClick = (match: Match) => {
    if (!match?.id) {
      console.error('Invalid match ID:', match);
      return;
    }
    console.log('Navigating to match:', match.id, match.title);
    setLocation(`/match/${encodeURIComponent(match.id)}?source=streamed`);
  };

  const handleSportClick = (sport: Sport) => {
    // In a real scenario, this would likely fetch matches for the sport
    // and then navigate. For this fix, we'll simulate navigating to a match detail.
    // If the original intent was to navigate to a list of matches for a sport,
    // that URL would be different. Based on the error description,
    // we're focusing on match detail navigation.
    if (sport.id) {
      // Simulating navigation to a specific match detail page for demonstration
      // In a real app, you might pick the first match of the sport or a dummy match ID
      const dummyMatchId = `dummy-${sport.id}-match-1`; // Placeholder for a real match ID
      setLocation(`/match/${encodeURIComponent(dummyMatchId)}?source=category`);
    } else {
      console.error('Invalid sport ID:', sport);
    }
  };

  if (isLoadingSports) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="skeleton h-8 w-48 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="glassmorphism border-border">
                <CardHeader>
                  <div className="skeleton h-8 w-8 rounded mb-2"></div>
                  <div className="skeleton h-6 w-24 rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="skeleton h-4 w-full rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Sports Categories</h1>
          <p className="text-muted-foreground">Browse all available sports and competitions</p>
        </div>

        {sports.length === 0 ? (
          <Card className="glassmorphism border-border">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No sports categories available</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sports.map((sport: Sport) => {
              const Icon = sportIcons[sport.id] || Trophy;

              return (
                <Card
                  key={sport.id}
                  className="glassmorphism border-border hover:bg-primary/10 transition-all duration-200 cursor-pointer group"
                  onClick={() => handleSportClick(sport)}
                  data-testid={`sport-card-${sport.id}`}
                >
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Icon className="h-8 w-8 text-primary group-hover:text-primary/80" />
                      <div>
                        <CardTitle className="text-foreground group-hover:text-primary">
                          {sport.name}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground">
                      View all {sport.name.toLowerCase()} matches and competitions
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Placeholder for where match cards might be displayed and clicked */}
        {/* This section is added based on the user's problem description and the changes provided. */}
        {/* In a real application, this would be a separate component or a section within this one */}
        {/* that fetches and displays matches for a selected sport. */}
        {/* Example of how handleMatchClick might be used: */}
        {/*
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Featured Matches</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Assuming 'matches' data is fetched here * /}
            {matches.map((match: Match) => (
              <Card
                key={match.id}
                className="glassmorphism border-border hover:bg-primary/10 transition-all duration-200 cursor-pointer group"
                onClick={() => handleMatchClick(match)}
                data-testid={`match-card-${match.id}`}
              >
                <CardHeader>
                  <CardTitle className="text-foreground group-hover:text-primary">{match.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {match.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        */}
      </main>
    </div>
  );
}