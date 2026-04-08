import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin } from "../../hooks/useAuth.js";
import { PawPrint, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button.jsx";
import { Input } from "../../components/ui/input.jsx";
import { Label } from "../../components/ui/label.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card.jsx";

// Validation Schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid work email"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    login(data);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 antialiased">
      {/* Branding Header */}
      <div className="w-full max-w-md mb-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/10">
          <PawPrint className="w-7 h-7 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          PawCare
        </h1>
        <p className="text-muted-foreground text-sm mt-1 font-medium">
          Veterinary Management System
        </p>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md border-border/50 shadow-xl shadow-black/5 animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl  text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Enter your email to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@clinic.com"
                className={`h-11 transition-all ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                disabled={isPending}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-[12px] font-medium text-destructive leading-none">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  className="text-xs text-primary hover:underline font-medium focus:outline-none"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className={`h-11 transition-all ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                disabled={isPending}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-[12px] font-medium text-destructive leading-none">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11 text-sm font-bold shadow-sm"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Modern Footer */}
      <footer className="mt-12 text-center">
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground/50 font-bold">
          Protected by PawCare Security © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
