"use client";

import React, { useState } from "react";
import { Lock, Eye, EyeOff, ArrowRight, Loader2, KeyRound } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import api from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { useUIStore } from "@/lib/store/uiStore";

const resetPasswordSchema = z.object({
  password: z.string()
             .min(1, { error: "Password is required" })
            .refine((val) => {
            const hasUpperCase = /[A-Z]/.test(val);
            const hasLowerCase = /[a-z]/.test(val);
            const hasNumber = /[0-9]/.test(val);
            
            return hasUpperCase && hasLowerCase && hasNumber;
            }, {
            error: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
            }),
  confirmPassword: z.string().min(1, { message: "Please confirm your password" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isLoading = useUIStore((state) => state.isLoading);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const token = searchParams.get("token");

  React.useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      router.push("/forgot-password");
    }
  }, [token, router]);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) {
      toast.error("Reset token is missing. Please request a new link.");
      return;
    }

    try {
      const res = await api.post(`${ENDPOINTS.auth.resetPassword}`, {
        password: data.password,
        token: token,
      });

      if (res.data.success) {
        toast.success("Password reset successful! You can now log in.");
        router.push("/login");
      }
    } catch (error: any) {
      const fallbackError = error.response?.data?.message || "Failed to reset password, please try again";
      toast.error(fallbackError);
    }
  };

  if (!token) return null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-8 bg-secondary p-8 rounded-xl border border-border shadow-sm">
        
        {/* Header Section */}
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-lg bg-primary flex items-center justify-center shadow-md">
            <KeyRound className="text-primary-foreground h-6 w-6" />
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground pt-2">
            Reset password
          </h2>
          <p className="text-sm text-muted-foreground">
            Choose a secure new password for your account.
          </p>
        </div>


        {/* Reset Password Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* New Password Input Field */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              New Password
            </label>
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
            {errors.password && (
              <p className="text-xs font-medium text-destructive animate-in fade-in-50 duration-200">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password Input Field */}
          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground/70">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("confirmPassword")}
                className="w-full pl-10 pr-10 py-2 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground/70 hover:text-foreground cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs font-medium text-destructive animate-in fade-in-50 duration-200">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-medium rounded-md shadow-sm hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer text-sm disabled:opacity-50"
          >
            <span>Reset password</span>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
          </button>
        </form>

      </div>
    </div>
  );
}