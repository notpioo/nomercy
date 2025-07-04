import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import AuthModal from "@/components/AuthModal";
import Dashboard from "@/pages/Dashboard";
import Social from "@/pages/Social";
import Profile from "@/pages/Profile";
import Quiz from "@/pages/Quiz";
import Redeem from "@/pages/Redeem";
import Mine from "@/pages/games/Mine";
import Tower from "@/pages/games/Tower";
import Coinflip from "@/pages/games/Coinflip";
import News from "@/pages/squad/News";
import Members from "@/pages/squad/Members";
import Tournaments from "@/pages/squad/Tournaments";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminSquad from "@/pages/admin/AdminSquad";
import AdminCasino from "@/pages/admin/AdminCasino";
import AdminQuiz from "@/pages/admin/AdminQuiz";
import AdminRedeem from "@/pages/admin/AdminRedeem";
import AdminSettings from "@/pages/admin/AdminSettings";
import NotFound from "@/pages/not-found";
import { useState, useEffect } from "react";

function AppContent() {
  const { user, loading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Update auth modal state when auth state changes
  useEffect(() => {
    if (!loading && !user) {
      setAuthModalOpen(true);
    } else {
      setAuthModalOpen(false);
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-slate-50 text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900">
        <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/social" component={Social} />
        <Route path="/profile" component={Profile} />
        <Route path="/quiz" component={Quiz} />
        <Route path="/redeem" component={Redeem} />
        <Route path="/games/mine" component={Mine} />
        <Route path="/games/tower" component={Tower} />
        <Route path="/games/coinflip" component={Coinflip} />
        <Route path="/squad/news" component={News} />
        <Route path="/squad/members" component={Members} />
        <Route path="/squad/tournaments" component={Tournaments} />
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route path="/admin/users" component={AdminUsers} />
        <Route path="/admin/squad" component={AdminSquad} />
        <Route path="/admin/casino" component={AdminCasino} />
        <Route path="/admin/quiz" component={AdminQuiz} />
        <Route path="/admin/redeem" component={AdminRedeem} />
        <Route path="/admin/settings" component={AdminSettings} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <AppContent />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
