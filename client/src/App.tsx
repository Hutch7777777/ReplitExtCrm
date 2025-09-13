import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/sidebar";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import LeadManagement from "@/pages/lead-management";
import Estimates from "@/pages/estimates";
import Communications from "@/pages/communications";
import Jobs from "@/pages/jobs";
import Customers from "@/pages/customers";
import Reporting from "@/pages/reporting";
import Vendors from "@/pages/vendors";
import Calendar from "@/pages/calendar";
import Settings from "@/pages/settings";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider defaultOpen={true}>
          <AppSidebar />
          <SidebarInset>
            <div className="flex-1">
              <Switch>
                <Route path="/" component={Dashboard} />
                <Route path="/leads" component={LeadManagement} />
                <Route path="/estimates" component={Estimates} />
                <Route path="/communications" component={Communications} />
                <Route path="/jobs" component={Jobs} />
                <Route path="/customers" component={Customers} />
                <Route path="/reporting" component={Reporting} />
                <Route path="/vendors" component={Vendors} />
                <Route path="/calendar" component={Calendar} />
                <Route path="/settings" component={Settings} />
                <Route component={NotFound} />
              </Switch>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
