
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  content: string;
  isUser: boolean;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const sendMessage = useCallback(async (input: string) => {
    if (!input.trim() || isLoading) return false;
    
    // Add user message
    const userMessage = { content: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Create URL with the message as a query parameter
      const url = new URL('http://localhost:8000/chat');
      url.searchParams.append('message', input);
      
      // Send request to API
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Accept': 'text/event-stream',
        },
        mode: 'cors',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      if (!response.body) {
        throw new Error('ReadableStream not supported');
      }
      
      // Create empty assistant message
      setMessages(prev => [...prev, { content: '', isUser: false }]);
      
      // Process the stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      let accumulatedText = '';
      
      const processStream = async () => {
        try {
          while (true) {
            const { value, done } = await reader.read();
            
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            accumulatedText += chunk;
            
            // Update the last message (assistant's message)
            setMessages(prev => {
              const newMessages = [...prev];
              if (newMessages.length > 0) {
                newMessages[newMessages.length - 1].content = accumulatedText;
              }
              return newMessages;
            });
          }
        } catch (error) {
          console.error('Error reading stream:', error);
          toast({
            title: 'Error',
            description: 'Failed to read response stream',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      };
      
      processStream();
      return true;
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Connection Error',
        description: 'Failed to connect to the server',
        variant: 'destructive',
      });
      setIsLoading(false);
      return false;
    }
  }, [isLoading, toast]);
  
  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages: () => setMessages([])
  };
};
