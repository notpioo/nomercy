import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Image, Activity, Crown, Shield, UserCog } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { collection, getDocs, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User, Activity as ActivityType, Stats, UserRole } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

export default function DashboardOwner() {
  const { currentUser, firebaseUser } = useAuth();
  const { toast } = useToast();

  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  useEffect(() => {
    const unsubscribeUsers = onSnapshot(collection(db, "users"), (usersSnapshot) => {
      const usersData = usersSnapshot.docs.map(doc => doc.data() as User);
      
      const now = Date.now();
      const oneDayAgo = now - (24 * 60 * 60 * 1000);
      
      setUsers(usersData);
      setStats({
        totalMembers: usersData.length,
        activeToday: usersData.filter(u => u.lastLoginAt > oneDayAgo).length,
        mediaUploads: 0,
        onlineNow: usersData.filter(u => u.status === "online").length,
      });
      setStatsLoading(false);
      setUsersLoading(false);
    });

    const q = query(collection(db, "activities"), orderBy("timestamp", "desc"), limit(15));
    const unsubscribeActivities = onSnapshot(q, (snapshot) => {
      setActivities(snapshot.docs.map(doc => doc.data() as ActivityType));
      setActivitiesLoading(false);
    });

    return () => {
      unsubscribeUsers();
      unsubscribeActivities();
    };
  }, []);

  const updateRoleMutation = useMutation({
    mutationFn: async ({ uid, role }: { uid: string; role: UserRole }) => {
      if (!firebaseUser) throw new Error("Not authenticated");
      
      const token = await firebaseUser.getIdToken();
      const response = await fetch(`/api/users/${uid}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update role");
      }

      return { uid, role };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      toast({
        title: "Role updated",
        description: "User role has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update user role.",
      });
    },
  });

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const adminCount = users?.filter(u => u.role === "admin").length || 0;
  const memberCount = users?.filter(u => u.role === "member").length || 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between bg-gradient-to-r from-primary/10 to-transparent p-6 rounded-lg border-l-4 border-primary">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent mb-2" data-testid="text-dashboard-title">
            Owner Dashboard
          </h1>
          <p className="text-muted-foreground">
            Complete control over the community
          </p>
        </div>
        <Crown className="h-12 w-12 text-primary" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {statsLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4 rounded" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <Card data-testid="card-stat-members" className="border-t-2 border-t-primary">
              <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary" data-testid="text-total-members">{stats?.totalMembers || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {adminCount} admin{adminCount !== 1 ? 's' : ''}, {memberCount} member{memberCount !== 1 ? 's' : ''}
                </p>
              </CardContent>
            </Card>

            <Card data-testid="card-stat-active" className="border-t-2 border-t-orange-500">
              <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Today</CardTitle>
                <Activity className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-500" data-testid="text-active-today">{stats?.activeToday || 0}</div>
                <p className="text-xs text-muted-foreground">In the last 24h</p>
              </CardContent>
            </Card>

            <Card data-testid="card-stat-online" className="border-t-2 border-t-status-online">
              <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Online Now</CardTitle>
                <div className="h-2 w-2 bg-status-online rounded-full animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-status-online" data-testid="text-online-now">{stats?.onlineNow || 0}</div>
                <p className="text-xs text-muted-foreground">Currently playing</p>
              </CardContent>
            </Card>

            <Card data-testid="card-stat-media" className="border-t-2 border-t-primary">
              <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Media Shared</CardTitle>
                <Image className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary" data-testid="text-media-uploads">{stats?.mediaUploads || 0}</div>
                <p className="text-xs text-muted-foreground">Epic moments</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Complete role and permission control</CardDescription>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-md border">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-9 w-32" />
                  </div>
                ))}
              </div>
            ) : users && users.length > 0 ? (
              <div className="space-y-3">
                {users.map((user) => {
                  const roleColor = {
                    member: "bg-blue-500",
                    admin: "bg-purple-500",
                    owner: "bg-primary",
                  }[user.role];

                  const roleIcon = {
                    member: Users,
                    admin: Shield,
                    owner: Crown,
                  }[user.role];

                  const RoleIcon = roleIcon;

                  return (
                    <div
                      key={user.uid}
                      className="flex items-center gap-4 p-4 rounded-md border border-border hover-elevate"
                      data-testid={`user-${user.uid}`}
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.photoURL} />
                          <AvatarFallback className={roleColor}>
                            {getInitials(user.displayName)}
                          </AvatarFallback>
                        </Avatar>
                        {user.status === "online" && (
                          <div className="absolute bottom-0 right-0 h-3 w-3 bg-status-online border-2 border-card rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">
                            {user.displayName}
                          </p>
                          <RoleIcon className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                      <Select
                        value={user.role}
                        onValueChange={(role: UserRole) => {
                          if (user.uid !== currentUser?.uid) {
                            updateRoleMutation.mutate({ uid: user.uid, role });
                          }
                        }}
                        disabled={user.uid === currentUser?.uid}
                      >
                        <SelectTrigger className="w-32" data-testid={`select-role-${user.uid}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="owner">Owner</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No users found</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
            <CardDescription>Audit trail of all actions</CardDescription>
          </CardHeader>
          <CardContent className="max-h-[600px] overflow-y-auto">
            {activitiesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : activities && activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3" data-testid={`activity-${activity.id}`}>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={activity.userPhotoURL} />
                      <AvatarFallback className="text-xs">
                        {getInitials(activity.userName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{getTimeAgo(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No activity logs</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
