
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

  // Process the query to extract just values
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
    
    // Add just the keyword value (e.g., TSLA instead of stock:TSLA)
    if (match[2]) {
      parts.push(
        <span 
          key={`value-${match.index}`} 
          className="text-primary font-semibold"
        >
          {match[2]}
        </span>
      );
    } else {
      // If no value after colon, still show the prefix (stock:, timeframe:, etc.)
      parts.push(
        <span 
          key={`keyword-${match.index}`} 
          className="text-primary font-semibold"
        >
          {match[1]}
        </span>
      );
    }
    
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
