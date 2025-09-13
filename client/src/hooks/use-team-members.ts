import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { TeamMember, InsertTeamMember } from "@shared/schema";

export function useTeamMembers() {
  return useQuery({
    queryKey: ['/api/team-members'],
  });
}

export function useTeamMembersByDivision(division: string) {
  return useQuery({
    queryKey: ['/api/team-members', division],
    queryFn: () => apiRequest(`/api/team-members?division=${division}`),
  });
}

export function useTeamMembersByPosition(position: string) {
  return useQuery({
    queryKey: ['/api/team-members', position],
    queryFn: () => apiRequest(`/api/team-members?position=${position}`),
  });
}

export function useCreateTeamMember() {
  return useMutation({
    mutationFn: (teamMember: InsertTeamMember) => apiRequest('/api/team-members', {
      method: 'POST',
      body: JSON.stringify(teamMember),
      headers: {
        'Content-Type': 'application/json',
      },
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/team-members'] });
    },
  });
}

export function useUpdateTeamMember() {
  return useMutation({
    mutationFn: ({ id, teamMember }: { id: string; teamMember: Partial<InsertTeamMember> }) =>
      apiRequest(`/api/team-members/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(teamMember),
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/team-members'] });
    },
  });
}

export function useDeleteTeamMember() {
  return useMutation({
    mutationFn: (id: string) => apiRequest(`/api/team-members/${id}`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/team-members'] });
    },
  });
}