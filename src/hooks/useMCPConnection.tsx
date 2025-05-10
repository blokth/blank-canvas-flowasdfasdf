
import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useChunkProcessor } from './useChunkProcessor';
import { checkMCPHealth, makeStreamRequest, StreamResponse, MCPResponse } from '../utils/mcpUtils';
import { useToast } from './use-toast';
import { processStream } from '../utils/streamProcessor';

// Define the types for streaming data
interface ProgressEvent {
  type: string;
  complete: boolean;
  progress: number;
}

interface CloseEvent {
  type: string;
  result: string | string[];
}

// Constants for API requests
const API_RETRY_COUNT = 3;
const API_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;

/**
 * Parse a Server-Sent Event string according to the SSE specification
 */
function parseSSEEvent(eventString: string): { event?: string; data?: string } | null {
  if (!eventString.trim()) return null;

  const result: { event?: string; data?: string } = {};
  const lines = eventString.split('\n');
  let dataLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith('event:')) {
      result.event = line.substring(6).trim();
    } else if (line.startsWith('data:')) {
      dataLines.push(line.substring(5).trim());
    }
    // Ignore other SSE fields like id: and retry: for now as they're not used
  }

  if (dataLines.length > 0) {
    result.data = dataLines.join('\n');
  }

  return result;
}

export const useMCPConnection = () => {
  const { toast } = useToast();
  
  // Use the chunk processor hook
  const {
    response,
    visualizationType,
    chunks,
    setResponse,
    setVisualizationType,
    setChunks,
    processChunk,
    reset,
  } = useChunkProcessor();

  // Send message mutation
  const { mutate: sendMessage, isPending: isLoading } = useMutation({
    mutationFn: async (query: string) => {
      const result = await makeStreamRequest(query);
      return result;
    },
    onMutate: () => {
      // Reset state before new request
      reset();
    },
    onSuccess: async (result) => {
      if ('reader' in result && 'decoder' in result) {
        // Handle streaming response
        const streamResult = result as StreamResponse;
        processStream(streamResult.reader, streamResult.decoder, processChunk);
      } else if ('content' in result) {
        // Handle non-streaming response
        const mcpResult = result as MCPResponse;
        setResponse(mcpResult.content);
        
        if (mcpResult.visualization) {
          setVisualizationType(mcpResult.visualization);
        }
      }
    },
    onError: (error) => {
      console.error('Error sending message to MCP:', error);
      setResponse("Failed to connect to the server.");
      toast({
        title: "Connection Error",
        description: "Failed to connect to the server. Please try again later.",
        variant: "destructive",
      });
    }
  });

  // Check MCP health on mount
  useEffect(() => {
    checkMCPHealth();
  }, []);

  return {
    response,
    visualizationType,
    isLoading,
    chunks,
    sendMessage: (query: string) => {
      if (query.trim()) {
        sendMessage(query);
        return true;
      }
      return false;
    },
    setResponse,
    setVisualizationType
  };
};
