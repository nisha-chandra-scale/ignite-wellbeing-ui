import { Trophy, Star, Gift, Zap, Crown, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";

const Rewards = () => {
  const { toast } = useToast();

  const badges = [
    { icon: Trophy, title: "Wellness Warrior", description: "Complete 50 challenges", earned: true, rarity: "Gold" },
    { icon: Zap, title: "Quick Starter", description: "Complete 10 morning challenges", earned: true, rarity: "Silver" },
    { icon: Star, title: "Consistency King", description: "30-day streak achieved", earned: true, rarity: "Gold" },
    { icon: Crown, title: "Level Master", description: "Reach Level 10", earned: false, rarity: "Platinum" },
    { icon: Target, title: "Perfect Week", description: "Complete all daily challenges for a week", earned: false, rarity: "Gold" },
  ];

  const rewards = [
    { id: 1, title: "Custom Theme", cost: 500, description: "Unlock a premium app theme" },
    { id: 2, title: "Bonus Challenge Pack", cost: 750, description: "Get 5 exclusive challenges" },
    { id: 3, title: "AI Companion Upgrade", cost: 1000, description: "Enhanced conversation features" },
  ];

  const handleRedeem = (title: string, cost: number) => {
    toast({
      title: "Reward Redeemed! 🎁",
      description: `You've unlocked: ${title} (-${cost} points)`,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Your Rewards
          </h1>
          <p className="text-muted-foreground">Track your progress and redeem exciting rewards</p>
        </div>

        {/* Points Overview */}
        <Card className="p-6 mb-8 shadow-md bg-gradient-to-r from-primary to-secondary text-primary-foreground">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-90 mb-1">Total Points Earned</p>
              <p className="text-5xl font-bold">2,450</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90 mb-1">Current Streak</p>
              <p className="text-3xl font-bold flex items-center gap-2">
                7 🔥
              </p>
            </div>
          </div>
        </Card>

        {/* Achievement Badges */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Trophy className="h-6 w-6 text-amber-500" />
            Achievement Badges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {badges.map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <Card
                  key={idx}
                  className={`p-5 transition-all ${
                    badge.earned
                      ? "border-2 border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950"
                      : "opacity-60 border-border"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-full ${
                        badge.earned ? "bg-amber-500" : "bg-muted"
                      }`}
                    >
                      <Icon className={`h-6 w-6 ${badge.earned ? "text-white" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{badge.title}</h3>
                        <Badge variant={badge.earned ? "default" : "secondary"} className="text-xs">
                          {badge.rarity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{badge.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Redeemable Rewards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Gift className="h-6 w-6 text-primary" />
            Redeemable Rewards
          </h2>
          <div className="space-y-4">
            {rewards.map((reward) => (
              <Card key={reward.id} className="p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">{reward.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{reward.description}</p>
                    <Badge variant="secondary" className="bg-primary text-primary-foreground">
                      {reward.cost} points
                    </Badge>
                  </div>
                  <Button
                    onClick={() => handleRedeem(reward.title, reward.cost)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Redeem
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default Rewards;
