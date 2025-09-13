import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertTeamMemberSchema, TeamMember } from "@shared/schema";
import { useCreateTeamMember, useUpdateTeamMember } from "@/hooks/use-team-members";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { format } from "date-fns";

const teamMemberFormSchema = insertTeamMemberSchema.extend({
  hireDate: z.string().optional(),
});

type TeamMemberFormData = z.infer<typeof teamMemberFormSchema>;

interface TeamMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamMember?: TeamMember;
  availableUsers?: { id: string; firstName: string; lastName: string; email: string; }[];
}

export default function TeamMemberModal({ 
  open, 
  onOpenChange, 
  teamMember,
  availableUsers = []
}: TeamMemberModalProps) {
  const { toast } = useToast();
  const createTeamMemberMutation = useCreateTeamMember();
  const updateTeamMemberMutation = useUpdateTeamMember();
  
  const form = useForm<TeamMemberFormData>({
    resolver: zodResolver(teamMemberFormSchema),
    defaultValues: {
      userId: "",
      position: "estimator",
      division: "rr",
      isActive: true,
      hireDate: "",
      phone: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (teamMember) {
      form.reset({
        userId: teamMember.userId,
        position: teamMember.position,
        division: teamMember.division,
        isActive: teamMember.isActive,
        hireDate: teamMember.hireDate ? format(new Date(teamMember.hireDate), "yyyy-MM-dd") : "",
        phone: teamMember.phone || "",
        notes: teamMember.notes || "",
      });
    } else {
      form.reset({
        userId: "",
        position: "estimator",
        division: "rr",
        isActive: true,
        hireDate: "",
        phone: "",
        notes: "",
      });
    }
  }, [teamMember, form]);

  const onSubmit = async (data: TeamMemberFormData) => {
    try {
      const teamMemberData = {
        ...data,
        hireDate: data.hireDate ? new Date(data.hireDate) : null,
      };

      if (teamMember) {
        await updateTeamMemberMutation.mutateAsync({ id: teamMember.id, teamMember: teamMemberData });
        toast({
          title: "Team Member Updated",
          description: "Team member has been updated successfully.",
        });
      } else {
        await createTeamMemberMutation.mutateAsync(teamMemberData);
        toast({
          title: "Team Member Added",
          description: "New team member has been added successfully.",
        });
      }
      
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: teamMember ? "Failed to update team member." : "Failed to add team member.",
        variant: "destructive",
      });
    }
  };

  const positionOptions = [
    { value: "owner", label: "Owner" },
    { value: "operations-manager", label: "Operations Manager" },
    { value: "sales-marketing-manager", label: "Sales & Marketing Manager" },
    { value: "estimator", label: "Estimator" },
    { value: "field-management", label: "Field Management" },
    { value: "accounting", label: "Accounting" },
  ];

  const divisionOptions = [
    { value: "rr", label: "R&R Division" },
    { value: "multi-family", label: "Multi-Family" },
    { value: "single-family", label: "Single-Family" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="modal-team-member">
        <DialogHeader>
          <DialogTitle data-testid="text-modal-title">
            {teamMember ? "Edit Team Member" : "Add New Team Member"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="form-team-member">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select User</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-user">
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.firstName} {user.lastName} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-position">
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {positionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
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
                name="division"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Division</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-division">
                          <SelectValue placeholder="Select division" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {divisionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="hireDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hire Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} data-testid="input-hire-date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} data-testid="input-phone" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      className="h-24" 
                      placeholder="Additional notes about the team member..."
                      data-testid="textarea-notes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createTeamMemberMutation.isPending || updateTeamMemberMutation.isPending}
                data-testid="button-save"
              >
                {teamMember ? "Update Team Member" : "Add Team Member"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}