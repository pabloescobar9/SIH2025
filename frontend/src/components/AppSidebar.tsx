import { NavLink } from "react-router-dom";
import { Home, Map, FileInput, AlertTriangle, BarChart3, Database, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar, SidebarHeader } from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Pollution Map", url: "/map", icon: Map },
  { title: "Data Entry", url: "/data-entry", icon: FileInput },
  { title: "Alerts", url: "/alerts", icon: AlertTriangle },
];

const dataItems = [
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Database", url: "/database", icon: Database },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="flex-shrink-0">
      <SidebarContent>
        <SidebarHeader>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2 overflow-hidden">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground truncate">GW Monitor</h2>
                <p className="text-xs text-muted-foreground truncate">Pollution System</p>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-md hover:bg-muted transition-colors flex items-center justify-center"
              title={state === "expanded" ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              {state === "expanded" ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </SidebarHeader>

        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={window.location.pathname === item.url} tooltip={item.title}>
                    <NavLink to={item.url} className="flex items-center gap-2 w-full px-2 py-1">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Data & Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {dataItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={window.location.pathname === item.url} tooltip={item.title}>
                    <NavLink to={item.url} className="flex items-center gap-2 w-full px-2 py-1">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
