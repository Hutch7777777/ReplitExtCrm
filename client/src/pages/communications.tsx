import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Mail, Phone, Calendar, Users, Send } from "lucide-react";

export default function Communications() {
  return (
    <div className="flex h-screen" data-testid="page-communications">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-serif font-bold text-card-foreground">
                Communications
              </h2>
              <p className="text-muted-foreground">
                Manage emails, calls, and communication history
              </p>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" data-testid="button-compose-email">
                <Mail className="mr-2" size={16} />
                Compose Email
              </Button>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-log-call">
                <Phone className="mr-2" size={16} />
                Log Call
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 bg-muted p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Messages</p>
                    <p className="text-2xl font-bold">156</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-chart-1" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Emails Sent</p>
                    <p className="text-2xl font-bold">89</p>
                  </div>
                  <Mail className="w-8 h-8 text-chart-3" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Calls Logged</p>
                    <p className="text-2xl font-bold">67</p>
                  </div>
                  <Phone className="w-8 h-8 text-chart-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Meetings</p>
                    <p className="text-2xl font-bold">23</p>
                  </div>
                  <Users className="w-8 h-8 text-chart-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Emails</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Outlook email integration coming soon</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    View and send emails directly from the CRM
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Communication History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Activity tracking system coming soon</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Track all communications with leads and customers
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}