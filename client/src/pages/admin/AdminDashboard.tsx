import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Trophy, DollarSign, Gem } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalGamesPlayed: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect if not admin
  if (user?.role !== "admin") {
    setLocation("/");
    return null;
  }

  const { data: stats, isLoading } = useQuery<AdminStats>({
    queryKey: ['/api/admin/stats'],
    queryFn: async () => {
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id || user?.firebaseUid || 'admin-demo',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    },
    enabled: !!user, // Always fetch for any authenticated user
    retry: 1,
    staleTime: 30000, // Cache for 30 seconds
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-50">Admin Dashboard</h1>
          <p className="text-slate-400">Loading platform statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-50">Admin Dashboard</h1>
        <p className="text-slate-400">Overview of platform statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Users</CardTitle>
            <Users className="h-4 w-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-50">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-slate-400">Registered members</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Active Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-50">{stats?.activeUsers || 0}</div>
            <p className="text-xs text-slate-400">Currently active</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Games Played</CardTitle>
            <Trophy className="h-4 w-4 text-violet-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-50">{stats?.totalGamesPlayed || 0}</div>
            <p className="text-xs text-slate-400">Total games completed</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total MC</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-50">{stats?.totalRevenue?.toLocaleString() || 0}</div>
            <p className="text-xs text-slate-400">Mercy Coins in circulation</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-50">Rank System Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-300">🆕 Rookie</span>
                </div>
                <span className="text-slate-400">Level 1-3</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-300">🥉 Bronze</span>
                </div>
                <span className="text-slate-400">Level 1-3</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-300">🥈 Silver</span>
                </div>
                <span className="text-slate-400">Level 1-3</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-300">🥇 Gold</span>
                </div>
                <span className="text-slate-400">Level 1-3</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-300">💎 Platinum</span>
                </div>
                <span className="text-slate-400">Level 1-3</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-300">💠 Diamond</span>
                </div>
                <span className="text-slate-400">Level 1-3</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-50">Currency System</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-yellow-400" />
                  <span className="text-slate-300">Mercy Coins (MC)</span>
                </div>
                <span className="text-slate-400">Primary currency</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Gem className="h-4 w-4 text-purple-400" />
                  <span className="text-slate-300">Gems</span>
                </div>
                <span className="text-slate-400">Premium currency</span>
              </div>
              <div className="text-sm text-slate-400 mt-4 space-y-1">
                <p>• MC: Earned from games, used for betting</p>
                <p>• Gems: Rank rewards, special purchases</p>
                <p>• New users start with 10 MC + 100 Gems</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}