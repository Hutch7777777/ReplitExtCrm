import { useState } from "react";
import { Search, Filter, Plus } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import StatsCards from "@/components/stats/stats-cards";
import KanbanBoard from "@/components/kanban/kanban-board";
import LeadModal from "@/components/modals/lead-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLeads } from "@/hooks/use-leads";
import { useWebSocket } from "@/hooks/use-websocket";
import { Division, LeadStatus } from "@/types";
import { Lead } from "@shared/schema";

export default function LeadManagement() {
  const [selectedDivision, setSelectedDivision] = useState<Division>("rr");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | undefined>();
  const [defaultStatus, setDefaultStatus] = useState<LeadStatus>("new");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: leads = [], isLoading } = useLeads(selectedDivision);
  const { isConnected } = useWebSocket();

  const filteredLeads = leads.filter(lead =>
    lead.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDivisionCounts = () => {
    // This would normally come from separate queries
    return {
      rr: 23,
      "multi-family": 18,
      "single-family": 86
    };
  };

  const handleAddLead = (status?: LeadStatus) => {
    setSelectedLead(undefined);
    setDefaultStatus(status || "new");
    setIsModalOpen(true);
  };

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const divisionCounts = getDivisionCounts();

  return (
    <div className="flex flex-col h-screen" data-testid="page-lead-management">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SidebarTrigger data-testid="button-toggle-sidebar" />
            <div>
              <h2 className="text-2xl font-serif font-bold text-card-foreground">
                Lead Management
              </h2>
              <p className="text-muted-foreground">
                Manage leads across all divisions with Kanban boards
              </p>
              {isConnected && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-chart-2/10 text-chart-2 mt-2">
                  <span className="w-2 h-2 bg-chart-2 rounded-full mr-2"></span>
                  Real-time updates active
                </span>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  type="text"
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2"
                  data-testid="input-search"
                />
              </div>

              {/* Add Lead Button */}
              <Button
                onClick={() => handleAddLead()}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="button-add-lead"
              >
                <Plus className="mr-2" size={16} />
                Add Lead
              </Button>

              {/* Filter Button */}
              <Button
                variant="outline"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                data-testid="button-filter"
              >
                <Filter className="mr-2" size={16} />
                Filter
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6">
            <StatsCards />
          </div>
        </div>
      </header>

      {/* Division Tabs */}
      <div className="bg-card border-b border-border px-6 py-3">
          <Tabs value={selectedDivision} onValueChange={(value) => setSelectedDivision(value as Division)}>
          <TabsList className="grid w-fit grid-cols-3" data-testid="tabs-divisions">
            <TabsTrigger value="rr" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              R&R Division
              <span className="ml-2 bg-primary-foreground/20 px-2 py-1 rounded text-xs">
                {divisionCounts.rr}
              </span>
            </TabsTrigger>
            <TabsTrigger value="multi-family" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Multi-Family
              <span className="ml-2 bg-primary-foreground/20 px-2 py-1 rounded text-xs">
                {divisionCounts["multi-family"]}
              </span>
            </TabsTrigger>
            <TabsTrigger value="single-family" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Single-Family
              <span className="ml-2 bg-primary-foreground/20 px-2 py-1 rounded text-xs">
                {divisionCounts["single-family"]}
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 bg-muted p-6 overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading leads...</p>
            </div>
          </div>
        ) : (
          <KanbanBoard
            leads={filteredLeads}
            division={selectedDivision}
            onAddLead={handleAddLead}
            onLeadClick={handleLeadClick}
          />
        )}
      </div>

      {/* Lead Modal */}
      <LeadModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        lead={selectedLead}
        defaultStatus={defaultStatus}
        defaultDivision={selectedDivision}
      />
    </div>
  );
}