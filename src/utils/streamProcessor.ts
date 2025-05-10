
import { VisualizationType } from '../components/Assistant/components/VisualizationManager';

type ProcessChunkFn = (chunk: string) => void;

/**
 * Processes a stream of data from an MCP response with FastAPI StreamingResponse
 */
export const processStream = async (
  reader: ReadableStreamDefaultReader<Uint8Array>, 
  decoder: TextDecoder,
  processChunk: ProcessChunkFn
): Promise<void> => {
  try {
    console.log('Starting to process FastAPI stream...');
    
    // Set up a non-blocking reading loop for FastAPI StreamingResponse
    const readChunk = async () => {
      try {
        const { done, value } = await reader.read();
        
        if (done) {
          console.log('Stream finished.');
          return;
        }
        
        // Decode and process the chunk immediately
        const text = decoder.decode(value, { stream: true });
        console.log('Received chunk:', text);
        
        // Process the raw text chunk without buffering
        // FastAPI StreamingResponse sends complete chunks
        if (text.trim()) {
          processChunk(text);
        }
        
        // Continue reading in a non-blocking way
        setTimeout(() => readChunk(), 0);
      } catch (error) {
        console.error('Error reading stream chunk:', error);
        throw error;
      }
    };
    
    // Start the reading process without awaiting the entire stream
    readChunk();
  } catch (error) {
    console.error('Error reading stream:', error);
    throw new Error("Error streaming the response.");
  }
};
