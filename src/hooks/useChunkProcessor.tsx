
import { useState, useCallback, useRef } from 'react';
import { VisualizationType } from '../components/Assistant/components/VisualizationManager';

export const useChunkProcessor = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [visualizationType, setVisualizationType] = useState<VisualizationType | null>(null);
  const [chunks, setChunks] = useState<string[]>([]);
  const processingRef = useRef<boolean>(false);
  const accumulatedTextRef = useRef<string>('');
  // Add throttling for UI updates
  const lastProcessTimeRef = useRef<number>(0);
  const throttleDelayMs = 50; // Minimum 50ms between UI updates
  
  // Process chunk function that updates chunks array with throttling
  const processChunk = useCallback((chunk: string) => {
    // Skip empty chunks
    if (!chunk.trim()) return;
    
    const now = Date.now();
    // Skip updates that are too frequent to reduce UI flicker
    if (now - lastProcessTimeRef.current < throttleDelayMs) {
      return;
    }
    lastProcessTimeRef.current = now;
    
    console.log('Processing chunk');
    
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
      // For plain text, use the complete chunk from the stream
      // This is the full message so far
      
      // Update response with the current chunk (which contains the full message so far)
      setResponse(chunk);
      
      // Update chunks for streaming display with throttling
      setChunks(prev => {
        // Start fresh if we're in a new conversation or if we explicitly reset
        if (processingRef.current === false) {
          processingRef.current = true;
          return [chunk];
        }
        
        // Replace the last chunk with the complete accumulated text so far
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
    accumulatedTextRef.current = '';
    lastProcessTimeRef.current = 0;
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
