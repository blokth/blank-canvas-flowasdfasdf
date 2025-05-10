
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const sendMessage = useCallback(async () => {
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      role: 'user',
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInput(''); // Clear input field
    
    try {
      // Send request to chat endpoint
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Added correct Content-Type header
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({ message: input }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      // Create new assistant message
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: ''
      };
      
      // Add empty assistant message
      setMessages(prev => [...prev, assistantMessage]);
      
      // Process stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) {
        throw new Error('Unable to read response');
      }
      
      // Read stream chunks
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }
        
        // Decode chunk
        const chunk = decoder.decode(value, { stream: true });
        
        // Update the last assistant message
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          
          if (lastMessage && lastMessage.role === 'assistant') {
            lastMessage.content += chunk;
          }
          
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to the chat service.",
        variant: "destructive",
      });
      
      // Remove loading state or add error message
      setMessages(prev => {
        if (prev[prev.length - 1]?.role === 'assistant' && prev[prev.length - 1]?.content === '') {
          // Replace empty assistant message with error
          const newMessages = [...prev];
          newMessages[prev.length - 1] = {
            role: 'assistant',
            content: "I'm sorry, I couldn't process your request right now."
          };
          return newMessages;
        }
        return prev;
      });
    } finally {
      setIsLoading(false);
    }
  }, [input, toast]);
  
  return {
    messages,
    input,
    setInput,
    isLoading,
    sendMessage
  };
};
