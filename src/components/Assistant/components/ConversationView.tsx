
import React, { useEffect, useRef, useState } from 'react';
import ActionPills from './ActionPills';
import AssistantInput from './AssistantInput';
import { Bot, User } from 'lucide-react';

interface ConversationViewProps {
  chunks: string[];
  isLoading: boolean;
  query?: string;
  setQuery?: (query: string) => void;
  onSubmit?: (e: React.FormEvent) => void;
}

type MessageType = 'user' | 'assistant';

interface Message {
  type: MessageType;
  content: string;
}

const ConversationView: React.FC<ConversationViewProps> = ({
  chunks,
  isLoading,
  query = '',
  setQuery = () => {},
  onSubmit = () => {}
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // Process chunks into messages
  useEffect(() => {
    if (chunks.length === 0) return;
    
    // Get unique chunks
    const uniqueChunks = Array.from(new Set(chunks));
    
    // Check if we have a new user message to add
    const lastMessage = messages[messages.length - 1];
    const hasUserMessageForCurrentResponse = lastMessage && 
      lastMessage.type === 'user' && 
      messages.some(m => m.type === 'assistant' && uniqueChunks.includes(m.content));
    
    // Create a new message list
    let newMessages = [...messages];
    
    // Add user query if it doesn't exist yet and is different from previous
    if (query && (!hasUserMessageForCurrentResponse)) {
      const lastUserMessage = messages.filter(m => m.type === 'user').pop();
      
      // Only add if different from last user message
      if (!lastUserMessage || lastUserMessage.content !== query) {
        newMessages.push({ type: 'user', content: query });
      }
    }
    
    // Add assistant responses that aren't already in the messages
    uniqueChunks.forEach(chunk => {
      if (!newMessages.some(m => m.type === 'assistant' && m.content === chunk)) {
        newMessages.push({ type: 'assistant', content: chunk });
      }
    });
    
    setMessages(newMessages);
  }, [chunks, query, messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Handle pill click
  const handlePillClick = (templateQuery: string) => {
    setQuery(templateQuery);
    
    // Focus the input element if possible
    setTimeout(() => {
      const textareaElement = document.querySelector('textarea');
      if (textareaElement) {
        textareaElement.focus();
      }
    }, 0);
  };

  return (
    <div className="flex flex-col h-full border border-border/20 rounded-xl bg-background/80 shadow-sm">
      {/* Messages area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 min-h-[350px] max-h-[500px]"
      >
        {messages.length === 0 ? (
          // Show action pills when no messages
          <div className="flex flex-col h-full justify-center">
            <h3 className="text-lg font-medium mb-4 text-center">Ask me about your finances</h3>
            <ActionPills onPillClick={handlePillClick} />
          </div>
        ) : (
          // Show messages when they exist
          <>
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex items-start gap-3 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot size={18} className="text-primary" />
                  </div>
                )}
                
                <div 
                  className={`p-3 rounded-lg max-w-[80%] ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.content}
                </div>
                
                {message.type === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <User size={18} className="text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot size={18} className="text-primary" />
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce animation-delay-200"></div>
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce animation-delay-400"></div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Input area */}
      <div className="border-t border-border/10 p-4">
        <AssistantInput
          query={query}
          setQuery={setQuery}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ConversationView;
