
import React from 'react';
import { cn } from '@/lib/utils';

interface ChatBubbleProps {
  content: string;
  isUser: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ content, isUser }) => {
  return (
    <div 
      className={cn(
        "max-w-[80%] rounded-2xl px-4 py-2 mb-2",
        isUser 
          ? "bg-primary text-primary-foreground self-end rounded-br-none"
          : "bg-muted self-start rounded-bl-none"
      )}
    >
      {content}
    </div>
  );
};

export default ChatBubble;
