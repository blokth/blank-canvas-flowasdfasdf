
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
  
  // Function to send messages to the MCP server
  const sendMessage = useCallback(async (query: string) => {
    if (!query.trim()) return false;
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`${MCP_CONFIG.baseUrl}${MCP_CONFIG.chatEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: query }),
        mode: 'cors', // Explicitly request CORS
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
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
