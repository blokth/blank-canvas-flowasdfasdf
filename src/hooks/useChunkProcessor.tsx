import { useState, useCallback, useRef } from 'react';
import { VisualizationType } from '../components/Assistant/components/VisualizationManager';

export const useChunkProcessor = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [visualizationType, setVisualizationType] = useState<VisualizationType | null>(null);
  const [chunks, setChunks] = useState<string[]>([]);
  
  // Process chunk function that updates chunks array
  const processChunk = useCallback((chunk: string) => {
    // Skip empty chunks
    if (!chunk.trim()) return;
    
    console.log('Processing chunk:', chunk);
    
    try {
      // Try to parse as JSON for structured data
      const jsonData = JSON.parse(chunk);
      console.log('Parsed JSON data:', jsonData);
      
      // Handle structured content if available
      if (jsonData.content) {
        setResponse(jsonData.content);
        setChunks(prev => [...prev, jsonData.content]);
      }
      
      // Handle visualization type if provided
      if (jsonData.visualization) {
        setVisualizationType(jsonData.visualization);
      }
    } catch (e) {
      // For plain text, just set it directly
      setResponse(chunk);
      
      // Update chunks for streaming display
      setChunks(prev => {
        // If this is a continuation of a response, replace the last chunk
        if (prev.length > 0) {
          return [...prev.slice(0, -1), chunk];
        }
        // Otherwise add as new chunk
        return [...prev, chunk];
      });
    }
  }, []);
  
  // Reset all state
  const reset = useCallback(() => {
    setResponse(null);
    setVisualizationType(null);
    setChunks([]);
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
