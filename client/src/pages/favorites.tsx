
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Match } from '@/types/api';
import Navbar from '@/components/navbar';
import { MatchCard } from '@/components/match-card';
import { useFavorites } from '@/hooks/use-favorites';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Star, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Favorites() {
  const [, setLocation] = useLocation();
  const { currentUser } = useAuth();
  const { favorites } = useFavorites();
  const [favoriteMatches, setFavoriteMatches] = useState<Match[]>([]);

  // SEO - Add noindex for favorites page
  useEffect(() => {
    document.title = 'My Favorites';
    
    // Add noindex meta tag
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', 'noindex, nofollow');
  }, []);

  // Authentication gate - require login before accessing favorites
  if (!currentUser) {
    return (
      <div className="min-h-screen pb-16 md:pb-0">
        <Navbar hideSearchOnMobile={true} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-center items-center min-h-[60vh]">
            <Card className="w-full max-w-md glassmorphism">
              <CardHeader className="text-center space-y-4">
                <CardTitle className="text-2xl flex items-center justify-center gap-2">
                  <LogIn className="w-6 h-6 text-primary" />
                  Sign In Required
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    You need to sign in to view and manage your favorite matches
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/70">
                    <Star className="w-3 h-3" />
                    <span>Save matches across all your devices</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    asChild
                    className="w-full h-12 font-semibold"
                  >
                    <Link href="/login">
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In to View Favorites
                    </Link>
                  </Button>
                  <Button 
                    asChild
                    variant="outline"
                    className="w-full h-12 font-semibold"
                  >
                    <Link href="/register">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create Account
                    </Link>
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground/60 text-center">
                  Keep track of your favorite teams and matches across all devices
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Fetch all matches to filter favorites
  const { data: allMatches = [], isLoading } = useQuery({
    queryKey: ['/api/matches/all'],
    queryFn: () => api.getAllMatches(),
    enabled: favorites.length > 0,
  });

  useEffect(() => {
    if (allMatches.length > 0 && favorites.length > 0) {
      const filtered = allMatches.filter((match: Match) => 
        favorites.includes(match.id)
      );
      setFavoriteMatches(filtered);
    } else {
      setFavoriteMatches([]);
    }
  }, [allMatches, favorites]);

  const handleMatchClick = (match: Match) => {
    setLocation(`/match/${match.id}?source=streamed`);
  };

  if (isLoading && favorites.length > 0) {
    return (
      <div className="min-h-screen pb-16 md:pb-0">
        <Navbar hideSearchOnMobile={true} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="skeleton h-8 w-48 rounded mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton h-64 rounded-lg"></div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <Navbar hideSearchOnMobile={true} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
            <Star className="mr-3 h-8 w-8 text-primary" />
            Favorite Matches
          </h1>
          <p className="text-muted-foreground">Your saved matches for easy access</p>
        </div>

        {favoriteMatches.length === 0 ? (
          <div className="glassmorphism p-8 rounded-lg text-center">
            <Heart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No favorites yet</h3>
            <p className="text-muted-foreground mb-4">
              Start adding matches to your favorites by tapping the star icon on match cards
            </p>
            <button
              onClick={() => setLocation('/schedule')}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Browse Matches
            </button>
          </div>
        ) : (
          <>
            {/* Mobile Grid (2 columns) */}
            <div className="block md:hidden">
              <div className="grid grid-cols-2 gap-3">
                {favoriteMatches.map((match) => (
                  <MatchCard 
                    key={match.id} 
                    match={match} 
                    onClick={() => handleMatchClick(match)}
                    showFavorite={true}
                  />
                ))}
              </div>
            </div>

            {/* Desktop Grid (5 columns) */}
            <div className="hidden md:block">
              <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-5 gap-4">
                {favoriteMatches.map((match) => (
                  <MatchCard 
                    key={match.id} 
                    match={match} 
                    onClick={() => handleMatchClick(match)}
                    showFavorite={true}
                  />
                ))}
              </div>
            </div>

            <div className="text-center mt-6 text-sm text-muted-foreground">
              {favoriteMatches.length} favorite{favoriteMatches.length !== 1 ? 's' : ''}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
