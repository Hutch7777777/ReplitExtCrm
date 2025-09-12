import { useState } from "react";
import { Lead } from "@shared/schema";
import { useUpdateLead } from "@/hooks/use-leads";
import { Division, LeadStatus } from "@/types";
import KanbanColumn from "./kanban-column";
import { useToast } from "@/hooks/use-toast";

interface KanbanBoardProps {
  leads: Lead[];
  division: Division;
  onAddLead?: (status?: LeadStatus) => void;
  onLeadClick?: (lead: Lead) => void;
}

const COLUMNS = [
  { status: 'new' as LeadStatus, title: 'New Leads', color: 'bg-chart-1' },
  { status: 'contacted' as LeadStatus, title: 'Contacted', color: 'bg-chart-3' },
  { status: 'estimate_requested' as LeadStatus, title: 'Estimate Requested', color: 'bg-chart-4' },
  { status: 'quote_sent' as LeadStatus, title: 'Quote Sent', color: 'bg-chart-5' },
  { status: 'won' as LeadStatus, title: 'Won', color: 'bg-chart-2' },
];

export default function KanbanBoard({ leads, division, onAddLead, onLeadClick }: KanbanBoardProps) {
  const updateLeadMutation = useUpdateLead();
  const { toast } = useToast();

  const getLeadsByStatus = (status: LeadStatus) => {
    return leads.filter(lead => lead.status === status);
  };

  const handleDrop = async (leadId: string, newStatus: LeadStatus) => {
    try {
      await updateLeadMutation.mutateAsync({
        id: leadId,
        lead: { status: newStatus }
      });
      
      toast({
        title: "Lead Updated",
        description: `Lead status changed to ${newStatus.replace('_', ' ')}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update lead status.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex space-x-6 min-w-max" data-testid="kanban-board">
      {COLUMNS.map((column) => (
        <KanbanColumn
          key={column.status}
          title={column.title}
          status={column.status}
          leads={getLeadsByStatus(column.status)}
          color={column.color}
          onAddLead={() => onAddLead?.(column.status)}
          onLeadClick={onLeadClick}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
}
