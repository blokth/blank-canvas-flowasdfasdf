
import React from 'react';
import { cn } from '@/lib/utils';

export interface MessageProps {
  role: 'user' | 'assistant';
  content: string;
  id: string;
}

const Message: React.FC<MessageProps> = ({ role, content, id }) => {
  return (
    <div 
      key={id}
      className={cn(
        "flex flex-col space-y-2 animate-fade-in",
        role === 'user' ? "items-end" : "items-start"
      )}
    >
      <div className={cn(
        "px-4 py-3 rounded-lg max-w-[80%] shadow-sm",
        role === 'user' 
          ? "bg-primary text-primary-foreground rounded-br-none" 
          : "bg-muted rounded-bl-none"
      )}>
        <div 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ 
            __html: content.replace(/\n/g, '<br />') 
          }} 
        />
      </div>
    </div>
  );
};

export default Message;
