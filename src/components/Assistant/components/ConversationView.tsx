
import React, { memo, useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import AssistantInput from './AssistantInput';
import ActionPills from './ActionPills';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ConversationViewProps {
  chunks: string[];
  isLoading: boolean;
  query?: string;
  setQuery?: (query: string) => void;
  onSubmit?: (e: React.FormEvent) => void;
}

const ConversationView: React.FC<ConversationViewProps> = ({
  chunks = [],
  isLoading,
  query = '',
  setQuery = () => {},
  onSubmit = () => {}
}) => {
  const { toast } = useToast();
  const conversationEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState<string>('');
  
  // Handle pills click
  const handlePillClick = (templateQuery: string) => {
    setQuery(templateQuery);
    
    // Focus the input element
    const inputElement = document.querySelector('textarea');
    if (inputElement) {
      setTimeout(() => {
        inputElement.focus();
      }, 0);
    }
  };

  // Process incoming chunks and update messages
  useEffect(() => {
    if (chunks.length > 0) {
      const latestChunk = chunks[chunks.length - 1];
      
      // If we already have an assistant message being built
      if (currentAssistantMessage) {
        setCurrentAssistantMessage(latestChunk);
      } else {
        // Start a new assistant message
        setCurrentAssistantMessage(latestChunk);
        
        // Add to messages only if this is a new assistant response
        // (i.e., not a continuation of the current one)
        if (messages.length === 0 || messages[messages.length - 1].role !== 'assistant') {
          setMessages(prev => [...prev, { role: 'assistant', content: latestChunk }]);
        }
      }
      
      // Update the last assistant message with the current content
      setMessages(prev => {
        const newMessages = [...prev];
        if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'assistant') {
          newMessages[newMessages.length - 1].content = latestChunk;
        }
        return newMessages;
      });
    }
  }, [chunks, currentAssistantMessage, messages]);
  
  // Handle form submission to add user message
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    // Add user message to the conversation
    setMessages(prev => [...prev, { role: 'user', content: query }]);
    
    // Reset current assistant message
    setCurrentAssistantMessage('');
    
    // Call the provided onSubmit
    onSubmit(e);
  };
  
  // Simple scroll to bottom when messages change
  useEffect(() => {
    if (conversationEndRef.current) {
      setTimeout(() => {
        conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages, currentAssistantMessage]);

  return (
    <div className="flex flex-col h-full border border-border/20 rounded-xl bg-background/80 shadow-sm overflow-hidden">
      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col h-full justify-center space-y-6">
            <h3 className="text-lg font-medium">
              Ask me about your finances
            </h3>
            <ActionPills onPillClick={handlePillClick} />
          </div>
        ) : (
          <div className="space-y-6 pb-6">
            {messages.map((message, index) => (
              <div 
                key={index}
                className={cn(
                  "flex flex-col space-y-2",
                  message.role === 'user' ? "items-end" : "items-start"
                )}
              >
                <div className={cn(
                  "px-4 py-3 rounded-lg max-w-[80%]",
                  message.role === 'user' 
                    ? "bg-primary text-primary-foreground rounded-br-none" 
                    : "bg-muted rounded-bl-none"
                )}>
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: message.content.replace(/\n/g, '<br />') 
                    }} 
                  />
                </div>
              </div>
            ))}
            {/* Only show the typing indicator when loading and after at least one message */}
            {isLoading && messages.length > 0 && !currentAssistantMessage && (
              <div className="flex items-center space-x-2 px-4 py-3 rounded-lg bg-muted rounded-bl-none max-w-[80%] w-20">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={conversationEndRef} />
          </div>
        )}
      </ScrollArea>
      
      {/* Input area */}
      <div className="border-t border-border/10 p-4">
        <AssistantInput
          query={query}
          setQuery={setQuery}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

// Memoize the component to avoid unnecessary rerenders
export default memo(ConversationView);
