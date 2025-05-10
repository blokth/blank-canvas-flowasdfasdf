
import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useChunkProcessor } from './useChunkProcessor';
import { makeStreamRequest, checkMCPHealth } from '../utils/mcpUtils';
import { processStream } from '../utils/streamProcessor';

export const useMCPConnection = () => {
  // Use the chunk processor hook
  const {
    response,
    visualizationType,
    chunks,
    setResponse,
    setVisualizationType,
    setChunks,
    processChunk,
  } = useChunkProcessor();

  // Send message mutation
  const { mutate: sendMessage, isPending: isLoading } = useMutation({
    mutationFn: makeStreamRequest,
    onMutate: () => {
      setResponse(null);
      setVisualizationType(null);
      setChunks([]);
    },
    onSuccess: async (result) => {
      // Handle non-streaming response (MCPResponse type)
      if ('content' in result) {
        setResponse(result.content);
        if (result.visualization) {
          setVisualizationType(result.visualization);
        }
        return;
      }
      
      // Handle FastAPI StreamingResponse - non-blocking
      if ('reader' in result && 'decoder' in result) {
        processStream(
          result.reader, 
          result.decoder, 
          (chunk) => {
            // Process each chunk as it arrives from FastAPI
            processChunk(chunk);
          }
        ).catch(error => {
          console.error("FastAPI stream processing error:", error);
          setResponse("Error streaming the response.");
        });
      }
    },
    onError: (error) => {
      console.error('Error sending message to MCP server:', error);
      setResponse("Failed to connect to the server.");
    }
  });

  // Check MCP server health on mount
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
