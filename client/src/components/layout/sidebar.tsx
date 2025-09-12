import { Link, useLocation } from "wouter";
import { Building, Users, Calculator, MessageSquare, Hammer, NotebookTabs, ChartLine, Truck, Calendar, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import exteriorFinishesLogo from "@/assets/exterior-finishes-logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { path: "/leads", label: "Lead Management", icon: Users },
  { path: "/estimates", label: "Estimates", icon: Calculator },
  { path: "/communications", label: "Communications", icon: MessageSquare },
  { path: "/jobs", label: "Jobs", icon: Hammer },
  { path: "/customers", label: "Customers", icon: NotebookTabs },
  { path: "/reporting", label: "Reporting", icon: ChartLine },
  { path: "/vendors", label: "Vendors", icon: Truck },
  { path: "/calendar", label: "Calendar", icon: Calendar },
];

export default function AppSidebar() {
  const [location] = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r" data-testid="sidebar">
      <SidebarHeader className="border-b p-4">
        <Link href="/" data-testid="link-dashboard">
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1 shrink-0">
              <img 
                src={exteriorFinishesLogo} 
                alt="Exterior Finishes Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <h1 className="text-lg font-serif font-bold text-sidebar-foreground truncate">
                  Exterior Finishes
                </h1>
                <p className="text-sm text-sidebar-foreground/70 truncate">
                  Where Service & Quality Meet
                </p>
              </div>
            )}
          </div>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu data-testid="nav-menu">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;
                
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton 
                      asChild
                      isActive={isActive}
                      data-testid={`link-${item.label.toLowerCase().replace(' ', '-')}`}
                    >
                      <Link href={item.path}>
                        <Icon size={20} />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-sidebar-primary rounded-full flex items-center justify-center shrink-0">
            <Users className="text-sidebar-primary-foreground text-sm" size={16} />
          </div>
          {!isCollapsed && (
            <>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-sidebar-foreground truncate">John Smith</p>
                <p className="text-xs text-sidebar-foreground/70 truncate">Sales Manager</p>
              </div>
              <button 
                className="text-sidebar-foreground/70 hover:text-sidebar-foreground shrink-0"
                data-testid="button-settings"
              >
                <Settings size={16} />
              </button>
            </>
          )}
        </div>
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  );
}
