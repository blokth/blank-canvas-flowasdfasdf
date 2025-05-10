
import React, { memo, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import AssistantInput from './AssistantInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import EmptyConversation from './EmptyConversation';
import MessageList from './Message/MessageList';
import { useMessageHandler } from '../hooks/useMessageHandler';

interface ConversationViewProps {
  chunks: string[];
  isLoading: boolean;
  query?: string;
  setQuery?: (query: string) => void;
  onSubmit?: (e: React.FormEvent) => void;
}

const ConversationView: React.FC<ConversationViewProps> = ({
  chunks = [],
  isLoading,
  query = '',
  setQuery = () => {},
  onSubmit = () => {}
}) => {
  const { toast } = useToast();
  const { messages, processChunks, addUserMessage, handleLoadingChange } = useMessageHandler(chunks);
  
  // Handle pills click
  const handlePillClick = (templateQuery: string) => {
    setQuery(templateQuery);
    
    // Focus the input element
    const inputElement = document.querySelector('textarea');
    if (inputElement) {
      setTimeout(() => {
        inputElement.focus();
      }, 0);
    }
  };

  // Watch loading state changes
  useEffect(() => {
    handleLoadingChange(isLoading);
  }, [isLoading]);

  // Process incoming chunks
  useEffect(() => {
    processChunks();
  }, [chunks]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim() || isLoading) return;
    
    // Add user message to the conversation
    addUserMessage(query);
    
    // First clear the query input and then call the provided onSubmit
    const currentQuery = query.trim();
    setQuery('');
    
    // Use setTimeout to ensure React has time to process state updates
    setTimeout(() => {
      // Create a new form event to pass to the onSubmit handler
      const newEvent = { ...e, preventDefault: () => {} };
      onSubmit(newEvent);
    }, 0);
  };

  return (
    <div className="flex flex-col h-full border border-border/20 rounded-xl bg-background/80 shadow-sm overflow-hidden">
      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <EmptyConversation onPillClick={handlePillClick} />
        ) : (
          <MessageList messages={messages} isLoading={isLoading} />
        )}
      </ScrollArea>
      
      {/* Input area */}
      <div className="border-t border-border/10 p-4 bg-background/95">
        <AssistantInput
          query={query}
          setQuery={setQuery}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

// Memoize the component to avoid unnecessary rerenders
export default memo(ConversationView);
