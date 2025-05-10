
import React from 'react';
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
  return (
    <div className="resize-none text-sm border-0 focus-visible:ring-0 shadow-none min-h-10 py-3 bg-transparent pr-10 whitespace-pre-wrap">
      <HighlightedText query={query} />
      
      {isStreaming && streamingChunks && streamingChunks.length > 0 && (
        <div className="mt-4 pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Assistant is typing...</p>
          <div className="text-sm whitespace-pre-wrap">
            {streamingChunks.join('')}
          </div>
        </div>
      )}
    </div>
  );
};

export default InputDisplay;
