
import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import ActionPills from './ActionPills';
import AssistantInput from './AssistantInput';

interface ConversationViewProps {
  chunks: string[];
  isLoading: boolean;
  query?: string;
  setQuery?: (query: string) => void;
  onSubmit?: (e: React.FormEvent) => void;
}

type MessageType = 'user' | 'assistant';

interface Message {
  type: MessageType;
  content: string;
  isStreaming?: boolean;
}

const ConversationView: React.FC<ConversationViewProps> = ({
  chunks,
  isLoading,
  query = '',
  setQuery = () => {},
  onSubmit = () => {}
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  // Track current streaming message to accumulate chunks
  const [streamingMessage, setStreamingMessage] = useState<string>('');

  // Process chunks into messages with streaming support - optimize for immediate rendering
  useEffect(() => {
    // Exit early if there are no chunks
    if (!chunks.length) return;
    
    console.log('Processing chunks in ConversationView:', chunks);
    
    // Add user query if it doesn't exist yet
    let newMessages = [...messages];
    const hasUserQueryForCurrentResponse = newMessages.some(
      m => m.type === 'user' && m.content === query
    );

    if (query && !hasUserQueryForCurrentResponse) {
      newMessages = [...newMessages, { type: 'user', content: query }];
    }

    // Get the latest chunk as it arrives
    const latestChunk = chunks[chunks.length - 1];
    
    // Accumulate all chunks into the current message
    const currentMessageContent = chunks.join('');
    
    // Update the streaming message immediately for each new chunk
    if (currentMessageContent !== streamingMessage) {
      setStreamingMessage(currentMessageContent);
      
      // Find if we already have an assistant message that's streaming
      const streamingMessageIndex = newMessages.findIndex(
        m => m.type === 'assistant' && m.isStreaming
      );
      
      if (streamingMessageIndex >= 0) {
        // Update existing streaming message immediately with new content
        newMessages[streamingMessageIndex] = {
          ...newMessages[streamingMessageIndex],
          content: currentMessageContent
        };
      } else {
        // Add new streaming message
        newMessages = [
          ...newMessages,
          { 
            type: 'assistant', 
            content: currentMessageContent, 
            isStreaming: true 
          }
        ];
      }
      
      // Update messages immediately to show streaming content
      setMessages(newMessages);
    }
    
    // Mark message as non-streaming when loading completes
    if (!isLoading && streamingMessage) {
      setMessages(prev => 
        prev.map(msg => 
          msg.isStreaming ? { ...msg, isStreaming: false } : msg
        )
      );
    }
  }, [chunks, query, isLoading, streamingMessage, messages]);

  // Auto-scroll to bottom when new messages arrive or chunks update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, chunks, isLoading]);

  // Handle pill click - memoize to prevent rerenders
  const handlePillClick = useCallback((templateQuery: string) => {
    setQuery(templateQuery);
    
    // Focus the input element if possible
    setTimeout(() => {
      const textareaElement = document.querySelector('textarea');
      if (textareaElement) {
        textareaElement.focus();
      }
    }, 0);
  }, [setQuery]);

  return (
    <div className="flex flex-col h-full border border-border/20 rounded-xl bg-background/80 shadow-sm">
      {/* Messages area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 min-h-[350px] max-h-[500px]"
      >
        {messages.length === 0 ? (
          // Show action pills when no messages - removed heading as it's now in Dashboard
          <div className="flex flex-col h-full justify-center">
            <ActionPills onPillClick={handlePillClick} />
          </div>
        ) : (
          // Show messages when they exist
          <>
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={message.type === 'user' ? 'self-end' : 'w-full'}
              >
                <div 
                  className={`p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground max-w-[80%] ml-auto'
                      : 'bg-muted w-full'
                  }`}
                >
                  {message.type === 'user' ? (
                    message.content
                  ) : (
                    <div className="prose dark:prose-invert prose-sm max-w-none">
                      <ReactMarkdown>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && !streamingMessage && (
              <div className="w-full">
                <div className="p-3 rounded-lg bg-muted">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce animation-delay-200"></div>
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce animation-delay-400"></div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Input area */}
      <div className="border-t border-border/10 p-4">
        <AssistantInput
          query={query}
          setQuery={setQuery}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

// Memoize the component to avoid unnecessary rerenders
export default memo(ConversationView);
