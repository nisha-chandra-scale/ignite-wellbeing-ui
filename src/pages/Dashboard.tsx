import { useState } from "react";
import { Flame, Sparkles, Trophy, Target, Clock, Brain } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatCard from "@/components/StatCard";
import ProgressBar from "@/components/ProgressBar";
import ChallengeCard from "@/components/ChallengeCard";
import AchievementBadge from "@/components/AchievementBadge";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { toast } = useToast();
  const [challenges, setChallenges] = useState([
    { id: 1, icon: Target, title: "Morning Walk", description: "Take a 10-minute walk outside", duration: "10 min", xp: 50, completed: false },
    { id: 2, icon: Clock, title: "Digital Detox Hour", description: "Stay off social media for 1 hour", duration: "60 min", xp: 75, completed: false },
    { id: 3, icon: Brain, title: "Mindful Moment", description: "Take 5 deep breaths and stretch", duration: "5 min", xp: 25, completed: true },
  ]);

  const handleStartChallenge = (id: number) => {
    setChallenges(challenges.map(c => 
      c.id === id ? { ...c, completed: true } : c
    ));
    const challenge = challenges.find(c => c.id === id);
    toast({
      title: "Challenge Started! 🎯",
      description: `You've started: ${challenge?.title}`,
    });
  };

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
            Level 5
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard icon={Flame} value="7 days" label="Daily Streak" iconColor="text-orange-500" />
          <StatCard icon={Sparkles} value="150" label="Today's XP" iconColor="text-accent" />
          <StatCard icon={Trophy} value="3" label="Achievements" iconColor="text-amber-500" />
        </div>

        {/* Progress Section */}
        <Card className="p-6 mb-8 shadow-sm">
          <ProgressBar current={750} max={1000} label="Level 5 Progress" />
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
