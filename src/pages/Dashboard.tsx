import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Flame, Sparkles, Trophy, Target, Clock, Brain } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatCard from "@/components/StatCard";
import ProgressBar from "@/components/ProgressBar";
import ChallengeCard from "@/components/ChallengeCard";
import AchievementBadge from "@/components/AchievementBadge";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUserProgress } from "@/hooks/useUserProgress";

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { progress, loading, addXP } = useUserProgress();
  const [todayXp, setTodayXp] = useState(0);
  
  const [challenges, setChallenges] = useState([
    { id: 1, icon: Target, title: "Morning Walk", description: "Take a 10-minute walk outside", duration: "10 min", xp: 50, completed: false },
    { id: 2, icon: Clock, title: "Digital Detox Hour", description: "Stay off social media for 1 hour", duration: "60 min", xp: 75, completed: false },
    { id: 3, icon: Brain, title: "Mindful Moment", description: "Take 5 deep breaths and stretch", duration: "5 min", xp: 25, completed: false },
  ]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleStartChallenge = async (id: number) => {
    const challenge = challenges.find(c => c.id === id);
    
    if (challenge?.completed) return;
    
    setChallenges(challenges.map(c => 
      c.id === id ? { ...c, completed: true } : c
    ));
    
    if (challenge) {
      setTodayXp(prev => prev + challenge.xp);
      
      const leveledUp = await addXP(challenge.xp);
      
      // Save to database
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("completed_challenges").insert({
            user_id: user.id,
            challenge_id: challenge.id,
            xp_earned: challenge.xp,
          });
        }
      } catch (error) {
        console.error("Error saving challenge:", error);
      }
      
      toast({
        title: "Challenge Completed! 🎉",
        description: `+${challenge.xp} XP earned for ${challenge.title}`,
      });
      
      if (leveledUp) {
        setTimeout(() => {
          toast({
            title: "Level Up! 🎊",
            description: "You've reached a new level!",
          });
        }, 500);
      }
    }
  };

  if (loading || !progress) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  const currentLevel = Math.floor(progress.total_xp / 1000) + 1;
  const levelProgress = progress.total_xp % 1000;

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
              Welcome Back!
            </h1>
            <p className="text-muted-foreground">Keep building your healthy habits</p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2 bg-secondary text-secondary-foreground">
            <Sparkles className="h-4 w-4 mr-2" />
            Level {currentLevel}
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard icon={Flame} value={`${progress.current_streak} days`} label="Daily Streak" iconColor="text-orange-500" />
          <StatCard icon={Sparkles} value={todayXp.toString()} label="Today's XP" iconColor="text-accent" />
          <StatCard icon={Trophy} value={progress.achievements_count.toString()} label="Achievements" iconColor="text-amber-500" />
        </div>

        {/* Progress Section */}
        <Card className="p-6 mb-8 shadow-sm">
          <ProgressBar current={levelProgress} max={1000} label={`Level ${currentLevel} Progress`} />
        </Card>

        {/* Today's Challenges */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Today's Challenges
          </h2>
          <div className="space-y-4">
            {challenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                {...challenge}
                onStart={() => handleStartChallenge(challenge.id)}
              />
            ))}
          </div>
        </div>

        {/* Recent Achievements */}
        <Card className="p-6 shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Recent Achievements
          </h2>
          <div className="flex flex-wrap gap-3">
            <AchievementBadge icon={Flame} title="7-Day Streak" />
            <AchievementBadge icon={Sparkles} title="Early Bird" />
            <AchievementBadge icon={Trophy} title="Wellness Warrior" />
          </div>
        </Card>
      </div>

      <Navigation />
    </div>
  );
};

export default Dashboard;
