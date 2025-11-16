import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Register from "@/pages/register";
import DashboardMember from "@/pages/dashboard-member";
import DashboardAdmin from "@/pages/dashboard-admin";
import DashboardOwner from "@/pages/dashboard-owner";
import Members from "@/pages/members";
import MemberProfile from "@/pages/member-profile";
import Gallery from "@/pages/gallery";
import Activity from "@/pages/activity";
import Settings from "@/pages/settings";
import { useEffect } from "react";

function RootRedirect() {
  const { currentUser, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading) {
      if (currentUser) {
        setLocation(`/dashboard/${currentUser.role}`);
      } else {
        setLocation("/login");
      }
    }
  }, [currentUser, loading, setLocation]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return null;
}

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b border-border bg-background">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
          </header>
          <main className="flex-1 overflow-y-auto bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={RootRedirect} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />

      <Route path="/dashboard/member">
        <ProtectedRoute allowedRoles={["member", "admin", "owner"]}>
          <AuthenticatedLayout>
            <DashboardMember />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/dashboard/admin">
        <ProtectedRoute allowedRoles={["admin", "owner"]}>
          <AuthenticatedLayout>
            <DashboardAdmin />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/dashboard/owner">
        <ProtectedRoute allowedRoles={["owner"]}>
          <AuthenticatedLayout>
            <DashboardOwner />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/members">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <Members />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/members/:uid">
        {(params) => (
          <ProtectedRoute>
            <AuthenticatedLayout>
              <MemberProfile params={params} />
            </AuthenticatedLayout>
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/gallery">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <Gallery />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/activity">
        <ProtectedRoute allowedRoles={["admin", "owner"]}>
          <AuthenticatedLayout>
            <Activity />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/manage-users">
        <ProtectedRoute allowedRoles={["admin", "owner"]}>
          <AuthenticatedLayout>
            <DashboardAdmin />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/settings">
        <ProtectedRoute allowedRoles={["owner"]}>
          <AuthenticatedLayout>
            <Settings />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/profile">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <Profile />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Router />
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;