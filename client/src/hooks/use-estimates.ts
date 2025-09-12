import { useQuery, useMutation } from "@tanstack/react-query";
import { Estimate, InsertEstimate } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export function useEstimates() {
  return useQuery<Estimate[]>({
    queryKey: ['/api/estimates'],
    queryFn: async () => {
      const response = await fetch('/api/estimates');
      if (!response.ok) throw new Error('Failed to fetch estimates');
      return response.json();
    }
  });
}

export function useEstimate(id: string) {
  return useQuery<Estimate>({
    queryKey: ['/api/estimates', id],
    queryFn: async () => {
      const response = await fetch(`/api/estimates/${id}`);
      if (!response.ok) throw new Error('Failed to fetch estimate');
      return response.json();
    },
    enabled: !!id,
  });
}

export function useCreateEstimate() {
  return useMutation({
    mutationFn: async (estimate: InsertEstimate) => {
      const response = await apiRequest('POST', '/api/estimates', estimate);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/estimates'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    },
  });
}

export function useUpdateEstimate() {
  return useMutation({
    mutationFn: async ({ id, estimate }: { id: string; estimate: Partial<InsertEstimate> }) => {
      const response = await apiRequest('PATCH', `/api/estimates/${id}`, estimate);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/estimates'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    },
  });
}
