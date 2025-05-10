
import { VisualizationType } from '../components/Assistant/components/VisualizationManager';

type ProcessChunkFn = (chunk: string) => void;

/**
 * Processes a stream of data from an MCP response
 */
export const processStream = async (
  reader: ReadableStreamDefaultReader<Uint8Array>, 
  decoder: TextDecoder,
  processChunk: ProcessChunkFn
): Promise<void> => {
  try {
    console.log('Starting to process stream...');
    let buffer = '';
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        console.log('Stream finished.');
        // Process any remaining data in the buffer
        if (buffer.trim()) {
          console.log('Processing remaining buffer:', buffer);
          processChunk(buffer);
        }
        break;
      }
      
      // Process the chunk as it arrives
      const text = decoder.decode(value, { stream: true });
      console.log('Received chunk:', text);
      
      // Immediately update with the new chunk
      processChunk(text);
      
      // Also handle line breaks for complete messages
      buffer += text;
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep the last incomplete line in the buffer
    }
  } catch (error) {
    console.error('Error reading stream:', error);
    throw new Error("Error streaming the response.");
  }
};
