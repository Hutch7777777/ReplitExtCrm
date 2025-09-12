import { useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import StatsCards from "@/components/stats/stats-cards";
import { useWebSocket } from "@/hooks/use-websocket";

export default function Dashboard() {
  const { isConnected } = useWebSocket();

  return (
    <div className="flex flex-col h-screen" data-testid="page-dashboard">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SidebarTrigger data-testid="button-toggle-sidebar" />
            <div>
              <h2 className="text-2xl font-serif font-bold text-card-foreground">
                CRM Dashboard
              </h2>
              <p className="text-muted-foreground">
                Welcome to your Exterior Finishes CRM
              </p>
              {isConnected && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-chart-2/10 text-chart-2 mt-2">
                  <span className="w-2 h-2 bg-chart-2 rounded-full mr-2"></span>
                  Real-time updates active
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6">
          <StatsCards />
        </div>
      </header>

      {/* Main Content */}
      {/* Removed padding from here to make it flush with sidebar */}
      <div className="flex-1 bg-muted">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6"> {/* Added internal padding here */}
            {/* Quick Actions */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <a
                  href="/leads"
                  className="flex items-center justify-between p-3 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
                  data-testid="link-quick-leads"
                >
                  <span className="font-medium">Manage Leads</span>
                  <span className="text-sm text-muted-foreground">→</span>
                </a>
                <a
                  href="/estimates"
                  className="flex items-center justify-between p-3 bg-accent hover:bg-accent/80 rounded-lg transition-colors"
                  data-testid="link-quick-estimates"
                >
                  <span className="font-medium">Create Estimate</span>
                  <span className="text-sm text-muted-foreground">→</span>
                </a>
                <a
                  href="/calendar"
                  className="flex items-center justify-between p-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                  data-testid="link-quick-calendar"
                >
                  <span className="font-medium">Schedule Appointment</span>
                  <span className="text-sm text-muted-foreground">→</span>
                </a>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-chart-1 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New lead added</p>
                    <p className="text-xs text-muted-foreground">Johnson Residence - Siding Installation</p>
                  </div>
                  <span className="text-xs text-muted-foreground">2m ago</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-chart-3 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Estimate approved</p>
                    <p className="text-xs text-muted-foreground">Smith Property - $8,200</p>
                  </div>
                  <span className="text-xs text-muted-foreground">15m ago</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-chart-2 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Deal closed</p>
                    <p className="text-xs text-muted-foreground">Thompson Residence - $22,350</p>
                  </div>
                  <span className="text-xs text-muted-foreground">1h ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}