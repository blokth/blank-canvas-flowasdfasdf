
import React from 'react';
import HighlightedText from './HighlightedText';

interface InputDisplayProps {
  query: string;
  cursorPosition?: number;
}

const InputDisplay: React.FC<InputDisplayProps> = ({ query, cursorPosition }) => {
  return (
    <div className="resize-none text-sm border-0 focus-visible:ring-0 shadow-none min-h-10 py-3 bg-transparent pr-10 whitespace-pre-wrap relative">
      <HighlightedText query={query} />
      
      {typeof cursorPosition === 'number' && (
        <span 
          className="absolute inline-block w-0.5 bg-primary animate-pulse" 
          style={{
            height: '1.2rem',
            left: `calc(${getCharacterOffset(query, cursorPosition)}ch)`,
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        />
      )}
    </div>
  );
};

// Helper function to calculate cursor position, accounting for variable-width characters
function getCharacterOffset(text: string, position: number): number {
  if (!text || position === 0) return 0;
  
  // Use the text before cursor to calculate position
  const beforeCursor = text.substring(0, position);
  
  // For simple implementation, we'll use character count
  // In a more advanced implementation, you would use canvas to measure actual text width
  return beforeCursor.length;
}

export default InputDisplay;
