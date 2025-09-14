import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTeamMembers, useDeleteTeamMember } from "@/hooks/use-team-members";
import TeamMemberModal from "@/components/modals/team-member-modal";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Building, Users, MapPin, Phone, UserPlus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const companySchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  zipCode: z.string().min(5, "ZIP code must be at least 5 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  defaultDivision: z.enum(["rr", "multi-family", "single-family"]),
  autoAssignLeads: z.boolean(),
  leadRetentionDays: z.number().min(30).max(365),
});

type CompanySettings = z.infer<typeof companySchema>;

const divisions = [
  { value: "rr", label: "R&R Division" },
  { value: "multi-family", label: "Multi-Family" },
  { value: "single-family", label: "Single-Family" },
];

export default function CompanySettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [teamMemberModalOpen, setTeamMemberModalOpen] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const { toast } = useToast();
  const { data: teamMembers = [] } = useTeamMembers();
  const deleteTeamMemberMutation = useDeleteTeamMember();

  const form = useForm<CompanySettings>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyName: "ABC Exterior Finishes",
      address: "123 Business St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      phone: "(555) 123-4567",
      website: "https://www.abcexterior.com",
      defaultDivision: "rr",
      autoAssignLeads: true,
      leadRetentionDays: 90,
    },
  });

  const onSubmit = async (data: CompanySettings) => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to save company settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Settings saved",
        description: "Your company settings have been updated successfully.",
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

  const handleDeleteTeamMember = async () => {
    if (!memberToDelete) return;

    try {
      await deleteTeamMemberMutation.mutateAsync(memberToDelete.id);
      toast({
        title: "Team Member Removed",
        description: `${memberToDelete.position.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} has been removed from the team.`,
      });
      setDeleteDialogOpen(false);
      setMemberToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove team member. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>Company Information</span>
          </CardTitle>
          <CardDescription>
            Basic company details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-company-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-company-phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="https://www.example.com" {...field} data-testid="input-company-website" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Business Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Business Address</span>
          </CardTitle>
          <CardDescription>
            Primary business location
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-city" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-state" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP Code</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-zip" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>

      {/* Division Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Division Management</span>
          </CardTitle>
          <CardDescription>
            Configure business divisions and default settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Active Divisions */}
            <div>
              <h4 className="text-sm font-medium mb-3">Active Divisions</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" data-testid="badge-rr-division">
                  R&R Division
                  <span className="ml-2 text-xs">(23 leads)</span>
                </Badge>
                <Badge variant="secondary" data-testid="badge-multi-family-division">
                  Multi-Family
                  <span className="ml-2 text-xs">(18 leads)</span>
                </Badge>
                <Badge variant="secondary" data-testid="badge-single-family-division">
                  Single-Family
                  <span className="ml-2 text-xs">(86 leads)</span>
                </Badge>
              </div>
            </div>

            <Form {...form}>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="defaultDivision"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Division for New Leads</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-default-division">
                            <SelectValue placeholder="Select default division" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {divisions.map((division) => (
                            <SelectItem key={division.value} value={division.value}>
                              {division.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="autoAssignLeads"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Auto-assign Leads</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Automatically assign new leads to available team members
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-auto-assign"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="leadRetentionDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lead Retention Period (days)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="30" 
                          max="365" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          data-testid="input-retention-days"
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-muted-foreground">
                        How long to keep inactive leads before archiving (30-365 days)
                      </p>
                    </FormItem>
                  )}
                />
              </div>
            </Form>

            {/* Team Members Section */}
            <div className="space-y-4 pt-6 border-t">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Team Members</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedTeamMember(undefined);
                    setTeamMemberModalOpen(true);
                  }}
                  data-testid="button-add-team-member"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 border rounded-lg bg-card"
                    data-testid={`card-team-member-${member.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="font-medium text-sm">
                          {member.position.split('-').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {member.division.charAt(0).toUpperCase() + member.division.slice(1)} Division
                        </div>
                        {member.phone && (
                          <div className="text-xs text-muted-foreground">
                            📞 {member.phone}
                          </div>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" data-testid={`button-menu-${member.id}`}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedTeamMember(member);
                              setTeamMemberModalOpen(true);
                            }}
                            data-testid={`button-edit-${member.id}`}
                          >
                            Edit Member
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setMemberToDelete(member);
                              setDeleteDialogOpen(true);
                            }}
                            data-testid={`button-remove-${member.id}`}
                          >
                            Remove Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>

              {teamMembers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">No team members added yet.</p>
                  <p className="text-xs">Click "Add Team Member" to get started.</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={form.handleSubmit(onSubmit)}
          disabled={isLoading}
          data-testid="button-save-company"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Team Member Modal */}
      <TeamMemberModal
        open={teamMemberModalOpen}
        onOpenChange={setTeamMemberModalOpen}
        teamMember={selectedTeamMember}
        availableUsers={[]} // TODO: Fetch available users
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent data-testid="dialog-delete-team-member">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <strong>
                {memberToDelete?.position?.split('-')?.map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                )?.join(' ') ?? 'this team member'}
              </strong>{" "}
              from the {memberToDelete?.division ? 
                memberToDelete.division.charAt(0).toUpperCase() + memberToDelete.division.slice(1) : 
                ''
              } division?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTeamMember}
              disabled={deleteTeamMemberMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              {deleteTeamMemberMutation.isPending ? "Removing..." : "Remove Member"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}