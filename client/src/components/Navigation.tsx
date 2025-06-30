import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { logoutUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Home, Users, User, Menu, ChevronDown, Skull, Coins, Newspaper, UserCog, Trophy, Bomb, Building, Dice1, Settings } from "lucide-react";
import BottomSheet from "./BottomSheet";

export default function Navigation() {
  const [location] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isActive = (path: string) => location === path;

  // Desktop Navigation
  const DesktopNav = () => (
    <nav className="hidden lg:flex bg-slate-800 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center">
              <Skull className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold">NoMercy</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link href="/">
              <Button
                variant="ghost"
                className={`flex items-center space-x-2 ${
                  isActive("/") ? "bg-slate-700 text-slate-50" : "text-slate-300 hover:text-slate-50 hover:bg-slate-700"
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Button>
            </Link>
            <Link href="/social">
              <Button
                variant="ghost"
                className={`flex items-center space-x-2 ${
                  isActive("/social") ? "bg-slate-700 text-slate-50" : "text-slate-300 hover:text-slate-50 hover:bg-slate-700"
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Social</span>
              </Button>
            </Link>
            <Link href="/profile">
              <Button
                variant="ghost"
                className={`flex items-center space-x-2 ${
                  isActive("/profile") ? "bg-slate-700 text-slate-50" : "text-slate-300 hover:text-slate-50 hover:bg-slate-700"
                }`}
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Button>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 text-slate-300 hover:text-slate-50 hover:bg-slate-700"
                >
                  <Menu className="w-4 h-4" />
                  <span>Menu</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700">
                <div className="px-4 py-2 text-sm font-medium text-slate-400 uppercase tracking-wide">Squad</div>
                <DropdownMenuItem asChild>
                  <Link href="/squad/news">
                    <Newspaper className="w-4 h-4 mr-2" />
                    News
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/squad/members">
                    <UserCog className="w-4 h-4 mr-2" />
                    Members
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/squad/tournaments">
                    <Trophy className="w-4 h-4 mr-2" />
                    Tournaments
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-700" />
                <div className="px-4 py-2 text-sm font-medium text-slate-400 uppercase tracking-wide">Casino</div>
                <DropdownMenuItem asChild>
                  <Link href="/games/mine">
                    <Bomb className="w-4 h-4 mr-2" />
                    Mine
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/games/tower">
                    <Building className="w-4 h-4 mr-2" />
                    Tower
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/games/coinflip">
                    <Coins className="w-4 h-4 mr-2" />
                    Coinflip
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-700" />
                <div className="px-4 py-2 text-sm font-medium text-slate-400 uppercase tracking-wide">Main</div>
                <DropdownMenuItem asChild>
                  <Link href="/quiz">
                    <Dice1 className="w-4 h-4 mr-2" />
                    Quiz
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/redeem">
                    <Coins className="w-4 h-4 mr-2" />
                    Redeem
                  </Link>
                </DropdownMenuItem>
                {user?.role === "admin" && (
                  <>
                    <DropdownMenuSeparator className="bg-slate-700" />
                    <div className="px-4 py-2 text-sm font-medium text-slate-400 uppercase tracking-wide">Admin</div>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard">
                        <Settings className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-slate-700 px-4 py-2 rounded-lg">
            <Coins className="text-yellow-500 w-4 h-4" />
            <span className="font-medium">{user?.mercyCoins?.toLocaleString() || 0}</span>
            <span className="text-slate-400 text-sm">MC</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-700 px-4 py-2 rounded-lg">
            <div className="text-purple-400 text-sm">💎</div>
            <span className="font-medium">{user?.gems?.toLocaleString() || 0}</span>
            <span className="text-slate-400 text-sm">Gems</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">{getInitials(user?.fullName || "U")}</span>
            </div>
            <div className="text-right hidden xl:block">
              <div className="text-sm font-medium">{user?.username}</div>
              <div className="text-xs text-slate-400 capitalize">{user?.role}</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );

  // Mobile Navigation
  const MobileNav = () => (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 z-40">
        <div className="flex items-center justify-around py-2">
          <Link href="/">
            <Button
              variant="ghost"
              className={`flex flex-col items-center py-2 px-4 ${
                isActive("/") ? "text-indigo-500" : "text-slate-400"
              }`}
            >
              <Home className="w-5 h-5 mb-1" />
              <span className="text-xs">Home</span>
            </Button>
          </Link>
          <Link href="/social">
            <Button
              variant="ghost"
              className={`flex flex-col items-center py-2 px-4 ${
                isActive("/social") ? "text-indigo-500" : "text-slate-400"
              }`}
            >
              <Users className="w-5 h-5 mb-1" />
              <span className="text-xs">Social</span>
            </Button>
          </Link>
          <Link href="/profile">
            <Button
              variant="ghost"
              className={`flex flex-col items-center py-2 px-4 ${
                isActive("/profile") ? "text-indigo-500" : "text-slate-400"
              }`}
            >
              <User className="w-5 h-5 mb-1" />
              <span className="text-xs">Profile</span>
            </Button>
          </Link>
          <Button
            variant="ghost"
            onClick={() => setIsBottomSheetOpen(true)}
            className="flex flex-col items-center py-2 px-4 text-slate-400"
          >
            <Menu className="w-5 h-5 mb-1" />
            <span className="text-xs">Menu</span>
          </Button>
        </div>
      </nav>
      <BottomSheet 
        open={isBottomSheetOpen} 
        onOpenChange={setIsBottomSheetOpen}
        userRole={user?.role}
      />
    </>
  );

  return (
    <>
      <DesktopNav />
      <MobileNav />
    </>
  );
}
