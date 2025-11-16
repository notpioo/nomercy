import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Shield, Users, Edit2, MapPin, Gamepad2, Calendar, Mail, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useLocation } from "wouter";

export default function Profile() {
  const { currentUser } = useAuth();
  const [, setLocation] = useLocation();

  if (!currentUser) return null;

  const roleColor = {
    member: "bg-blue-500",
    admin: "bg-purple-500",
    owner: "bg-primary",
  }[currentUser.role];

  const roleIcon = {
    member: Users,
    admin: Shield,
    owner: Crown,
  }[currentUser.role];

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
      {/* Header with Edit Button */}
      <div className="flex items-center justify-end">
        <Button 
          onClick={() => setLocation("/profile/edit")} 
          className="gap-2"
          data-testid="button-edit-profile"
        >
          <Edit2 className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>

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
            {currentUser.bannerURL && (
              <img src={currentUser.bannerURL} alt="Banner" className="w-full h-full object-cover" />
            )}
          </div>

          {/* Avatar */}
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-card">
                <AvatarImage src={currentUser.photoURL} />
                <AvatarFallback className={`${roleColor} text-white text-3xl`}>
                  {getInitials(currentUser.displayName)}
                </AvatarFallback>
              </Avatar>
              <div
                className={`absolute bottom-2 right-2 h-6 w-6 ${getStatusColor(currentUser.status)} border-4 border-card rounded-full`}
                title={currentUser.status}
              />
            </div>
          </div>
        </div>

        <CardContent className="pt-20 pb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-2xl font-bold">{currentUser.displayName}</h2>
                <Badge variant="secondary" className="gap-1">
                  <RoleIcon className="h-3 w-3" />
                  {currentUser.role}
                </Badge>
                <Badge variant="outline" className="gap-1 capitalize">
                  <div className={`h-2 w-2 ${getStatusColor(currentUser.status)} rounded-full`} />
                  {currentUser.status}
                </Badge>
              </div>

              {/* Gaming Platforms & Favorite Games - Side by Side */}
              {((currentUser.gamingPlatforms && currentUser.gamingPlatforms.length > 0) || 
                (currentUser.favoriteGames && currentUser.favoriteGames.length > 0)) && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Gaming Platforms */}
                  {currentUser.gamingPlatforms && currentUser.gamingPlatforms.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Gamepad2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Gaming Platforms</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {currentUser.gamingPlatforms.map((platform) => (
                          <Badge key={platform} variant="default" className="text-xs">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Favorite Games */}
                  {currentUser.favoriteGames && currentUser.favoriteGames.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Favorite Games</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {currentUser.favoriteGames.map((game, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {game}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Bio with Box - Full width to match profile card */}
              {currentUser.bio && (
                <div className="p-4 rounded-md bg-muted/50 border border-border w-full">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Bio</p>
                  <p className="text-sm text-foreground leading-relaxed">{currentUser.bio}</p>
                </div>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              Member since {format(new Date(currentUser.createdAt), "MMM yyyy")}
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
            <CardDescription>Your profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email */}
            <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{currentUser.email}</p>
              </div>
            </div>

            {/* Birthday */}
            {currentUser.birthday && (
              <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Birthday</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(currentUser.birthday), "MMMM d, yyyy")}
                  </p>
                </div>
              </div>
            )}

            {/* Gender */}
            {currentUser.gender && (
              <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50">
                <UserIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Gender</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {currentUser.gender.replace(/_/g, " ")}
                  </p>
                </div>
              </div>
            )}

            {/* Location */}
            {currentUser.location && (
              <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{currentUser.location}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Social Links - Moved to Sidebar */}
        {(currentUser.socialLinks?.discord || currentUser.socialLinks?.steam || currentUser.socialLinks?.twitch) && (
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>Connected accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentUser.socialLinks.discord && (
                <div className="p-3 rounded-md bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Discord</p>
                  <p className="text-sm font-medium truncate">{currentUser.socialLinks.discord}</p>
                </div>
              )}
              {currentUser.socialLinks.steam && (
                <div className="p-3 rounded-md bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Steam</p>
                  <p className="text-sm font-medium truncate">{currentUser.socialLinks.steam}</p>
                </div>
              )}
              {currentUser.socialLinks.twitch && (
                <div className="p-3 rounded-md bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Twitch</p>
                  <p className="text-sm font-medium truncate">{currentUser.socialLinks.twitch}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}