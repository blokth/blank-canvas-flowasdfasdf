
import React from 'react';
import HighlightedText from './HighlightedText';

interface InputDisplayProps {
  query: string;
  onFieldClick?: (fieldType: 'stock' | 'timeframe' | 'sector', position: number) => void;
}

const InputDisplay: React.FC<InputDisplayProps> = ({ 
  query,
  onFieldClick
}) => {
  return (
    <div className="resize-none text-sm border-0 focus-visible:ring-0 shadow-none min-h-10 py-3 bg-transparent pr-10 whitespace-pre-wrap rounded-md">
      <HighlightedText query={query} onFieldClick={onFieldClick} />
    </div>
  );
};

export default InputDisplay;
