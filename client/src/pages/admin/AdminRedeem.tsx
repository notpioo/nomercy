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
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Gift, 
  Plus, 
  Edit, 
  Trash2, 
  Copy,
  Clock,
  Users,
  Coins,
  Gem,
  Calendar,
  Shuffle,
  Eye,
  EyeOff
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface RedeemCode {
  id: string;
  code: string;
  title: string;
  description: string;
  reward: {
    mercyCoins: number;
    gems: number;
  };
  maxUses: number;
  currentUses: number;
  isActive: boolean;
  expiresAt: Date;
  createdAt: Date;
}

export default function AdminRedeem() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<RedeemCode | null>(null);
  const [formData, setFormData] = useState<Partial<RedeemCode>>({});
  const [showCodes, setShowCodes] = useState<Record<string, boolean>>({});

  // Fetch redeem codes
  const { data: redeemCodes = [], isLoading } = useQuery<RedeemCode[]>({
    queryKey: ['/api/admin/redeem-codes'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/redeem-codes');
      if (!response.ok) throw new Error('Failed to fetch redeem codes');
      const data = await response.json();
      
      // Parse dates properly from Firestore
      return data.map((code: any) => ({
        ...code,
        expiresAt: new Date(code.expiresAt),
        createdAt: new Date(code.createdAt)
      }));
    },
    enabled: !!user,
  });

  // Create/Update redeem code mutation
  const saveRedeemCodeMutation = useMutation({
    mutationFn: async (data: Partial<RedeemCode>) => {
      const method = selectedCode ? 'PATCH' : 'POST';
      const url = selectedCode ? `/api/admin/redeem-codes/${selectedCode.id}` : '/api/admin/redeem-codes';
      const response = await apiRequest(method, url, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/redeem-codes'] });
      setEditDialogOpen(false);
      setSelectedCode(null);
      setFormData({});
      toast({
        title: "Success",
        description: selectedCode ? "Redeem code updated successfully" : "Redeem code created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save redeem code",
        variant: "destructive",
      });
    },
  });

  // Delete redeem code mutation
  const deleteRedeemCodeMutation = useMutation({
    mutationFn: async (codeId: string) => {
      const response = await apiRequest('DELETE', `/api/admin/redeem-codes/${codeId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/redeem-codes'] });
      toast({ title: "Success", description: "Redeem code deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete redeem code", variant: "destructive" });
    },
  });

  // Toggle code status mutation
  const toggleCodeMutation = useMutation({
    mutationFn: async ({ codeId, isActive }: { codeId: string; isActive: boolean }) => {
      const response = await apiRequest('PATCH', `/api/admin/redeem-codes/${codeId}`, { isActive });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/redeem-codes'] });
      toast({ title: "Success", description: "Code status updated" });
    },
  });

  const handleCreateCode = () => {
    setSelectedCode(null);
    setFormData({
      code: generateRandomCode(),
      title: "",
      description: "",
      reward: { mercyCoins: 500, gems: 10 },
      maxUses: 100,
      isActive: true,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    });
    setEditDialogOpen(true);
  };

  const handleEditCode = (code: RedeemCode) => {
    setSelectedCode(code);
    setFormData(code);
    setEditDialogOpen(true);
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Copied", description: "Code copied to clipboard" });
  };

  const toggleCodeVisibility = (codeId: string) => {
    setShowCodes(prev => ({ ...prev, [codeId]: !prev[codeId] }));
  };

  const getCodeStatus = (code: RedeemCode) => {
    if (!code.isActive) return { label: 'Inactive', color: 'text-slate-400 border-slate-500/30' };
    if (new Date(code.expiresAt) < new Date()) return { label: 'Expired', color: 'text-red-400 border-red-500/30' };
    if (code.currentUses >= code.maxUses) return { label: 'Used Up', color: 'text-orange-400 border-orange-500/30' };
    return { label: 'Active', color: 'text-green-400 border-green-500/30' };
  };

  const activeCodes = redeemCodes.filter(c => c.isActive && new Date(c.expiresAt) > new Date() && c.currentUses < c.maxUses);
  const expiredCodes = redeemCodes.filter(c => new Date(c.expiresAt) <= new Date() || c.currentUses >= c.maxUses);
  const totalRedemptions = redeemCodes.reduce((sum, code) => sum + code.currentUses, 0);
  const totalMCDistributed = redeemCodes.reduce((sum, code) => sum + (code.currentUses * code.reward.mercyCoins), 0);
  const totalGemsDistributed = redeemCodes.reduce((sum, code) => sum + (code.currentUses * code.reward.gems), 0);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-700 rounded w-64"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-800 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Redeem Code Management
          </h1>
          <p className="text-slate-400 mt-1">Create and manage promotional codes</p>
        </div>
        <Button onClick={handleCreateCode} className="bg-pink-600 hover:bg-pink-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Code
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-pink-500/10 rounded-lg">
                <Gift className="h-6 w-6 text-pink-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-50">{redeemCodes.length}</p>
                <p className="text-slate-400 text-sm">Total Codes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-50">{totalRedemptions}</p>
                <p className="text-slate-400 text-sm">Total Uses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <Coins className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-50">{totalMCDistributed.toLocaleString()}</p>
                <p className="text-slate-400 text-sm">MC Distributed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Gem className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-50">{totalGemsDistributed.toLocaleString()}</p>
                <p className="text-slate-400 text-sm">Gems Distributed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Codes */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-slate-50 flex items-center gap-2">
            <Clock className="h-5 w-5 text-green-400" />
            Active Codes ({activeCodes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeCodes.length === 0 ? (
            <div className="text-center py-8">
              <Gift className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400">No active codes</p>
              <Button onClick={handleCreateCode} variant="outline" className="mt-4">
                Create Your First Code
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeCodes.map((code) => (
                <Card key={code.id} className="bg-slate-700/30 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-slate-50">{code.title}</h3>
                        <p className="text-slate-400 text-sm">{code.description}</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Label className="text-slate-400 text-sm">Code:</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCodeVisibility(code.id)}
                          className="h-6 w-6 p-0"
                        >
                          {showCodes[code.id] ? 
                            <EyeOff className="h-4 w-4 text-slate-400" /> : 
                            <Eye className="h-4 w-4 text-slate-400" />
                          }
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="bg-slate-600 px-2 py-1 rounded text-sm font-mono text-slate-50">
                          {showCodes[code.id] ? code.code : '••••••••'}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(code.code)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-4 w-4 text-slate-400" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-slate-400">Reward</p>
                        <p className="text-slate-50">{code.reward.mercyCoins} MC + {code.reward.gems} Gems</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Uses</p>
                        <p className="text-slate-50">{code.currentUses} / {code.maxUses}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditCode(code)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => deleteRedeemCodeMutation.mutate(code.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Codes Table */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-slate-50">All Redeem Codes ({redeemCodes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-700 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-slate-700/50">
                  <TableHead className="text-slate-300">Code</TableHead>
                  <TableHead className="text-slate-300">Title</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Reward</TableHead>
                  <TableHead className="text-slate-300">Usage</TableHead>
                  <TableHead className="text-slate-300">Expires</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {redeemCodes.map((code) => {
                  const status = getCodeStatus(code);
                  return (
                    <TableRow key={code.id} className="border-slate-700 hover:bg-slate-700/50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="bg-slate-600 px-2 py-1 rounded text-sm font-mono text-slate-50">
                            {showCodes[code.id] ? code.code : '••••••••'}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleCodeVisibility(code.id)}
                            className="h-6 w-6 p-0"
                          >
                            {showCodes[code.id] ? 
                              <EyeOff className="h-4 w-4 text-slate-400" /> : 
                              <Eye className="h-4 w-4 text-slate-400" />
                            }
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(code.code)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-4 w-4 text-slate-400" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-50">{code.title}</p>
                          <p className="text-slate-400 text-sm">{code.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={status.color}>
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {code.reward.mercyCoins} MC + {code.reward.gems} Gems
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {code.currentUses} / {code.maxUses}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {new Date(code.expiresAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCode(code)}
                            className="h-8 w-8 p-0 hover:bg-blue-500/20"
                          >
                            <Edit className="h-4 w-4 text-blue-400" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleCodeMutation.mutate({ codeId: code.id, isActive: !code.isActive })}
                            className="h-8 w-8 p-0 hover:bg-green-500/20"
                          >
                            {code.isActive ? 
                              <EyeOff className="h-4 w-4 text-orange-400" /> : 
                              <Eye className="h-4 w-4 text-green-400" />
                            }
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteRedeemCodeMutation.mutate(code.id)}
                            className="h-8 w-8 p-0 hover:bg-red-500/20"
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit/Create Code Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-slate-50">
              {selectedCode ? 'Edit Redeem Code' : 'Create New Redeem Code'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code">Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="code"
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="bg-slate-700 border-slate-600 font-mono"
                    placeholder="Enter code..."
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormData({ ...formData, code: generateRandomCode() })}
                  >
                    <Shuffle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-slate-700 border-slate-600"
                  placeholder="Code title..."
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-slate-700 border-slate-600"
                placeholder="Code description..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mercyCoins">Mercy Coins Reward</Label>
                <Input
                  id="mercyCoins"
                  type="number"
                  value={formData.reward?.mercyCoins || 500}
                  onChange={(e) => setFormData({
                    ...formData,
                    reward: {
                      ...formData.reward,
                      mercyCoins: parseInt(e.target.value),
                      gems: formData.reward?.gems || 10
                    }
                  })}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div>
                <Label htmlFor="gems">Gems Reward</Label>
                <Input
                  id="gems"
                  type="number"
                  value={formData.reward?.gems || 10}
                  onChange={(e) => setFormData({
                    ...formData,
                    reward: {
                      mercyCoins: formData.reward?.mercyCoins || 500,
                      gems: parseInt(e.target.value)
                    }
                  })}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maxUses">Maximum Uses</Label>
                <Input
                  id="maxUses"
                  type="number"
                  value={formData.maxUses || 100}
                  onChange={(e) => setFormData({ ...formData, maxUses: parseInt(e.target.value) })}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div>
                <Label htmlFor="expiresAt">Expires At</Label>
                <Input
                  id="expiresAt"
                  type="datetime-local"
                  value={formData.expiresAt ? new Date(formData.expiresAt).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setFormData({ ...formData, expiresAt: new Date(e.target.value) })}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive || false}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">Make Code Active</Label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => saveRedeemCodeMutation.mutate(formData)}
                disabled={saveRedeemCodeMutation.isPending}
              >
                {saveRedeemCodeMutation.isPending ? 'Saving...' : (selectedCode ? 'Update Code' : 'Create Code')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}