import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Calendar, Coins } from "lucide-react";

export default function Tournaments() {
  const tournaments = [
    {
      id: 1,
      name: "Welcome Tournament",
      description: "A friendly tournament for new members to get started!",
      entryFee: 50,
      prizePool: 500,
      maxParticipants: 10,
      currentParticipants: 1,
      startDate: "2024-02-01T10:00:00Z",
      endDate: "2024-02-01T18:00:00Z",
      status: "upcoming" as const,
      gameType: "Mixed Games",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-blue-500 text-white">Upcoming</Badge>;
      case "active":
        return <Badge className="bg-green-500 text-white">Active</Badge>;
      case "completed":
        return <Badge className="bg-slate-500 text-white">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 pb-24 lg:pb-6">
      <div className="max-w-4xl mx-auto lg:px-6">
        <div className="p-4 lg:p-0 lg:mt-6">
          <div className="flex items-center space-x-3 mb-6">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <h1 className="text-2xl font-bold text-slate-50">Tournaments</h1>
          </div>
          
          <div className="space-y-6">
            {tournaments.map((tournament) => (
              <Card key={tournament.id} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-slate-50 mb-2">{tournament.name}</CardTitle>
                      <p className="text-slate-300 text-sm">{tournament.description}</p>
                    </div>
                    {getStatusBadge(tournament.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <Coins className="w-4 h-4 text-yellow-500" />
                        <span className="text-slate-300">Entry Fee:</span>
                        <span className="font-medium text-slate-50">{tournament.entryFee} MC</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="text-slate-300">Prize Pool:</span>
                        <span className="font-medium text-slate-50">{tournament.prizePool} MC</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Users className="w-4 h-4 text-indigo-400" />
                        <span className="text-slate-300">Participants:</span>
                        <span className="font-medium text-slate-50">
                          {tournament.currentParticipants}/{tournament.maxParticipants}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="w-4 h-4 text-green-400" />
                        <span className="text-slate-300">Starts:</span>
                        <span className="font-medium text-slate-50">
                          {formatDate(tournament.startDate)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="w-4 h-4 text-red-400" />
                        <span className="text-slate-300">Ends:</span>
                        <span className="font-medium text-slate-50">
                          {formatDate(tournament.endDate)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Trophy className="w-4 h-4 text-violet-400" />
                        <span className="text-slate-300">Game Type:</span>
                        <span className="font-medium text-slate-50">{tournament.gameType}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex-1 bg-slate-700 rounded-full h-2 mr-4">
                      <div 
                        className="bg-indigo-500 h-2 rounded-full transition-all"
                        style={{ 
                          width: `${(tournament.currentParticipants / tournament.maxParticipants) * 100}%` 
                        }}
                      ></div>
                    </div>
                    
                    {tournament.status === "upcoming" && (
                      <Button className="bg-indigo-500 hover:bg-indigo-600">
                        Join Tournament
                      </Button>
                    )}
                    
                    {tournament.status === "active" && (
                      <Button variant="outline" className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white">
                        View Live
                      </Button>
                    )}
                    
                    {tournament.status === "completed" && (
                      <Button variant="outline" className="border-slate-600 text-slate-400">
                        View Results
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {tournaments.length === 0 && (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="text-center py-12">
                  <Trophy className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-50 mb-2">No tournaments available</h3>
                  <p className="text-slate-400">Check back later for exciting tournaments and competitions!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
