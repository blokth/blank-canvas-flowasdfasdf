
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ConversationViewProps {
  chunks: string[];
  isLoading: boolean;
}

const ConversationView: React.FC<ConversationViewProps> = ({ chunks, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new content arrives
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chunks]);

  if (chunks.length === 0) {
    return null;
  }

  return (
    <div className="border border-border/20 rounded-lg p-4 bg-background/80">
      <div 
        ref={scrollRef}
        className="max-h-[300px] overflow-y-auto"
      >
        {chunks.length > 0 && (
          <div className="flex items-start mb-4">
            <div className="flex-shrink-0 rounded-full bg-primary w-8 h-8 flex items-center justify-center text-primary-foreground text-sm font-medium mr-3">
              A
            </div>
            <div className="text-sm whitespace-pre-wrap">
              {chunks.join('')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationView;
