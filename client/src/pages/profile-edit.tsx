import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Crown,
  Shield,
  Users,
  X,
  Check,
  Camera,
  Upload,
  CalendarIcon,
  MapPin,
  Gamepad2,
  ArrowLeft,
} from "lucide-react";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useLocation } from "wouter";

export default function ProfileEdit() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isSaving, setIsSaving] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [displayName, setDisplayName] = useState(
    currentUser?.displayName || "",
  );
  const [bio, setBio] = useState(currentUser?.bio || "");
  const [birthday, setBirthday] = useState<Date | undefined>(
    currentUser?.birthday ? new Date(currentUser.birthday) : undefined,
  );
  const [gender, setGender] = useState(currentUser?.gender || "");
  const [userLocation, setUserLocation] = useState(currentUser?.location || "");
  const [gamingPlatforms, setGamingPlatforms] = useState<string[]>(
    currentUser?.gamingPlatforms || [],
  );
  const [favoriteGames, setFavoriteGames] = useState(
    currentUser?.favoriteGames?.join(", ") || "",
  );
  const [discordLink, setDiscordLink] = useState(
    currentUser?.socialLinks?.discord || "",
  );
  const [steamLink, setSteamLink] = useState(
    currentUser?.socialLinks?.steam || "",
  );
  const [twitchLink, setTwitchLink] = useState(
    currentUser?.socialLinks?.twitch || "",
  );
  const [showEmail, setShowEmail] = useState(
    currentUser?.privacySettings?.showEmail || false,
  );
  const [showBirthday, setShowBirthday] = useState(
    currentUser?.privacySettings?.showBirthday || false,
  );
  const [showLocation, setShowLocation] = useState(
    currentUser?.privacySettings?.showLocation || false,
  );
  const [bannerURL, setBannerURL] = useState(currentUser?.bannerURL || "");
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || "");

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
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      toast({ title: "Uploading banner..." });
      const { url } = await uploadToCloudinary(file);
      setBannerURL(url);
      toast({ title: "Banner uploaded successfully!" });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to upload banner",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      toast({ title: "Uploading avatar..." });
      const { url } = await uploadToCloudinary(file);
      setPhotoURL(url);
      toast({ title: "Avatar uploaded successfully!" });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to upload avatar",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const togglePlatform = (platform: string) => {
    setGamingPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform],
    );
  };

  const handleSave = async () => {
    if (!currentUser) return;

    setIsSaving(true);
    try {
      const updateData = {
        displayName,
        bio,
        birthday: birthday ? birthday.getTime() : null,
        gender: gender || null,
        location: userLocation,
        gamingPlatforms,
        favoriteGames: favoriteGames
          .split(",")
          .map((g) => g.trim())
          .filter(Boolean),
        socialLinks: {
          discord: discordLink,
          steam: steamLink,
          twitch: twitchLink,
        },
        privacySettings: {
          showEmail,
          showBirthday,
          showLocation,
        },
        bannerURL,
        photoURL,
      };

      await updateDoc(doc(db, "users", currentUser.uid), updateData);

      toast({
        title: "Profile updated!",
        description: "Your profile has been saved successfully.",
      });

      // Redirect back to profile view
      setLocation("/profile");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setLocation("/profile");
  };

  const platformOptions = [
    "PC",
    "PlayStation",
    "Xbox",
    "Nintendo Switch",
    "Mobile",
  ];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header with Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleCancel} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
              Edit Profile
            </h1>
            <p className="text-muted-foreground">
              Update your personal information
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Check className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Banner and Avatar Section */}
      <Card className="overflow-hidden">
        <div className="relative">
          {/* Banner */}
          <div
            className={cn(
              "h-48 bg-gradient-to-r relative",
              roleColor === "bg-primary" && "from-primary/20 to-orange-500/20",
              roleColor === "bg-purple-500" &&
                "from-purple-500/20 to-pink-500/20",
              roleColor === "bg-blue-500" && "from-blue-500/20 to-cyan-500/20",
            )}
          >
            {bannerURL && (
              <img
                src={bannerURL}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            )}
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4"
              onClick={() => bannerInputRef.current?.click()}
            >
              <Camera className="h-4 w-4 mr-2" />
              Change Banner
            </Button>
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleBannerUpload}
            />
          </div>

          {/* Avatar */}
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-card">
                <AvatarImage src={photoURL} />
                <AvatarFallback className={`${roleColor} text-white text-3xl`}>
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                onClick={() => avatarInputRef.current?.click()}
              >
                <Upload className="h-4 w-4" />
              </Button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>
          </div>
        </div>

        <CardContent className="pt-20 pb-6">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="gap-1">
              <RoleIcon className="h-3 w-3" />
              {currentUser.role}
            </Badge>
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
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Birthday</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !birthday && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {birthday ? format(birthday, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={birthday}
                      onSelect={setBirthday}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">
                <MapPin className="h-4 w-4 inline mr-1" />
                Location
              </Label>
              <Input
                id="location"
                placeholder="City, Country"
                value={userLocation}
                onChange={(e) => setUserLocation(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Privacy Settings</CardTitle>
            <CardDescription>Control what others can see</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Email</Label>
                <p className="text-xs text-muted-foreground">
                  Display email on profile
                </p>
              </div>
              <Switch checked={showEmail} onCheckedChange={setShowEmail} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Birthday</Label>
                <p className="text-xs text-muted-foreground">
                  Display birthday publicly
                </p>
              </div>
              <Switch
                checked={showBirthday}
                onCheckedChange={setShowBirthday}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Location</Label>
                <p className="text-xs text-muted-foreground">
                  Display location publicly
                </p>
              </div>
              <Switch
                checked={showLocation}
                onCheckedChange={setShowLocation}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gaming Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <Gamepad2 className="h-5 w-5 inline mr-2" />
              Gaming Platforms
            </CardTitle>
            <CardDescription>Select your gaming platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {platformOptions.map((platform) => (
                <Badge
                  key={platform}
                  variant={
                    gamingPlatforms.includes(platform) ? "default" : "outline"
                  }
                  className="cursor-pointer transition-all"
                  onClick={() => togglePlatform(platform)}
                >
                  {platform}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Favorite Games</CardTitle>
            <CardDescription>
              Comma-separated list of your favorite games
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Valorant, CS2, League of Legends..."
              value={favoriteGames}
              onChange={(e) => setFavoriteGames(e.target.value)}
              rows={3}
            />
          </CardContent>
        </Card>
      </div>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
          <CardDescription>Connect your gaming profiles</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="discord">Discord</Label>
            <Input
              id="discord"
              placeholder="username#1234"
              value={discordLink}
              onChange={(e) => setDiscordLink(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="steam">Steam</Label>
            <Input
              id="steam"
              placeholder="steamcommunity.com/id/..."
              value={steamLink}
              onChange={(e) => setSteamLink(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitch">Twitch</Label>
            <Input
              id="twitch"
              placeholder="twitch.tv/..."
              value={twitchLink}
              onChange={(e) => setTwitchLink(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
