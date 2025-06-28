import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Users, TrendingUp, DollarSign, Activity, AlertTriangle } from "lucide-react";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const { user } = useAuth();

  const [, setLocation] = useLocation();

  // Redirect if not admin
  if (user?.role !== "admin") {
    setLocation("/");
    return null;
  }

  const stats = [
    {
      title: "Total Users",
      value: "1",
      icon: Users,
      color: "text-indigo-400",
      bg: "bg-indigo-500/20",
    },
    {
      title: "Total MC in Circulation",
      value: user?.mercyCoins?.toLocaleString() || "0",
      icon: DollarSign,
      color: "text-yellow-400",
      bg: "bg-yellow-500/20",
    },
    {
      title: "Games Played Today",
      value: "0",
      icon: Activity,
      color: "text-green-400",
      bg: "bg-green-500/20",
    },
    {
      title: "Platform Revenue",
      value: "0 MC",
      icon: TrendingUp,
      color: "text-violet-400",
      bg: "bg-violet-500/20",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "User Registration",
      user: user?.username || "User",
      timestamp: "Just now",
      type: "info",
    },
  ];

  const adminActions = [
    {
      title: "User Management",
      description: "Manage user accounts, roles, and permissions",
      icon: Users,
      action: () => console.log("User management"),
    },
    {
      title: "Game Settings",
      description: "Configure game parameters and house edge",
      icon: Settings,
      action: () => console.log("Game settings"),
    },
    {
      title: "Financial Overview",
      description: "View detailed financial reports and analytics",
      icon: TrendingUp,
      action: () => console.log("Financial overview"),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 pb-24 lg:pb-6">
      <div className="max-w-7xl mx-auto lg:px-6">
        <div className="p-4 lg:p-0 lg:mt-6">
          <div className="flex items-center space-x-3 mb-6">
            <Settings className="w-8 h-8 text-red-400" />
            <h1 className="text-2xl font-bold text-slate-50">Admin Dashboard</h1>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat) => (
              <Card key={stat.title} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">{stat.title}</p>
                      <p className="text-2xl font-bold text-slate-50">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bg}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Admin Actions */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-50">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {adminActions.map((action) => (
                  <div
                    key={action.title}
                    className="flex items-center space-x-4 p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors cursor-pointer"
                    onClick={action.action}
                  >
                    <div className="p-2 bg-slate-600 rounded-lg">
                      <action.icon className="w-5 h-5 text-slate-300" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-50">{action.title}</h3>
                      <p className="text-sm text-slate-400">{action.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-50">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-3 bg-slate-700 rounded-lg">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-50">{activity.action}</p>
                        <p className="text-xs text-slate-400">
                          {activity.user} • {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Health */}
          <Card className="bg-slate-800 border-slate-700 mt-6">
            <CardHeader>
              <CardTitle className="text-slate-50 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-green-400" />
                <span>System Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-2"></div>
                  <p className="text-sm text-slate-50">Database</p>
                  <p className="text-xs text-slate-400">Operational</p>
                </div>
                <div className="text-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-2"></div>
                  <p className="text-sm text-slate-50">Authentication</p>
                  <p className="text-xs text-slate-400">Operational</p>
                </div>
                <div className="text-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-2"></div>
                  <p className="text-sm text-slate-50">Games</p>
                  <p className="text-xs text-slate-400">Operational</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
