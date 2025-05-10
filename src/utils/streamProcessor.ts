
import { VisualizationType } from '../components/Assistant/components/VisualizationManager';

type ProcessChunkFn = (chunk: string) => void;

/**
 * Processes a stream of data from a FastAPI StreamingResponse
 * Uses a non-blocking approach to handle chunks as they arrive immediately
 */
export const processStream = async (
  reader: ReadableStreamDefaultReader<Uint8Array>, 
  decoder: TextDecoder,
  processChunk: ProcessChunkFn
): Promise<void> => {
  console.log('Starting to process FastAPI stream...');
  
  // Set up a non-blocking reading loop
  const readChunk = async (): Promise<void> => {
    try {
      const { done, value } = await reader.read();
      
      if (done) {
        console.log('Stream finished.');
        return;
      }
      
      // Decode the chunk immediately
      const text = decoder.decode(value, { stream: true });
      
      if (text.trim()) {
        console.log('Received chunk:', text);
        // Process the chunk immediately - no delay
        processChunk(text);
      }
      
      // Continue reading immediately with requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        readChunk().catch(error => {
          console.error('Error in animation frame:', error);
        });
      });
    } catch (error) {
      console.error('Error processing stream chunk:', error);
      throw error;
    }
  };
  
  // Start the reading process without blocking
  readChunk().catch(error => {
    console.error('Fatal stream processing error:', error);
    throw new Error("Error streaming the response.");
  });
};
