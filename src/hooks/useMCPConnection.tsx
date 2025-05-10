
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { VisualizationType } from '../components/Assistant/components/VisualizationManager';

// Type definitions for MCP responses
type MCPResponse = {
  content: string;
  visualization?: VisualizationType | null;
};

export const useMCPConnection = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [visualizationType, setVisualizationType] = useState<VisualizationType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  
  // Check server connection on initial load
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('http://localhost:8000/health', { 
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        setIsConnected(response.ok);
        
        if (!response.ok) {
          toast({
            title: "MCP Server Error",
            description: "Could not connect to MCP server at localhost:8000",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Failed to check MCP server status:', error);
        setIsConnected(false);
        toast({
          title: "MCP Server Error",
          description: "Could not connect to MCP server at localhost:8000",
          variant: "destructive"
        });
      }
    };
    
    checkConnection();
    
    // Set up periodic connection check
    const intervalId = setInterval(checkConnection, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Function to send messages to the MCP server
  const sendMessage = useCallback(async (query: string) => {
    if (!query.trim()) return false;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/chat', {
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
    sendMessage,
    setResponse,
    setVisualizationType
  };
};
