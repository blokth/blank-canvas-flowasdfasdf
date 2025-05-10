
import { useState, useCallback, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { VisualizationType } from '../components/Assistant/components/VisualizationManager';

// Type definitions for MCP responses
type MCPResponse = {
  content: string;
  visualization?: VisualizationType | null;
};

// Type for streaming response
type StreamResponse = {
  reader: ReadableStreamDefaultReader<Uint8Array>;
  decoder: TextDecoder;
};

// MCP configuration with default values
const MCP_CONFIG = {
  baseUrl: import.meta.env.VITE_APP_MCP_URL || 'http://localhost:8000',
  healthEndpoint: '/health',
  chatEndpoint: '/chat',
};

export const useMCPConnection = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [visualizationType, setVisualizationType] = useState<VisualizationType | null>(null);
  const [chunks, setChunks] = useState<string[]>([]);
  
  // Process individual chunks of data from stream
  const processChunk = useCallback((chunk: string) => {
    // Log each raw chunk received
    console.log('Raw chunk received:', chunk);
    
    // Add chunk to chunks state for real-time display
    setChunks(prevChunks => [...prevChunks, chunk]);
    
    try {
      // Try to parse as JSON if possible
      const jsonData = JSON.parse(chunk);
      console.log('Received JSON data:', jsonData);
      
      // Update response state with content
      if (jsonData.content) {
        setResponse(jsonData.content);
      }
      
      // Handle visualization type if provided
      if (jsonData.visualization) {
        setVisualizationType(jsonData.visualization);
      }
    } catch (e) {
      // If not JSON, use the line as plain text
      console.log('Received text data (not JSON):', chunk);
      // We don't update response here since it's just a chunk
    }
  }, []);

  // Helper function to make the streaming request
  const makeStreamRequest = useCallback(async (query: string): Promise<MCPResponse | StreamResponse> => {
    if (!query.trim()) throw new Error('Empty query');
    
    // Use query parameters instead of JSON body for the message
    const url = new URL(`${MCP_CONFIG.baseUrl}${MCP_CONFIG.chatEndpoint}`);
    url.searchParams.append('message', query);
    
    console.log('Sending request to:', url.toString());
    
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Accept': 'text/event-stream',
      },
      mode: 'cors',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // For non-streaming responses
    if (!response.body) {
      try {
        const data: MCPResponse = await response.json();
        console.log('MCP non-streaming response:', data);
        return data;
      } catch (error) {
        console.error('Error parsing non-streaming response:', error);
        throw error;
      }
    }
    
    // For streaming responses, return the reader
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    return {
      reader,
      decoder
    };
  }, []);

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
      
      // Handle streaming response (StreamResponse type)
      if ('reader' in result && 'decoder' in result) {
        const { reader, decoder } = result;
        
        try {
          console.log('Starting to process stream...');
          let buffer = '';
          
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              console.log('Stream finished.');
              // Process any remaining data in the buffer
              if (buffer.trim()) {
                console.log('Processing remaining buffer:', buffer);
                processChunk(buffer);
              }
              break;
            }
            
            const text = decoder.decode(value, { stream: true });
            console.log('Received chunk:', text);
            buffer += text;
            
            // Process complete lines in the buffer
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // Keep the last incomplete line in the buffer
            
            for (const line of lines.filter(Boolean)) {
              processChunk(line);
            }
          }
        } catch (error) {
          console.error('Error reading stream:', error);
          setResponse("Error streaming the response.");
        }
      }
    },
    onError: (error) => {
      console.error('Error sending message to MCP server:', error);
      setResponse("Failed to connect to the server.");
    }
  });

  // Add a health check for the MCP server
  useEffect(() => {
    const checkHealth = async () => {
      try {
        console.log(`Checking MCP connection at ${MCP_CONFIG.baseUrl}${MCP_CONFIG.healthEndpoint}`);
        const response = await fetch(`${MCP_CONFIG.baseUrl}${MCP_CONFIG.healthEndpoint}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('MCP health check response:', data);
        } else {
          console.error('MCP health check failed:', response.status);
        }
      } catch (error) {
        console.error('MCP health check error:', error);
      }
    };
    
    // Check health on component mount
    checkHealth();
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
