import { useState, useCallback, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { VisualizationType } from '../components/Assistant/components/VisualizationManager';

// Type definitions for MCP responses
type MCPResponse = {
  content: string;
  visualization?: VisualizationType | null;
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
  const processChunk = useCallback((chunk: string, partialData: { text: string }) => {
    partialData.text += chunk;
    
    // Log each raw chunk received
    console.log('Raw chunk received:', chunk);
    
    // Add chunk to chunks state for real-time display
    setChunks(prevChunks => [...prevChunks, chunk]);
    
    // Process any complete messages that end with newlines
    if (partialData.text.includes('\n')) {
      const lines = partialData.text.split('\n');
      // Keep the last line (potentially incomplete) for next iteration
      partialData.text = lines.pop() || '';
      
      // Process each complete line
      for (const line of lines) {
        if (line.trim()) {
          try {
            // Try to parse as JSON if possible
            const jsonData = JSON.parse(line);
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
            console.log('Received text data:', line);
            setResponse(prev => (prev ? `${prev}\n${line}` : line));
          }
        }
      }
    }
  }, []);

  // Send message mutation
  const { mutate: sendMessage, isPending: isLoading } = useMutation({
    mutationFn: async (query: string) => {
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
      
      return response;
    },
    onMutate: () => {
      setResponse(null);
      setVisualizationType(null);
      setChunks([]);
    },
    onSuccess: async (response) => {
      // For non-streaming responses
      if (!response.body) {
        try {
          const data: MCPResponse = await response.json();
          console.log('MCP non-streaming response:', data);
          
          // Update state with server response
          setResponse(data.content || "I didn't get a proper response from the server.");
          
          // Handle visualization type if provided
          if (data.visualization) {
            setVisualizationType(data.visualization);
          }
        } catch (error) {
          console.error('Error parsing non-streaming response:', error);
          setResponse("Error processing the response.");
        }
        return;
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      try {
        console.log('Starting to process stream...');
        return reader;
      } catch (error) {
        console.error('Error reading stream:', error);
        setResponse("Error streaming the response.");
      }
    },
    onError: (error) => {
      console.error('Error sending message to MCP server:', error);
      setResponse("Failed to connect to the server.");
    },
    onProgress: ({ data }) => {
      if (!data) return;
      
      try {
        // Get the chunk as string
        const chunk = typeof data === 'string' ? data : decoder.decode(data, { stream: true });
        console.log('Streaming chunk:', chunk);
        
        // Add chunk to chunks array for real-time display
        setChunks(prevChunks => [...prevChunks, chunk]);
        
        // Try to parse as JSON
        try {
          const jsonData = JSON.parse(chunk);
          console.log('Parsed JSON data:', jsonData);
          
          if (jsonData.content) {
            setResponse(jsonData.content);
          }
          
          if (jsonData.visualization) {
            setVisualizationType(jsonData.visualization);
          }
        } catch (e) {
          // If not valid JSON, treat as plain text
          console.log('Using chunk as plain text');
        }
      } catch (error) {
        console.error('Error processing chunk:', error);
      }
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
