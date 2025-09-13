import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bell, Mail, Smartphone, Calendar, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const notificationSchema = z.object({
  // Email Notifications
  newLeadEmail: z.boolean(),
  leadAssignmentEmail: z.boolean(),
  estimateReminderEmail: z.boolean(),
  deadlineAlertEmail: z.boolean(),
  weeklyReportEmail: z.boolean(),
  
  // In-App Notifications
  newLeadInApp: z.boolean(),
  leadAssignmentInApp: z.boolean(),
  estimateReminderInApp: z.boolean(),
  deadlineAlertInApp: z.boolean(),
  
  // SMS Notifications
  urgentLeadSMS: z.boolean(),
  deadlineAlertSMS: z.boolean(),
  
  // Frequency Settings
  emailDigestFrequency: z.enum(["immediate", "daily", "weekly", "never"]),
  reminderFrequency: z.enum(["1day", "3days", "1week"]),
});

type NotificationSettings = z.infer<typeof notificationSchema>;

export default function NotificationSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<NotificationSettings>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      // Email Notifications
      newLeadEmail: true,
      leadAssignmentEmail: true,
      estimateReminderEmail: true,
      deadlineAlertEmail: true,
      weeklyReportEmail: false,
      
      // In-App Notifications
      newLeadInApp: true,
      leadAssignmentInApp: true,
      estimateReminderInApp: true,
      deadlineAlertInApp: true,
      
      // SMS Notifications
      urgentLeadSMS: false,
      deadlineAlertSMS: false,
      
      // Frequency Settings
      emailDigestFrequency: "daily",
      reminderFrequency: "3days",
    },
  });

  const onSubmit = async (data: NotificationSettings) => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to save notification settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Settings saved",
        description: "Your notification preferences have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Email Notifications</span>
          </CardTitle>
          <CardDescription>
            Configure when you want to receive email notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="newLeadEmail"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">New Lead Notifications</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Get notified when a new lead is created
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-new-lead-email"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="leadAssignmentEmail"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Lead Assignment</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Get notified when a lead is assigned to you
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-lead-assignment-email"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="estimateReminderEmail"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Estimate Reminders</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Reminders for pending estimates and follow-ups
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-estimate-reminder-email"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="deadlineAlertEmail"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Deadline Alerts</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Urgent notifications for approaching deadlines
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-deadline-alert-email"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="weeklyReportEmail"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Weekly Reports</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Weekly summary of leads, estimates, and performance
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-weekly-report-email"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </Form>
        </CardContent>
      </Card>

      {/* In-App Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>In-App Notifications</span>
          </CardTitle>
          <CardDescription>
            Configure notifications within the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="newLeadInApp"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">New Lead Notifications</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Show in-app notifications for new leads
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-new-lead-inapp"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="leadAssignmentInApp"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Lead Assignment</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Show notifications when leads are assigned
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-lead-assignment-inapp"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="estimateReminderInApp"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Estimate Reminders</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Show reminders for pending estimates
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-estimate-reminder-inapp"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="deadlineAlertInApp"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Deadline Alerts</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Show urgent alerts for approaching deadlines
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-deadline-alert-inapp"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </Form>
        </CardContent>
      </Card>

      {/* SMS Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="h-5 w-5" />
            <span>SMS Notifications</span>
          </CardTitle>
          <CardDescription>
            Configure SMS notifications for urgent alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="urgentLeadSMS"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Urgent Lead Alerts</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        SMS for high-priority or urgent leads
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-urgent-lead-sms"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="deadlineAlertSMS"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Deadline Alerts</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        SMS for critical deadlines and urgent tasks
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-deadline-alert-sms"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </Form>
        </CardContent>
      </Card>

      {/* Notification Frequency */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Notification Frequency</span>
          </CardTitle>
          <CardDescription>
            Configure how often you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="emailDigestFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Digest Frequency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-email-digest-frequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="daily">Daily Summary</SelectItem>
                        <SelectItem value="weekly">Weekly Summary</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="reminderFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reminder Frequency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-reminder-frequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1day">1 Day Before</SelectItem>
                        <SelectItem value="3days">3 Days Before</SelectItem>
                        <SelectItem value="1week">1 Week Before</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Form>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={form.handleSubmit(onSubmit)}
          disabled={isLoading}
          data-testid="button-save-notifications"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}