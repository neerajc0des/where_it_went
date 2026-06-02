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

  // Prevent local state hydration mismatches between server and client runs
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
        {/* The responsive drawer engine */}
        <AppSidebar />
        
        {/* Core application view frame */}
        <div className="flex flex-1 flex-col overflow-hidden bg-background">
          {/* Header Action Navbar bar */}
          <header className="flex h-14 items-center gap-4 border-b border-border bg-background px-6">
            {/* The trigger auto-toggles collapsible icon mode on desktop, and drawers over mobile viewports */}
            <SidebarTrigger className="-ml-1" />
            {/* <div className="h-4 w-[1px] bg-border" />
            <h1 className="text-sm font-medium text-muted-foreground">
              Workspace
            </h1> */}
          </header>

          {/* Sub-page view content injection wrapper */}
          <main className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="mx-auto max-w-6xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}