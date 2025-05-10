
import React, { memo } from 'react';

interface HighlightedTextProps {
  query: string;
  onFieldClick?: (fieldType: 'stock' | 'timeframe' | 'sector', position: number) => void;
}

const HighlightedText: React.FC<HighlightedTextProps> = ({ 
  query,
  onFieldClick 
}) => {
  if (!query) {
    return (
      <span className="text-muted-foreground">
        Ask about your finances or portfolio... (Type / for commands)
      </span>
    );
  }

  // Process the query to highlight patterns with field values
  const parts = [];
  let lastIndex = 0;
  
  // Match patterns: stock:value, timeframe:value, sector:value
  const pattern = /(stock:|timeframe:|sector:)(\w+)/g;
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
    
    // Extract field type and value
    const fieldType = match[1].slice(0, -1) as 'stock' | 'timeframe' | 'sector'; // Remove the colon
    const value = match[2];
    
    // Create the visual representation showing the actual value with highlighting
    parts.push(
      <span 
        key={`field-${match.index}`} 
        className="bg-primary/10 px-1 rounded cursor-pointer text-primary"
        onClick={() => onFieldClick && onFieldClick(fieldType, match.index)}
      >
        {value}
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

// Memoize the component to prevent unnecessary re-renders
export default memo(HighlightedText, (prevProps, nextProps) => {
  // Only re-render if query changes
  return prevProps.query === nextProps.query;
});
