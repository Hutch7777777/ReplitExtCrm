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

function Router() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
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
          <Route component={NotFound} />
        </Switch>
      </SidebarInset>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
