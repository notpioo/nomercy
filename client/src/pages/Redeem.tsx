import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Gift, 
  Coins, 
  Gem, 
  CheckCircle,
  XCircle,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Redeem() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [redeemCode, setRedeemCode] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);

  // Redeem code mutation
  const redeemMutation = useMutation({
    mutationFn: async (code: string) => {
      setIsRedeeming(true);
      
      console.log('Attempting to redeem code:', code);
      console.log('Current user:', user);
      
      const response = await apiRequest('POST', '/api/redeem/use', {
        code: code.toUpperCase()
      });
      
      console.log('Redeem response status:', response.status);
      
      if (!response.ok) {
        const error = await response.json();
        console.error('Redeem error:', error);
        throw new Error(error.error || error.message || 'Failed to redeem code');
      }
      
      return response.json();
    },
    onSuccess: async (data) => {
      setIsRedeeming(false);
      setRedeemCode("");
      
      // Refresh user data immediately
      await refreshUser();
      
      // Also invalidate react-query cache
      queryClient.invalidateQueries({ queryKey: ['/api/users/me'] });
      
      toast({
        title: "Code Redeemed Successfully!",
        description: `You received ${data.reward.mercyCoins} MC and ${data.reward.gems} Gems! Check your balance now!`,
      });
      
      console.log('Balance should be updated now. Old:', data.oldBalance, 'New:', data.newBalance);
    },
    onError: (error: Error) => {
      setIsRedeeming(false);
      toast({
        title: "Redemption Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleRedeem = () => {
    if (!redeemCode.trim()) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid redeem code",
        variant: "destructive",
      });
      return;
    }

    console.log('Redeeming code:', redeemCode.trim());
    console.log('Current user state:', user);

    redeemMutation.mutate(redeemCode.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRedeem();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          Redeem Codes
        </h1>
        <p className="text-slate-400 mt-1">Enter promotional codes to claim rewards</p>
      </div>

      {/* Main Redeem Card */}
      <div className="max-w-md mx-auto">
        <Card className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-pink-500/20">
          <CardHeader className="text-center">
            <CardTitle className="text-slate-50 flex items-center justify-center gap-2">
              <Gift className="h-6 w-6 text-pink-400" />
              Enter Redeem Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="redeemCode" className="text-slate-300">Redeem Code</Label>
              <Input
                id="redeemCode"
                value={redeemCode}
                onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                placeholder="Enter your code here..."
                className="bg-slate-700 border-slate-600 text-center font-mono text-lg tracking-wide"
                maxLength={12}
                disabled={isRedeeming}
              />
              <p className="text-slate-400 text-sm text-center">
                Codes are case-insensitive and contain 8 characters
              </p>
            </div>

            <Button 
              onClick={handleRedeem}
              disabled={!redeemCode.trim() || isRedeeming}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
            >
              {isRedeeming ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Redeeming...
                </>
              ) : (
                <>
                  <Gift className="w-4 h-4 mr-2" />
                  Redeem Code
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-slate-50 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              How to Redeem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="bg-green-500/20 text-green-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">1</span>
              <p className="text-slate-300 text-sm">Get a promotional code from events or social media</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-green-500/20 text-green-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">2</span>
              <p className="text-slate-300 text-sm">Enter the code in the input field above</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-green-500/20 text-green-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">3</span>
              <p className="text-slate-300 text-sm">Click "Redeem Code" to claim your rewards instantly</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-slate-50 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              Possible Rewards
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Coins className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="text-slate-300 text-sm font-medium">Mercy Coins</p>
                <p className="text-slate-400 text-xs">Use to play casino games</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Gem className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-slate-300 text-sm font-medium">Gems</p>
                <p className="text-slate-400 text-xs">Premium currency for special features</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Gift className="h-5 w-5 text-pink-400" />
              <div>
                <p className="text-slate-300 text-sm font-medium">Special Items</p>
                <p className="text-slate-400 text-xs">Exclusive bonuses and rewards</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tips Card */}
      <div className="max-w-2xl mx-auto">
        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <Gift className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-400 mb-2">Tips for Getting Codes</h3>
                <ul className="space-y-1 text-slate-300 text-sm">
                  <li>• Follow our social media for regular code drops</li>
                  <li>• Participate in community events and tournaments</li>
                  <li>• Check announcements in the squad news section</li>
                  <li>• Some codes have limited uses, so redeem quickly!</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Common Errors */}
      <div className="max-w-2xl mx-auto">
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-red-500/20 p-2 rounded-lg">
                <XCircle className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-red-400 mb-2">Common Issues</h3>
                <ul className="space-y-1 text-slate-300 text-sm">
                  <li>• <strong>Code expired:</strong> Some codes have time limits</li>
                  <li>• <strong>Already used:</strong> You can only use each code once</li>
                  <li>• <strong>Usage limit reached:</strong> Popular codes may run out</li>
                  <li>• <strong>Invalid format:</strong> Make sure you typed the code correctly</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}