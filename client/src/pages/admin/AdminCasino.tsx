import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Gamepad2, 
  Settings, 
  Edit, 
  Save, 
  RotateCcw,
  Bomb, 
  Building, 
  Coins,
  TrendingUp,
  AlertTriangle,
  Plus,
  Trash2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { GameSettings } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminCasino() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedGame, setSelectedGame] = useState<"coinflip" | "mine" | "tower">("coinflip");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});

  // Fetch game settings
  const { data: gameSettings = [], isLoading } = useQuery<GameSettings[]>({
    queryKey: ['/api/admin/game-settings'],
    queryFn: async () => {
      const response = await fetch('/api/admin/game-settings', {
        headers: {
          'x-user-id': user?.id || 'admin-demo',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch game settings');
      return response.json();
    },
    enabled: !!user,
  });

  // Update game settings mutation
  const updateGameSettingsMutation = useMutation({
    mutationFn: async (data: { gameType: string; settings: any }) => {
      const response = await apiRequest('PATCH', `/api/admin/game-settings/${data.gameType}`, data.settings);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/game-settings'] });
      setEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Game settings updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update game settings",
        variant: "destructive",
      });
    },
  });

  const getCurrentSettings = (gameType: string) => {
    const found = gameSettings.find(g => g.gameType === gameType);
    if (found) return found;
    
    return {
      gameType,
      settings: getDefaultSettings(gameType),
      isActive: true,
    };
  };

  const getDefaultSettings = (gameType: string) => {
    switch (gameType) {
      case 'coinflip':
        return {
          minBet: 10,
          maxBet: 1000,
          houseEdge: 2.5,
          multipliers: [1.95]
        };
      case 'mine':
        return {
          minBet: 10,
          maxBet: 1000,
          houseEdge: 3.0,
          difficultyLevels: [
            { name: "Easy", mines: 3, multiplier: 2.0 },
            { name: "Medium", mines: 5, multiplier: 3.5 },
            { name: "Hard", mines: 8, multiplier: 6.0 },
            { name: "Extreme", mines: 12, multiplier: 12.0 }
          ]
        };
      case 'tower':
        return {
          minBet: 10,
          maxBet: 1000,
          houseEdge: 2.8,
          towerLevels: Array.from({ length: 20 }, (_, i) => ({
            level: i + 1,
            multiplier: 1.1 + (i * 0.15),
            difficulty: Math.min(10 + (i * 2), 80)
          }))
        };
      default:
        return {};
    }
  };

  const handleEditSettings = (gameType: "coinflip" | "mine" | "tower") => {
    const settings = getCurrentSettings(gameType);
    setSelectedGame(gameType);
    setFormData(settings);
    setEditDialogOpen(true);
  };

  const handleSaveSettings = () => {
    updateGameSettingsMutation.mutate({
      gameType: selectedGame,
      settings: formData.settings
    });
  };

  const addDifficultyLevel = () => {
    if (formData.settings?.difficultyLevels) {
      setFormData({
        ...formData,
        settings: {
          ...formData.settings,
          difficultyLevels: [
            ...formData.settings.difficultyLevels,
            { name: "New Level", mines: 5, multiplier: 2.0 }
          ]
        }
      });
    }
  };

  const removeDifficultyLevel = (index: number) => {
    if (formData.settings?.difficultyLevels) {
      const newLevels = [...formData.settings.difficultyLevels];
      newLevels.splice(index, 1);
      setFormData({
        ...formData,
        settings: {
          ...formData.settings,
          difficultyLevels: newLevels
        }
      });
    }
  };

  const updateDifficultyLevel = (index: number, field: string, value: any) => {
    if (formData.settings?.difficultyLevels) {
      const newLevels = [...formData.settings.difficultyLevels];
      newLevels[index] = { ...newLevels[index], [field]: value };
      setFormData({
        ...formData,
        settings: {
          ...formData.settings,
          difficultyLevels: newLevels
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-700 rounded w-64"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-slate-800 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  const coinflipSettings = getCurrentSettings('coinflip');
  const mineSettings = getCurrentSettings('mine');
  const towerSettings = getCurrentSettings('tower');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Casino Management
          </h1>
          <p className="text-slate-400 mt-1">Configure game settings and rewards</p>
        </div>
      </div>

      {/* Game Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Coinflip */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-slate-50 flex items-center gap-2">
              <Coins className="h-5 w-5 text-yellow-400" />
              Coinflip
              <Badge 
                variant="outline" 
                className={coinflipSettings.isActive ? 'text-green-400 border-green-500/30' : 'text-red-400 border-red-500/30'}
              >
                {coinflipSettings.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Min Bet</p>
                <p className="text-slate-50 font-semibold">{coinflipSettings.settings.minBet} MC</p>
              </div>
              <div>
                <p className="text-slate-400">Max Bet</p>
                <p className="text-slate-50 font-semibold">{coinflipSettings.settings.maxBet} MC</p>
              </div>
              <div>
                <p className="text-slate-400">House Edge</p>
                <p className="text-slate-50 font-semibold">{coinflipSettings.settings.houseEdge}%</p>
              </div>
              <div>
                <p className="text-slate-400">Multiplier</p>
                <p className="text-slate-50 font-semibold">{coinflipSettings.settings.multipliers?.[0] || 1.95}x</p>
              </div>
            </div>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => handleEditSettings('coinflip')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </Button>
          </CardContent>
        </Card>

        {/* Mine */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-slate-50 flex items-center gap-2">
              <Bomb className="h-5 w-5 text-red-400" />
              Mine
              <Badge 
                variant="outline" 
                className={mineSettings.isActive ? 'text-green-400 border-green-500/30' : 'text-red-400 border-red-500/30'}
              >
                {mineSettings.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Min Bet</p>
                <p className="text-slate-50 font-semibold">{mineSettings.settings.minBet} MC</p>
              </div>
              <div>
                <p className="text-slate-400">Max Bet</p>
                <p className="text-slate-50 font-semibold">{mineSettings.settings.maxBet} MC</p>
              </div>
              <div>
                <p className="text-slate-400">House Edge</p>
                <p className="text-slate-50 font-semibold">{mineSettings.settings.houseEdge}%</p>
              </div>
              <div>
                <p className="text-slate-400">Difficulty Levels</p>
                <p className="text-slate-50 font-semibold">{mineSettings.settings.difficultyLevels?.length || 4}</p>
              </div>
            </div>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => handleEditSettings('mine')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </Button>
          </CardContent>
        </Card>

        {/* Tower */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-slate-50 flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-400" />
              Tower
              <Badge 
                variant="outline" 
                className={towerSettings.isActive ? 'text-green-400 border-green-500/30' : 'text-red-400 border-red-500/30'}
              >
                {towerSettings.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Min Bet</p>
                <p className="text-slate-50 font-semibold">{towerSettings.settings.minBet} MC</p>
              </div>
              <div>
                <p className="text-slate-400">Max Bet</p>
                <p className="text-slate-50 font-semibold">{towerSettings.settings.maxBet} MC</p>
              </div>
              <div>
                <p className="text-slate-400">House Edge</p>
                <p className="text-slate-50 font-semibold">{towerSettings.settings.houseEdge}%</p>
              </div>
              <div>
                <p className="text-slate-400">Tower Levels</p>
                <p className="text-slate-50 font-semibold">{towerSettings.settings.towerLevels?.length || 20}</p>
              </div>
            </div>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => handleEditSettings('tower')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Game Statistics */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-slate-50 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            Game Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">87%</p>
              <p className="text-slate-400 text-sm">Coinflip Popularity</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">64%</p>
              <p className="text-slate-400 text-sm">Mine Popularity</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">71%</p>
              <p className="text-slate-400 text-sm">Tower Popularity</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Settings Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-slate-50 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configure {selectedGame?.toUpperCase()} Settings
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="basic" className="space-y-4">
            <TabsList className="bg-slate-700">
              <TabsTrigger value="basic">Basic Settings</TabsTrigger>
              {selectedGame === 'mine' && <TabsTrigger value="difficulty">Difficulty Levels</TabsTrigger>}
              {selectedGame === 'tower' && <TabsTrigger value="levels">Tower Levels</TabsTrigger>}
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minBet">Minimum Bet (MC)</Label>
                  <Input
                    id="minBet"
                    type="number"
                    value={formData.settings?.minBet || 10}
                    onChange={(e) => setFormData({
                      ...formData,
                      settings: { ...formData.settings, minBet: parseInt(e.target.value) }
                    })}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div>
                  <Label htmlFor="maxBet">Maximum Bet (MC)</Label>
                  <Input
                    id="maxBet"
                    type="number"
                    value={formData.settings?.maxBet || 1000}
                    onChange={(e) => setFormData({
                      ...formData,
                      settings: { ...formData.settings, maxBet: parseInt(e.target.value) }
                    })}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div>
                  <Label htmlFor="houseEdge">House Edge (%)</Label>
                  <Input
                    id="houseEdge"
                    type="number"
                    step="0.1"
                    value={formData.settings?.houseEdge || 2.5}
                    onChange={(e) => setFormData({
                      ...formData,
                      settings: { ...formData.settings, houseEdge: parseFloat(e.target.value) }
                    })}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive">Game Active</Label>
                </div>
              </div>
            </TabsContent>

            {selectedGame === 'mine' && (
              <TabsContent value="difficulty" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-50">Difficulty Levels</h3>
                  <Button onClick={addDifficultyLevel} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Level
                  </Button>
                </div>
                <div className="space-y-4">
                  {formData.settings?.difficultyLevels?.map((level: any, index: number) => (
                    <Card key={index} className="bg-slate-700/50 border-slate-600">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-4 gap-4 items-end">
                          <div>
                            <Label>Level Name</Label>
                            <Input
                              value={level.name}
                              onChange={(e) => updateDifficultyLevel(index, 'name', e.target.value)}
                              className="bg-slate-600 border-slate-500"
                            />
                          </div>
                          <div>
                            <Label>Mines</Label>
                            <Input
                              type="number"
                              value={level.mines}
                              onChange={(e) => updateDifficultyLevel(index, 'mines', parseInt(e.target.value))}
                              className="bg-slate-600 border-slate-500"
                            />
                          </div>
                          <div>
                            <Label>Multiplier</Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={level.multiplier}
                              onChange={(e) => updateDifficultyLevel(index, 'multiplier', parseFloat(e.target.value))}
                              className="bg-slate-600 border-slate-500"
                            />
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeDifficultyLevel(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            )}

            {selectedGame === 'tower' && (
              <TabsContent value="levels" className="space-y-4">
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {formData.settings?.towerLevels?.map((level: any, index: number) => (
                    <div key={index} className="grid grid-cols-3 gap-4 p-3 bg-slate-700/30 rounded">
                      <div>
                        <Label>Level {level.level}</Label>
                      </div>
                      <div>
                        <Label>Multiplier</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={level.multiplier}
                          onChange={(e) => {
                            const newLevels = [...formData.settings.towerLevels];
                            newLevels[index].multiplier = parseFloat(e.target.value);
                            setFormData({
                              ...formData,
                              settings: { ...formData.settings, towerLevels: newLevels }
                            });
                          }}
                          className="bg-slate-600 border-slate-500 text-sm"
                        />
                      </div>
                      <div>
                        <Label>Difficulty</Label>
                        <Input
                          type="number"
                          value={level.difficulty}
                          onChange={(e) => {
                            const newLevels = [...formData.settings.towerLevels];
                            newLevels[index].difficulty = parseInt(e.target.value);
                            setFormData({
                              ...formData,
                              settings: { ...formData.settings, towerLevels: newLevels }
                            });
                          }}
                          className="bg-slate-600 border-slate-500 text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}

            <TabsContent value="advanced" className="space-y-4">
              <Card className="bg-slate-700/30 border-slate-600">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    <h4 className="font-semibold text-slate-50">Advanced Settings</h4>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">
                    These settings directly affect game economy and player experience. 
                    Changes should be made carefully.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <Label>Risk Management</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger className="bg-slate-600 border-slate-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Risk</SelectItem>
                          <SelectItem value="medium">Medium Risk</SelectItem>
                          <SelectItem value="high">High Risk</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Auto-balance Economy</Label>
                      <div className="flex items-center space-x-2 mt-2">
                        <Switch id="autoBalance" defaultChecked />
                        <Label htmlFor="autoBalance" className="text-sm">
                          Automatically adjust payouts based on player activity
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSaveSettings}
                disabled={updateGameSettingsMutation.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                {updateGameSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}