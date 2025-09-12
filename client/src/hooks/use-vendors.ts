import { useQuery, useMutation } from "@tanstack/react-query";
import { Vendor, InsertVendor } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export function useVendors() {
  return useQuery<Vendor[]>({
    queryKey: ['/api/vendors'],
    queryFn: async () => {
      const response = await fetch('/api/vendors');
      if (!response.ok) throw new Error('Failed to fetch vendors');
      return response.json();
    }
  });
}

export function useVendor(id: string) {
  return useQuery<Vendor>({
    queryKey: ['/api/vendors', id],
    queryFn: async () => {
      const response = await fetch(`/api/vendors/${id}`);
      if (!response.ok) throw new Error('Failed to fetch vendor');
      return response.json();
    },
    enabled: !!id,
  });
}

export function useCreateVendor() {
  return useMutation({
    mutationFn: async (vendor: InsertVendor) => {
      const response = await apiRequest('POST', '/api/vendors', vendor);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vendors'] });
    },
  });
}

export function useUpdateVendor() {
  return useMutation({
    mutationFn: async ({ id, vendor }: { id: string; vendor: Partial<InsertVendor> }) => {
      const response = await apiRequest('PATCH', `/api/vendors/${id}`, vendor);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vendors'] });
    },
  });
}
