import AppSidebar from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import Titlebar from "@/components/titlebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { createRootRoute, Navigate, Outlet } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

const RootLayout = () => (
  <ThemeProvider defaultTheme="dark" storageKey="electron-app-theme">
    <TooltipProvider>
      <div className="flex h-svh flex-col">
        <SidebarProvider className="min-h-0 flex-1" defaultOpen={false}>
          <Titlebar />
          <AppSidebar />
          <main className="min-h-0 flex-1 overflow-auto">
            <Outlet />
          </main>
        </SidebarProvider>
      </div>
    </TooltipProvider>
    <Toaster />
  </ThemeProvider>
);

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => <Navigate replace to="/" />,
});
