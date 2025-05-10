import { useState, useEffect, useCallback } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);
  
  // Function to handle streamed responses from the server without awaiting the reader
  const handleStreamedResponse = (reader: ReadableStreamDefaultReader<Uint8Array>) => {
    const decoder = new TextDecoder();
    let completeResponse = '';
    let partialResponse = '';
    
    // Process chunks without awaiting
    function processNextChunk() {
      reader.read().then(({ value, done }) => {
        if (done) return;
        
        const chunk = decoder.decode(value, { stream: true });
        completeResponse += chunk;
        partialResponse += chunk;
        
        // Process any complete messages that end with newlines
        if (partialResponse.includes('\n')) {
          const lines = partialResponse.split('\n');
          // Keep the last line (potentially incomplete) for next iteration
          partialResponse = lines.pop() || '';
          
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
        
        // Provide immediate feedback for the first chunk of data
        if (!response && completeResponse.trim()) {
          setResponse(completeResponse.trim());
        }
        
        // Continue processing next chunk
        processNextChunk();
      }).catch(error => {
        console.error('Error reading stream:', error);
      });
    }
    
    // Start processing chunks
    processNextChunk();
    
    return completeResponse;
  };
  
  // Function to send messages to the MCP server
  const sendMessage = useCallback(async (query: string) => {
    if (!query.trim()) return false;
    
    setIsLoading(true);
    
    try {
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
      
      // Check if the response body is a stream
      if (response.body) {
        const reader = response.body.getReader();
        handleStreamedResponse(reader);
        return true;
      } else {
        // Fallback for non-streaming responses
        const data: MCPResponse = await response.json();
        console.log('MCP response:', data);
        
        // Update state with server response
        setResponse(data.content || "I didn't get a proper response from the server.");
        
        // Handle visualization type if provided
        if (data.visualization) {
          setVisualizationType(data.visualization);
        }
        
        return true;
      }
    } catch (error) {
      console.error('Error sending message to MCP server:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  return {
    response,
    visualizationType,
    isLoading,
    sendMessage,
    setResponse,
    setVisualizationType
  };
};
