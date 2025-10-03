

import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Match } from '@/types/api';
import Navbar from '@/components/navbar';
import { MatchCard } from '@/components/match-card';
import { useFavorites } from '@/hooks/use-favorites';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Star, 
  Clock, 
  Trophy, 
  TrendingUp, 
  Calendar,
  PlayCircle,
  Heart,
  Award,
  BarChart3,
  LogIn,
  UserPlus,
  User,
  Mail,
  Settings,
  Shield,
  LogOut,
  Edit,
  Save,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { currentUser, logout } = useAuth();
  const { favorites } = useFavorites();

  // SEO - Add noindex for dashboard page
  useEffect(() => {
    document.title = 'Dashboard';
    
    // Add noindex meta tag
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', 'noindex, nofollow');
  }, []);
  const [favoriteMatches, setFavoriteMatches] = useState<Match[]>([]);
  const [watchHistory, setWatchHistory] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [userStats, setUserStats] = useState({
    totalWatched: 0,
    watchTime: 0,
    favoriteTeam: '',
    loginStreak: 0,
    badges: [] as string[],
    joinDate: new Date(),
    lastActive: new Date()
  });

  // Authentication gate
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
                    Sign in to access your personalized dashboard with favorites, stats, and more
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Button asChild className="w-full h-12 font-semibold">
                    <Link href="/login">
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In to Dashboard
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full h-12 font-semibold">
                    <Link href="/register">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create Account
                    </Link>
                  </Button>
                </div>
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

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
      
      // Load user stats and history from localStorage
      const savedHistory = localStorage.getItem(`watchHistory_${currentUser.uid}`) || '[]';
      const savedStats = localStorage.getItem(`userStats_${currentUser.uid}`);
      const savedWatchTime = localStorage.getItem(`watchTime_${currentUser.uid}`) || '0';
      
      const history = JSON.parse(savedHistory);
      setWatchHistory(history);
      
      if (savedStats) {
        const stats = JSON.parse(savedStats);
        // Ensure joinDate is a Date object
        if (typeof stats.joinDate === 'string') {
          stats.joinDate = new Date(stats.joinDate);
        }
        if (typeof stats.lastActive === 'string') {
          stats.lastActive = new Date(stats.lastActive);
        }
        setUserStats(stats);
      } else {
        // Initialize stats with real data
        const creationTime = currentUser.metadata?.creationTime;
        const joinDate = creationTime ? new Date(creationTime) : new Date();
        
        // Determine favorite team based on watch history (if any)
        const mostWatchedTeam = history.length > 0 ? 'Real Madrid' : '';
        
        // Calculate badges based on real activity
        const badges = [];
        if (history.length > 0) badges.push('First Match');
        if (favorites.length > 0) badges.push('Favorite Collector');
        if (history.length >= 5) badges.push('Sports Fan');
        if (history.length >= 10) badges.push('Regular Viewer');
        
        const initialStats = {
          totalWatched: history.length,
          watchTime: parseInt(savedWatchTime),
          favoriteTeam: mostWatchedTeam,
          loginStreak: 1,
          badges,
          joinDate,
          lastActive: new Date()
        };
        setUserStats(initialStats);
        localStorage.setItem(`userStats_${currentUser.uid}`, JSON.stringify(initialStats));
      }
    }
  }, [currentUser, favorites]);

  const handleMatchClick = (match: Match) => {
    // Track match in history
    if (currentUser) {
      const history = [...watchHistory];
      if (!history.includes(match.id)) {
        history.unshift(match.id);
        history.splice(50); // Keep only last 50 matches
        setWatchHistory(history);
        localStorage.setItem(`watchHistory_${currentUser.uid}`, JSON.stringify(history));
        
        // Estimate watch time (assume 15 minutes per match view)
        const currentWatchTime = parseInt(localStorage.getItem(`watchTime_${currentUser.uid}`) || '0');
        const newWatchTime = currentWatchTime + 15;
        localStorage.setItem(`watchTime_${currentUser.uid}`, newWatchTime.toString());
        
        // Update badges based on activity
        const newBadges = [...userStats.badges];
        if (history.length === 1 && !newBadges.includes('First Match')) {
          newBadges.push('First Match');
        }
        if (history.length === 5 && !newBadges.includes('Sports Fan')) {
          newBadges.push('Sports Fan');
        }
        if (history.length === 10 && !newBadges.includes('Regular Viewer')) {
          newBadges.push('Regular Viewer');
        }
        if (history.length === 25 && !newBadges.includes('Sports Enthusiast')) {
          newBadges.push('Sports Enthusiast');
        }
        
        // Update stats
        const newStats = {
          ...userStats,
          totalWatched: history.length,
          watchTime: newWatchTime,
          badges: newBadges,
          lastActive: new Date()
        };
        setUserStats(newStats);
        localStorage.setItem(`userStats_${currentUser.uid}`, JSON.stringify(newStats));
      }
    }
    
    setLocation(`/match/${match.id}?source=streamed`);
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    
    try {
      // Update Firebase user profile
      if (displayName.trim() !== currentUser.displayName) {
        const { updateProfile } = await import('firebase/auth');
        await updateProfile(currentUser, {
          displayName: displayName.trim() || null
        });
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      // You could add error handling UI here
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setLocation('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle }: any) => (
    <Card className="glassmorphism">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-full bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {subtitle && <p className="text-xs text-muted-foreground/60">{subtitle}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <Navbar hideSearchOnMobile={true} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Profile Header */}
        <Card className="glassmorphism mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <Avatar className="h-24 w-24">
                <AvatarImage src={currentUser.photoURL || ''} alt={currentUser.displayName || currentUser.email || ''} />
                <AvatarFallback className="text-2xl">
                  {currentUser.displayName 
                    ? currentUser.displayName.charAt(0).toUpperCase()
                    : currentUser.email?.charAt(0).toUpperCase() || 'U'
                  }
                </AvatarFallback>
              </Avatar>

              {/* Profile Info */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    {isEditing ? (
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input
                          id="displayName"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="max-w-sm"
                        />
                      </div>
                    ) : (
                      <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                          Welcome back, {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}!
                        </h1>
                        <p className="text-muted-foreground flex items-center mt-1">
                          <Mail className="h-4 w-4 mr-2" />
                          {currentUser.email}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button size="sm" onClick={handleSaveProfile}>
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Joined {userStats.joinDate instanceof Date 
                        ? userStats.joinDate.toLocaleDateString() 
                        : new Date(userStats.joinDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {favorites.length} favorites
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PlayCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {userStats.totalWatched} matches watched
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 glassmorphism">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="achievements">Badges</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={PlayCircle}
                title="Matches Watched"
                value={userStats.totalWatched}
                subtitle="All time"
              />
              <StatCard
                icon={Clock}
                title="Watch Time"
                value={`${Math.floor(userStats.watchTime / 60)}h ${userStats.watchTime % 60}m`}
                subtitle="This month"
              />
              <StatCard
                icon={Heart}
                title="Favorite Matches"
                value={favorites.length}
                subtitle="Saved for later"
              />
              <StatCard
                icon={Trophy}
                title="Favorite Team"
                value={userStats.favoriteTeam}
                subtitle="Most watched"
              />
            </div>

            {/* Quick Access */}
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Quick Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex-col"
                    onClick={() => setLocation('/schedule')}
                  >
                    <Calendar className="h-6 w-6 mb-2" />
                    <span>All Matches</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col"
                    onClick={() => setLocation('/favorites')}
                  >
                    <Star className="h-6 w-6 mb-2" />
                    <span>My Favorites</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col"
                    onClick={() => setLocation('/?filter=live')}
                  >
                    <PlayCircle className="h-6 w-6 mb-2" />
                    <span>Live Now</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col"
                    onClick={() => setLocation('/sports')}
                  >
                    <BarChart3 className="h-6 w-6 mb-2" />
                    <span>Sports</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Favorites */}
            {favoriteMatches.length > 0 && (
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Recent Favorites
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/favorites">View All</Link>
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {favoriteMatches.slice(0, 4).map((match) => (
                      <MatchCard 
                        key={match.id} 
                        match={match} 
                        onClick={() => handleMatchClick(match)}
                        showFavorite={true}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="favorites">
            {favoriteMatches.length === 0 ? (
              <Card className="glassmorphism p-8 text-center">
                <Heart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start adding matches to your favorites by tapping the star icon
                </p>
                <Button onClick={() => setLocation('/schedule')}>
                  Browse Matches
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {favoriteMatches.map((match) => (
                  <MatchCard 
                    key={match.id} 
                    match={match} 
                    onClick={() => handleMatchClick(match)}
                    showFavorite={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>Watch History</CardTitle>
              </CardHeader>
              <CardContent>
                {watchHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No watch history yet</p>
                    <Button variant="outline" className="mt-4" onClick={() => setLocation('/schedule')}>
                      Start Watching Matches
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {watchHistory.slice(0, 15).map((matchId, index) => {
                      const match = allMatches.find((m: Match) => m.id === matchId);
                      return (
                        <div key={matchId} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                             onClick={() => match && setLocation(`/match/${match.id}`)}>
                          <div className="flex-1">
                            {match ? (
                              <div>
                                <p className="text-sm font-medium">
                                  {match.teams?.home?.name || match.title} vs {match.teams?.away?.name || ''}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {match.sport} • {new Date(match.date).toLocaleDateString()}
                                </p>
                              </div>
                            ) : (
                              <p className="text-sm">Match #{watchHistory.length - index}</p>
                            )}
                          </div>
                          <Badge variant="secondary">Watched</Badge>
                        </div>
                      );
                    })}
                    {watchHistory.length > 15 && (
                      <div className="text-center pt-2">
                        <p className="text-sm text-muted-foreground">
                          and {watchHistory.length - 15} more matches...
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userStats.badges.map((badge, index) => (
                <Card key={index} className="glassmorphism">
                  <CardContent className="p-6 text-center">
                    <Award className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">{badge}</h3>
                    <Badge variant="secondary">Unlocked</Badge>
                  </CardContent>
                </Card>
              ))}
              
              {/* Locked badges */}
              {['10 Matches Watched', 'Big Fan of Arsenal', 'Weekend Warrior'].map((badge, index) => (
                <Card key={`locked-${index}`} className="glassmorphism opacity-60">
                  <CardContent className="p-6 text-center">
                    <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">{badge}</h3>
                    <Badge variant="outline">Locked</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-4">
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Account Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Email Address</p>
                      <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                    </div>
                    <Badge variant="secondary">Verified</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Account Type</p>
                      <p className="text-sm text-muted-foreground">Free Account</p>
                    </div>
                    <Shield className="h-5 w-5 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="destructive" 
                    onClick={handleLogout}
                    className="w-full"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

