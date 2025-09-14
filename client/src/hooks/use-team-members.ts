import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { TeamMember, InsertTeamMember } from "@shared/schema";

export function useTeamMembers() {
  return useQuery({
    queryKey: ['/api/team-members'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/team-members');
      return response.json();
    },
  });
}

export function useTeamMembersByDivision(division: string) {
  return useQuery({
    queryKey: ['/api/team-members', division],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/team-members?division=${division}`);
      return response.json();
    },
  });
}

export function useTeamMembersByPosition(position: string) {
  return useQuery({
    queryKey: ['/api/team-members', position],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/team-members?position=${position}`);
      return response.json();
    },
  });
}

export function useCreateTeamMember() {
  return useMutation({
    mutationFn: async (teamMember: InsertTeamMember) => {
      const response = await apiRequest('POST', '/api/team-members', teamMember);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/team-members'] });
    },
  });
}

export function useUpdateTeamMember() {
  return useMutation({
    mutationFn: async ({ id, teamMember }: { id: string; teamMember: Partial<InsertTeamMember> }) => {
      const response = await apiRequest('PATCH', `/api/team-members/${id}`, teamMember);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/team-members'] });
    },
  });
}

export function useDeleteTeamMember() {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/team-members/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/team-members'] });
    },
  });
}