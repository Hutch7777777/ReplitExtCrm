import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertLeadSchema, Lead } from "@shared/schema";
import { useCreateLead, useUpdateLead } from "@/hooks/use-leads";
import { useToast } from "@/hooks/use-toast";
import { Division, LeadStatus, Priority } from "@/types";
import { z } from "zod";

const leadFormSchema = insertLeadSchema.extend({
  estimatedValue: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

interface LeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: Lead;
  defaultStatus?: LeadStatus;
  defaultDivision?: Division;
}

export default function LeadModal({ 
  open, 
  onOpenChange, 
  lead, 
  defaultStatus = 'new',
  defaultDivision = 'single-family'
}: LeadModalProps) {
  const { toast } = useToast();
  const createLeadMutation = useCreateLead();
  const updateLeadMutation = useUpdateLead();
  
  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      customerName: "",
      email: "",
      phone: "",
      address: "",
      division: defaultDivision,
      projectType: "siding",
      priority: "medium",
      status: defaultStatus,
      estimatedValue: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (lead) {
      form.reset({
        customerName: lead.customerName,
        email: lead.email || "",
        phone: lead.phone || "",
        address: lead.address,
        division: lead.division,
        projectType: lead.projectType,
        priority: lead.priority,
        status: lead.status,
        estimatedValue: lead.estimatedValue || "",
        notes: lead.notes || "",
      });
    } else {
      form.reset({
        customerName: "",
        email: "",
        phone: "",
        address: "",
        division: defaultDivision,
        projectType: "siding",
        priority: "medium",
        status: defaultStatus,
        estimatedValue: "",
        notes: "",
      });
    }
  }, [lead, form, defaultStatus, defaultDivision]);

  const onSubmit = async (data: LeadFormData) => {
    try {
      const leadData = {
        ...data,
        estimatedValue: data.estimatedValue ? data.estimatedValue : null,
      };

      if (lead) {
        await updateLeadMutation.mutateAsync({ id: lead.id, lead: leadData });
        toast({
          title: "Lead Updated",
          description: "Lead has been updated successfully.",
        });
      } else {
        await createLeadMutation.mutateAsync(leadData);
        toast({
          title: "Lead Created",
          description: "New lead has been created successfully.",
        });
      }
      
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: lead ? "Failed to update lead." : "Failed to create lead.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="modal-lead">
        <DialogHeader>
          <DialogTitle data-testid="text-modal-title">
            {lead ? "Edit Lead" : "Add New Lead"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="form-lead">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-customer-name" />
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
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Address</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="h-20" data-testid="textarea-address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="division"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Division</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-division">
                          <SelectValue placeholder="Select Division" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="rr">R&R Division</SelectItem>
                        <SelectItem value="multi-family">Multi-Family</SelectItem>
                        <SelectItem value="single-family">Single-Family</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="projectType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-project-type">
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="siding">Siding Installation</SelectItem>
                        <SelectItem value="repair">Repair Work</SelectItem>
                        <SelectItem value="replacement">Full Replacement</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="roofing">Roofing</SelectItem>
                        <SelectItem value="windows">Windows</SelectItem>
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
                name="estimatedValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Value</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00" 
                        {...field} 
                        data-testid="input-estimated-value"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-priority">
                          <SelectValue placeholder="Select Priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
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
                      placeholder="Initial notes about the lead..."
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
                disabled={createLeadMutation.isPending || updateLeadMutation.isPending}
                data-testid="button-save"
              >
                {lead ? "Update Lead" : "Create Lead"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
