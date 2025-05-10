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
  // Use the Vite proxy to avoid CORS issues
  baseUrl: import.meta.env.VITE_APP_MCP_URL || '/mcp',
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
        
        // Now we don't need to specify CORS mode since we're using the proxy
        const response = await fetch(`${MCP_CONFIG.baseUrl}${MCP_CONFIG.healthEndpoint}`, { 
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
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
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        setConnectionError(`Connection error: ${errorMessage}`);
        
        toast({
          title: "MCP Connection Error",
          description: "Could not connect to MCP server",
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
      
      toast({
        title: "MCP Server Error",
        description: "Failed to get a response from the MCP server",
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
