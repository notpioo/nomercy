import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Activity as ActivityIcon, UserPlus, Upload, Shield, LogIn } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Activity as ActivityType } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function Activity() {
  const { data: activities, isLoading } = useQuery<ActivityType[]>({
    queryKey: ["/api/activities"],
    queryFn: async () => {
      const q = query(collection(db, "activities"), orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as ActivityType);
    },
  });

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "join":
        return UserPlus;
      case "upload":
        return Upload;
      case "role_change":
        return Shield;
      case "login":
        return LogIn;
      default:
        return ActivityIcon;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "join":
        return "bg-green-500";
      case "upload":
        return "bg-blue-500";
      case "role_change":
        return "bg-purple-500";
      case "login":
        return "bg-primary";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 24) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
      }
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-page-title">
            Community Activity
          </h1>
          <p className="text-muted-foreground">
            Track all actions and events in the community
          </p>
        </div>
        <ActivityIcon className="h-12 w-12 text-primary" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
          <CardDescription>Recent community events and actions</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : activities && activities.length > 0 ? (
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
              
              <div className="space-y-6">
                {activities.map((activity, index) => {
                  const Icon = getActivityIcon(activity.type);
                  const iconColor = getActivityColor(activity.type);

                  return (
                    <div key={activity.id} className="relative flex gap-4" data-testid={`activity-${activity.id}`}>
                      <div className={`relative z-10 flex-shrink-0 h-12 w-12 ${iconColor} rounded-full flex items-center justify-center`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      
                      <div className="flex-1 pt-1">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground mb-1">
                              {activity.description}
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="secondary" className="text-xs capitalize">
                                {activity.type.replace("_", " ")}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(activity.timestamp)}
                              </span>
                            </div>
                          </div>
                          
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={activity.userPhotoURL} />
                            <AvatarFallback>
                              {getInitials(activity.userName)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <ActivityIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No activity recorded yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
