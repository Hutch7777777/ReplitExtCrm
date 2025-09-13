import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { User, Lock, Palette, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const accountSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
});

type AccountSettings = z.infer<typeof accountSchema>;

const preferencesSchema = z.object({
  timezone: z.string().min(1, "Timezone is required"),
  language: z.string().min(1, "Language is required"),
  theme: z.enum(["light", "dark", "system"]),
  emailNotifications: z.boolean(),
});

type PreferencesSettings = z.infer<typeof preferencesSchema>;

const timezones = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
];

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
];

export default function AccountSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // For now, using a dummy user ID since we don't have authentication
  const userId = "user_1";

  // Fetch user account data
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: [`/api/settings/account/${userId}`],
    enabled: !!userId,
  });

  // Fetch user preferences data  
  const { data: preferencesData, isLoading: preferencesLoading } = useQuery({
    queryKey: [`/api/settings/preferences/${userId}`],
    enabled: !!userId,
  });

  const accountForm = useForm<AccountSettings>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "",
    },
    values: userData ? {
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      email: userData.email || "",
      role: userData.role || "",
    } : undefined,
  });

  const preferencesForm = useForm<PreferencesSettings>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      timezone: "America/New_York",
      language: "en",
      theme: "system",
      emailNotifications: true,
    },
    values: preferencesData ? {
      timezone: preferencesData.timezone || "America/New_York",
      language: preferencesData.language || "en",
      theme: preferencesData.theme || "system",
      emailNotifications: preferencesData.emailNotifications ?? true,
    } : undefined,
  });

  // Mutation for account updates
  const accountMutation = useMutation({
    mutationFn: (data: AccountSettings) => 
      apiRequest(`/api/settings/account/${userId}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/settings/account/${userId}`] });
      toast({
        title: "Settings saved",
        description: "Your account settings have been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Mutation for preferences updates
  const preferencesMutation = useMutation({
    mutationFn: (data: PreferencesSettings) =>
      apiRequest(`/api/settings/preferences/${userId}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/settings/preferences/${userId}`] });
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onAccountSubmit = (data: AccountSettings) => {
    accountMutation.mutate(data);
  };

  const onPreferencesSubmit = (data: PreferencesSettings) => {
    preferencesMutation.mutate(data);
  };

  if (userLoading || preferencesLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p>Loading account settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Profile Information</span>
          </CardTitle>
          <CardDescription>
            Update your personal information and contact details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...accountForm}>
            <form onSubmit={accountForm.handleSubmit(onAccountSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={accountForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-first-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={accountForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-last-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={accountForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} data-testid="input-email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={accountForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-role" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Preferences</span>
          </CardTitle>
          <CardDescription>
            Configure your application preferences and display settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...preferencesForm}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={preferencesForm.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timezone</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-timezone">
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timezones.map((tz) => (
                            <SelectItem key={tz.value} value={tz.value}>
                              {tz.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={preferencesForm.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-language">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {languages.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={preferencesForm.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Theme</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-theme">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={preferencesForm.control}
                name="emailNotifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Email Notifications</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Receive email notifications for important updates
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-email-notifications"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </Form>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <span>Security</span>
          </CardTitle>
          <CardDescription>
            Manage your password and security settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Password</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Last changed 30 days ago
              </p>
              <Button variant="outline" data-testid="button-change-password">
                Change Password
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Buttons */}
      <div className="flex justify-end space-x-4">
        <Button 
          onClick={preferencesForm.handleSubmit(onPreferencesSubmit)}
          disabled={preferencesMutation.isPending}
          variant="outline"
          data-testid="button-save-preferences"
        >
          {preferencesMutation.isPending ? "Saving..." : "Save Preferences"}
        </Button>
        <Button 
          onClick={accountForm.handleSubmit(onAccountSubmit)}
          disabled={accountMutation.isPending}
          data-testid="button-save-account"
        >
          {accountMutation.isPending ? "Saving..." : "Save Account"}
        </Button>
      </div>
    </div>
  );
}