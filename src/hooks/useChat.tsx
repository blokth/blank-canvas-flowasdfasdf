
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseChatProps {
  apiUrl?: string;
}

export const useChat = ({ apiUrl = 'http://localhost:8000/chat' }: UseChatProps = {}) => {
  const [messages, setMessages] = useState<{content: string; isUser: boolean}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const { toast } = useToast();

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    // Add user message to list
    setMessages(prev => [...prev, { content: message, isUser: true }]);
    setIsLoading(true);
    setCurrentResponse('');

    try {
      // Create URL with query parameter
      const url = new URL(apiUrl);
      url.searchParams.append('message', message);
      
      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Accept': 'text/event-stream',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Get the reader from the response body
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) {
        throw new Error('No reader available');
      }

      // Process the stream
      let accumulatedResponse = '';
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }
        
        // Decode the chunk and add to accumulated response
        const chunk = decoder.decode(value, { stream: true });
        accumulatedResponse += chunk;
        setCurrentResponse(accumulatedResponse);
      }

      // Add the final response to messages
      if (accumulatedResponse) {
        setMessages(prev => [...prev, { content: accumulatedResponse, isUser: false }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setCurrentResponse('');
    }
  }, [apiUrl, toast]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    currentResponse,
    sendMessage,
    clearMessages,
  };
};
