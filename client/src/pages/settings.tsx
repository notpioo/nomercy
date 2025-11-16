import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, Crown } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [communityName, setCommunityName] = useState("NoMercy");
  const [communityDescription, setCommunityDescription] = useState("Gaming Community");

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Community settings have been updated successfully.",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-page-title">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage community configuration and preferences
          </p>
        </div>
        <Crown className="h-12 w-12 text-primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Community Information</CardTitle>
            <CardDescription>Update basic community details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="community-name">Community Name</Label>
              <Input
                id="community-name"
                value={communityName}
                onChange={(e) => setCommunityName(e.target.value)}
                data-testid="input-community-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="community-description">Description</Label>
              <Input
                id="community-description"
                value={communityDescription}
                onChange={(e) => setCommunityDescription(e.target.value)}
                data-testid="input-community-description"
              />
            </div>

            <Button onClick={handleSave} data-testid="button-save-settings">
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cloudinary Configuration</CardTitle>
            <CardDescription>Media storage settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Cloud Name</Label>
              <Input value="dvybhadnh" disabled />
            </div>

            <div className="space-y-2">
              <Label>Upload Preset</Label>
              <Input value="nomercy_uploads" disabled />
              <p className="text-xs text-muted-foreground">
                Configure this preset in your Cloudinary dashboard
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Firebase Configuration</CardTitle>
            <CardDescription>Authentication and database settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Project ID</Label>
              <Input value="nomercy-fb35b" disabled />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-status-online rounded-full" />
                <span className="text-sm text-foreground">Connected</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Role Permissions</CardTitle>
            <CardDescription>Configure access levels for each role</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Owner</p>
                  <p className="text-xs text-muted-foreground">Full access to all features</p>
                </div>
                <Crown className="h-4 w-4 text-primary" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Admin</p>
                  <p className="text-xs text-muted-foreground">Manage users and content</p>
                </div>
                <SettingsIcon className="h-4 w-4 text-purple-500" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Member</p>
                  <p className="text-xs text-muted-foreground">View and upload content</p>
                </div>
                <SettingsIcon className="h-4 w-4 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
