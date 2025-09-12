import { useQuery, useMutation } from "@tanstack/react-query";
import { Lead, InsertLead } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Division } from "@/types";

export function useLeads(division?: Division) {
  return useQuery<Lead[]>({
    queryKey: division ? ['/api/leads', { division }] : ['/api/leads'],
    queryFn: async () => {
      const url = division ? `/api/leads?division=${division}` : '/api/leads';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch leads');
      return response.json();
    }
  });
}

export function useLead(id: string) {
  return useQuery<Lead>({
    queryKey: ['/api/leads', id],
    queryFn: async () => {
      const response = await fetch(`/api/leads/${id}`);
      if (!response.ok) throw new Error('Failed to fetch lead');
      return response.json();
    },
    enabled: !!id,
  });
}

export function useCreateLead() {
  return useMutation({
    mutationFn: async (lead: InsertLead) => {
      const response = await apiRequest('POST', '/api/leads', lead);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    },
  });
}

export function useUpdateLead() {
  return useMutation({
    mutationFn: async ({ id, lead }: { id: string; lead: Partial<InsertLead> }) => {
      const response = await apiRequest('PATCH', `/api/leads/${id}`, lead);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    },
  });
}

export function useDeleteLead() {
  return useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/leads/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    },
  });
}
