
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
  timestamp?: Date;
  id?: string; // Add unique ID for messages
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastChunkRef = useRef<string>(''); // Track the last chunk to avoid duplicates
  const inSubmissionRef = useRef<boolean>(false); // Track if we're in submission process
  
  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
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

  // Reset assistant state when loading starts
  useEffect(() => {
    if (isLoading) {
      inSubmissionRef.current = true;
      // Don't reset messages, just prepare for new assistant response
      lastChunkRef.current = '';
      setCurrentAssistantMessage('');
    } else {
      // After loading is complete, allow processing new chunks
      inSubmissionRef.current = false;
    }
  }, [isLoading]);

  // Process incoming chunks and update messages
  useEffect(() => {
    if (chunks.length === 0) return;
    
    const latestChunk = chunks[chunks.length - 1];
    
    // Skip if this is the same chunk we've already processed
    if (latestChunk === lastChunkRef.current) return;
    lastChunkRef.current = latestChunk;
    
    // If this is a new response and not a continuation
    if (!currentAssistantMessage || messages.length === 0 || 
        (messages.length > 0 && messages[messages.length - 1].role === 'user')) {
      // Create a new assistant message with unique ID
      setCurrentAssistantMessage(latestChunk);
      setMessages(prev => {
        // Only add a new assistant message if the last message was from the user
        if (prev.length === 0 || prev[prev.length - 1].role === 'user') {
          return [...prev, { 
            role: 'assistant', 
            content: latestChunk,
            timestamp: new Date(),
            id: `assistant-${Date.now()}`
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
  }, [chunks, messages, currentAssistantMessage]);
  
  // Handle form submission to add user message
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim() || isLoading) return;
    
    // Mark as in submission to prevent processing chunks temporarily
    inSubmissionRef.current = true;

    // Add user message to the conversation with unique ID
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: query,
      timestamp: new Date(),
      id: `user-${Date.now()}`
    }]);
    
    // Reset current assistant message to prevent showing old content
    setCurrentAssistantMessage('');
    
    // Reset chunks tracking
    lastChunkRef.current = '';
    
    // Call the provided onSubmit (this will also clear the input in parent components)
    onSubmit(e);
  };

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
            {messages.map((message) => (
              <div 
                key={message.id || `${message.role}-${message.timestamp?.getTime()}`}
                className={cn(
                  "flex flex-col space-y-2 animate-fade-in",
                  message.role === 'user' ? "items-end" : "items-start"
                )}
              >
                <div className={cn(
                  "px-4 py-3 rounded-lg max-w-[80%] shadow-sm",
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
                {message.timestamp && (
                  <span className="text-xs text-muted-foreground px-2">
                    {new Intl.DateTimeFormat('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    }).format(message.timestamp)}
                  </span>
                )}
              </div>
            ))}
            {/* Only show the typing indicator when loading and after at least one message */}
            {isLoading && messages.length > 0 && (
              <div className="flex items-center space-x-2 px-4 py-3 rounded-lg bg-muted rounded-bl-none max-w-[80%] w-20">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>
      
      {/* Input area */}
      <div className="border-t border-border/10 p-4 bg-background/95">
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
