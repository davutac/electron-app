import { PanelLeftIcon } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import TitlebarUpdateButton from "@/components/titlebar-update-button";
import { APP_NAME } from "@/constants";

const Titlebar = (): React.JSX.Element => (
  <header className="app-titlebar fixed inset-x-0 top-0 z-30 flex shrink-0 items-center justify-between gap-2 border-b bg-background">
    <div className="flex min-w-0 items-center gap-2">
      <SidebarTrigger className="app-titlebar-interactive">
        <PanelLeftIcon />
        <span className="sr-only">Toggle sidebar</span>
      </SidebarTrigger>
      <div className="min-w-0">
        <p className="truncate font-medium text-sm">{APP_NAME}</p>
      </div>
    </div>
    <TitlebarUpdateButton />
  </header>
);

export default Titlebar;
