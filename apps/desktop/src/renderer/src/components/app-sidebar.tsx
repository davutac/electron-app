import {
  ActivityIcon,
  ArchiveIcon,
  BoxesIcon,
  GaugeIcon,
  InboxIcon,
  LayoutDashboardIcon,
  SettingsIcon,
} from "lucide-react";
import { formatForDisplay, useHotkey } from "@tanstack/react-hotkeys";
import type { RegisterableHotkey } from "@tanstack/react-hotkeys";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { LucideProps } from "lucide-react";

import { Kbd } from "@/components/ui/kbd";
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
  shortcut: RegisterableHotkey;
  to: AppRoutePath;
}

const primaryItems = [
  {
    end: true,
    icon: LayoutDashboardIcon,
    shortcut: "Mod+1",
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
  shortcut: "Mod+,",
  title: "Settings",
  to: "/settings",
} satisfies SidebarRouteItem;

const isRouteItem = (item: SidebarItem | SidebarRouteItem): item is SidebarRouteItem =>
  "to" in item;

interface SidebarRouteMenuItemProps {
  isActive: boolean;
  item: SidebarRouteItem;
}

const SidebarRouteMenuItem = ({ isActive, item }: SidebarRouteMenuItemProps): React.JSX.Element => {
  const navigate = useNavigate();
  const shortcutLabel = formatForDisplay(item.shortcut);

  useHotkey(item.shortcut, () => {
    void navigate({ to: item.to });
  });

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        render={<Link to={item.to} />}
        tooltip={{
          children: (
            <>
              <span>{item.title}</span>
              <Kbd>{shortcutLabel}</Kbd>
            </>
          ),
        }}
      >
        <item.icon />
        <span>{item.title}</span>
        <Kbd className="ml-auto opacity-0 transition-opacity group-focus-within/menu-button:opacity-100 group-hover/menu-button:opacity-100 group-data-[collapsible=icon]:hidden">
          {shortcutLabel}
        </Kbd>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

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
              {primaryItems.map((item) =>
                isRouteItem(item) ? (
                  <SidebarRouteMenuItem isActive={isActive(item)} item={item} key={item.title} />
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton tooltip={item.title}>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ),
              )}
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
          <SidebarRouteMenuItem isActive={isActive(settingsItem)} item={settingsItem} />
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
