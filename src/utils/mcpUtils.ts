
import { VisualizationType } from '../components/Assistant/components/VisualizationManager';

// Type definitions for MCP responses
export type MCPResponse = {
  content: string;
  visualization?: VisualizationType | null;
};

// Type for streaming response
export type StreamResponse = {
  reader: ReadableStreamDefaultReader<Uint8Array>;
  decoder: TextDecoder;
};

// MCP configuration with default values
export const MCP_CONFIG = {
  baseUrl: 'https://blokth.com:8000',
  healthEndpoint: '/health',
  chatEndpoint: '/chat',
};

/**
 * Makes a request to the MCP server
 */
export const makeStreamRequest = async (query: string): Promise<MCPResponse | StreamResponse> => {
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
};

/**
 * Checks the health of the MCP server
 */
export const checkMCPHealth = async (): Promise<void> => {
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
