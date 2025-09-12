import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface OutlookEmail {
  id: string;
  subject: string;
  from: {
    emailAddress: {
      address: string;
      name: string;
    };
  };
  receivedDateTime: string;
  bodyPreview: string;
  isRead: boolean;
}

export interface CalendarEvent {
  id: string;
  subject: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  location?: {
    displayName: string;
  };
  attendees: Array<{
    emailAddress: {
      address: string;
      name: string;
    };
  }>;
}

export function useOutlookEmails(folder = 'inbox', top = 25) {
  return useQuery<{ value: OutlookEmail[] }>({
    queryKey: ['/api/outlook/emails', { folder, top }],
    queryFn: async () => {
      const response = await fetch(`/api/outlook/emails?folder=${folder}&top=${top}`);
      if (!response.ok) throw new Error('Failed to fetch emails');
      return response.json();
    },
    retry: false,
  });
}

export function useCalendarEvents(startTime?: string, endTime?: string) {
  return useQuery<{ value: CalendarEvent[] }>({
    queryKey: ['/api/outlook/calendar', { startTime, endTime }],
    queryFn: async () => {
      const url = new URL('/api/outlook/calendar', window.location.origin);
      if (startTime) url.searchParams.set('startTime', startTime);
      if (endTime) url.searchParams.set('endTime', endTime);
      
      const response = await fetch(url.toString());
      if (!response.ok) throw new Error('Failed to fetch calendar events');
      return response.json();
    },
    retry: false,
  });
}

export function useSendEmail() {
  return useMutation({
    mutationFn: async ({ to, subject, content, cc }: { 
      to: string; 
      subject: string; 
      content: string; 
      cc?: string[] 
    }) => {
      await apiRequest('POST', '/api/outlook/send-email', { to, subject, content, cc });
    },
  });
}

export function useCreateCalendarEvent() {
  return useMutation({
    mutationFn: async ({ 
      subject, 
      start, 
      end, 
      attendees, 
      location 
    }: { 
      subject: string;
      start: string;
      end: string;
      attendees?: string[];
      location?: string;
    }) => {
      const response = await apiRequest('POST', '/api/outlook/calendar', {
        subject,
        start,
        end,
        attendees,
        location
      });
      return response.json();
    },
  });
}
