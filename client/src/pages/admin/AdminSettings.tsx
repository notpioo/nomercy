import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  Database, 
  Shield, 
  Bell, 
  Globe,
  Zap,
  Save,
  RotateCcw,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "NoMercy Gaming",
    siteDescription: "Premier gaming platform with casino games and tournaments",
    maintenanceMode: false,
    registrationEnabled: true,
    
    // Economy Settings
    defaultStartingCoins: 1000,
    defaultStartingGems: 50,
    dailyBonusCoins: 100,
    dailyBonusGems: 5,
    maxBetLimit: 10000,
    minBetLimit: 10,
    
    // Security Settings
    maxLoginAttempts: 5,
    sessionTimeout: 24, // hours
    passwordMinLength: 6,
    twoFactorEnabled: false,
    ipWhitelistEnabled: false,
    
    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    discordWebhook: "",
    
    // Game Settings
    houseEdgeGlobal: 2.5,
    maxWinningsPerDay: 50000,
    antiCheatEnabled: true,
    gameLogging: true,
  });

  const handleSave = () => {
    // Here you would save settings to the backend
    toast({
      title: "Settings Saved",
      description: "System settings have been updated successfully",
    });
  };

  const handleReset = () => {
    // Reset to default values
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-400 to-slate-400 bg-clip-text text-transparent">
            System Settings
          </h1>
          <p className="text-slate-400 mt-1">Configure platform-wide settings and preferences</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="bg-slate-700">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="economy">Economy</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="games">Games</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-slate-50 flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Site Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div>
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Input
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
              </div>
              
              <Separator className="bg-slate-600" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Maintenance Mode</Label>
                    <p className="text-slate-400 text-sm">Temporarily disable site for maintenance</p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>User Registration</Label>
                    <p className="text-slate-400 text-sm">Allow new users to register</p>
                  </div>
                  <Switch
                    checked={settings.registrationEnabled}
                    onCheckedChange={(checked) => setSettings({...settings, registrationEnabled: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Economy Settings */}
        <TabsContent value="economy" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-slate-50 flex items-center gap-2">
                <Database className="h-5 w-5" />
                Economy Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="defaultStartingCoins">Starting Coins</Label>
                  <Input
                    id="defaultStartingCoins"
                    type="number"
                    value={settings.defaultStartingCoins}
                    onChange={(e) => setSettings({...settings, defaultStartingCoins: parseInt(e.target.value)})}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div>
                  <Label htmlFor="defaultStartingGems">Starting Gems</Label>
                  <Input
                    id="defaultStartingGems"
                    type="number"
                    value={settings.defaultStartingGems}
                    onChange={(e) => setSettings({...settings, defaultStartingGems: parseInt(e.target.value)})}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div>
                  <Label htmlFor="dailyBonusCoins">Daily Bonus Coins</Label>
                  <Input
                    id="dailyBonusCoins"
                    type="number"
                    value={settings.dailyBonusCoins}
                    onChange={(e) => setSettings({...settings, dailyBonusCoins: parseInt(e.target.value)})}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div>
                  <Label htmlFor="dailyBonusGems">Daily Bonus Gems</Label>
                  <Input
                    id="dailyBonusGems"
                    type="number"
                    value={settings.dailyBonusGems}
                    onChange={(e) => setSettings({...settings, dailyBonusGems: parseInt(e.target.value)})}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
              </div>
              
              <Separator className="bg-slate-600" />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minBetLimit">Minimum Bet Limit</Label>
                  <Input
                    id="minBetLimit"
                    type="number"
                    value={settings.minBetLimit}
                    onChange={(e) => setSettings({...settings, minBetLimit: parseInt(e.target.value)})}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div>
                  <Label htmlFor="maxBetLimit">Maximum Bet Limit</Label>
                  <Input
                    id="maxBetLimit"
                    type="number"
                    value={settings.maxBetLimit}
                    onChange={(e) => setSettings({...settings, maxBetLimit: parseInt(e.target.value)})}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-slate-50 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) => setSettings({...settings, maxLoginAttempts: parseInt(e.target.value)})}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div>
                  <Label htmlFor="passwordMinLength">Min Password Length</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={settings.passwordMinLength}
                    onChange={(e) => setSettings({...settings, passwordMinLength: parseInt(e.target.value)})}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
              </div>
              
              <Separator className="bg-slate-600" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-slate-400 text-sm">Require 2FA for admin accounts</p>
                  </div>
                  <Switch
                    checked={settings.twoFactorEnabled}
                    onCheckedChange={(checked) => setSettings({...settings, twoFactorEnabled: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>IP Whitelist</Label>
                    <p className="text-slate-400 text-sm">Restrict admin access to specific IPs</p>
                  </div>
                  <Switch
                    checked={settings.ipWhitelistEnabled}
                    onCheckedChange={(checked) => setSettings({...settings, ipWhitelistEnabled: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-slate-50 flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-slate-400 text-sm">Send admin alerts via email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-slate-400 text-sm">Browser push notifications</p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => setSettings({...settings, pushNotifications: checked})}
                  />
                </div>
              </div>
              
              <Separator className="bg-slate-600" />
              
              <div>
                <Label htmlFor="discordWebhook">Discord Webhook URL</Label>
                <Input
                  id="discordWebhook"
                  value={settings.discordWebhook}
                  onChange={(e) => setSettings({...settings, discordWebhook: e.target.value})}
                  className="bg-slate-700 border-slate-600"
                  placeholder="https://discord.com/api/webhooks/..."
                />
                <p className="text-slate-400 text-sm mt-1">Send alerts to Discord channel</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Game Settings */}
        <TabsContent value="games" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-slate-50 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Game Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="houseEdgeGlobal">Global House Edge (%)</Label>
                  <Input
                    id="houseEdgeGlobal"
                    type="number"
                    step="0.1"
                    value={settings.houseEdgeGlobal}
                    onChange={(e) => setSettings({...settings, houseEdgeGlobal: parseFloat(e.target.value)})}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div>
                  <Label htmlFor="maxWinningsPerDay">Max Winnings Per Day</Label>
                  <Input
                    id="maxWinningsPerDay"
                    type="number"
                    value={settings.maxWinningsPerDay}
                    onChange={(e) => setSettings({...settings, maxWinningsPerDay: parseInt(e.target.value)})}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
              </div>
              
              <Separator className="bg-slate-600" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Anti-Cheat System</Label>
                    <p className="text-slate-400 text-sm">Enable automated cheat detection</p>
                  </div>
                  <Switch
                    checked={settings.antiCheatEnabled}
                    onCheckedChange={(checked) => setSettings({...settings, antiCheatEnabled: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Game Logging</Label>
                    <p className="text-slate-400 text-sm">Log all game activities for audit</p>
                  </div>
                  <Switch
                    checked={settings.gameLogging}
                    onCheckedChange={(checked) => setSettings({...settings, gameLogging: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-red-500/10 border-red-500/20">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-500/5 rounded-lg border border-red-500/20">
                <div>
                  <Label className="text-red-400">Reset All Game Statistics</Label>
                  <p className="text-slate-400 text-sm">This will permanently delete all game history and statistics</p>
                </div>
                <Button variant="destructive" size="sm">
                  Reset Stats
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-red-500/5 rounded-lg border border-red-500/20">
                <div>
                  <Label className="text-red-400">Clear All User Data</Label>
                  <p className="text-slate-400 text-sm">This will permanently delete all user accounts and data</p>
                </div>
                <Button variant="destructive" size="sm">
                  Clear Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}