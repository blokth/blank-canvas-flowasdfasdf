
import { VisualizationType } from '../components/Assistant/components/VisualizationManager';

type ProcessChunkFn = (chunk: string) => void;

/**
 * Processes a stream of data from a FastAPI StreamingResponse
 * Non-blocking approach for real-time streaming
 */
export const processStream = (
  reader: ReadableStreamDefaultReader<Uint8Array>, 
  decoder: TextDecoder,
  processChunk: ProcessChunkFn
): void => {
  console.log('Starting to process stream (non-blocking)...');
  
  // Function to process chunks without awaiting
  function pump(): void {
    reader.read().then(({ value, done }) => {
      if (done) {
        console.log('Stream finished.');
        return;
      }
      
      const text = decoder.decode(value, { stream: true });
      
      if (text.trim()) {
        console.log('Received chunk:', text);
        // Process chunk immediately without awaiting
        processChunk(text);
      }
      
      // Continue reading the next chunk
      pump();
    }).catch(error => {
      console.error('Error processing stream:', error);
    });
  }
  
  // Start the pumping process
  pump();
};
