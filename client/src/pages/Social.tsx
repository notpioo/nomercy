import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send } from "lucide-react";

export default function Social() {
  const [message, setMessage] = useState("");

  const onlinePlayers = [
    { name: "Welcome", initials: "W", status: "Online", activity: "Dashboard" },
    { name: "Player", initials: "P", status: "Online", activity: "Idle" },
  ];

  const chatMessages = [
    {
      id: 1,
      username: "System",
      initials: "S",
      message: "Welcome to NoMercy community chat!",
      timestamp: "Just now",
    },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // TODO: Implement real chat functionality
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 pb-24 lg:pb-6">
      <div className="max-w-7xl mx-auto lg:px-6">
        <div className="p-4 lg:p-0 lg:mt-6">
          <h2 className="text-2xl font-bold mb-6 text-slate-50">Community</h2>
          
          {/* Chat Section */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-slate-800 border-slate-700 h-96">
                <CardHeader className="border-b border-slate-700">
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="text-indigo-400" />
                    <span>General Chat</span>
                    <span className="bg-green-500 text-xs px-2 py-1 rounded-full">
                      {onlinePlayers.length} online
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 h-64 overflow-y-auto space-y-3">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium">{msg.initials}</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm text-slate-50">{msg.username}</span>
                          <span className="text-xs text-slate-400">{msg.timestamp}</span>
                        </div>
                        <div className="text-sm text-slate-300">{msg.message}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <div className="p-4 border-t border-slate-700">
                  <div className="flex space-x-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-slate-700 border-slate-600 text-slate-50"
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="bg-indigo-500 hover:bg-indigo-600"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Online Players */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="border-b border-slate-700">
                <CardTitle>Online Players</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 h-80 overflow-y-auto">
                {onlinePlayers.map((player, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium">{player.initials}</span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-50">{player.name}</div>
                      <div className="text-xs text-slate-400">{player.activity}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
