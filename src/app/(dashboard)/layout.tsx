"use client";

import * as React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-sidebar/50">
        <AppSidebar />
        
        <div className="flex flex-1 flex-col overflow-hidden bg-background">
         <header className="flex h-14 items-center justify-between border-b border-border bg-sidebar px-4 md:hidden">
           <SidebarTrigger className="h-9 w-9 rounded-lg text-sidebar-foreground/70 cursor-pointer" />
           <div className="flex flex-col items-center gap-4 py-2">
            <div className="h-10 w-10 rounded-full overflow-hidden border border-sidebar-border shadow-xs bg-zinc-800 text-white flex items-center justify-center font-bold text-xs capitalize">
              {"U"}
            </div>
          </div>
         </header>

          <div className="flex flex-1 flex-col overflow-hidden bg-background">
            <header className="flex h-14 text-xl items-center justify-between border-b border-border md:hidden">
              Heading
            </header>

            <div className="hidden md:flex h-14 items-center px-8 border-b border-border/40">
              <h1 className="text-lg font-semibold capitalize text-muted-foreground tracking-wide">
                Dashboard Overview
              </h1>
            </div>

            <main className="flex-1 overflow-y-auto p-6 md:p-8">
              <div className="mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}