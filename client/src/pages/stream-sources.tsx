import { useQuery } from '@tanstack/react-query';
import { useRoute, useLocation } from 'wouter';
import { useEffect } from 'react';
import { api } from '@/lib/api';
import { Match } from '@/types/api';
import Navbar from '@/components/navbar';
import { StreamSources } from '@/components/stream-sources';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
export default function StreamSourcesPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/match/:id/streams');

  // Block search engines from indexing stream sources pages
  useEffect(() => {
    document.title = 'Stream Sources';
    
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', 'noindex, nofollow');
  }, []);

  const { data: matches = [], isLoading } = useQuery({
    queryKey: ['/api/matches/all'],
    queryFn: () => api.getAllMatches(),
    enabled: !!params?.id,
  });

  // Find the specific match with improved matching logic
  const matchId = params?.id ? params.id : null;
  
  console.log('Stream sources - Looking for match ID:', matchId);
  
  const currentMatch = matches.find((m: Match) => {
    if (!m || !m.id) return false;
    
    // Convert both to strings for comparison
    const searchId = String(matchId);
    const matchIdStr = String(m.id);
    
    // Try exact match first (most common case)
    if (matchIdStr === searchId) return true;
    
    // Try URL encoded versions
    try {
      const encodedSearchId = encodeURIComponent(searchId);
      const encodedMatchId = encodeURIComponent(matchIdStr);
      if (encodedMatchId === encodedSearchId || matchIdStr === encodedSearchId || encodedMatchId === searchId) return true;
    } catch (e) {
      // Ignore encode errors
    }
    
    // Try URL decoded versions
    try {
      const decodedSearchId = decodeURIComponent(searchId);
      const decodedMatchId = decodeURIComponent(matchIdStr);
      if (decodedMatchId === decodedSearchId || matchIdStr === decodedSearchId || decodedMatchId === searchId) return true;
    } catch (e) {
      // Ignore decode errors
    }
    
    // Try case-insensitive comparison for string IDs
    if (searchId.toLowerCase() === matchIdStr.toLowerCase()) return true;
    
    return false;
  });
  
  console.log('Stream sources - Match found:', !!currentMatch, currentMatch?.title);
  if (!currentMatch && matches.length > 0) {
    console.log('Available match IDs sample:', matches.slice(0, 5).map(m => ({ id: m.id, title: m.title })));
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar hideSearchOnMobile />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="skeleton h-8 w-32 rounded mb-6"></div>
          <div className="skeleton h-96 rounded-lg"></div>
        </main>
      </div>
    );
  }

  if (!currentMatch) {
    return (
      <div className="min-h-screen">
        <Navbar hideSearchOnMobile />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="mb-6"
            data-testid="back-button"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          <Card className="glassmorphism border-border">
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold text-foreground mb-2">Match Not Found</h2>
              <p className="text-muted-foreground">The requested match could not be found.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Navbar hideSearchOnMobile />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <StreamSources match={currentMatch} />
      </main>
    </div>
  );
}