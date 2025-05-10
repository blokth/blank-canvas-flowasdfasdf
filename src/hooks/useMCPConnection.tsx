
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
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
  checkInterval: 30000, // 30 seconds
};

export const useMCPConnection = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [visualizationType, setVisualizationType] = useState<VisualizationType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Check server connection on initial load
  useEffect(() => {
    const checkConnection = async () => {
      try {
        console.log(`Checking MCP connection at ${MCP_CONFIG.baseUrl}${MCP_CONFIG.healthEndpoint}`);
        
        const response = await fetch(`${MCP_CONFIG.baseUrl}${MCP_CONFIG.healthEndpoint}`, { 
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors', // Explicitly request CORS
        });
        
        console.log('MCP health check response:', response);
        
        setIsConnected(response.ok);
        setConnectionError(null);
        
        if (!response.ok) {
          const errorMessage = `Server returned ${response.status}: ${response.statusText}`;
          setConnectionError(errorMessage);
          console.warn('MCP Server Error:', errorMessage);
          toast({
            title: "MCP Server Error",
            description: `Could not connect to MCP server (${response.status})`,
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Failed to check MCP server status:', error);
        setIsConnected(false);
        
        // Handle CORS errors specifically
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const isCorsError = errorMessage.includes('CORS') || 
                           (error instanceof TypeError && errorMessage.includes('Network'));
        
        setConnectionError(
          isCorsError 
            ? "CORS error: The MCP server needs to enable cross-origin requests" 
            : `Connection error: ${errorMessage}`
        );
        
        toast({
          title: "MCP Connection Error",
          description: isCorsError 
            ? "CORS policy blocked connection to MCP server" 
            : "Could not connect to MCP server",
          variant: "destructive"
        });
      }
    };
    
    checkConnection();
    
    // Set up periodic connection check
    const intervalId = setInterval(checkConnection, MCP_CONFIG.checkInterval);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Function to handle streamed responses from the server
  const handleStreamedResponse = async (reader: ReadableStreamDefaultReader<Uint8Array>) => {
    const decoder = new TextDecoder();
    let completeResponse = '';
    let partialResponse = '';
    
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
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
      }
      
      // Process any remaining partial response
      if (partialResponse.trim()) {
        try {
          const jsonData = JSON.parse(partialResponse);
          // Update final response state with content
          if (jsonData.content) {
            setResponse(jsonData.content);
          }
          // Handle visualization type if provided
          if (jsonData.visualization) {
            setVisualizationType(jsonData.visualization);
          }
        } catch (e) {
          // Use as plain text if not JSON
          setResponse(prev => (prev ? `${prev}\n${partialResponse}` : partialResponse));
        }
      }
      
      return completeResponse;
    } catch (error) {
      console.error('Error reading stream:', error);
      throw error;
    }
  };
  
  // Function to send messages to the MCP server
  const sendMessage = useCallback(async (query: string) => {
    if (!query.trim()) return false;
    
    setIsLoading(true);
    
    try {
      // Change here: Use query parameters instead of JSON body for the message
      const url = new URL(`${MCP_CONFIG.baseUrl}${MCP_CONFIG.chatEndpoint}`);
      url.searchParams.append('message', query);
      
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Accept': 'text/event-stream',
        },
        mode: 'cors', // Explicitly request CORS
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Check if the response body is a stream
      if (response.body) {
        const reader = response.body.getReader();
        const result = await handleStreamedResponse(reader);
        console.log('Completed streamed response:', result);
        setIsConnected(true);
        setConnectionError(null);
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
        
        setIsConnected(true);
        setConnectionError(null);
        return true;
      }
    } catch (error) {
      console.error('Error sending message to MCP server:', error);
      
      // Check if this is a CORS error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const isCorsError = errorMessage.includes('CORS') || 
                         (error instanceof TypeError && errorMessage.includes('Network'));
      
      toast({
        title: "MCP Server Error",
        description: isCorsError 
          ? "CORS policy blocked connection to MCP server" 
          : "Failed to get a response from the MCP server",
        variant: "destructive"
      });
      
      setIsConnected(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  return {
    response,
    visualizationType,
    isLoading,
    isConnected,
    connectionError,
    sendMessage,
    setResponse,
    setVisualizationType
  };
};
