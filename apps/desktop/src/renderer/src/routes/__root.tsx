import AppSidebar from "@/components/app-sidebar";
import IpcToastListener from "@/components/ipc-toast-listener";
import { useTheme } from "@/components/theme-provider";
import Titlebar from "@/components/titlebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { createRootRoute, Navigate, Outlet } from "@tanstack/react-router";

const RootLayout = () => {
  const { theme } = useTheme();

  return (
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
      <IpcToastListener />
      <Toaster theme={theme} />
    </TooltipProvider>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => <Navigate replace to="/" />,
});
