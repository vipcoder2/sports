import { cn } from "@/lib/utils";
import { Sport } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Users, TrendingUp } from "lucide-react";

interface SportsSidebarProps {
  sports: Sport[];
  selectedSport: string;
  onSportSelect: (sportId: string) => void;
  showLiveOnly: boolean;
  onLiveToggle: () => void;
  className?: string;
}

export function SportsSidebar({
  sports,
  selectedSport,
  onSportSelect,
  showLiveOnly,
  onLiveToggle,
  className,
}: SportsSidebarProps) {
  const allSportsOption = { id: "all", name: "All Sports" };
  const sportsWithAll = [allSportsOption, ...sports];

  return (
    <div
      className={cn(
        "w-64 bg-card/50 border-r border-border backdrop-blur-sm h-full",
        className,
      )}
    >
      <div className="p-4 space-y-4">
        {/* Sidebar Header */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground flex items-center">
            <Activity className="h-5 w-5 mr-2 text-accent" />
            Sports Categories
          </h2>
          <p className="text-xs text-muted-foreground">
            Choose your favorite sports
          </p>
        </div>

        {/* Live Filter Toggle */}
        <div className="pb-3 border-b border-border">
          <Button
            onClick={onLiveToggle}
            variant={showLiveOnly ? "default" : "outline"}
            size="sm"
            className={cn(
              "w-full justify-start h-9 transition-all duration-200",
              showLiveOnly
                ? "bg-red-600 text-white border-red-600"
                : "border-border",
            )}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full mr-2",
                    showLiveOnly
                      ? "bg-white animate-pulse"
                      : "bg-muted-foreground",
                  )}
                />
                <span className="text-sm">Live Events Only</span>
              </div>
              {showLiveOnly && (
                <Badge variant="secondary" className="text-xs bg-white/20">
                  ON
                </Badge>
              )}
            </div>
          </Button>
        </div>

        {/* Sports Categories */}
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center mb-2">
            <Users className="h-4 w-4 mr-2" />
            Categories
          </h3>

          <div className="space-y-1 max-h-96 overflow-y-auto">
            {sportsWithAll.map((sport) => {
              const isSelected = selectedSport === sport.id;
              const isAll = sport.id === "all";

              return (
                <Button
                  key={sport.id}
                  onClick={() => onSportSelect(sport.id)}
                  variant={isSelected ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "w-full justify-start h-9 text-sm transition-all duration-200",
                    isSelected
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "hover:bg-accent/10 text-muted-foreground hover:text-foreground",
                    isAll && "font-medium",
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="capitalize truncate">
                      {sport.name.toLowerCase()}
                    </span>
                    {isAll && (
                      <TrendingUp className="h-3 w-3 ml-2 text-accent" />
                    )}
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Popular Sports Quick Access */}
        <div className="pt-3 border-t border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Quick Access
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {["football", "basketball", "tennis", "cricket"].map((sport) => {
              const sportData = sports.find((s) => s.id === sport);
              if (!sportData) return null;

              return (
                <Button
                  key={sport}
                  onClick={() => onSportSelect(sport)}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-8 text-xs border-border transition-colors",
                    selectedSport === sport && "bg-accent/20 border-accent",
                  )}
                >
                  <span className="capitalize truncate">{sportData.name}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
