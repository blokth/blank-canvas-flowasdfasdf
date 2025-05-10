
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
    
    // Focus the input element directly without setTimeout
    const inputElement = document.querySelector('textarea');
    if (inputElement) {
      inputElement.focus();
    }
  };

  // Process query to replace patterns with just values
  const processQuery = (q: string): string => {
    return q.replace(/(stock:|timeframe:|sector:)(\w+)/g, "$2");
  };

  // Watch loading state changes
  useEffect(() => {
    handleLoadingChange(isLoading);
  }, [isLoading, handleLoadingChange]);

  // Process incoming chunks
  useEffect(() => {
    processChunks();
  }, [chunks, processChunks]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim() || isLoading) return;
    
    // Process the query to replace patterns with just values
    const processedQuery = processQuery(query);
    
    // Add user message to the conversation with processed query
    addUserMessage(processedQuery);
    
    // Clear the query input and immediately submit
    setQuery('');
    
    // Create a new form event to pass to the onSubmit handler
    const newEvent = { ...e, preventDefault: () => {} };
    onSubmit(newEvent);
  };

  return (
    <div className="flex flex-col h-full border border-border/20 rounded-xl bg-background/80 shadow-sm overflow-hidden">
      <div className="flex-1 h-[calc(100vh-220px)] md:h-[450px] overflow-hidden">
        {messages.length === 0 ? (
          <EmptyConversation onPillClick={handlePillClick} />
        ) : (
          <ScrollArea className="h-full p-4">
            <MessageList messages={messages} isLoading={isLoading} />
          </ScrollArea>
        )}
      </div>
      
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
