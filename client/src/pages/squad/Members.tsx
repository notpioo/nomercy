import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Crown, Shield } from "lucide-react";

export default function Members() {
  const { user } = useAuth();

  const members = [
    {
      id: 1,
      username: user?.username || "You",
      fullName: user?.fullName || "Your Name",
      role: user?.role || "member",
      level: user?.level || 1,
      mercyCoins: user?.mercyCoins || 0,
      joinDate: "2024-01-01",
      status: "online",
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleIcon = (role: string) => {
    return role === "admin" ? <Crown className="w-4 h-4 text-yellow-500" /> : <Shield className="w-4 h-4 text-indigo-500" />;
  };

  const getRoleBadge = (role: string) => {
    return role === "admin" ? (
      <Badge className="bg-yellow-500 text-slate-900">Admin</Badge>
    ) : (
      <Badge variant="secondary" className="bg-indigo-500 text-white">Member</Badge>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 pb-24 lg:pb-6">
      <div className="max-w-4xl mx-auto lg:px-6">
        <div className="p-4 lg:p-0 lg:mt-6">
          <div className="flex items-center space-x-3 mb-6">
            <Users className="w-8 h-8 text-indigo-400" />
            <h1 className="text-2xl font-bold text-slate-50">Squad Members</h1>
            <Badge className="bg-slate-700 text-slate-300">{members.length} members</Badge>
          </div>
          
          <div className="space-y-4">
            {members.map((member) => (
              <Card key={member.id} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold">{getInitials(member.fullName)}</span>
                      </div>
                      {member.status === "online" && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-800"></div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-bold text-slate-50">{member.fullName}</h3>
                        {getRoleIcon(member.role)}
                        {getRoleBadge(member.role)}
                      </div>
                      <p className="text-slate-400 mb-1">@{member.username}</p>
                      <div className="flex items-center space-x-4 text-sm text-slate-400">
                        <span>Level {member.level}</span>
                        <span>{member.mercyCoins.toLocaleString()} MC</span>
                        <span>Joined {new Date(member.joinDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                        member.status === "online" 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-slate-600/20 text-slate-400"
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          member.status === "online" ? "bg-green-400" : "bg-slate-400"
                        }`}></div>
                        <span className="capitalize">{member.status}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {members.length === 0 && (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="text-center py-12">
                  <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-50 mb-2">No members yet</h3>
                  <p className="text-slate-400">Be the first to join the NoMercy squad!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
