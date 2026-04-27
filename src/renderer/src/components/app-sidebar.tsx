import {
  ActivityIcon,
  ArchiveIcon,
  BoxesIcon,
  GaugeIcon,
  InboxIcon,
  LayoutDashboardIcon,
  SettingsIcon,
} from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
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
  title: string;
}

type AppRoutePath = "/" | "/settings";

interface SidebarRouteItem extends SidebarItem {
  end?: boolean;
  to: AppRoutePath;
}

const primaryItems = [
  {
    end: true,
    icon: LayoutDashboardIcon,
    title: "Dashboard",
    to: "/",
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
] satisfies (SidebarItem | SidebarRouteItem)[];

const workspaceItems = [
  {
    icon: BoxesIcon,
    title: "Projects",
  },
  {
    icon: GaugeIcon,
    title: "Metrics",
  },
] satisfies SidebarItem[];

const settingsItem = {
  icon: SettingsIcon,
  title: "Settings",
  to: "/settings",
} satisfies SidebarRouteItem;

const isRouteItem = (item: SidebarItem | SidebarRouteItem): item is SidebarRouteItem =>
  "to" in item;

const AppSidebar = (): React.JSX.Element => {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const isActive = (item: SidebarRouteItem) =>
    item.end ? pathname === item.to : pathname.startsWith(item.to);

  return (
    <Sidebar className="app-sidebar" collapsible="icon">
      <SidebarContent className="pt-1">
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {primaryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={isRouteItem(item) ? isActive(item) : false}
                    render={isRouteItem(item) ? <Link to={item.to} /> : undefined}
                    tooltip={item.title}
                  >
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
            <SidebarMenuButton
              isActive={isActive(settingsItem)}
              render={<Link to={settingsItem.to} />}
              tooltip={settingsItem.title}
            >
              <settingsItem.icon />
              <span>{settingsItem.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
