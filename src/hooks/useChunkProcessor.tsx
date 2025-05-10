import { useState, useCallback, useRef } from 'react';
import { VisualizationType } from '../components/Assistant/components/VisualizationManager';

export const useChunkProcessor = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [visualizationType, setVisualizationType] = useState<VisualizationType | null>(null);
  const [chunks, setChunks] = useState<string[]>([]);
  
  // Keep track of processed chunk IDs to avoid duplicates
  const processedChunksRef = useRef<Set<string>>(new Set());
  
  // Process chunks from FastAPI StreamingResponse
  const processChunk = useCallback((chunk: string) => {
    // Skip empty chunks
    if (!chunk.trim()) return;
    
    console.log('Processing chunk:', chunk);
    
    // Generate a simple hash/id for the chunk to detect duplicates
    const chunkId = chunk.trim();
    
    // Skip if we've already processed this exact chunk
    if (processedChunksRef.current.has(chunkId)) {
      console.log('Skipping duplicate chunk');
      return;
    }
    
    // Mark this chunk as processed
    processedChunksRef.current.add(chunkId);
    
    // Add the raw chunk to our chunks collection
    setChunks(prevChunks => [...prevChunks, chunk]);
    
    try {
      // Try to parse as JSON for structured data
      const jsonData = JSON.parse(chunk);
      console.log('Parsed JSON data:', jsonData);
      
      // Handle structured content if available
      if (jsonData.content) {
        setResponse(jsonData.content);
      }
      
      // Handle visualization type if provided
      if (jsonData.visualization) {
        setVisualizationType(jsonData.visualization);
      }
    } catch (e) {
      // For plain text streams, just accumulate the content
      setResponse(prevResponse => 
        prevResponse ? prevResponse + chunk : chunk
      );
    }
  }, []);
  
  // Reset all state and processed chunks tracking
  const reset = useCallback(() => {
    setResponse(null);
    setVisualizationType(null);
    setChunks([]);
    processedChunksRef.current.clear();
  }, []);
  
  return {
    response,
    visualizationType,
    chunks,
    setResponse,
    setVisualizationType,
    setChunks,
    processChunk,
    reset,
  };
};
