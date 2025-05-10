import React, { useEffect, useRef, useMemo } from 'react';

interface ConversationViewProps {
  chunks: string[];
  isLoading: boolean;
}

const ConversationView: React.FC<ConversationViewProps> = ({
  chunks,
  isLoading
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new chunks arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chunks]);

  // Process chunks to deduplicate and combine them properly
  const processedChunks = useMemo(() => {
    if (chunks.length === 0) return [];
    
    // Simple deduplication - keep only unique messages
    const uniqueChunks = Array.from(new Set(chunks));
    
    // If the chunks appear to be part of a continuous message,
    // combine them into a single message
    if (uniqueChunks.length === 1) {
      return uniqueChunks;
    }
    
    return uniqueChunks;
  }, [chunks]);

  if (processedChunks.length === 0) {
    return null;
  }

  return (
    <div 
      ref={scrollRef}
      className="max-h-[300px] overflow-y-auto bg-background/80 rounded-lg border border-border/5 p-4 mb-4"
    >
      {processedChunks.map((chunk, index) => (
        <div key={index} className="mb-2 text-sm">
          {chunk}
        </div>
      ))}
      {isLoading && (
        <div className="text-sm text-muted-foreground animate-pulse">
          Typing...
        </div>
      )}
    </div>
  );
};

export default ConversationView;
