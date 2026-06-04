"use client";
import React, { useEffect, useState } from "react";
import { useUIStore } from "@/lib/store/uiStore";
import { Loader, } from "lucide-react"; 

export default function GlobalLoader() {
  const isLoading = useUIStore((state) => state.isLoading);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-6 shadow-md">
        
        <Loader className="h-8 w-8 animate-spin text-primary" />
        
        <span className="text-sm font-medium text-muted-foreground">Loading...</span>
      </div>
    </div>
  );
}