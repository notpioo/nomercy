import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  UserCog, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Crown, 
  Coins, 
  Gem,
  Calendar,
  Shield,
  TrendingUp,
  Users
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { User } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminUsers() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<User>>({});

  // Fetch all users
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
    queryFn: async () => {
      const response = await fetch('/api/admin/users', {
        headers: {
          'x-user-id': user?.id || 'admin-demo',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    },
    enabled: !!user,
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async (userData: Partial<User>) => {
      const response = await apiRequest('PATCH', `/api/admin/users/${selectedUser?.id}`, userData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      setEditDialogOpen(false);
      setSelectedUser(null);
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiRequest('DELETE', `/api/admin/users/${userId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      setDeleteDialogOpen(false);
      setSelectedUser(null);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    },
  });

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      rank: user.rank || 'rookie',
      mercyCoins: user.mercyCoins,
      gems: user.gems || 0,
      level: user.level || 1,
      totalGamesPlayed: user.totalGamesPlayed || 0,
      totalWins: user.totalWins || 0
    });
    setEditDialogOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const getRankBadgeColor = (rank?: string) => {
    switch (rank) {
      case 'diamond': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'gold': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'silver': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'bronze': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const userStats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    members: users.filter(u => u.role === 'member').length,
    totalCoins: users.reduce((sum, u) => sum + (u.mercyCoins || 0), 0),
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-700 rounded w-64"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-800 rounded-lg"></div>
          ))}
        </div>
        <div className="h-96 bg-slate-800 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-slate-400 mt-1">Manage all registered users</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-50">{userStats.total}</p>
                <p className="text-slate-400 text-sm">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/10 rounded-lg">
                <Shield className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-50">{userStats.admins}</p>
                <p className="text-slate-400 text-sm">Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <UserCog className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-50">{userStats.members}</p>
                <p className="text-slate-400 text-sm">Members</p>
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
                <p className="text-2xl font-bold text-slate-50">{userStats.totalCoins.toLocaleString()}</p>
                <p className="text-slate-400 text-sm">Total MC</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search users by username, full name, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-slate-50">All Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-slate-700 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-slate-700/50">
                  <TableHead className="text-slate-300">Username</TableHead>
                  <TableHead className="text-slate-300">Full Name</TableHead>
                  <TableHead className="text-slate-300">Role</TableHead>
                  <TableHead className="text-slate-300">Rank</TableHead>
                  <TableHead className="text-slate-300">MC</TableHead>
                  <TableHead className="text-slate-300">Gems</TableHead>
                  <TableHead className="text-slate-300">Games</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-slate-700 hover:bg-slate-700/50">
                    <TableCell className="font-medium text-slate-50">{user.username}</TableCell>
                    <TableCell className="text-slate-300">{user.fullName}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={user.role === 'admin' ? 'text-red-400 border-red-500/30' : 'text-blue-400 border-blue-500/30'}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getRankBadgeColor(user.rank)}>
                        {user.rank || 'rookie'} {user.rankLevel || 1}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300">{(user.mercyCoins || 0).toLocaleString()}</TableCell>
                    <TableCell className="text-slate-300">{(user.gems || 0).toLocaleString()}</TableCell>
                    <TableCell className="text-slate-300">
                      {user.totalGamesPlayed || 0} / {user.totalWins || 0}W
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                          className="h-8 w-8 p-0 hover:bg-blue-500/20"
                        >
                          <Edit className="h-4 w-4 text-blue-400" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user)}
                          className="h-8 w-8 p-0 hover:bg-red-500/20"
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-slate-50">Edit User: {selectedUser?.username}</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList className="bg-slate-700">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="economy">Economy</TabsTrigger>
                <TabsTrigger value="progress">Progress</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={editFormData.username || ''}
                      onChange={(e) => setEditFormData({...editFormData, username: e.target.value})}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={editFormData.fullName || ''}
                      onChange={(e) => setEditFormData({...editFormData, fullName: e.target.value})}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select 
                      value={editFormData.role || 'member'} 
                      onValueChange={(value) => setEditFormData({...editFormData, role: value as 'admin' | 'member'})}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="rank">Rank</Label>
                    <Select 
                      value={editFormData.rank || 'rookie'}
                      onValueChange={(value) => setEditFormData({...editFormData, rank: value})}
                    >
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rookie">Rookie</SelectItem>
                        <SelectItem value="bronze">Bronze</SelectItem>
                        <SelectItem value="silver">Silver</SelectItem>
                        <SelectItem value="gold">Gold</SelectItem>
                        <SelectItem value="diamond">Diamond</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="economy" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mercyCoins">Mercy Coins</Label>
                    <Input
                      id="mercyCoins"
                      type="number"
                      value={editFormData.mercyCoins || 0}
                      onChange={(e) => setEditFormData({...editFormData, mercyCoins: parseInt(e.target.value) || 0})}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gems">Gems</Label>
                    <Input
                      id="gems"
                      type="number"
                      value={editFormData.gems || 0}
                      onChange={(e) => setEditFormData({...editFormData, gems: parseInt(e.target.value) || 0})}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="progress" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="level">Level</Label>
                    <Input
                      id="level"
                      type="number"
                      value={editFormData.level || 1}
                      onChange={(e) => setEditFormData({...editFormData, level: parseInt(e.target.value) || 1})}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalGames">Total Games</Label>
                    <Input
                      id="totalGames"
                      type="number"
                      value={editFormData.totalGamesPlayed || 0}
                      onChange={(e) => setEditFormData({...editFormData, totalGamesPlayed: parseInt(e.target.value) || 0})}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalWins">Total Wins</Label>
                    <Input
                      id="totalWins"
                      type="number"
                      value={editFormData.totalWins || 0}
                      onChange={(e) => setEditFormData({...editFormData, totalWins: parseInt(e.target.value) || 0})}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                </div>
              </TabsContent>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => updateUserMutation.mutate(editFormData)}
                  disabled={updateUserMutation.isPending}
                >
                  {updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-slate-50">Delete User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-slate-300">
              Are you sure you want to delete user <strong>{selectedUser?.username}</strong>? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => selectedUser && deleteUserMutation.mutate(selectedUser.id)}
                disabled={deleteUserMutation.isPending}
              >
                {deleteUserMutation.isPending ? 'Deleting...' : 'Delete User'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}