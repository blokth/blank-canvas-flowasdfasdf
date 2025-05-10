
import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ChatBubble from './ChatBubble';
import { useChat } from '@/hooks/useChat';

const MinimalChat: React.FC = () => {
  const { 
    messages, 
    input, 
    setInput, 
    isLoading, 
    sendMessage,
    chunks 
  } = useChat();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chunks]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage();
  };

  return (
    <div className="w-full bg-background border border-border/10 rounded-xl overflow-hidden shadow-sm">
      <div className="border-b border-border/10 px-4 py-3">
        <h3 className="text-sm font-medium">Ask about your finances</h3>
      </div>
      
      <div className="p-4">
        <div className="max-h-[300px] overflow-y-auto mb-4">
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Ask me anything about your finances or portfolio.
            </p>
          ) : (
            messages.map((msg, index) => (
              <ChatBubble 
                key={index}
                message={msg.content}
                isUser={msg.role === 'user'}
              />
            ))
          )}
          {isLoading && chunks.length === 0 && <ChatBubble message="" isUser={false} isLoading={true} />}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !input.trim()}
          >
            <Send size={16} />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default MinimalChat;
