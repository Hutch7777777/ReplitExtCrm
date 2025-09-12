import Sidebar from "@/components/layout/sidebar";
import StatsCards from "@/components/stats/stats-cards";
import { RevenueChart, DivisionChart } from "@/components/charts/revenue-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Filter, Calendar } from "lucide-react";
import { useWebSocket } from "@/hooks/use-websocket";

export default function Reporting() {
  const { isConnected } = useWebSocket();

  return (
    <div className="flex h-screen" data-testid="page-reporting">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-serif font-bold text-card-foreground">
                Reporting
              </h2>
              <p className="text-muted-foreground">
                Real-time dashboard with deal tracking and division performance metrics
              </p>
              {isConnected && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-chart-2/10 text-chart-2 mt-2">
                  <span className="w-2 h-2 bg-chart-2 rounded-full mr-2"></span>
                  Real-time updates active
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" data-testid="button-filter">
                <Filter className="mr-2" size={16} />
                Filter
              </Button>
              <Button variant="outline" data-testid="button-date-range">
                <Calendar className="mr-2" size={16} />
                Date Range
              </Button>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-export">
                <Download className="mr-2" size={16} />
                Export
              </Button>
            </div>
          </div>
          
          <div className="mt-6">
            <StatsCards />
          </div>
        </header>

        <div className="flex-1 bg-muted p-6 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <RevenueChart />
            <DivisionChart />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Lead Conversion Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">New Leads</span>
                    <span className="font-semibold">127</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full">
                    <div className="bg-chart-1 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Contacted</span>
                    <span className="font-semibold">89</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full">
                    <div className="bg-chart-3 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Estimates Sent</span>
                    <span className="font-semibold">45</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full">
                    <div className="bg-chart-4 h-2 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Closed Won</span>
                    <span className="font-semibold">28</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full">
                    <div className="bg-chart-2 h-2 rounded-full" style={{ width: '22%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Sales Reps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Sarah Johnson</p>
                      <p className="text-sm text-muted-foreground">12 deals closed</p>
                    </div>
                    <span className="text-lg font-bold text-chart-2">$145K</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Mike Chen</p>
                      <p className="text-sm text-muted-foreground">8 deals closed</p>
                    </div>
                    <span className="text-lg font-bold text-chart-2">$98K</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Tom Rodriguez</p>
                      <p className="text-sm text-muted-foreground">6 deals closed</p>
                    </div>
                    <span className="text-lg font-bold text-chart-2">$78K</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Lisa Park</p>
                      <p className="text-sm text-muted-foreground">5 deals closed</p>
                    </div>
                    <span className="text-lg font-bold text-chart-2">$65K</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Types Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Siding Installation</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-muted h-2 rounded-full">
                        <div className="bg-chart-1 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Repair Work</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-muted h-2 rounded-full">
                        <div className="bg-chart-3 h-2 rounded-full" style={{ width: '72%' }}></div>
                      </div>
                      <span className="text-sm font-medium">72%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Full Replacement</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-muted h-2 rounded-full">
                        <div className="bg-chart-4 h-2 rounded-full" style={{ width: '68%' }}></div>
                      </div>
                      <span className="text-sm font-medium">68%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Roofing</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-muted h-2 rounded-full">
                        <div className="bg-chart-5 h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Goals vs Actual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Revenue Goal</p>
                      <p className="text-sm text-muted-foreground">$500K target</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-chart-2">$485K</p>
                      <p className="text-sm text-chart-2">97% achieved</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">New Leads Goal</p>
                      <p className="text-sm text-muted-foreground">150 target</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-chart-1">127</p>
                      <p className="text-sm text-chart-3">85% achieved</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Conversion Rate Goal</p>
                      <p className="text-sm text-muted-foreground">25% target</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-chart-2">28%</p>
                      <p className="text-sm text-chart-2">112% achieved</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-chart-2 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">3 deals closed today</p>
                      <p className="text-xs text-muted-foreground">Total value: $42,500</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-chart-1 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">8 new leads this week</p>
                      <p className="text-xs text-muted-foreground">Estimated value: $125K</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-chart-3 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">12 estimates sent</p>
                      <p className="text-xs text-muted-foreground">Awaiting customer response</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-chart-4 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">5 projects started</p>
                      <p className="text-xs text-muted-foreground">On schedule for completion</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
