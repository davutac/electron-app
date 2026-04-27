import AppSidebar from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import Titlebar from "@/components/titlebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardRoute from "@/routes/dashboard";
import SettingsRoute from "@/routes/settings";
import { HashRouter, Navigate, Route, Routes } from "react-router";
import { SidebarProvider } from "./components/ui/sidebar";

const App = (): React.JSX.Element => (
  <ThemeProvider defaultTheme="dark" storageKey="electron-app-theme">
    <HashRouter>
      <TooltipProvider>
        <div className="flex h-svh flex-col">
          <SidebarProvider className="min-h-0 flex-1" defaultOpen={false}>
            <Titlebar />
            <AppSidebar />
            <main className="min-h-0 flex-1 overflow-auto">
              <Routes>
                <Route element={<DashboardRoute />} path="/" />
                <Route element={<SettingsRoute />} path="/settings" />
                <Route element={<Navigate replace to="/" />} path="*" />
              </Routes>
            </main>
          </SidebarProvider>
        </div>
      </TooltipProvider>
    </HashRouter>
  </ThemeProvider>
);

export default App;
