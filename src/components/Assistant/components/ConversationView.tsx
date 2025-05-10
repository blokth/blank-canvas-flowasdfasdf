
import React, { useEffect, useRef } from 'react';

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

  if (chunks.length === 0) {
    return null;
  }

  return (
    <div 
      ref={scrollRef}
      className="max-h-[300px] overflow-y-auto bg-background/80 rounded-lg border border-border/5 p-4 mb-4"
    >
      {chunks.map((chunk, index) => (
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
