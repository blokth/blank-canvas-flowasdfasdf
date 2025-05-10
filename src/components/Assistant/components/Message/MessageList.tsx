
import React, { useRef, useEffect, useState } from 'react';
import Message, { MessageProps } from './Message';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface MessageListProps {
  messages: MessageProps[];
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showHistory, setShowHistory] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle scroll events to show history
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;
    
    // If user is scrolling up, automatically show history
    if (scrollTop < 50 && !showHistory && hasHistory) {
      setShowHistory(true);
    }
  };

  // Only show recent messages if showHistory is false
  const recentMessagesCount = 4; // Show last 2 exchanges (4 messages)
  const visibleMessages = showHistory 
    ? messages 
    : messages.slice(Math.max(0, messages.length - recentMessagesCount));

  const hasHistory = messages.length > recentMessagesCount;

  return (
    <div 
      className="flex flex-col h-full overflow-y-auto"
      onScroll={handleScroll}
      ref={scrollContainerRef}
    >
      {/* History toggle button - only show if there are older messages */}
      {hasHistory && !showHistory && (
        <div className="flex justify-center sticky top-0 z-10 pb-2 pt-1 bg-gradient-to-b from-background to-transparent">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setShowHistory(true)}
          >
            Show History <ChevronDown size={14} />
          </Button>
        </div>
      )}
      
      {/* Messages container with top fade effect */}
      <div className="space-y-6">
        {/* Historical messages */}
        {showHistory && (
          <div className="space-y-6 pb-3">
            {messages.slice(0, Math.max(0, messages.length - recentMessagesCount)).map((message) => (
              <Message
                key={message.id}
                role={message.role}
                content={message.content}
                id={message.id}
              />
            ))}
          </div>
        )}
        
        {/* Always visible messages (recent ones) */}
        <div className="space-y-6 pb-6">
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
    </div>
  );
};

export default MessageList;
