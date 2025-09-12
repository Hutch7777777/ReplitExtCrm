import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertVendorSchema, Vendor } from "@shared/schema";
import { useCreateVendor, useUpdateVendor } from "@/hooks/use-vendors";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const vendorFormSchema = insertVendorSchema.extend({
  rating: z.string().optional(),
});

type VendorFormData = z.infer<typeof vendorFormSchema>;

interface VendorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendor?: Vendor;
}

export default function VendorModal({ open, onOpenChange, vendor }: VendorModalProps) {
  const { toast } = useToast();
  const createVendorMutation = useCreateVendor();
  const updateVendorMutation = useUpdateVendor();
  
  const form = useForm<VendorFormData>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues: {
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      category: "",
      rating: "",
      notes: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (vendor) {
      form.reset({
        name: vendor.name,
        contactPerson: vendor.contactPerson || "",
        email: vendor.email || "",
        phone: vendor.phone || "",
        address: vendor.address || "",
        category: vendor.category || "",
        rating: vendor.rating?.toString() || "",
        notes: vendor.notes || "",
        isActive: vendor.isActive,
      });
    } else {
      form.reset({
        name: "",
        contactPerson: "",
        email: "",
        phone: "",
        address: "",
        category: "",
        rating: "",
        notes: "",
        isActive: true,
      });
    }
  }, [vendor, form]);

  const onSubmit = async (data: VendorFormData) => {
    try {
      const vendorData = {
        ...data,
        rating: data.rating ? parseInt(data.rating) : null,
      };

      if (vendor) {
        await updateVendorMutation.mutateAsync({ id: vendor.id, vendor: vendorData });
        toast({
          title: "Vendor Updated",
          description: "Vendor has been updated successfully.",
        });
      } else {
        await createVendorMutation.mutateAsync(vendorData);
        toast({
          title: "Vendor Created",
          description: "New vendor has been created successfully.",
        });
      }
      
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: vendor ? "Failed to update vendor." : "Failed to create vendor.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="modal-vendor">
        <DialogHeader>
          <DialogTitle data-testid="text-modal-title">
            {vendor ? "Edit Vendor" : "Add New Vendor"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="form-vendor">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor Name</FormLabel>
                  <FormControl>
                    <Input {...field} data-testid="input-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-contact-person" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-category">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="materials">Materials</SelectItem>
                        <SelectItem value="subcontractor">Subcontractor</SelectItem>
                        <SelectItem value="equipment">Equipment</SelectItem>
                        <SelectItem value="supplies">Supplies</SelectItem>
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
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="h-20" data-testid="textarea-address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating (1-5)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-rating">
                        <SelectValue placeholder="Select Rating" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1 - Poor</SelectItem>
                      <SelectItem value="2">2 - Below Average</SelectItem>
                      <SelectItem value="3">3 - Average</SelectItem>
                      <SelectItem value="4">4 - Good</SelectItem>
                      <SelectItem value="5">5 - Excellent</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
                      placeholder="Additional notes about the vendor..."
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
                disabled={createVendorMutation.isPending || updateVendorMutation.isPending}
                data-testid="button-save"
              >
                {vendor ? "Update Vendor" : "Create Vendor"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
