import { useEffect, useRef, useState } from "react";
import { queryClient } from "@/lib/queryClient";
import { WebSocketMessage } from "@/types";

export function useWebSocket() {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      setIsConnected(true);
      console.log("WebSocket connected");
    };

    ws.current.onclose = () => {
      setIsConnected(false);
      console.log("WebSocket disconnected");
    };

    ws.current.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        handleMessage(message);
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const handleMessage = (message: WebSocketMessage) => {
    switch (message.type) {
      case 'lead_created':
      case 'lead_updated':
      case 'lead_deleted':
        queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
        queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
        break;
      case 'estimate_created':
      case 'estimate_updated':
        queryClient.invalidateQueries({ queryKey: ['/api/estimates'] });
        queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
        break;
      case 'job_created':
      case 'job_updated':
        queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
        break;
      case 'communication_created':
        queryClient.invalidateQueries({ queryKey: ['/api/communications'] });
        break;
      case 'white_label_updated':
        queryClient.invalidateQueries({ queryKey: ['/api/white-label'] });
        break;
    }
  };

  return { isConnected };
}
