import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Bomb, Building, Coins, Trophy, Gamepad2, Users, Calendar } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  const getDisplayName = () => {
    if (!user?.fullName) return "User";
    return user.fullName.split(" ")[0];
  };

  const quickActions = [
    { name: "Play Mine", description: "Test your luck", icon: Bomb, href: "/games/mine", color: "text-indigo-400" },
    { name: "Tower", description: "Climb higher", icon: Building, href: "/games/tower", color: "text-violet-400" },
    { name: "Coinflip", description: "50/50 chance", icon: Coins, href: "/games/coinflip", color: "text-yellow-400" },
    { name: "Tournament", description: "Compete now", icon: Trophy, href: "/squad/tournaments", color: "text-green-400" },
  ];

  const recentActivities = [
    { 
      icon: Gamepad2, 
      title: "Daily login bonus", 
      description: "Day 1 streak • Just now", 
      amount: "+100 MC", 
      positive: true 
    },
  ];

  const topPlayers = [
    { rank: 1, name: "Welcome", initials: "W", level: 1, coins: 100, weeklyGain: 100, color: "from-yellow-500 to-indigo-500" },
    { rank: 2, name: "Player", initials: "P", level: 1, coins: 0, weeklyGain: 0, color: "from-slate-500 to-violet-500" },
    { rank: 3, name: "Example", initials: "E", level: 1, coins: 0, weeklyGain: 0, color: "from-orange-600 to-indigo-500" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 pb-24 lg:pb-6">
      <div className="max-w-7xl mx-auto lg:px-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-indigo-500 to-violet-500 p-6 lg:p-8 m-4 lg:m-0 lg:mt-6 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                Welcome back, {getDisplayName()}!
              </h1>
              <p className="text-purple-100 mb-4">Ready for some action in the NoMercy arena?</p>
              <div className="flex items-center space-x-4">
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <div className="text-sm text-purple-100">Total MC</div>
                  <div className="text-xl font-bold">{user?.mercyCoins?.toLocaleString() || 0}</div>
                </div>
                <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <div className="text-sm text-purple-100">Rank</div>
                  <div className="text-xl font-bold">Rookie</div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white bg-opacity-10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Gamepad2 className="w-16 h-16 text-white opacity-60" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 lg:p-0 lg:mt-6">
          <h2 className="text-xl font-bold mb-4 text-slate-50">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.name} href={action.href}>
                <Button
                  variant="ghost"
                  className="bg-slate-800 hover:bg-slate-700 p-6 rounded-xl transition-colors border border-slate-700 group h-auto w-full"
                >
                  <div className="text-center">
                    <action.icon className={`w-8 h-8 ${action.color} mb-3 group-hover:scale-110 transition-transform mx-auto`} />
                    <div className="font-medium text-slate-50">{action.name}</div>
                    <div className="text-sm text-slate-400">{action.description}</div>
                  </div>
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-4 lg:p-0 lg:mt-6">
          <h2 className="text-xl font-bold mb-4 text-slate-50">Recent Activity</h2>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-0">
              {recentActivities.map((activity, index) => (
                <div key={index} className="p-4 border-b border-slate-700 last:border-b-0 flex items-center space-x-4">
                  <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                    <activity.icon className="text-white w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-50">{activity.title}</div>
                    <div className="text-sm text-slate-400">{activity.description}</div>
                  </div>
                  <div className={`font-medium ${activity.positive ? 'text-green-400' : 'text-slate-400'}`}>
                    {activity.amount}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard Preview */}
        <div className="p-4 lg:p-0 lg:mt-6">
          <h2 className="text-xl font-bold mb-4 text-slate-50">Getting Started</h2>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <p className="text-slate-300 mb-4">
                Welcome to NoMercy! You're starting with 0 MC. Try some games to earn your first coins!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-slate-700 border-slate-600 p-4">
                  <div className="text-center">
                    <Bomb className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                    <h3 className="font-medium text-slate-50">Mine Game</h3>
                    <p className="text-sm text-slate-400">Click tiles to avoid mines</p>
                  </div>
                </Card>
                <Card className="bg-slate-700 border-slate-600 p-4">
                  <div className="text-center">
                    <Users className="w-8 h-8 text-violet-400 mx-auto mb-2" />
                    <h3 className="font-medium text-slate-50">Join Community</h3>
                    <p className="text-sm text-slate-400">Chat with other players</p>
                  </div>
                </Card>
                <Card className="bg-slate-700 border-slate-600 p-4">
                  <div className="text-center">
                    <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <h3 className="font-medium text-slate-50">Tournaments</h3>
                    <p className="text-sm text-slate-400">Compete in events</p>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
