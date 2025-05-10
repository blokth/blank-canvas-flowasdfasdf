
import React from 'react';
import { cn } from '@/lib/utils';

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  isLoading?: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isUser, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="flex justify-start mb-4">
        <div className="bg-muted py-2 px-4 rounded-2xl rounded-bl-none max-w-[75%]">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex mb-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "py-2 px-4 rounded-2xl max-w-[75%]",
        isUser ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none"
      )}>
        <p className="whitespace-pre-wrap">{message}</p>
      </div>
    </div>
  );
};

export default ChatBubble;
