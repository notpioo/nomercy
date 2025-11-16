import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Users, Trophy, Image as ImageIcon } from "lucide-react";
import { Link } from "wouter";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp, currentUser } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (currentUser) {
      setLocation(`/dashboard/${currentUser.role}`);
    }
  }, [currentUser, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signUp(email, password, displayName);
      toast({
        title: "Account created!",
        description: "Welcome to the NoMercy community.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "Could not create account. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary/20 via-primary/10 to-background relative overflow-hidden p-12 flex-col justify-between">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-gaming font-bold text-2xl">NM</span>
            </div>
            <div>
              <h1 className="font-gaming font-bold text-2xl text-foreground">NoMercy</h1>
              <p className="text-sm text-muted-foreground">Gaming Community</p>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Level Up Together
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join our growing community and experience gaming like never before.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-md bg-card border border-card-border hover-elevate">
              <Users className="w-6 h-6 text-primary" />
              <div>
                <p className="font-semibold text-foreground">Connect</p>
                <p className="text-sm text-muted-foreground">Meet fellow gamers</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-md bg-card border border-card-border hover-elevate">
              <ImageIcon className="w-6 h-6 text-primary" />
              <div>
                <p className="font-semibold text-foreground">Share</p>
                <p className="text-sm text-muted-foreground">Upload your best moments</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-md bg-card border border-card-border hover-elevate">
              <Trophy className="w-6 h-6 text-primary" />
              <div>
                <p className="font-semibold text-foreground">Compete</p>
                <p className="text-sm text-muted-foreground">Join tournaments & events</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="md:hidden mb-8 text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-gaming font-bold text-xl">NM</span>
              </div>
              <h1 className="font-gaming font-bold text-xl text-foreground">NoMercy</h1>
            </div>
          </div>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
              <CardDescription>
                Join the community and start your journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Your gaming name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    data-testid="input-displayname"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    data-testid="input-email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    data-testid="input-password"
                  />
                  <p className="text-xs text-muted-foreground">
                    Must be at least 6 characters
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                  data-testid="button-register"
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link href="/login" className="text-primary font-medium hover:underline" data-testid="link-login">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
