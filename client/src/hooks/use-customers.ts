import { useQuery, useMutation } from "@tanstack/react-query";
import { Customer, InsertCustomer } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export function useCustomers() {
  return useQuery<Customer[]>({
    queryKey: ['/api/customers'],
    queryFn: async () => {
      const response = await fetch('/api/customers');
      if (!response.ok) throw new Error('Failed to fetch customers');
      return response.json();
    }
  });
}

export function useCustomer(id: string) {
  return useQuery<Customer>({
    queryKey: ['/api/customers', id],
    queryFn: async () => {
      const response = await fetch(`/api/customers/${id}`);
      if (!response.ok) throw new Error('Failed to fetch customer');
      return response.json();
    },
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  return useMutation({
    mutationFn: async (customer: InsertCustomer) => {
      const response = await apiRequest('POST', '/api/customers', customer);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
    },
  });
}

export function useUpdateCustomer() {
  return useMutation({
    mutationFn: async ({ id, customer }: { id: string; customer: Partial<InsertCustomer> }) => {
      const response = await apiRequest('PATCH', `/api/customers/${id}`, customer);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
    },
  });
}
