import { Lead } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeadCardProps {
  lead: Lead;
  onClick?: () => void;
  isDragging?: boolean;
}

export default function LeadCard({ lead, onClick, isDragging }: LeadCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-chart-1/10 text-chart-1';
      case 'medium':
        return 'bg-chart-3/10 text-chart-3';
      case 'low':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatCurrency = (value: string | null) => {
    if (!value) return 'Est. TBD';
    return `Est. $${Number(value).toLocaleString()}`;
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  return (
    <Card 
      className={cn(
        "lead-card bg-background cursor-pointer",
        isDragging && "dragging"
      )}
      onClick={onClick}
      data-testid={`card-lead-${lead.id}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-foreground" data-testid={`text-customer-name-${lead.id}`}>
            {lead.customerName}
          </h4>
          <Badge 
            className={cn("text-xs px-2 py-1", getPriorityColor(lead.priority))}
            data-testid={`badge-priority-${lead.id}`}
          >
            {lead.priority.charAt(0).toUpperCase() + lead.priority.slice(1)}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-2" data-testid={`text-address-${lead.id}`}>
          {lead.address}
        </p>
        
        <p className="text-sm text-muted-foreground mb-3" data-testid={`text-project-type-${lead.id}`}>
          {lead.projectType.charAt(0).toUpperCase() + lead.projectType.slice(1)} Work
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground" data-testid={`text-estimated-value-${lead.id}`}>
            {formatCurrency(lead.estimatedValue)}
          </span>
          <span className="text-xs text-muted-foreground" data-testid={`text-date-added-${lead.id}`}>
            {getTimeAgo(lead.createdAt)}
          </span>
        </div>
        
        <div className="flex items-center mt-3 text-xs text-muted-foreground">
          <User size={12} className="mr-1" />
          <span data-testid={`text-assigned-to-${lead.id}`}>
            {lead.assignedTo || 'Unassigned'}
          </span>
          
          {lead.phone && (
            <>
              <Phone size={12} className="ml-3 mr-1" />
              <span data-testid={`text-phone-${lead.id}`}>Has contact</span>
            </>
          )}
          
          <Calendar size={12} className="ml-3 mr-1" />
          <span data-testid={`text-last-contact-${lead.id}`}>
            {getTimeAgo(lead.updatedAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
