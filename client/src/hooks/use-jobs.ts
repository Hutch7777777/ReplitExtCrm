import { useQuery, useMutation } from "@tanstack/react-query";
import { Job, InsertJob } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export function useJobs() {
  return useQuery<Job[]>({
    queryKey: ['/api/jobs'],
    queryFn: async () => {
      const response = await fetch('/api/jobs');
      if (!response.ok) throw new Error('Failed to fetch jobs');
      return response.json();
    }
  });
}

export function useJob(id: string) {
  return useQuery<Job>({
    queryKey: ['/api/jobs', id],
    queryFn: async () => {
      const response = await fetch(`/api/jobs/${id}`);
      if (!response.ok) throw new Error('Failed to fetch job');
      return response.json();
    },
    enabled: !!id,
  });
}

export function useCreateJob() {
  return useMutation({
    mutationFn: async (job: InsertJob) => {
      const response = await apiRequest('POST', '/api/jobs', job);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
    },
  });
}

export function useUpdateJob() {
  return useMutation({
    mutationFn: async ({ id, job }: { id: string; job: Partial<InsertJob> }) => {
      const response = await apiRequest('PATCH', `/api/jobs/${id}`, job);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
    },
  });
}
