
import React, { memo, useEffect, useRef, useState } from 'react';
import AssistantInput from './AssistantInput';
import { VisualizationType } from './VisualizationManager';
import { useToast } from '../../../hooks/use-toast';

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
  const conversationRef = useRef<HTMLDivElement>(null);
  const [displayedText, setDisplayedText] = useState<string>('');
  
  // Process chunks as they come in
  useEffect(() => {
    console.log('Processing chunks in ConversationView:', chunks);
    if (chunks.length > 0) {
      // Take the latest chunk for now (simple streaming display)
      setDisplayedText(chunks[chunks.length - 1]);
    }
  }, [chunks]);
  
  return (
    <div className="flex flex-col h-full border border-border/20 rounded-xl bg-background/80 shadow-sm">
      {/* Messages area */}
      {displayedText && (
        <div 
          className="flex-1 overflow-y-auto p-4"
          ref={conversationRef}
        >
          <div className="prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ __html: displayedText.replace(/\n/g, '<br />') }} />
          </div>
        </div>
      )}
      
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
