import {
  ActivityIcon,
  ArchiveIcon,
  BoxesIcon,
  GaugeIcon,
  InboxIcon,
  LayoutDashboardIcon,
  SettingsIcon,
} from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { LucideProps } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

interface SidebarItem {
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  isActive?: boolean;
  title: string;
}

const primaryItems = [
  {
    icon: LayoutDashboardIcon,
    isActive: true,
    title: "Dashboard",
  },
  {
    icon: InboxIcon,
    title: "Inbox",
  },
  {
    icon: ActivityIcon,
    title: "Activity",
  },
  {
    icon: ArchiveIcon,
    title: "Archive",
  },
] satisfies SidebarItem[];

const workspaceItems = [
  {
    icon: BoxesIcon,
    title: "Projects",
  },
  {
    icon: GaugeIcon,
    title: "Metrics",
  },
  {
    icon: SettingsIcon,
    title: "Settings",
  },
] satisfies SidebarItem[];

const AppSidebar = (): React.JSX.Element => (
  <Sidebar className="app-sidebar" collapsible="icon">
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {primaryItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton isActive={item.isActive} tooltip={item.title}>
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Workspace</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {workspaceItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title}>
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <div className="flex aspect-square items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
              EA
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Davut</span>
              <span className="truncate text-muted-foreground text-xs">Desktop session</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
);

export default AppSidebar;
