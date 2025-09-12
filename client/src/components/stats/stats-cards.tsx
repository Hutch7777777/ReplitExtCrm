import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Calculator, Percent, Trophy, TrendingUp } from "lucide-react";
import { DashboardStats } from "@/types";

export default function StatsCards() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-12 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: "Total Leads",
      value: stats.totalLeads.toString(),
      icon: Users,
      color: "chart-1",
      growth: `+${stats.leadGrowth}%`,
      subtitle: "from last month"
    },
    {
      title: "Active Estimates",
      value: stats.activeEstimates.toString(),
      icon: Calculator,
      color: "chart-3",
      growth: `+${stats.estimateGrowth}%`,
      subtitle: "this week"
    },
    {
      title: "Conversion Rate",
      value: `${stats.conversionRate}%`,
      icon: Percent,
      color: "chart-4",
      growth: "+3%",
      subtitle: "vs target"
    },
    {
      title: "Closed Deals",
      value: `$${(stats.closedDeals / 1000).toFixed(0)}K`,
      icon: Trophy,
      color: "chart-5",
      growth: "+18%",
      subtitle: "this month"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        
        return (
          <Card key={stat.title} className="bg-card rounded-lg border border-border" data-testid={`card-${stat.title.toLowerCase().replace(' ', '-')}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-card-foreground" data-testid={`text-${stat.title.toLowerCase().replace(' ', '-')}-value`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 bg-${stat.color}/10 rounded-lg flex items-center justify-center`}>
                  <Icon className={`text-${stat.color}`} size={20} />
                </div>
              </div>
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="text-chart-2 mr-1" size={12} />
                <span className="text-chart-2">{stat.growth}</span>
                <span className="text-muted-foreground ml-1">{stat.subtitle}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
