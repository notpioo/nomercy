import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Newspaper, UserCog, Trophy, Bomb, Building, Coins, Settings, Brain, Gift } from "lucide-react";

interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userRole?: string;
}

export default function BottomSheet({ open, onOpenChange, userRole }: BottomSheetProps) {
  const handleLinkClick = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="bg-slate-800 border-slate-700 max-h-[80vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-slate-50">Menu</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6 mt-6">
          {/* Main Section */}
          <div>
            <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-3">Main</h4>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/quiz">
                <Button
                  variant="ghost"
                  onClick={handleLinkClick}
                  className="w-full bg-slate-700 hover:bg-slate-600 p-4 rounded-xl transition-colors text-center h-auto flex-col"
                >
                  <Brain className="w-6 h-6 text-green-400 mb-2" />
                  <div className="text-sm font-medium">Quiz</div>
                </Button>
              </Link>
              <Link href="/redeem">
                <Button
                  variant="ghost"
                  onClick={handleLinkClick}
                  className="w-full bg-slate-700 hover:bg-slate-600 p-4 rounded-xl transition-colors text-center h-auto flex-col"
                >
                  <Gift className="w-6 h-6 text-green-400 mb-2" />
                  <div className="text-sm font-medium">Redeem</div>
                </Button>
              </Link>
            </div>
          </div>

          {/* Squad Section */}
          <div>
            <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-3">Squad</h4>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/squad/news">
                <Button
                  variant="ghost"
                  onClick={handleLinkClick}
                  className="w-full bg-slate-700 hover:bg-slate-600 p-4 rounded-xl transition-colors text-center h-auto flex-col"
                >
                  <Newspaper className="w-6 h-6 text-indigo-400 mb-2" />
                  <div className="text-sm font-medium">News</div>
                </Button>
              </Link>
              <Link href="/squad/members">
                <Button
                  variant="ghost"
                  onClick={handleLinkClick}
                  className="w-full bg-slate-700 hover:bg-slate-600 p-4 rounded-xl transition-colors text-center h-auto flex-col"
                >
                  <UserCog className="w-6 h-6 text-indigo-400 mb-2" />
                  <div className="text-sm font-medium">Members</div>
                </Button>
              </Link>
              <Link href="/squad/tournaments">
                <Button
                  variant="ghost"
                  onClick={handleLinkClick}
                  className="w-full bg-slate-700 hover:bg-slate-600 p-4 rounded-xl transition-colors text-center h-auto flex-col"
                >
                  <Trophy className="w-6 h-6 text-indigo-400 mb-2" />
                  <div className="text-sm font-medium">Tournaments</div>
                </Button>
              </Link>
            </div>
          </div>

          {/* Casino Section */}
          <div>
            <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-3">Casino</h4>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/games/mine">
                <Button
                  variant="ghost"
                  onClick={handleLinkClick}
                  className="w-full bg-slate-700 hover:bg-slate-600 p-4 rounded-xl transition-colors text-center h-auto flex-col"
                >
                  <Bomb className="w-6 h-6 text-violet-400 mb-2" />
                  <div className="text-sm font-medium">Mine</div>
                </Button>
              </Link>
              <Link href="/games/tower">
                <Button
                  variant="ghost"
                  onClick={handleLinkClick}
                  className="w-full bg-slate-700 hover:bg-slate-600 p-4 rounded-xl transition-colors text-center h-auto flex-col"
                >
                  <Building className="w-6 h-6 text-violet-400 mb-2" />
                  <div className="text-sm font-medium">Tower</div>
                </Button>
              </Link>
              <Link href="/games/coinflip">
                <Button
                  variant="ghost"
                  onClick={handleLinkClick}
                  className="w-full bg-slate-700 hover:bg-slate-600 p-4 rounded-xl transition-colors text-center h-auto flex-col"
                >
                  <Coins className="w-6 h-6 text-violet-400 mb-2" />
                  <div className="text-sm font-medium">Coinflip</div>
                </Button>
              </Link>
            </div>
          </div>

          {/* Admin Section */}
          {userRole === "admin" && (
            <div>
              <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-3">Admin</h4>
              <div className="grid grid-cols-1 gap-3">
                <Link href="/admin/dashboard">
                  <Button
                    variant="ghost"
                    onClick={handleLinkClick}
                    className="w-full bg-slate-700 hover:bg-slate-600 p-4 rounded-xl transition-colors text-center h-auto flex-col"
                  >
                    <Settings className="w-6 h-6 text-red-400 mb-2" />
                    <div className="text-sm font-medium">Dashboard</div>
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
