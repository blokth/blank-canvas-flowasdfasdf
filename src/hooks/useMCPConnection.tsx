
import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useChunkProcessor } from './useChunkProcessor';
import { checkMCPHealth } from '../utils/mcpUtils';
import { useToast } from './use-toast';
import { processStream } from '../utils/streamProcessor';

// Define the types for streaming data
interface ProgressEvent {
  type: string;
  complete: boolean;
  progress: number;
}

interface CloseEvent {
  type: string;
  result: string | string[];
}

// Constants for API requests
const API_BASE_URL = process.env.API_BASE_URL || '';
const API_RETRY_COUNT = 3;
const API_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;

/**
 * Parse a Server-Sent Event string according to the SSE specification
 */
function parseSSEEvent(eventString: string): { event?: string; data?: string } | null {
  if (!eventString.trim()) return null;

  const result: { event?: string; data?: string } = {};
  const lines = eventString.split('\n');
  let dataLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith('event:')) {
      result.event = line.substring(6).trim();
    } else if (line.startsWith('data:')) {
      dataLines.push(line.substring(5).trim());
    }
    // Ignore other SSE fields like id: and retry: for now as they're not used
  }

  if (dataLines.length > 0) {
    result.data = dataLines.join('\n');
  }

  return result;
}

/**
 * Make a streaming request to an API endpoint
 */
const makeStreamRequest = async <T>(
  query: string,
  options?: {
    onProgress?: (progress: ProgressEvent) => void;
    retries?: number;
    onError?: (error: Error) => void;
  }
): Promise<T | undefined> => {
  const retries = options?.retries ?? API_RETRY_COUNT;
  let result: T | undefined;

  try {
    // Use demo mode for now - replace with actual API call
    console.log('Making stream request with query:', query);
    
    return {
      content: `This is a sample response to your query: "${query}"`,
    } as unknown as T;
    
    // Uncomment below for actual API integration when ready

    /*
    const formData = new FormData();
    formData.append('query', query);

    // Create controller for potential abort
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT * 3);

    // Use fetch with ReadableStream to handle streaming properly
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      body: formData,
      headers: {
        // Add auth headers if needed
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    // Process the stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    const processStream = async (): Promise<T | undefined> => {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          console.log('[Stream Debug] Stream finished.');
          // Process any remaining data in the buffer
          if (buffer.trim()) {
            console.log('[Stream Debug] Processing remaining buffer:', buffer);
            processEvent(buffer);
          }
          return result;
        }

        const text = decoder.decode(value, { stream: true });
        console.log('[Stream Debug] Received chunk:', text);
        buffer += text;

        // Process complete events in the buffer
        const events = buffer.split('\n\n');
        buffer = events.pop() || ''; // Keep the last incomplete chunk in the buffer

        for (const eventText of events.filter(Boolean)) {
          processEvent(eventText);
        }
      }
    };

    const processEvent = (eventText: string) => {
      console.log('[Stream Debug] Processing event text:', JSON.stringify(eventText));
      const eventData = parseSSEEvent(eventText);
      console.log('[Stream Debug] Parsed event data:', eventData);
      if (!eventData) return;

      // Handle the event based on its type
      if (eventData.event === 'progress' && eventData.data) {
        try {
          const progressData = JSON.parse(eventData.data) as ProgressEvent;
          if (options?.onProgress) {
            options.onProgress(progressData);
          }
        } catch (e) {
          console.error('Failed to parse progress event data as JSON:', e);
        }
      } else if (eventData.event === 'close' && eventData.data) {
        console.log('[Stream Debug] Close event raw data:', eventData.data);
        try {
          const closeData = JSON.parse(eventData.data) as CloseEvent;
          console.log('[Stream Debug] Close event parsed data:', closeData);
          if (options?.onProgress) {
            options.onProgress(closeData as any);
          }

          // Process the result
          if (closeData.result) {
            if (typeof closeData.result === 'string') {
              result = { content: closeData.result } as unknown as T;
            } else if (Array.isArray(closeData.result)) {
              result = closeData.result as unknown as T;
            }
          }
        } catch (e) {
          console.error('[Stream Debug] Failed to parse close event data as JSON:', eventData.data, e);
        }
      }
    };

    return await processStream();
    */
  } catch (error) {
    // Handle retries
    if (
      error instanceof Error &&
      retries > 0 &&
      (error.name === 'AbortError' ||
       (error instanceof TypeError && error.message.includes('network')) ||
       (error instanceof DOMException && error.name === 'AbortError'))
    ) {
      console.log(`Retrying streaming request (${API_RETRY_COUNT - retries + 1}/${API_RETRY_COUNT})...`);
      // Wait before retry - exponential backoff
      const delay = 1000 * (MAX_RETRIES - retries + 1);
      await new Promise(resolve => setTimeout(resolve, delay));
      return makeStreamRequest<T>(query, {
        ...options,
        retries: retries - 1
      });
    }

    // Handle errors
    if (options?.onError) {
      if (error instanceof Error && error.name === 'AbortError') {
        options.onError(new Error('The request timed out. Please check your network connection and try again.'));
      } else if (error instanceof Error) {
        options.onError(error);
      } else {
        options.onError(new Error('Unknown error occurred'));
      }
    }

    throw error;
  }
};

export const useMCPConnection = () => {
  const { toast } = useToast();
  
  // Use the chunk processor hook
  const {
    response,
    visualizationType,
    chunks,
    setResponse,
    setVisualizationType,
    setChunks,
    processChunk,
    reset,
  } = useChunkProcessor();

  // Send message mutation
  const { mutate: sendMessage, isPending: isLoading } = useMutation({
    mutationFn: async (query: string) => {
      return makeStreamRequest(query, {
        onProgress: (progress) => {
          console.log('Stream progress:', progress);
        },
        onError: (error) => {
          console.error('Stream error:', error);
          toast({
            title: "Connection Error",
            description: error.message || "Failed to connect to the server. Please try again later.",
            variant: "destructive",
          });
        }
      });
    },
    onMutate: () => {
      // Reset state before new request
      reset();
    },
    onSuccess: (result) => {
      // For demo purposes, simulate streaming with the result
      if (result && 'content' in result) {
        const content = result.content as string;
        const fakeChunks = content.split(' ');
        
        // Process each word as if it were a separate chunk
        let accumulatedText = '';
        
        // Schedule the chunks to appear one by one to simulate streaming
        fakeChunks.forEach((chunk, index) => {
          setTimeout(() => {
            accumulatedText += (index > 0 ? ' ' : '') + chunk;
            processChunk(accumulatedText);
            
            // Set response when all chunks have been processed
            if (index === fakeChunks.length - 1) {
              setResponse(accumulatedText);
            }
          }, index * 100); // Delay each chunk by 100ms
        });
        
        // Set visualization type if available
        if ('visualization' in result) {
          setVisualizationType(result.visualization as any);
        }
      }
    },
    onError: (error) => {
      console.error('Error sending message to MCP:', error);
      setResponse("Failed to connect to the server.");
      toast({
        title: "Connection Error",
        description: "Failed to connect to the server. Please try again later.",
        variant: "destructive",
      });
    }
  });

  // Check MCP health on mount
  useEffect(() => {
    checkMCPHealth();
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
