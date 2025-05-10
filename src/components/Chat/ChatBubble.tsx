
import React from 'react';
import { cn } from '@/lib/utils';

interface ChatBubbleProps {
  content: string;
  isUser?: boolean;
  isLoading?: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ content, isUser = false, isLoading = false }) => {
  return (
    <div className={cn(
      "mb-2 flex",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "px-4 py-2 rounded-2xl max-w-[85%] break-words",
        isUser ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted text-muted-foreground rounded-bl-none",
        isLoading && "animate-pulse"
      )}>
        {content}
      </div>
    </div>
  );
};

export default ChatBubble;
