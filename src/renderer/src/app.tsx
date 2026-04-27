import AppSidebar from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import Titlebar from "@/components/titlebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "./components/ui/sidebar";

const App = (): React.JSX.Element => (
  <ThemeProvider defaultTheme="dark" storageKey="electron-app-theme">
    <TooltipProvider>
      <div className="flex h-svh flex-col">
        <SidebarProvider className="min-h-0 flex-1" defaultOpen={false}>
          <Titlebar />
          <AppSidebar />
          <main className="min-h-0 flex-1 overflow-auto" />
        </SidebarProvider>
      </div>
    </TooltipProvider>
  </ThemeProvider>
);

export default App;
