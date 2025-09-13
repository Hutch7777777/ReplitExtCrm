import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertLeadSchema, Lead } from "@shared/schema";
import { useCreateLead, useUpdateLead } from "@/hooks/use-leads";
import { useToast } from "@/hooks/use-toast";
import { Division, LeadStatus, Priority } from "@/types";
import { z } from "zod";
import { FileUpload } from "@/components/ui/file-upload";
import { AttachmentList, FileAttachment } from "@/components/ui/attachment-list";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

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
  const queryClient = useQueryClient();
  const createLeadMutation = useCreateLead();
  const updateLeadMutation = useUpdateLead();
  const [activeTab, setActiveTab] = useState("details");

  // File attachment functionality
  const { data: attachments = [], isLoading: loadingAttachments, refetch: refetchAttachments } = useQuery<FileAttachment[]>({
    queryKey: ['/api/leads', lead?.id, 'attachments'],
    enabled: !!lead?.id && open,
  });

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      if (!lead?.id) throw new Error('Lead ID is required for file upload');
      
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('leadId', lead.id);
        formData.append('uploadedBy', 'Current User'); // TODO: Get from auth context
        
        const response = await fetch(`/api/attachments/upload`, {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) throw new Error('Upload failed');
        return await response.json();
      });
      
      return Promise.all(uploadPromises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads', lead?.id, 'attachments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
    },
  });

  const downloadMutation = useMutation({
    mutationFn: async (attachment: FileAttachment) => {
      const response = await fetch(`/api/attachments/${attachment.id}/download`);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.originalName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (attachmentId: string) => {
      const response = await fetch(`/api/attachments/${attachmentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Delete failed');
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads', lead?.id, 'attachments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
    },
  });

  const handleFileUpload = async (files: File[]) => {
    if (!lead?.id) {
      toast({
        title: "Error",
        description: "Please save the lead first before uploading files.",
        variant: "destructive",
      });
      return;
    }
    await uploadMutation.mutateAsync(files);
  };

  const handleFileDownload = async (attachment: FileAttachment) => {
    await downloadMutation.mutateAsync(attachment);
  };

  const handleFileDelete = async (attachmentId: string) => {
    await deleteMutation.mutateAsync(attachmentId);
  };
  
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

  // Reset tab to details when modal opens
  useEffect(() => {
    if (open) {
      setActiveTab("details");
    }
  }, [open]);

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="modal-lead">
        <DialogHeader>
          <DialogTitle data-testid="text-modal-title">
            {lead ? "Edit Lead" : "Add New Lead"}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details" data-testid="tab-lead-details">Lead Details</TabsTrigger>
            <TabsTrigger value="attachments" data-testid="tab-attachments">
              Attachments {attachments.length > 0 && `(${attachments.length})`}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
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
                      <Input type="tel" {...field} value={field.value || ""} data-testid="input-phone" />
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
                    <Input type="email" {...field} value={field.value || ""} data-testid="input-email" />
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
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" aria-hidden="true">$</span>
                        <Input 
                          type="number" 
                          step="0.01"
                          min="0"
                          inputMode="decimal"
                          placeholder="0.00" 
                          {...field} 
                          className="pl-8"
                          data-testid="input-estimated-value"
                        />
                      </div>
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
                      value={field.value || ""}
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
          </TabsContent>

          <TabsContent value="attachments" className="space-y-4">
            {!lead?.id ? (
              <div className="text-center p-8 space-y-4">
                <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
                    File Attachments Ready
                  </h4>
                  <p className="text-blue-700 dark:text-blue-300 mb-4">
                    You can attach documents, photos, contracts, and other files to this lead. 
                    Files will be uploaded after you save the lead details.
                  </p>
                  <Button 
                    onClick={() => setActiveTab("details")} 
                    variant="outline" 
                    className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/40"
                    data-testid="button-back-to-details"
                  >
                    ← Back to Lead Details
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p><strong>Supported file types:</strong> PDF, Word, Excel, Images, Text files, ZIP</p>
                  <p><strong>File size limit:</strong> 10MB per file</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium mb-4">Upload Files</h4>
                  <FileUpload
                    onUpload={handleFileUpload}
                    disabled={uploadMutation.isPending}
                    maxFiles={10}
                    data-testid="file-upload-component"
                  />
                </div>

                <div>
                  <AttachmentList
                    attachments={attachments}
                    isLoading={loadingAttachments}
                    onDownload={handleFileDownload}
                    onDelete={handleFileDelete}
                    emptyMessage="No files attached to this lead yet."
                    data-testid="attachment-list-component"
                  />
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
