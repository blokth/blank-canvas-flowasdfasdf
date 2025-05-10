
import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useChunkProcessor } from './useChunkProcessor';
import { checkMCPHealth, makeStreamRequest, StreamResponse, MCPResponse } from '../utils/mcpUtils';
import { useToast } from './use-toast';
import { processStream } from '../utils/streamProcessor';

export const useMCPConnection = () => {
  const { toast } = useToast();
  
  // Use the chunk processor hook
  const {
    response,
    visualizationType,
    setResponse,
    setVisualizationType,
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
