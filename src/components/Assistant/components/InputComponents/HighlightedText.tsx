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

  // First process the query string to extract keyword values
  const processedQuery = processQueryKeywords(query);
  
  const parts = [];
  let lastIndex = 0;
  
  // Match any remaining patterns that weren't processed
  const pattern = /(stock:|timeframe:|sector:)(\w*)/g;
  let match;
  
  while ((match = pattern.exec(processedQuery)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {processedQuery.substring(lastIndex, match.index)}
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
  if (lastIndex < processedQuery.length) {
    parts.push(
      <span key={`text-${lastIndex}`}>
        {processedQuery.substring(lastIndex)}
      </span>
    );
  }
  
  return <>{parts}</>;
};

// Helper function to process the query string and extract keyword values
function processQueryKeywords(input: string): string {
  // This is where we transform the actual text before rendering
  // For now we're keeping the original format in the underlying text
  // but returning the formatted version for display
  return input;
}

export default HighlightedText;
