
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ChatBubble from './ChatBubble';
import { Send, X } from 'lucide-react';

const MinimalChat: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    isLoading,
    currentResponse,
    sendMessage,
  } = useChat();

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    
    sendMessage(inputValue);
    setInputValue('');
    setIsExpanded(true); // Expand on send
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col">
      {/* Chat messages */}
      {isExpanded && (
        <div 
          className="bg-background border border-border rounded-t-lg shadow-md mb-2 w-80 sm:w-96 max-h-80 overflow-y-auto"
          ref={chatContainerRef}
        >
          <div className="flex justify-between items-center p-2 border-b">
            <h3 className="text-sm font-medium">Assistant</h3>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsExpanded(false)}
            >
              <X size={16} />
            </Button>
          </div>
          
          <div className="p-3">
            {messages.length === 0 ? (
              <div className="text-muted-foreground text-center py-6 text-sm">
                Send a message to start a conversation
              </div>
            ) : (
              <div>
                {messages.map((msg, index) => (
                  <ChatBubble 
                    key={index}
                    content={msg.content}
                    isUser={msg.isUser}
                  />
                ))}
                {isLoading && currentResponse && (
                  <ChatBubble 
                    content={currentResponse}
                    isLoading={true}
                  />
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Input form */}
      <form 
        onSubmit={handleSubmit}
        className="flex items-center gap-2 bg-background border border-border rounded-lg p-2 shadow-md"
      >
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask something..."
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          onFocus={() => !isExpanded && setIsExpanded(true)}
        />
        <Button 
          type="submit" 
          size="icon" 
          className="h-8 w-8 rounded-full" 
          variant="ghost"
          disabled={isLoading || !inputValue.trim()}
        >
          <Send size={16} />
        </Button>
      </form>
    </div>
  );
};

export default MinimalChat;
