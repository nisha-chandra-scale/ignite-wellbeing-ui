import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Star, Gift, Zap, Crown, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUserProgress } from "@/hooks/useUserProgress";

const Rewards = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { progress, loading, deductPoints } = useUserProgress();
  const [redeemedRewards, setRedeemedRewards] = useState<number[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
      } else {
        fetchRedeemedRewards(user.id);
      }
    };
    checkAuth();
  }, [navigate]);

  const fetchRedeemedRewards = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("redeemed_rewards")
        .select("reward_id")
        .eq("user_id", userId);

      if (error) throw error;
      setRedeemedRewards(data.map(r => r.reward_id));
    } catch (error: any) {
      console.error("Error fetching redeemed rewards:", error);
    }
  };

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

  const handleRedeem = async (id: number, title: string, cost: number) => {
    if (!progress) return;

    if (progress.total_points < cost) {
      toast({
        title: "Not Enough Points!",
        description: `You need ${cost - progress.total_points} more points to redeem this reward.`,
        variant: "destructive",
      });
      return;
    }

    if (redeemedRewards.includes(id)) {
      toast({
        title: "Already Redeemed!",
        description: "You've already unlocked this reward.",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("redeemed_rewards").insert({
        user_id: user.id,
        reward_id: id,
        reward_title: title,
        reward_cost: cost,
      });

      await deductPoints(cost);
      setRedeemedRewards([...redeemedRewards, id]);
      
      toast({
        title: "Reward Redeemed! 🎁",
        description: `You've unlocked: ${title} (-${cost} points)`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading || !progress) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

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
              <p className="text-sm opacity-90 mb-1">Available Points</p>
              <p className="text-5xl font-bold">{progress.total_points.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90 mb-1">Current Streak</p>
              <p className="text-3xl font-bold flex items-center gap-2">
                {progress.current_streak} 🔥
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
            {rewards.map((reward) => {
              const isRedeemed = redeemedRewards.includes(reward.id);
              const canAfford = progress.total_points >= reward.cost;
              
              return (
                <Card
                  key={reward.id}
                  className={`p-6 shadow-sm transition-all ${
                    isRedeemed
                      ? "bg-success-light border-2 border-accent"
                      : "hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-foreground">{reward.title}</h3>
                        {isRedeemed && (
                          <Badge variant="default" className="bg-accent text-accent-foreground">
                            Redeemed ✓
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{reward.description}</p>
                      <Badge
                        variant="secondary"
                        className={`${
                          canAfford && !isRedeemed
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {reward.cost} points
                      </Badge>
                    </div>
                    <Button
                      onClick={() => handleRedeem(reward.id, reward.title, reward.cost)}
                      disabled={isRedeemed}
                      className={`${
                        isRedeemed
                          ? "bg-muted text-muted-foreground cursor-not-allowed"
                          : canAfford
                          ? "bg-primary hover:bg-primary/90"
                          : "bg-muted text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {isRedeemed ? "Redeemed" : "Redeem"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default Rewards;
