
import { useState, useRef } from 'react';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  id: string;
}

export const useMessageHandler = (chunks: string[] = []) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState<string>('');
  const lastChunkRef = useRef<string>(''); // Track the last chunk to avoid duplicates
  const inSubmissionRef = useRef<boolean>(false); // Track if we're in submission process
  const submissionTimeRef = useRef<number>(0); // Track when the last submission happened

  // Process incoming chunks and update messages
  const processChunks = () => {
    if (chunks.length === 0) return;
    
    const latestChunk = chunks[chunks.length - 1];
    
    // Skip if this is the same chunk we've already processed
    if (latestChunk === lastChunkRef.current) return;
    lastChunkRef.current = latestChunk;
    
    // Get the current time to compare with submission time
    const currentTime = Date.now();
    // Only process if it's been at least 100ms since submission or if not in submission
    const timeElapsed = currentTime - submissionTimeRef.current;
    
    if (timeElapsed < 100 && submissionTimeRef.current > 0) {
      console.log('Skipping chunk processing, too soon after submission:', timeElapsed, 'ms');
      return;
    }
    
    // If this is a new response and not a continuation
    if (!currentAssistantMessage || messages.length === 0 || 
        (messages.length > 0 && messages[messages.length - 1].role === 'user')) {
      // Create a new assistant message with unique ID
      setCurrentAssistantMessage(latestChunk);
      setMessages(prev => {
        // Only add a new assistant message if the last message was from the user
        if (prev.length === 0 || prev[prev.length - 1].role === 'user') {
          // Generate a truly unique ID with timestamp and random number
          const uniqueId = `assistant-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
          return [...prev, { 
            role: 'assistant', 
            content: latestChunk,
            timestamp: new Date(),
            id: uniqueId
          }];
        }
        return prev;
      });
    } else {
      // Update existing assistant message
      setCurrentAssistantMessage(latestChunk);
      setMessages(prev => {
        const newMessages = [...prev];
        if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'assistant') {
          newMessages[newMessages.length - 1].content = latestChunk;
        }
        return newMessages;
      });
    }
  };

  // Handle form submission to add user message
  const addUserMessage = (query: string) => {
    if (!query.trim()) return;
    
    // Mark as in submission to prevent processing chunks temporarily
    inSubmissionRef.current = true;
    // Record the submission time
    submissionTimeRef.current = Date.now();

    // Generate a unique ID for the user message
    const uniqueId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Add user message to the conversation with unique ID
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: query,
      timestamp: new Date(),
      id: uniqueId
    }]);
    
    // Reset current assistant message to prevent showing old content
    setCurrentAssistantMessage('');
    
    // Reset chunks tracking
    lastChunkRef.current = '';
  };

  // Reset assistant state
  const handleLoadingChange = (isLoading: boolean) => {
    if (isLoading) {
      inSubmissionRef.current = true;
      // Mark the time of submission to prevent race conditions
      submissionTimeRef.current = Date.now();
      // Don't reset messages, just prepare for new assistant response
      lastChunkRef.current = '';
      setCurrentAssistantMessage('');
    } else {
      // After loading is complete, allow processing new chunks
      inSubmissionRef.current = false;
    }
  };

  return {
    messages,
    processChunks,
    addUserMessage,
    handleLoadingChange
  };
};
