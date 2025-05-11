
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
  baseUrl: 'http://localhost:8080',
  healthEndpoint: '/health',
  chatEndpoint: '/chat',
  connectionTimeout: 10000, // 10 second timeout
};

/**
 * Makes a request to the MCP server with proper error handling
 */
export const makeStreamRequest = async (query: string): Promise<MCPResponse | StreamResponse> => {
  if (!query.trim()) throw new Error('Empty query');
  
  // Use query parameters instead of JSON body for the message
  const url = new URL(`${MCP_CONFIG.baseUrl}${MCP_CONFIG.chatEndpoint}`);
  url.searchParams.append('message', query);
  
  console.log('Sending request to:', url.toString());
  
  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), MCP_CONFIG.connectionTimeout);
    
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Accept': 'text/event-stream',
      },
      mode: 'cors',
      signal: controller.signal,
    });
    
    // Clear the timeout as the request completed
    clearTimeout(timeoutId);
    
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
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Request timed out after', MCP_CONFIG.connectionTimeout, 'ms');
      throw new Error(`Connection to ${MCP_CONFIG.baseUrl} timed out. Please check if the server is accessible.`);
    }
    
    // Fallback for CORS issues
    if (error.message.includes('CORS') || error.message.includes('cross-origin')) {
      console.error('CORS error detected:', error);
      throw new Error(`CORS error: Unable to access ${MCP_CONFIG.baseUrl}. The server might not allow requests from this origin.`);
    }
    
    // Network errors
    if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
      console.error('Network error:', error);
      throw new Error(`Network error: Unable to connect to ${MCP_CONFIG.baseUrl}. The server might be down or not publicly accessible.`);
    }
    
    // Re-throw other errors
    throw error;
  }
};

/**
 * Checks the health of the MCP server with improved error handling
 */
export const checkMCPHealth = async (): Promise<boolean> => {
  try {
    console.log(`Checking MCP connection at ${MCP_CONFIG.baseUrl}${MCP_CONFIG.healthEndpoint}`);
    
    // Add timeout to prevent hanging health checks
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), MCP_CONFIG.connectionTimeout);
    
    const response = await fetch(`${MCP_CONFIG.baseUrl}${MCP_CONFIG.healthEndpoint}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });
    
    // Clear the timeout as the request completed
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      console.log('MCP health check response:', data);
      return true;
    } else {
      console.error('MCP health check failed:', response.status);
      return false;
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Health check timed out after', MCP_CONFIG.connectionTimeout, 'ms');
    } else {
      console.error('MCP health check error:', error);
    }
    return false;
  }
};

