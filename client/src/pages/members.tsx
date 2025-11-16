import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Members() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  const { data: members, isLoading } = useQuery<User[]>({
    queryKey: ["/api/members"],
    queryFn: async () => {
      const q = query(collection(db, "users"), orderBy("displayName", "asc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as User);
    },
  });

  const filteredMembers = members?.filter(member =>
    member.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getStatusColor = (status: string) => {
    return {
      online: "bg-status-online",
      away: "bg-status-away",
      busy: "bg-status-busy",
      offline: "bg-status-offline",
    }[status] || "bg-status-offline";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-page-title">
            Community Members
          </h1>
          <p className="text-muted-foreground">
            {members?.length || 0} members in the NoMercy community
          </p>
        </div>
        <Users className="h-12 w-12 text-primary" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Members</CardTitle>
          <CardDescription>Find members by name or email</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="input-search"
            />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredMembers && filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => {
            const roleColor = {
              member: "bg-blue-500",
              admin: "bg-purple-500",
              owner: "bg-primary",
            }[member.role];

            return (
              <Card 
                key={member.uid} 
                className="hover-elevate cursor-pointer transition-all" 
                data-testid={`member-card-${member.uid}`}
                onClick={() => setLocation(`/members/${member.uid}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={member.photoURL} />
                        <AvatarFallback className={`${roleColor} text-white text-lg`}>
                          {getInitials(member.displayName)}
                        </AvatarFallback>
                      </Avatar>
                      <div 
                        className={`absolute bottom-0 right-0 h-4 w-4 ${getStatusColor(member.status)} border-2 border-card rounded-full`}
                        title={member.status}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate" data-testid={`text-name-${member.uid}`}>
                        {member.displayName}
                      </h3>
                      <Badge variant="secondary" className="text-xs capitalize mt-1">
                        {member.role}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground truncate">
                      {member.email}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className={`h-2 w-2 ${getStatusColor(member.status)} rounded-full`} />
                      <span className="capitalize">{member.status}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchQuery ? "No members found matching your search" : "No members yet"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
