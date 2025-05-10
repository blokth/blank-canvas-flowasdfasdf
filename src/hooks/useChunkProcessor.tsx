
import { useState, useCallback } from 'react';
import { VisualizationType } from '../components/Assistant/components/VisualizationManager';

export const useChunkProcessor = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [visualizationType, setVisualizationType] = useState<VisualizationType | null>(null);
  const [chunks, setChunks] = useState<string[]>([]);
  
  // Process individual chunks of data from stream
  const processChunk = useCallback((chunk: string) => {
    // Log each raw chunk received
    console.log('Raw chunk received:', chunk);
    
    // Add chunk to chunks state for real-time display
    setChunks(prevChunks => [...prevChunks, chunk]);
    
    try {
      // Try to parse as JSON if possible
      const jsonData = JSON.parse(chunk);
      console.log('Received JSON data:', jsonData);
      
      // Update response state with content
      if (jsonData.content) {
        setResponse(jsonData.content);
      }
      
      // Handle visualization type if provided
      if (jsonData.visualization) {
        setVisualizationType(jsonData.visualization);
      }
    } catch (e) {
      // If not JSON, treat as plain text - just add to chunks
      // We've already added this to chunks above
    }
  }, []);
  
  return {
    response,
    visualizationType,
    chunks,
    setResponse,
    setVisualizationType,
    setChunks,
    processChunk,
  };
};
