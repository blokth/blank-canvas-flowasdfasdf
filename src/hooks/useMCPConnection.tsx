
import { useEffect, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useChunkProcessor } from './useChunkProcessor';
import { checkMCPHealth, makeStreamRequest, StreamResponse, MCPResponse } from '../utils/mcpUtils';
import { useToast } from './use-toast';
import { processStream } from '../utils/streamProcessor';

/**
 * Custom hook to handle MCP connection and communication
 */
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
      try {
        const result = await makeStreamRequest(query);
        return result;
      } catch (error) {
        // Handle specific error types and provide user-friendly messages
        if (error.message.includes('CORS')) {
          throw new Error('Unable to connect to the AI server due to CORS restrictions. Please check your network settings.');
        } else if (error.message.includes('Network') || error.message.includes('Failed to fetch')) {
          throw new Error('Network error: Unable to connect to the AI server. It may be down or unreachable.');
        } else if (error.message.includes('timed out')) {
          throw new Error('Connection to the AI server timed out. Please try again later.');
        }
        throw error;
      }
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
      let errorMessage = "Failed to connect to the server. Please try again later.";
      
      // Use custom error messages if available
      if (error.message) {
        errorMessage = error.message;
      }
      
      setResponse(errorMessage);
      toast({
        title: "Connection Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  });

  // Function to check server health and notify user
  const checkServerHealth = useCallback(async () => {
    const isHealthy = await checkMCPHealth();
    if (!isHealthy) {
      console.warn('MCP server is not responding. Features requiring AI may not work properly.');
      // Only show toast once to avoid spamming the user
      toast({
        title: "Server Connection Issue",
        description: "The AI server is not responding. Some features might be limited.",
        variant: "warning",
        duration: 10000, // Show for 10 seconds
      });
    }
  }, [toast]);

  // Check MCP health on mount
  useEffect(() => {
    checkServerHealth();
    // Set up periodic health check every 5 minutes
    const healthCheckInterval = setInterval(checkServerHealth, 5 * 60 * 1000);
    return () => clearInterval(healthCheckInterval);
  }, [checkServerHealth]);

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
