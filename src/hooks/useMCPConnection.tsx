
import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useChunkProcessor } from './useChunkProcessor';
import { makeStreamRequest, checkMCPHealth } from '../utils/mcpUtils';
import { processStream } from '../utils/streamProcessor';
import { useToast } from './use-toast';

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
    mutationFn: makeStreamRequest,
    onMutate: () => {
      // Reset state before new request
      reset();
    },
    onSuccess: async (result) => {
      // Handle non-streaming response
      if ('content' in result) {
        setResponse(result.content);
        if (result.visualization) {
          setVisualizationType(result.visualization);
        }
        return;
      }
      
      // Handle FastAPI StreamingResponse
      if ('reader' in result && 'decoder' in result) {
        // Process the stream without awaiting
        processStream(
          result.reader, 
          result.decoder, 
          processChunk
        );
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
