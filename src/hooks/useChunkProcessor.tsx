import { useState, useCallback, useRef } from 'react';
import { VisualizationType } from '../components/Assistant/components/VisualizationManager';

export const useChunkProcessor = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [visualizationType, setVisualizationType] = useState<VisualizationType | null>(null);
  const [chunks, setChunks] = useState<string[]>([]);
  const processingRef = useRef<boolean>(false);
  
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
        // Start fresh if we're in a new conversation or if we explicitly reset
        if (processingRef.current === false) {
          processingRef.current = true;
          return [chunk];
        }
        
        // Otherwise replace the last chunk for continuous updating
        const newChunks = [...prev];
        if (newChunks.length > 0) {
          newChunks[newChunks.length - 1] = chunk;
        } else {
          newChunks.push(chunk);
        }
        return newChunks;
      });
    }
  }, []);
  
  // Reset all state
  const reset = useCallback(() => {
    // Immediately clear all state
    setResponse(null);
    setVisualizationType(null);
    setChunks([]);
    processingRef.current = false;
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
