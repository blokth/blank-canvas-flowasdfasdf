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
  
  // Track accumulated text for handling partial chunks
  let accumulatedText = '';
  
  // Function to process chunks without awaiting
  function pump(): void {
    reader.read().then(({ value, done }) => {
      if (done) {
        console.log('Stream finished.');
        
        // Process any remaining accumulated text
        if (accumulatedText.trim()) {
          processChunk(accumulatedText);
        }
        return;
      }
      
      const text = decoder.decode(value, { stream: true });
      accumulatedText += text;
      
      // Look for complete responses (might be JSON objects or complete sentences)
      if (accumulatedText.trim()) {
        try {
          // Try parsing as JSON first
          JSON.parse(accumulatedText);
          // If successful, process the full chunk
          console.log('Processing complete JSON chunk:', accumulatedText);
          processChunk(accumulatedText);
          accumulatedText = '';
        } catch (e) {
          // Not valid JSON, could be partial or plain text
          // Check if we have complete sentences or meaningful content
          if (text.includes('.') || text.includes('!') || text.includes('?') || text.length > 50) {
            console.log('Processing text chunk:', accumulatedText);
            processChunk(accumulatedText);
            accumulatedText = '';
          }
          // Otherwise keep accumulating
        }
      }
      
      // Continue reading the next chunk
      pump();
    }).catch(error => {
      console.error('Error processing stream:', error);
      
      // Try to process any remaining text on error
      if (accumulatedText.trim()) {
        processChunk(accumulatedText);
      }
    });
  }
  
  // Start the pumping process
  pump();
};
