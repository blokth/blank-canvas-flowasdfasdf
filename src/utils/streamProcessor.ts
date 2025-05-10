
import { VisualizationType } from '../components/Assistant/components/VisualizationManager';

type ProcessChunkFn = (chunk: string) => void;

/**
 * Processes a stream of data from a FastAPI StreamingResponse
 * Simplified approach to avoid re-render issues
 */
export const processStream = async (
  reader: ReadableStreamDefaultReader<Uint8Array>, 
  decoder: TextDecoder,
  processChunk: ProcessChunkFn
): Promise<void> => {
  console.log('Starting to process FastAPI stream...');
  
  try {
    let done = false;
    
    while (!done) {
      const { value, done: isDone } = await reader.read();
      done = isDone;
      
      if (done) {
        console.log('Stream finished.');
        break;
      }
      
      const text = decoder.decode(value, { stream: true });
      
      if (text.trim()) {
        console.log('Received chunk:', text);
        processChunk(text);
      }
    }
  } catch (error) {
    console.error('Error processing stream:', error);
    throw error;
  }
};
