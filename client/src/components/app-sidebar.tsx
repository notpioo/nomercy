import { Home, Users, Image, Activity, Settings, LogOut, Crown, Shield, UserCog, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";

export function AppSidebar() {
  const { currentUser, signOut } = useAuth();
  const [location] = useLocation();

  if (!currentUser) return null;

  const roleColor = {
    member: "bg-blue-500",
    admin: "bg-purple-500",
    owner: "bg-primary",
  }[currentUser.role];

  const menuItems = [
    {
      title: "Dashboard",
      url: `/dashboard/${currentUser.role}`,
      icon: Home,
      roles: ["member", "admin", "owner"],
    },
    {
      title: "Members",
      url: "/members",
      icon: Users,
      roles: ["member", "admin", "owner"],
    },
    {
      title: "Gallery",
      url: "/gallery",
      icon: Image,
      roles: ["member", "admin", "owner"],
    },
    {
      title: "Activity",
      url: "/activity",
      icon: Activity,
      roles: ["admin", "owner"],
    },
    {
      title: "User Management",
      url: "/manage-users",
      icon: UserCog,
      roles: ["admin", "owner"],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      roles: ["owner"],
    },
    {
      title: "Profile",
      url: "/profile",
      icon: User,
      roles: ["member", "admin", "owner"],
    },
  ];

  const filteredItems = menuItems.filter((item) =>
    item.roles.includes(currentUser.role)
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Sidebar data-testid="sidebar-main">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-md bg-primary flex items-center justify-center`}>
            <span className="text-primary-foreground font-gaming font-bold text-xl">NM</span>
          </div>
          <div className="flex-1">
            <h1 className="font-gaming font-bold text-lg text-foreground">NoMercy</h1>
            <p className="text-xs text-muted-foreground">Gaming Community</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <Link href={item.url}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 p-3 rounded-md bg-sidebar-accent">
          <Avatar className="w-10 h-10">
            <AvatarImage src={currentUser.photoURL} />
            <AvatarFallback className={`${roleColor} text-white`}>
              {getInitials(currentUser.displayName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate" data-testid="text-user-name">
              {currentUser.displayName}
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs capitalize" data-testid={`badge-role-${currentUser.role}`}>
                {currentUser.role}
              </Badge>
            </div>
          </div>
        </div>
        <SidebarMenuButton 
          onClick={() => signOut()} 
          className="w-full mt-2" 
          data-testid="button-logout"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}