
import React from 'react';
import HighlightedText from './HighlightedText';

interface InputDisplayProps {
  query: string;
  cursorPosition: number;
}

const InputDisplay: React.FC<InputDisplayProps> = ({ query, cursorPosition }) => {
  return (
    <div className="resize-none text-sm border-0 focus-visible:ring-0 shadow-none min-h-10 py-3 bg-transparent pr-10 whitespace-pre-wrap pointer-events-none">
      <HighlightedText query={query} />
      {/* Render cursor */}
      {cursorPosition !== undefined && (
        <span
          className="absolute h-5 w-0.5 bg-primary animate-blink"
          style={{
            left: `${cursorPosition}ch`,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'inline-block',
          }}
        />
      )}
    </div>
  );
};

export default InputDisplay;
