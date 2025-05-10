
import React from 'react';

interface HighlightedTextProps {
  query: string;
}

const HighlightedText: React.FC<HighlightedTextProps> = ({ query }) => {
  if (!query) {
    return (
      <span className="text-muted-foreground">
        Ask about your finances or portfolio... (Type / for commands)
      </span>
    );
  }

  const parts = [];
  const pattern = /(\{\{(stock|timeframe|sector)\}\})/g;
  let lastIndex = 0;
  let match;
  
  while ((match = pattern.exec(query)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {query.substring(lastIndex, match.index)}
        </span>
      );
    }
    
    // Add highlighted template field
    parts.push(
      <span 
        key={`field-${match.index}`} 
        className="bg-primary/20 text-primary rounded px-1"
      >
        {match[0]}
      </span>
    );
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add any remaining text
  if (lastIndex < query.length) {
    parts.push(
      <span key={`text-${lastIndex}`}>
        {query.substring(lastIndex)}
      </span>
    );
  }
  
  return <>{parts}</>;
};

export default HighlightedText;
