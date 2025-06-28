import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { registerUser, loginUser } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";

// Schema untuk form login
const loginSchema = z.object({
  username: z.string().min(1, "Username harus diisi"),
  password: z.string().min(1, "Password harus diisi"),
});

// Schema untuk form register
const registerSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  fullName: z.string().min(2, "Nama lengkap minimal 2 karakter"),
  birthDate: z.string().min(1, "Tanggal lahir harus diisi"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuth();
  const { toast } = useToast();

  // Form untuk login
  const {
    register: loginRegister,
    handleSubmit: loginHandleSubmit,
    formState: { errors: loginErrors },
    reset: loginReset,
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  // Form untuk register
  const {
    register: registerRegister,
    handleSubmit: registerHandleSubmit,
    formState: { errors: registerErrors },
    reset: registerReset,
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const onLoginSubmit = async (data: LoginData) => {
    setIsLoading(true);
    try {
      const user = await loginUser({
        username: data.username,
        password: data.password,
      });
      setUser(user);
      onOpenChange(false);
      loginReset();
      toast({
        title: "Login berhasil!",
        description: `Selamat datang kembali, ${user.username}`,
      });
    } catch (error: any) {
      toast({
        title: "Login gagal",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const user = await registerUser({
        username: data.username,
        fullName: data.fullName,
        birthDate: data.birthDate,
        password: data.password,
      });
      setUser(user);
      onOpenChange(false);
      registerReset();
      toast({
        title: "Registrasi berhasil!",
        description: "Selamat datang di NoMercy!",
      });
    } catch (error: any) {
      toast({
        title: "Registrasi gagal",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    loginReset();
    registerReset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-50">
            {isLogin ? "Login ke NoMercy" : "Bergabung dengan NoMercy"}
          </DialogTitle>
        </DialogHeader>

        {isLogin ? (
          // Form Login
          <form onSubmit={loginHandleSubmit(onLoginSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-username" className="text-slate-300">
                Username
              </Label>
              <div className="relative">
                <Input
                  id="login-username"
                  type="text"
                  placeholder="Masukkan username"
                  className="bg-slate-700 border-slate-600 text-slate-50 pr-24"
                  {...loginRegister("username")}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm">
                  @gmail.com
                </div>
              </div>
              {loginErrors.username && (
                <p className="text-red-400 text-sm">{loginErrors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password" className="text-slate-300">
                Password
              </Label>
              <Input
                id="login-password"
                type="password"
                placeholder="Masukkan password"
                className="bg-slate-700 border-slate-600 text-slate-50"
                {...loginRegister("password")}
              />
              {loginErrors.password && (
                <p className="text-red-400 text-sm">{loginErrors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600"
              disabled={isLoading}
            >
              {isLoading ? "Masuk..." : "Masuk"}
            </Button>
          </form>
        ) : (
          // Form Register
          <form onSubmit={registerHandleSubmit(onRegisterSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="register-username" className="text-slate-300">
                Username
              </Label>
              <div className="relative">
                <Input
                  id="register-username"
                  type="text"
                  placeholder="Pilih username"
                  className="bg-slate-700 border-slate-600 text-slate-50 pr-24"
                  {...registerRegister("username")}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm">
                  @gmail.com
                </div>
              </div>
              {registerErrors.username && (
                <p className="text-red-400 text-sm">{registerErrors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-fullname" className="text-slate-300">
                Nama Lengkap
              </Label>
              <Input
                id="register-fullname"
                type="text"
                placeholder="Masukkan nama lengkap"
                className="bg-slate-700 border-slate-600 text-slate-50"
                {...registerRegister("fullName")}
              />
              {registerErrors.fullName && (
                <p className="text-red-400 text-sm">{registerErrors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-birthdate" className="text-slate-300">
                Tanggal Lahir
              </Label>
              <Input
                id="register-birthdate"
                type="date"
                className="bg-slate-700 border-slate-600 text-slate-50"
                {...registerRegister("birthDate")}
              />
              {registerErrors.birthDate && (
                <p className="text-red-400 text-sm">{registerErrors.birthDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-password" className="text-slate-300">
                Password
              </Label>
              <Input
                id="register-password"
                type="password"
                placeholder="Buat password"
                className="bg-slate-700 border-slate-600 text-slate-50"
                {...registerRegister("password")}
              />
              {registerErrors.password && (
                <p className="text-red-400 text-sm">{registerErrors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-violet-500 hover:bg-violet-600"
              disabled={isLoading}
            >
              {isLoading ? "Membuat Akun..." : "Buat Akun"}
            </Button>
          </form>
        )}

        <div className="text-center">
          <Button
            variant="link"
            onClick={toggleMode}
            className="text-indigo-400 hover:text-indigo-300"
          >
            {isLogin ? "Belum punya akun? Daftar" : "Sudah punya akun? Masuk"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}