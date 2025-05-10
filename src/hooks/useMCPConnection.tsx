import { useState, useCallback } from 'react';
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
  
  // Process individual chunks of data from stream
  const processChunk = useCallback((chunk: string, partialData: { text: string }) => {
    partialData.text += chunk;
    
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
      
      // For streaming responses
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const partialData = { text: '' };
      let completeResponse = '';
      
      try {
        const processStream = async () => {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            completeResponse += chunk;
            processChunk(chunk, partialData);
          }
          
          // Process any remaining partial data
          if (partialData.text.trim()) {
            processChunk('\n', partialData);
          }
          
          return completeResponse;
        };
        
        await processStream();
      } catch (error) {
        console.error('Error reading stream:', error);
        setResponse("Error streaming the response.");
      }
    },
    onError: (error) => {
      console.error('Error sending message to MCP server:', error);
      setResponse("Failed to connect to the server.");
    }
  });

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
