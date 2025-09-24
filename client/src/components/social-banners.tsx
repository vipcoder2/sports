import { MessageCircle, Send, Users, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SocialBannerProps {
  type: 'discord' | 'telegram';
  className?: string;
}

export function SocialBanner({ type, className }: SocialBannerProps) {
  const isDiscord = type === 'discord';
  
  const handleClick = () => {
    const url = isDiscord 
      ? 'https://discord.gg/Qg7uRXWAhU' 
      : 'https://t.me/+Zo7CoigxqRczMjRk';
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:scale-[1.02] border-l-4",
        isDiscord 
          ? "border-l-blue-500 hover:border-l-blue-400 bg-gradient-to-r from-blue-500/5 to-transparent hover:from-blue-500/10" 
          : "border-l-cyan-500 hover:border-l-cyan-400 bg-gradient-to-r from-cyan-500/5 to-transparent hover:from-cyan-500/10",
        "glassmorphism border-border/50 hover:border-border",
        className
      )}
      onClick={handleClick}
    >
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "p-2 rounded-lg",
              isDiscord ? "bg-blue-500/20 text-blue-400" : "bg-cyan-500/20 text-cyan-400"
            )}>
              {isDiscord ? (
                <MessageCircle className="h-5 w-5" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </div>
            
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-medium text-foreground">
                  Join our {isDiscord ? 'Discord' : 'Telegram'}
                </h3>
                <Users className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {isDiscord ? '<1k members' : '>2k subscribers'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {isDiscord 
                  ? 'Get live match updates, discuss games, and connect with fans'
                  : 'Instant notifications for live matches and exclusive content'
                }
              </p>
            </div>
          </div>
          
          <ArrowRight className={cn(
            "h-4 w-4 transition-transform group-hover:translate-x-1",
            isDiscord ? "text-blue-400" : "text-cyan-400"
          )} />
        </div>
      </CardContent>
    </Card>
  );
}

// Wrapper component for both banners
export function SocialBanners({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      <SocialBanner type="discord" />
      <SocialBanner type="telegram" />
    </div>
  );
}