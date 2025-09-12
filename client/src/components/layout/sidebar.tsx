import { Link, useLocation } from "wouter";
import { Building, Users, Calculator, MessageSquare, Hammer, NotebookTabs, ChartLine, Truck, Calendar, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import exteriorFinishesLogo from "@/assets/exterior-finishes-logo.png";

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

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-secondary text-secondary-foreground shadow-lg flex flex-col" data-testid="sidebar">
      {/* Company Header */}
      <div className="p-6 border-b border-secondary/20">
        <Link href="/" data-testid="link-dashboard">
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1">
              <img 
                src={exteriorFinishesLogo} 
                alt="Exterior Finishes Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-serif font-bold text-secondary-foreground">
                Exterior Finishes
              </h1>
              <p className="text-sm text-secondary-foreground/70">
                Where Service & Quality Meet
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2" data-testid="nav-menu">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <Link key={item.path} href={item.path} data-testid={`link-${item.label.toLowerCase().replace(' ', '-')}`}>
              <div
                className={cn(
                  "sidebar-nav-item flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium cursor-pointer",
                  isActive 
                    ? "active bg-primary text-primary-foreground" 
                    : "hover:bg-secondary-foreground/10"
                )}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-secondary/20">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Users className="text-primary-foreground text-sm" size={16} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">John Smith</p>
            <p className="text-xs text-secondary-foreground/70">Sales Manager</p>
          </div>
          <button 
            className="text-secondary-foreground/70 hover:text-secondary-foreground"
            data-testid="button-settings"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
