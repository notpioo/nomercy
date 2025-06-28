import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { logoutUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Bomb, Building, Coins, Trophy, Star, Flame } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const gameStats = [
    { name: "Mine", icon: Bomb, wins: 0, losses: 0, winRate: "0%", color: "text-indigo-400" },
    { name: "Tower", icon: Building, wins: 0, losses: 0, winRate: "0%", color: "text-violet-400" },
    { name: "Coinflip", icon: Coins, wins: 0, losses: 0, winRate: "0%", color: "text-yellow-400" },
  ];

  const achievements = [
    { name: "Welcome!", description: "Joined NoMercy community", icon: Star, color: "bg-yellow-500" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 pb-24 lg:pb-6">
      <div className="max-w-7xl mx-auto lg:px-6">
        <div className="p-4 lg:p-0 lg:mt-6">
          <h2 className="text-2xl font-bold mb-6 text-slate-50">Profile</h2>
          
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold">
                        {getInitials(user?.fullName || "User")}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-50">{user?.fullName}</h3>
                      <p className="text-slate-400">@{user?.username}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="bg-indigo-500 text-xs px-3 py-1 rounded-full capitalize">
                          {user?.role}
                        </span>
                        <span className="text-sm text-slate-400">Level {user?.level || 1}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-500">
                        {user?.mercyCoins?.toLocaleString() || 0}
                      </div>
                      <div className="text-sm text-slate-400">Mercy Coins</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">0</div>
                      <div className="text-sm text-slate-400">Games Won</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-slate-300">0</div>
                      <div className="text-sm text-slate-400">Games Lost</div>
                    </div>
                  </div>

                  <Button className="bg-indigo-500 hover:bg-indigo-600">
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Game Statistics */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-50">Game Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {gameStats.map((game) => (
                    <div key={game.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <game.icon className={`w-5 h-5 ${game.color}`} />
                        <span className="text-slate-50">{game.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-slate-50">
                          {game.wins} wins / {game.losses} losses
                        </div>
                        <div className="text-sm text-slate-400">{game.winRate} win rate</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Achievement & Settings */}
            <div className="space-y-6">
              {/* Achievements */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-50">Recent Achievements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${achievement.color} rounded-lg flex items-center justify-center`}>
                        <achievement.icon className="text-white w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-slate-50">{achievement.name}</div>
                        <div className="text-xs text-slate-400">{achievement.description}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Settings */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-50">Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-50">Sound Effects</span>
                    <Switch
                      checked={soundEnabled}
                      onCheckedChange={setSoundEnabled}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-50">Push Notifications</span>
                    <Switch
                      checked={notificationsEnabled}
                      onCheckedChange={setNotificationsEnabled}
                    />
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="destructive"
                    className="w-full"
                  >
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
