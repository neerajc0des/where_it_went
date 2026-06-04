"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader, Loader2 } from "lucide-react";
import { GithubIcon, GoogleIcon } from "@/components/brand-icons";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import api from "@/lib/api";
import { API_BASE_URL, ENDPOINTS } from "@/lib/constants";
import { useAuthStore } from "@/lib/store/authStore";
import { ApiResponse } from "@/types";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUIStore } from "@/lib/store/uiStore";


const loginSchema = z.object({
  email: z.email({ error: "Please enter a valid email address" }),
  password: z.string().min(1, "Password is required"),
});
type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const isLoading = useUIStore((state) => state.isLoading);

  const {setAuth} = useAuthStore();
  const router = useRouter();

  const {register, handleSubmit, formState: { errors, isSubmitting }} = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);

    try {
      const res = await api.post(`${ENDPOINTS.auth.login}`, data);
      if(res.data.success){
        setAuth(
          res.data.data.user,
          res.data.data.accessToken,
          res.data.data.refreshToken
        );
        toast.success("Login successful");
        router.push("/overview");
      }
    } catch (error:any) {
      const fallbackError = error.response?.data?.message || "Something went wrong, please try again";
      setServerError(fallbackError);
      toast.error(fallbackError);
    }
  };

  

  const handleGoogleLogin = ()=>{
    // router.push(API_BASE_URL+ENDPOINTS.auth.google);
    window.location.href =`${API_BASE_URL}${ENDPOINTS.auth.google}`;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-8 bg-secondary p-8 rounded-xl border border-border shadow-sm">
        
        {/* Header Section */}
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-lg bg-primary flex items-center justify-center shadow-md">
            <span className="text-primary-foreground font-bold text-xl tracking-tight">W</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground pt-2">
            Welcome back
          </h2>
          <p className="text-sm text-muted-foreground">
            Enter your details below to access your dashboard
          </p>
        </div>

        {/* Social Authentication Buttons */}
        <div className="grid grid-cols-1 gap-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-border bg-background rounded-md text-sm font-medium text-foreground hover:bg-accent transition-colors cursor-pointer"
          >
            <GoogleIcon className="h-4 w-4" />
            <span>Login with Google</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <span className="relative bg-secondary px-3 text-xs uppercase text-muted-foreground tracking-wider">
            Or
          </span>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground/70">
                <Mail className="h-4 w-4" />
              </div>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register("email")}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              />
            </div>
            {errors.email && (
              <p className="text-xs font-medium text-destructive animate-in fade-in-50 duration-200">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground/70">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className="w-full pl-10 pr-10 py-2 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground/70 hover:text-foreground cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="flex items-center justify-between min-h-[20px] pt-0.5">
              {errors.password ? (
                <p className="text-xs font-medium text-destructive animate-in fade-in-50 duration-200">
                  {errors.password.message}
                </p>
              ) : (
                <div />
              )}
              <Link href="/forgot-password" className="text-xs text-primary hover:underline tracking-wide font-medium">
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          {/* <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-border text-primary focus:ring-ring accent-primary"
            />
            <label htmlFor="remember-me" className="ml-2 text-sm text-muted-foreground select-none">
              Keep me logged in
            </label>
          </div> */}

          {/* Primary Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-medium rounded-md shadow-sm hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer text-sm"
          >
            <span>Sign in to account</span>
            {isLoading ?
             <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
            :
              <ArrowRight className="h-4 w-4" />
            }
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground pt-2">
          Don't have an account?{" "}
          <Link href="/register" className="text-primary font-semibold hover:underline">
            Create an account
          </Link>
        </p>

      </div>
    </div>
  );
}