export interface DashboardStats {
  totalLeads: number;
  activeEstimates: number;
  conversionRate: number;
  closedDeals: number;
  leadGrowth: number;
  estimateGrowth: number;
}

export interface WebSocketMessage {
  type: string;
  data: any;
}

export type Division = "rr" | "multi-family" | "single-family";
export type LeadStatus = "new" | "contacted" | "estimate_requested" | "quote_sent" | "won" | "lost";
export type Priority = "low" | "medium" | "high";
