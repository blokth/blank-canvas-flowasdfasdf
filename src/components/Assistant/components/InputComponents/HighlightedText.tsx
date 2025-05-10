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

  // Process the query to highlight the patterns, but keep the full patterns intact
  const parts = [];
  let lastIndex = 0;
  
  // Match any patterns: stock:, timeframe:, sector:
  const pattern = /(stock:|timeframe:|sector:)(\w*)/g;
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
    
    // Add the full pattern (e.g., stock:TSLA) as highlighted text
    parts.push(
      <span 
        key={`value-${match.index}`} 
        className="text-primary font-semibold"
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
