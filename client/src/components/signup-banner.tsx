import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, UserPlus, Star, MessageCircle, Heart } from "lucide-react";

interface SignupBannerProps {
  onClose?: () => void;
}

export function SignupBanner({ onClose }: SignupBannerProps) {
  const { currentUser } = useAuth();
  const [, setLocation] = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show for unauthenticated users
    if (currentUser) {
      return;
    }

    const BANNER_KEY = "signup_banner_last_shown";
    const SHOW_INTERVAL = 1 * 60 * 1000; // 1 minute in milliseconds
    const lastShown = localStorage.getItem(BANNER_KEY);
    const now = Date.now();

    if (!lastShown || now - parseInt(lastShown) > SHOW_INTERVAL) {
      // Random chance to show (50% probability)
      if (Math.random() > 0.5) {
        setIsVisible(true);
        localStorage.setItem(BANNER_KEY, now.toString());
      }
    }
  }, [currentUser]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const handleSignUp = () => {
    setLocation("/register");
  };

  const handleSignIn = () => {
    setLocation("/login");
  };

  // Don't render if user is authenticated or banner is not visible
  if (currentUser || !isVisible) {
    return null;
  }

  return (
    <Card className="glassmorphism border-primary/20 bg-gradient-to-r from-primary/10 to-accent/10 mb-4">
      <CardContent className="p-4 relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-destructive/20"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="flex items-start space-x-4 pr-8">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Join Sportsbite for Free!
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Create your account to unlock exclusive features and never miss
              your favorite matches.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4 text-xs">
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Heart className="h-3 w-3 text-red-500" />
                <span>Save favorites</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <MessageCircle className="h-3 w-3 text-blue-500" />
                <span>Join live chat</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Star className="h-3 w-3 text-yellow-500" />
                <span>Personal dashboard</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Button
                onClick={handleSignUp}
                className="flex-1 bg-primary"
                size="sm"
              >
                <UserPlus className="h-4 w-4 mr-1" />
                Sign Up Free
              </Button>
              <Button
                variant="outline"
                onClick={handleSignIn}
                className="flex-1 border-primary/30"
                size="sm"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}