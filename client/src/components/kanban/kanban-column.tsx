import { Lead } from "@shared/schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import LeadCard from "./lead-card";
import { LeadStatus } from "@/types";

interface KanbanColumnProps {
  title: string;
  status: LeadStatus;
  leads: Lead[];
  color: string;
  onAddLead?: () => void;
  onLeadClick?: (lead: Lead) => void;
  onDrop?: (leadId: string, newStatus: LeadStatus) => void;
}

export default function KanbanColumn({ 
  title, 
  status, 
  leads, 
  color, 
  onAddLead, 
  onLeadClick,
  onDrop 
}: KanbanColumnProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    const leadId = e.dataTransfer.getData('text/plain');
    if (leadId && onDrop) {
      onDrop(leadId, status);
    }
  };

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('text/plain', leadId);
    e.currentTarget.classList.add('dragging');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('dragging');
  };

  return (
    <Card 
      className="kanban-column bg-card rounded-lg border border-border p-4"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-testid={`column-${status}`}
    >
      <CardHeader className="p-0 mb-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-card-foreground flex items-center">
            <div className={`w-3 h-3 ${color} rounded-full mr-2`}></div>
            {title}
          </h3>
          <span 
            className="bg-muted px-2 py-1 rounded text-sm text-muted-foreground" 
            data-testid={`text-${status}-count`}
          >
            {leads.length}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="space-y-3">
          {leads.map((lead) => (
            <div
              key={lead.id}
              draggable
              onDragStart={(e) => handleDragStart(e, lead.id)}
              onDragEnd={handleDragEnd}
            >
              <LeadCard 
                lead={lead} 
                onClick={() => onLeadClick?.(lead)}
              />
            </div>
          ))}
        </div>
        
        <Button
          variant="outline"
          className="w-full mt-3 border-2 border-dashed border-border hover:border-primary hover:text-primary"
          onClick={onAddLead}
          data-testid={`button-add-lead-${status}`}
        >
          <Plus className="mr-2" size={16} />
          Add Lead
        </Button>
      </CardContent>
    </Card>
  );
}
