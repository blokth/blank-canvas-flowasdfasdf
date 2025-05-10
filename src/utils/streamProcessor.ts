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
  
  // Use a throttle mechanism to avoid too frequent UI updates
  let lastProcessTime = 0;
  const THROTTLE_MS = 50; // Minimum 50ms between UI updates
  
  // Function to process chunks without awaiting
  function pump(): void {
    reader.read().then(({ value, done }) => {
      const now = Date.now();
      
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
      
      // Only process chunks at a reasonable rate to avoid UI flicker
      if (accumulatedText.trim() && (now - lastProcessTime >= THROTTLE_MS)) {
        lastProcessTime = now;
        
        try {
          // Try parsing as JSON first
          JSON.parse(accumulatedText);
          // If successful, process the full chunk
          console.log('Processing complete JSON chunk');
          processChunk(accumulatedText);
          accumulatedText = '';
        } catch (e) {
          // Not valid JSON, could be partial or plain text
          // Process the current accumulated text but don't clear it
          // This way we keep building the complete message incrementally
          console.log('Processing partial text chunk');
          processChunk(accumulatedText);
          // Don't reset accumulatedText - we're building the complete message incrementally
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
