import { useState } from "react";
import { Sparkles, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import Navigation from "@/components/Navigation";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const Companion = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Great job staying on track! You're building amazing habits. Remember, every small step counts toward your wellness journey. Ready to tackle your next challenge?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "That's a great question! Remember to focus on one habit at a time for the best results.",
        "I'm proud of your progress! Keep up the momentum and you'll reach your goals in no time.",
        "Taking breaks is just as important as staying active. How about trying a mindful moment?",
        "Your dedication is inspiring! Would you like some tips on maintaining your streak?",
      ];

      const aiMessage: Message = {
        id: messages.length + 2,
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="container max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-7rem)] flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Your AI Companion
          </h1>
          <p className="text-muted-foreground">
            Your supportive wellness coach is here to help
          </p>
        </div>

        {/* Daily Check-in Card */}
        <Card className="p-6 mb-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-primary/20 shadow-md">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-primary">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Your Daily Check-in
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Great job staying on track! You're building amazing habits.
                Remember, every small step counts toward your wellness journey.
                Ready to tackle your next challenge?
              </p>
              <Button className="bg-secondary hover:bg-secondary/90">
                Start Conversation
              </Button>
            </div>
          </div>
        </Card>

        {/* Chat Messages */}
        <Card className="flex-1 p-6 mb-4 overflow-y-auto shadow-sm">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender === "ai" && (
                  <Avatar className="h-10 w-10 bg-primary flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-primary-foreground" />
                  </Avatar>
                )}
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button onClick={handleSend} className="bg-primary hover:bg-primary/90">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default Companion;
