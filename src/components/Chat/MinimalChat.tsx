
import React, { useState, useRef } from 'react';
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ChatBubble from './ChatBubble';
import { useChat } from '@/hooks/useChat';

const MinimalChat: React.FC = () => {
  const [input, setInput] = useState('');
  const { messages, isLoading, sendMessage } = useChat();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (await sendMessage(input)) {
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-background border border-border rounded-lg shadow-lg flex flex-col z-50">
      <div className="p-3 border-b">
        <h3 className="text-sm font-medium">Chat Assistant</h3>
      </div>
      
      <div className="flex-1 overflow-auto p-3" ref={containerRef}>
        <div className="flex flex-col space-y-2">
          {messages.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-8">
              Send a message to start chatting
            </p>
          ) : (
            messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <ChatBubble content={msg.content} isUser={msg.isUser} />
              </div>
            ))
          )}
          {isLoading && !messages[messages.length - 1]?.content && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-bl-none p-3 max-w-[80%]">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="p-3 border-t">
        <div className="flex">
          <Input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 mr-2"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MinimalChat;
