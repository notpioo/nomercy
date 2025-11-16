
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Shield, Users, ArrowLeft, MapPin, Gamepad2, Calendar, Mail, User as UserIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useLocation } from "wouter";

interface MemberProfileProps {
  params: {
    uid: string;
  };
}

export default function MemberProfile({ params }: MemberProfileProps) {
  const { currentUser } = useAuth();
  const [, setLocation] = useLocation();
  const { uid } = params;

  const { data: member, isLoading } = useQuery<User | null>({
    queryKey: [`/api/members/${uid}`],
    queryFn: async () => {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as User;
      }
      return null;
    },
  });

  // Redirect to own profile if viewing own uid
  if (member && currentUser && member.uid === currentUser.uid) {
    setLocation("/profile");
    return null;
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <Skeleton className="h-8 w-48" />
        <Card className="overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <CardContent className="pt-20 pb-6">
            <Skeleton className="h-32 w-32 rounded-full -mt-36 mb-6" />
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-4 w-full max-w-2xl" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <Button variant="ghost" onClick={() => setLocation("/members")} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Members
        </Button>
        <Card>
          <CardContent className="p-12 text-center">
            <UserIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Member not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const roleColor = {
    member: "bg-blue-500",
    admin: "bg-purple-500",
    owner: "bg-primary",
  }[member.role];

  const roleIcon = {
    member: Users,
    admin: Shield,
    owner: Crown,
  }[member.role];

  const RoleIcon = roleIcon;

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getStatusColor = (status: string) => {
    return {
      online: "bg-status-online",
      away: "bg-status-away",
      busy: "bg-status-busy",
      offline: "bg-status-offline",
    }[status] || "bg-status-offline";
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => setLocation("/members")} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Members
      </Button>

      {/* Banner and Avatar Section */}
      <Card className="overflow-hidden">
        <div className="relative">
          {/* Banner */}
          <div className={cn(
            "h-48 bg-gradient-to-r relative",
            roleColor === "bg-primary" && "from-primary/20 to-orange-500/20",
            roleColor === "bg-purple-500" && "from-purple-500/20 to-pink-500/20",
            roleColor === "bg-blue-500" && "from-blue-500/20 to-cyan-500/20"
          )}>
            {member.bannerURL && (
              <img src={member.bannerURL} alt="Banner" className="w-full h-full object-cover" />
            )}
          </div>

          {/* Avatar */}
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-card">
                <AvatarImage src={member.photoURL} />
                <AvatarFallback className={`${roleColor} text-white text-3xl`}>
                  {getInitials(member.displayName)}
                </AvatarFallback>
              </Avatar>
              <div 
                className={`absolute bottom-2 right-2 h-6 w-6 ${getStatusColor(member.status)} border-4 border-card rounded-full`}
                title={member.status}
              />
            </div>
          </div>
        </div>

        <CardContent className="pt-20 pb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{member.displayName}</h2>
                <Badge variant="secondary" className="gap-1">
                  <RoleIcon className="h-3 w-3" />
                  {member.role}
                </Badge>
                <Badge variant="outline" className="gap-1 capitalize">
                  <div className={`h-2 w-2 ${getStatusColor(member.status)} rounded-full`} />
                  {member.status}
                </Badge>
              </div>
              {member.bio && (
                <p className="text-muted-foreground max-w-2xl">{member.bio}</p>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              Member since {format(new Date(member.createdAt), "MMM yyyy")}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Public profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email - respect privacy */}
            {member.privacySettings?.showEmail && (
              <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                </div>
              </div>
            )}

            {/* Birthday - respect privacy */}
            {member.birthday && member.privacySettings?.showBirthday && (
              <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Birthday</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(member.birthday), "MMMM d, yyyy")}
                  </p>
                </div>
              </div>
            )}

            {/* Gender - respect privacy */}
            {member.gender && member.privacySettings?.showBirthday && (
              <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50">
                <UserIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Gender</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {member.gender.replace(/_/g, " ")}
                  </p>
                </div>
              </div>
            )}

            {/* Location - respect privacy */}
            {member.location && member.privacySettings?.showLocation && (
              <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{member.location}</p>
                </div>
              </div>
            )}

            {/* If all info is private */}
            {!member.privacySettings?.showEmail && 
             !member.privacySettings?.showBirthday && 
             !member.privacySettings?.showLocation && (
              <div className="text-center py-8 text-muted-foreground">
                <UserIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>This user has set their profile to private</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Member Stats</CardTitle>
            <CardDescription>Activity overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant="outline" className="capitalize gap-1">
                <div className={`h-2 w-2 ${getStatusColor(member.status)} rounded-full`} />
                {member.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Role</span>
              <Badge variant="secondary" className="capitalize">
                {member.role}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Joined</span>
              <span className="text-sm font-medium">
                {format(new Date(member.createdAt), "MMM yyyy")}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gaming Information */}
      {(member.gamingPlatforms?.length > 0 || member.favoriteGames?.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {member.gamingPlatforms && member.gamingPlatforms.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  <Gamepad2 className="h-5 w-5 inline mr-2" />
                  Gaming Platforms
                </CardTitle>
                <CardDescription>Platforms this member plays on</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {member.gamingPlatforms.map((platform) => (
                    <Badge key={platform} variant="default">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {member.favoriteGames && member.favoriteGames.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Favorite Games</CardTitle>
                <CardDescription>Games this member enjoys</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {member.favoriteGames.map((game, index) => (
                    <Badge key={index} variant="outline">
                      {game}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Social Links */}
      {(member.socialLinks?.discord || member.socialLinks?.steam || member.socialLinks?.twitch) && (
        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
            <CardDescription>Connect with this member</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {member.socialLinks.discord && (
              <div className="p-3 rounded-md bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Discord</p>
                <p className="text-sm font-medium truncate">{member.socialLinks.discord}</p>
              </div>
            )}
            {member.socialLinks.steam && (
              <div className="p-3 rounded-md bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Steam</p>
                <p className="text-sm font-medium truncate">{member.socialLinks.steam}</p>
              </div>
            )}
            {member.socialLinks.twitch && (
              <div className="p-3 rounded-md bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Twitch</p>
                <p className="text-sm font-medium truncate">{member.socialLinks.twitch}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
