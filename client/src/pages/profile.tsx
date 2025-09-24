
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
  User,
  Mail,
  Calendar,
  Star,
  Clock,
  Trophy,
  Settings,
  Shield,
  LogOut,
  Edit,
  Save,
  X,
  Award,
  TrendingUp,
  PlayCircle,
  LogIn,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Profile() {
  const [, setLocation] = useLocation();
  const { currentUser, logout } = useAuth();
  const { favorites } = useFavorites();
  const [favoriteMatches, setFavoriteMatches] = useState<Match[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  
  // SEO - Add noindex for profile page
  useEffect(() => {
    document.title = 'My Profile';
    
    // Add noindex meta tag
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', 'noindex, nofollow');
  }, []);

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
                    Sign in to access your profile and account settings
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Button asChild className="w-full h-12 font-semibold">
                    <Link href="/login">
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
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
  const { data: allMatches = [] } = useQuery({
    queryKey: ['/api/matches/all'],
    queryFn: () => api.getAllMatches(),
    enabled: favorites.length > 0,
  });

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
      
      // Load user stats
      const savedStats = localStorage.getItem(`userStats_${currentUser.uid}`);
      if (savedStats) {
        setUserStats(JSON.parse(savedStats));
      } else {
        // Initialize with mock data
        const initialStats = {
          totalWatched: Math.floor(Math.random() * 50) + 10,
          watchTime: Math.floor(Math.random() * 1000) + 500,
          favoriteTeam: 'Arsenal',
          loginStreak: Math.floor(Math.random() * 20) + 1,
          badges: ['First Match', 'Early Adopter', 'Sports Fan'],
          joinDate: new Date(currentUser.metadata?.creationTime || Date.now()),
          lastActive: new Date()
        };
        setUserStats(initialStats);
        localStorage.setItem(`userStats_${currentUser.uid}`, JSON.stringify(initialStats));
      }
    }
  }, [currentUser]);

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

  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <Navbar hideSearchOnMobile={true} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                        <h1 className="text-2xl font-bold">
                          {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
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
                      Joined {userStats.joinDate.toLocaleDateString()}
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
          <TabsList className="grid w-full grid-cols-4 glassmorphism">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="achievements">Badges</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="glassmorphism">
                <CardContent className="p-6 text-center">
                  <PlayCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{userStats.totalWatched}</p>
                  <p className="text-sm text-muted-foreground">Matches Watched</p>
                </CardContent>
              </Card>

              <Card className="glassmorphism">
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">
                    {Math.floor(userStats.watchTime / 60)}h {userStats.watchTime % 60}m
                  </p>
                  <p className="text-sm text-muted-foreground">Watch Time</p>
                </CardContent>
              </Card>

              <Card className="glassmorphism">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{userStats.loginStreak}</p>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
                </CardContent>
              </Card>
            </div>

            {/* Favorite Team */}
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Favorite Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{userStats.favoriteTeam}</p>
                    <p className="text-sm text-muted-foreground">Most watched team</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites">
            {favoriteMatches.length === 0 ? (
              <Card className="glassmorphism p-8 text-center">
                <Star className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start adding matches to your favorites
                </p>
                <Button onClick={() => setLocation('/schedule')}>
                  Browse Matches
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {favoriteMatches.map((match) => (
                  <MatchCard 
                    key={match.id} 
                    match={match} 
                    onClick={() => setLocation(`/match/${match.id}?source=streamed`)}
                    showFavorite={true}
                  />
                ))}
              </div>
            )}
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
