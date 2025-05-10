
import React, { useRef, useEffect, useState } from 'react';
import Message, { MessageProps } from './Message';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface MessageListProps {
  messages: MessageProps[];
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Only show recent messages if showHistory is false
  const recentMessagesCount = 4; // Show last 2 exchanges (4 messages)
  const visibleMessages = showHistory 
    ? messages 
    : messages.slice(Math.max(0, messages.length - recentMessagesCount));

  const hasHistory = messages.length > recentMessagesCount;

  // Handle scroll events to automatically show history when scrolling up
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollTop } = scrollContainerRef.current;
    
    // When user scrolls up past a threshold, show history
    if (scrollTop < 60 && hasHistory && !showHistory) {
      setShowHistory(true);
    }

    // Track if user is actively scrolling
    if (!isScrolling) {
      setIsScrolling(true);
      setTimeout(() => setIsScrolling(false), 150); // Debounce the scroll state
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* History toggle button - only show if there are older messages */}
      {hasHistory && (
        <Collapsible
          open={showHistory}
          onOpenChange={setShowHistory}
          className="mb-2"
        >
          <div className="flex justify-center">
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
              >
                {showHistory ? (
                  <>Hide History <ChevronUp size={14} /></>
                ) : (
                  <>Show History <ChevronDown size={14} /></>
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
          
          {/* Historical messages */}
          <CollapsibleContent>
            <div className="space-y-6 py-3 opacity-80">
              {messages.slice(0, Math.max(0, messages.length - recentMessagesCount)).map((message) => (
                <Message
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  id={message.id}
                />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
      
      {/* Always visible messages (recent ones) */}
      <div 
        className="space-y-6 overflow-y-auto pb-6 relative"
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
        {/* Fade effect at the top */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-background to-transparent pointer-events-none z-10"></div>
        
        {/* Only show if history is expanded or we're showing recent messages */}
        {visibleMessages.map((message) => (
          <Message
            key={message.id}
            role={message.role}
            content={message.content}
            id={message.id}
          />
        ))}
        
        {/* Typing indicator shown when loading */}
        {isLoading && messages.length > 0 && (
          <div className="flex items-center space-x-2 px-4 py-3 rounded-lg bg-white rounded-bl-none max-w-[80%] w-20">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
