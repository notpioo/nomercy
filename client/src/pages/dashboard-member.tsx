
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Image, Activity, Trophy } from "lucide-react";
import { User, Activity as ActivityType, Stats } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { collection, getDocs, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useState, useEffect } from "react";

export default function DashboardMember() {
  const { currentUser } = useAuth();

  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    // Real-time listener for users collection
    const unsubscribeUsers = onSnapshot(collection(db, "users"), (usersSnapshot) => {
      const users = usersSnapshot.docs.map(doc => doc.data() as User);
      
      const now = Date.now();
      const oneDayAgo = now - (24 * 60 * 60 * 1000);
      
      // Get media count
      getDocs(collection(db, "media")).then((mediaSnapshot) => {
        setStats({
          totalMembers: users.length,
          activeToday: users.filter(u => u.lastLoginAt > oneDayAgo).length,
          mediaUploads: mediaSnapshot.size,
          onlineNow: users.filter(u => u.status === "online").length,
        });
        setStatsLoading(false);
      });
    });

    return () => unsubscribeUsers();
  }, []);

  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "activities"), orderBy("timestamp", "desc"), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setActivities(snapshot.docs.map(doc => doc.data() as ActivityType));
      setActivitiesLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const [members, setMembers] = useState<User[]>([]);
  const [membersLoading, setMembersLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allUsers = snapshot.docs.map(doc => doc.data() as User);
      setMembers(allUsers.slice(0, 8));
      setMembersLoading(false);
    });

    return () => unsubscribe();
  }, []);

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

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-primary/10 to-transparent p-6 rounded-lg border-l-4 border-primary">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent mb-2" data-testid="text-dashboard-title">
          Welcome back, {currentUser?.displayName}!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening in the community
        </p>
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
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary" data-testid="text-total-members">{stats?.totalMembers || 0}</div>
                <p className="text-xs text-muted-foreground">Active community</p>
              </CardContent>
            </Card>

            <Card data-testid="card-stat-active" className="border-t-2 border-t-orange-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Today</CardTitle>
                <Activity className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-500" data-testid="text-active-today">{stats?.activeToday || 0}</div>
                <p className="text-xs text-muted-foreground">In the last 24h</p>
              </CardContent>
            </Card>

            <Card data-testid="card-stat-online" className="border-t-2 border-t-status-online">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Online Now</CardTitle>
                <div className="h-2 w-2 bg-status-online rounded-full animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-status-online" data-testid="text-online-now">{stats?.onlineNow || 0}</div>
                <p className="text-xs text-muted-foreground">Currently playing</p>
              </CardContent>
            </Card>

            <Card data-testid="card-stat-media" className="border-t-2 border-t-primary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from the community</CardDescription>
          </CardHeader>
          <CardContent>
            {activitiesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : activities && activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4" data-testid={`activity-${activity.id}`}>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={activity.userPhotoURL} />
                      <AvatarFallback>{getInitials(activity.userName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{getTimeAgo(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Community Members</CardTitle>
            <CardDescription>Active players in the community</CardDescription>
          </CardHeader>
          <CardContent>
            {membersLoading ? (
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : members && members.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {members.map((member) => {
                  const roleColor = {
                    member: "bg-blue-500",
                    admin: "bg-purple-500",
                    owner: "bg-primary",
                  }[member.role];

                  return (
                    <div key={member.uid} className="flex items-center gap-3 p-3 rounded-md hover-elevate" data-testid={`member-${member.uid}`}>
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.photoURL} />
                          <AvatarFallback className={roleColor}>
                            {getInitials(member.displayName)}
                          </AvatarFallback>
                        </Avatar>
                        {member.status === "online" && (
                          <div className="absolute bottom-0 right-0 h-3 w-3 bg-status-online border-2 border-card rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {member.displayName}
                        </p>
                        <Badge variant="secondary" className="text-xs capitalize">
                          {member.role}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No members found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
