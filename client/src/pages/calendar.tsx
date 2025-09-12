import { useState } from "react";
import { Plus, Mail, Calendar as CalendarIcon, Users, Clock, ExternalLink } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCalendarEvents, useOutlookEmails, useCreateCalendarEvent, useSendEmail } from "@/hooks/use-outlook";
import { useWebSocket } from "@/hooks/use-websocket";
import { useToast } from "@/hooks/use-toast";

export default function Calendar() {
  const { toast } = useToast();
  const { isConnected } = useWebSocket();

  // Get current week date range
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));

  const startTime = startOfWeek.toISOString();
  const endTime = endOfWeek.toISOString();

  const { data: eventsData, isLoading: eventsLoading, error: eventsError } = useCalendarEvents(startTime, endTime);
  const { data: emailsData, isLoading: emailsLoading, error: emailsError } = useOutlookEmails('inbox', 10);
  const createEventMutation = useCreateCalendarEvent();
  const sendEmailMutation = useSendEmail();

  const events = eventsData?.value || [];
  const emails = emailsData?.value || [];

  const handleCreateEvent = async () => {
    try {
      const eventStart = new Date();
      eventStart.setHours(eventStart.getHours() + 1);
      const eventEnd = new Date(eventStart);
      eventEnd.setHours(eventEnd.getHours() + 1);

      await createEventMutation.mutateAsync({
        subject: "Site Inspection",
        start: eventStart.toISOString(),
        end: eventEnd.toISOString(),
        location: "Customer Site"
      });

      toast({
        title: "Event Created",
        description: "Calendar event has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create calendar event. Please check your Outlook connection.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getEventTypeColor = (subject: string) => {
    if (subject.toLowerCase().includes('inspection')) return 'bg-chart-1/10 text-chart-1';
    if (subject.toLowerCase().includes('meeting')) return 'bg-chart-2/10 text-chart-2';
    if (subject.toLowerCase().includes('estimate')) return 'bg-chart-3/10 text-chart-3';
    return 'bg-chart-4/10 text-chart-4';
  };

  return (
    <div className="flex h-screen" data-testid="page-calendar">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-serif font-bold text-card-foreground">
                Calendar & Communications
              </h2>
              <p className="text-muted-foreground">
                Integrated calendar with scheduling for inspections, calls, and project milestones
              </p>
              {isConnected && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-chart-2/10 text-chart-2 mt-2">
                  <span className="w-2 h-2 bg-chart-2 rounded-full mr-2"></span>
                  Real-time updates active
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={handleCreateEvent}
                disabled={createEventMutation.isPending}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="button-create-event"
              >
                <Plus className="mr-2" size={16} />
                Schedule Event
              </Button>
              <Button variant="outline" data-testid="button-outlook">
                <ExternalLink className="mr-2" size={16} />
                Open Outlook
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 bg-muted p-6">
          <Tabs defaultValue="calendar" className="w-full">
            <TabsList className="grid w-fit grid-cols-2 mb-6" data-testid="tabs-calendar">
              <TabsTrigger value="calendar">Calendar Events</TabsTrigger>
              <TabsTrigger value="emails">Recent Emails</TabsTrigger>
            </TabsList>

            <TabsContent value="calendar" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">This Week</p>
                        <p className="text-2xl font-bold">{events.length}</p>
                      </div>
                      <CalendarIcon className="w-8 h-8 text-chart-1" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Inspections</p>
                        <p className="text-2xl font-bold">
                          {events.filter(e => e.subject.toLowerCase().includes('inspection')).length}
                        </p>
                      </div>
                      <Clock className="w-8 h-8 text-chart-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Meetings</p>
                        <p className="text-2xl font-bold">
                          {events.filter(e => e.subject.toLowerCase().includes('meeting')).length}
                        </p>
                      </div>
                      <Users className="w-8 h-8 text-chart-3" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Total Events</p>
                        <p className="text-2xl font-bold">{events.length}</p>
                      </div>
                      <CalendarIcon className="w-8 h-8 text-chart-5" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  {eventsLoading ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="text-center">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading calendar events...</p>
                      </div>
                    </div>
                  ) : eventsError ? (
                    <div className="text-center py-8">
                      <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Unable to connect to Outlook calendar</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Please ensure Outlook integration is configured
                      </p>
                    </div>
                  ) : events.length === 0 ? (
                    <div className="text-center py-8">
                      <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No upcoming events this week</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Schedule inspections and meetings with customers
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 md:p-8 pt-6 space-y-6">
                      {events.map((event) => (
                        <div
                          key={event.id}
                          className="flex items-center justify-between p-4 bg-background rounded-lg border border-border"
                          data-testid={`event-${event.id}`}
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground" data-testid={`text-event-subject-${event.id}`}>
                              {event.subject}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {formatDate(event.start.dateTime)}
                              {event.location?.displayName && ` • ${event.location.displayName}`}
                            </p>
                            {event.attendees.length > 0 && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Attendees: {event.attendees.map(a => a.emailAddress.name || a.emailAddress.address).join(', ')}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getEventTypeColor(event.subject)}>
                              {event.subject.toLowerCase().includes('inspection') ? 'Inspection' :
                               event.subject.toLowerCase().includes('meeting') ? 'Meeting' :
                               event.subject.toLowerCase().includes('estimate') ? 'Estimate' : 'Event'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="emails" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Recent Emails</p>
                        <p className="text-2xl font-bold">{emails.length}</p>
                      </div>
                      <Mail className="w-8 h-8 text-chart-1" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Unread</p>
                        <p className="text-2xl font-bold">
                          {emails.filter(e => !e.isRead).length}
                        </p>
                      </div>
                      <Mail className="w-8 h-8 text-chart-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Today</p>
                        <p className="text-2xl font-bold">
                          {emails.filter(e => new Date(e.receivedDateTime).toDateString() === new Date().toDateString()).length}
                        </p>
                      </div>
                      <Mail className="w-8 h-8 text-chart-3" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Response Rate</p>
                        <p className="text-2xl font-bold">85%</p>
                      </div>
                      <Mail className="w-8 h-8 text-chart-5" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Emails</CardTitle>
                </CardHeader>
                <CardContent>
                  {emailsLoading ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="text-center">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading emails...</p>
                      </div>
                    </div>
                  ) : emailsError ? (
                    <div className="text-center py-8">
                      <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Unable to connect to Outlook email</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Please ensure Outlook integration is configured
                      </p>
                    </div>
                  ) : emails.length === 0 ? (
                    <div className="text-center py-8">
                      <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No recent emails</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Email communication history will appear here
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {emails.map((email) => (
                        <div
                          key={email.id}
                          className="flex items-start space-x-4 p-4 bg-background rounded-lg border border-border"
                          data-testid={`email-${email.id}`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-foreground" data-testid={`text-email-subject-${email.id}`}>
                                {email.subject}
                              </h4>
                              {!email.isRead && (
                                <Badge variant="secondary" className="text-xs">New</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              From: {email.from.emailAddress.name || email.from.emailAddress.address}
                            </p>
                            <p className="text-sm text-muted-foreground" data-testid={`text-email-preview-${email.id}`}>
                              {email.bodyPreview}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              {formatDate(email.receivedDateTime)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}