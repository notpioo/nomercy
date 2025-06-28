import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { registerUser, loginUser } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";

// Separate schemas for login and register forms
const loginFormSchema = z.object({
  username: z.string().min(1, "Username harus diisi"),
  password: z.string().min(1, "Password harus diisi"),
});

const registerFormSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  fullName: z.string().min(1, "Nama lengkap harus diisi"),
  birthDate: z.string().min(1, "Tanggal lahir harus diisi"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type LoginFormData = z.infer<typeof loginFormSchema>;
type RegisterFormData = z.infer<typeof registerFormSchema>;

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuth();
  const { toast } = useToast();

  // Separate form instances
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      fullName: "",
      birthDate: "",
      password: "",
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const user = await loginUser({
        username: data.username,
        password: data.password,
      });
      setUser(user);
      onOpenChange(false);
      toast({
        title: "Selamat datang kembali!",
        description: `Login sebagai ${user.username}`,
      });
      loginForm.reset();
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

  const handleRegister = async (data: RegisterFormData) => {
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
      toast({
        title: "Selamat datang di NoMercy!",
        description: "Akun Anda berhasil dibuat.",
      });
      registerForm.reset();
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

  const switchMode = () => {
    setIsLogin(!isLogin);
    loginForm.reset();
    registerForm.reset();
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
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Masukkan username Anda"
                          className="bg-slate-700 border-slate-600 text-slate-50 pr-24"
                          {...field}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm">
                          @gmail.com
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Masukkan password Anda"
                        className="bg-slate-700 border-slate-600 text-slate-50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-indigo-500 hover:bg-indigo-600"
                disabled={isLoading}
              >
                {isLoading ? "Masuk..." : "Masuk"}
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...registerForm}>
            <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
              <FormField
                control={registerForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Pilih username"
                          className="bg-slate-700 border-slate-600 text-slate-50 pr-24"
                          {...field}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm">
                          @gmail.com
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masukkan nama lengkap Anda"
                        className="bg-slate-700 border-slate-600 text-slate-50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Tanggal Lahir</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="bg-slate-700 border-slate-600 text-slate-50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Buat password"
                        className="bg-slate-700 border-slate-600 text-slate-50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-violet-500 hover:bg-violet-600"
                disabled={isLoading}
              >
                {isLoading ? "Membuat Akun..." : "Buat Akun"}
              </Button>
            </form>
          </Form>
        )}

        <div className="text-center">
          <Button
            variant="link"
            onClick={switchMode}
            className="text-indigo-400 hover:text-indigo-300"
          >
            {isLogin ? "Belum punya akun? Daftar" : "Sudah punya akun? Masuk"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}