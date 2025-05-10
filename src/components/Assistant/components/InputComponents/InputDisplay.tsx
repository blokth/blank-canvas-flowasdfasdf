
import React, { useEffect, useRef } from 'react';
import HighlightedText from './HighlightedText';

interface InputDisplayProps {
  query: string;
  streamingChunks?: string[];
  isStreaming?: boolean;
}

const InputDisplay: React.FC<InputDisplayProps> = ({ 
  query,
  streamingChunks,
  isStreaming
}) => {
  // Reference to the streaming content div for auto-scrolling
  const streamingContentRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new content arrives
  useEffect(() => {
    if (streamingContentRef.current && isStreaming) {
      streamingContentRef.current.scrollTop = streamingContentRef.current.scrollHeight;
    }
  }, [streamingChunks, isStreaming]);
  
  return (
    <div className="resize-none text-sm border-0 focus-visible:ring-0 shadow-none min-h-10 py-3 bg-transparent pr-10 whitespace-pre-wrap">
      <HighlightedText query={query} />
      
      {isStreaming && (
        <div className="mt-4 pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Assistant is typing...</p>
          <div 
            ref={streamingContentRef}
            className="text-sm whitespace-pre-wrap max-h-[400px] overflow-y-auto"
          >
            {streamingChunks && streamingChunks.join('')}
          </div>
        </div>
      )}
    </div>
  );
};

export default InputDisplay;
