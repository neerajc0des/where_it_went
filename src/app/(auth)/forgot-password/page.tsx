"use client";

import React, { useState } from "react";
import { Mail, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import api from "@/lib/api";
import { ENDPOINTS } from "@/lib/constants";
import Link from "next/link";
import { useUIStore } from "@/lib/store/uiStore";

const forgotPasswordSchema = z.object({
  email: z.email({ error: "Please enter a valid email address" }),
});
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const isLoading = useUIStore((state) => state.isLoading);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {

    try {
      const res = await api.post(`${ENDPOINTS.auth.forgotPassword}`, data);
      if (res.data.success) {
        toast.success("Password reset link has been sent to your registered email.");
      }
    } catch (error: any) {
      const fallbackError = error.response?.data?.message || "Failed to send reset link, please try again";
      toast.error(fallbackError);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-8 bg-secondary p-8 rounded-xl border border-border shadow-sm">
        
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-lg bg-primary flex items-center justify-center shadow-md">
            <span className="text-primary-foreground font-bold text-xl tracking-tight">W</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground pt-2">
            Forgot password?
          </h2>
          <p className="text-sm text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

       

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
                placeholder="alisa@gmail.com"
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-medium rounded-md shadow-sm hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer text-sm disabled:opacity-50"
          >
            <span>Send reset link</span>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground pt-2">
          <Link href="/login" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to sign in</span>
          </Link>
        </p>

      </div>
    </div>
  );
}