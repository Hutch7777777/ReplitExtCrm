import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, DollarSign, Clock, CheckCircle } from "lucide-react";

export default function Estimates() {
  return (
    <div className="flex h-screen" data-testid="page-estimates">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-serif font-bold text-card-foreground">
                Estimates
              </h2>
              <p className="text-muted-foreground">
                Manage estimates and pricing for your projects
              </p>
            </div>
            
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-create-estimate">
              <Plus className="mr-2" size={16} />
              Create Estimate
            </Button>
          </div>
        </header>

        <div className="flex-1 bg-muted p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Estimates</p>
                    <p className="text-2xl font-bold">42</p>
                  </div>
                  <FileText className="w-8 h-8 text-chart-1" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Pending</p>
                    <p className="text-2xl font-bold">18</p>
                  </div>
                  <Clock className="w-8 h-8 text-chart-3" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Approved</p>
                    <p className="text-2xl font-bold">19</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-chart-2" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Value</p>
                    <p className="text-2xl font-bold">$485K</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-chart-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Estimates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Estimate management system coming soon</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Create, track, and manage estimates with pricing and approval workflows
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
