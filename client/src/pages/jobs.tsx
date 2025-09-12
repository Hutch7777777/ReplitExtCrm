import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Hammer, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function Jobs() {
  return (
    <div className="flex h-screen" data-testid="page-jobs">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-serif font-bold text-card-foreground">
                Jobs
              </h2>
              <p className="text-muted-foreground">
                Track active projects from estimate to completion
              </p>
            </div>
            
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-create-job">
              <Plus className="mr-2" size={16} />
              Create Job
            </Button>
          </div>
        </header>

        <div className="flex-1 bg-muted p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Active Jobs</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <Hammer className="w-8 h-8 text-chart-1" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Scheduled</p>
                    <p className="text-2xl font-bold">8</p>
                  </div>
                  <Clock className="w-8 h-8 text-chart-3" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">In Progress</p>
                    <p className="text-2xl font-bold">4</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-chart-5" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Completed</p>
                    <p className="text-2xl font-bold">28</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-chart-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Job Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Hammer className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Job management system coming soon</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Track projects from start to completion with scheduling and progress updates
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
