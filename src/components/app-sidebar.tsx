"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Tags, 
  LogOut, 
  Settings,
  Sun,
  Moon
} from "lucide-react";

import { useAuthStore } from "@/lib/store/authStore";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const { state, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed";

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/login"; // Hard reload breaks Next.js client-cache safely
  };

  // Nav items mapped to your exact folder layout structure
  const navigation = [
    { name: "Overview", href: "/overview", icon: LayoutDashboard },
    { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
    { name: "Categories", href: "/categories", icon: Tags }, // Matches your current folder naming
  ];

  return (
    <Sidebar className={cn(
       "transition-colors duration-200", "border-none",
       isCollapsed && "md:bg-background [&_[data-sidebar=sidebar]]:bg-background")} collapsible="icon" {...props}>
      {/* ================= HEADER BRANDING ================= */}
      <SidebarHeader className="h-14 justify-end md:justify-center  px-4">
        <div className="flex items-center justify-between font-semibold text-sidebar-foreground">
          
          {!isCollapsed && (
            <div className="flex items-center gap-3 animate-in fade-in duration-200">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold text-sm">
                W
              </div>
              <span className="truncate font-bold text-base tracking-tight">
                Where It Went
              </span>
            </div>
          )}

          <SidebarTrigger 
            className={
              isCollapsed
                ? "h-12 text-right w-full mx-auto text-foreground rounded-lg cursor-pointer hover:text-sidebar-accent-foreground"
                : "h-12 w-12 text-sidebar-foreground/70 hover:bg-sidebar-hover-accent hover:text-sidebar-accent-foreground rounded-lg cursor-pointer"
            }
          />

        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className={`${isCollapsed ? "space-y-2": ""}`}>
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton 
                      isActive={isActive} 
                      tooltip={item.name}
                      className="w-full h-12 gap-3 group-data-[collapsible=icon]:justify-center"
                    >
                       <Link 
                         href={item.href} 
                         onClick={() => setOpenMobile(false)} 
                         className="flex items-center w-full gap-3 group-data-[collapsible=icon]:justify-center"
                       >                        
                       <item.icon className="!h-8 !w-8 p-1 shrink-0" />
                        <span className="group-data-[collapsible=icon]:hidden">
                          {item.name}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-4 py-2">
            <button
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="relative p-2 text-sidebar-foreground/70 hover:bg-sidebar-hover-accent hover:text-sidebar-accent-foreground rounded-lg transition-colors cursor-pointer"
              >
                {mounted && resolvedTheme === "dark" ? (
                  <Sun className="h-5 w-5 text-amber-500" />
                ) : (
                  <Moon className="h-5 w-5 text-indigo-500" />
                )}
              </button>
            <div className="h-10 w-10 rounded-full overflow-hidden border border-sidebar-border shadow-xs bg-zinc-800 text-white flex items-center justify-center font-bold text-xs capitalize">
              {user?.name?.[0] || "U"}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full px-2 py-1 animate-in fade-in duration-200">
            {/* Left Block: User Identity Card */}
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-7 w-7 shrink-0 rounded-full overflow-hidden border border-sidebar-border shadow-xs bg-zinc-800 text-white flex items-center justify-center font-bold text-xs capitalize">
                {user?.name?.[0] || "U"}
              </div>
              <div className="flex flex-col overflow-hidden text-left">
                <span className="truncate capitalize text-sm font-medium text-sidebar-foreground">
                  {user?.name || "User"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="relative p-2 text-sidebar-foreground/70 hover:bg-sidebar-hover-accent hover:text-sidebar-accent-foreground rounded-lg transition-colors cursor-pointer"
              >
                <Settings className="h-5 w-5 " />
              </button>

              <button
                onClick={handleLogout}
                className="p-2 text-sidebar-foreground/50 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}