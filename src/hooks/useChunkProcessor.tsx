
import { useState, useCallback } from 'react';
import { VisualizationType } from '../components/Assistant/components/VisualizationManager';

export const useChunkProcessor = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [visualizationType, setVisualizationType] = useState<VisualizationType | null>(null);
  
  // Process chunk function
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
      }
      
      // Handle visualization type if provided
      if (jsonData.visualization) {
        setVisualizationType(jsonData.visualization);
      }
    } catch (e) {
      // For plain text, just set it directly
      setResponse(chunk);
    }
  }, []);
  
  // Reset all state
  const reset = useCallback(() => {
    setResponse(null);
    setVisualizationType(null);
  }, []);
  
  return {
    response,
    visualizationType,
    setResponse,
    setVisualizationType,
    processChunk,
    reset,
  };
};
