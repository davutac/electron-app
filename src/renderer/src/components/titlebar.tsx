import { PanelLeftIcon } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";

const Titlebar = (): React.JSX.Element => (
  <header className="app-titlebar fixed inset-x-0 top-0 z-30 border-b flex shrink-0 items-center bg-background">
    <div className="flex min-w-0 items-center gap-2">
      <SidebarTrigger className="app-titlebar-interactive">
        <PanelLeftIcon />
        <span className="sr-only">Toggle sidebar</span>
      </SidebarTrigger>
      <div className="min-w-0">
        <p className="truncate font-medium text-sm">Electron App</p>
      </div>
    </div>
  </header>
);

export default Titlebar;
