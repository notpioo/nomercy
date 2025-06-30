import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, Trophy, MessageSquare, Calendar, Settings } from "lucide-react";

export default function AdminSquad() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Squad Management
          </h1>
          <p className="text-slate-400 mt-1">Team and guild management features</p>
        </div>
      </div>

      {/* Coming Soon Card */}
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-12 text-center">
          <Shield className="h-24 w-24 text-green-400 mx-auto mb-6 opacity-50" />
          <h2 className="text-2xl font-bold text-slate-50 mb-4">Squad Features Coming Soon</h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Advanced team management features are currently in development. This will include 
            guild creation, team tournaments, member management, and collaborative challenges.
          </p>
          
          {/* Feature Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            <div className="bg-slate-700/30 p-6 rounded-lg border border-slate-600/50">
              <Users className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-50 mb-2">Team Formation</h3>
              <p className="text-slate-400 text-sm">Create and manage gaming squads with up to 10 members</p>
            </div>
            
            <div className="bg-slate-700/30 p-6 rounded-lg border border-slate-600/50">
              <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-50 mb-2">Team Tournaments</h3>
              <p className="text-slate-400 text-sm">Exclusive squad-based competitions and challenges</p>
            </div>
            
            <div className="bg-slate-700/30 p-6 rounded-lg border border-slate-600/50">
              <MessageSquare className="h-8 w-8 text-purple-400 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-50 mb-2">Team Chat</h3>
              <p className="text-slate-400 text-sm">Private communication channels for squad coordination</p>
            </div>
            
            <div className="bg-slate-700/30 p-6 rounded-lg border border-slate-600/50">
              <Calendar className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-50 mb-2">Event Planning</h3>
              <p className="text-slate-400 text-sm">Schedule and organize team gaming sessions</p>
            </div>
          </div>

          <div className="mt-8">
            <Button variant="outline" disabled>
              <Settings className="w-4 h-4 mr-2" />
              Configure Squad Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}