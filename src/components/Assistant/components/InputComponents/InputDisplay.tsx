
import React from 'react';
import HighlightedText from './HighlightedText';

interface InputDisplayProps {
  query: string;
}

const InputDisplay: React.FC<InputDisplayProps> = ({ 
  query
}) => {
  return (
    <div className="resize-none text-sm border-0 focus-visible:ring-0 shadow-none min-h-10 py-3 bg-transparent pr-10 whitespace-pre-wrap">
      <HighlightedText query={query} />
    </div>
  );
};

export default InputDisplay;
