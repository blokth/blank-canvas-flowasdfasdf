
// Utility for navigating between template fields in the assistant input

/**
 * Navigate to the next template field in the query string
 */
export const moveToNextTemplateField = (
  query: string,
  cursorPosition: number,
  textareaRef: React.RefObject<HTMLTextAreaElement>,
  setShowSuggestions?: (show: boolean) => void,
  setSuggestionType?: (type: 'stock' | 'timeframe' | 'sector' | null) => void
) => {
  const fieldPattern = /(stock|timeframe|sector):/g;
  let match;
  let firstMatch = null;
  let nextMatch = null;
  
  // Find the next template field after the cursor
  while ((match = fieldPattern.exec(query)) !== null) {
    if (firstMatch === null) {
      firstMatch = match;
    }
    
    if (match.index > cursorPosition) {
      nextMatch = match;
      break;
    }
  }
  
  // If no next match but we have a first match, cycle back to beginning
  if (!nextMatch && firstMatch) {
    nextMatch = firstMatch;
  }
  
  // Move cursor to the beginning of the next template field
  if (nextMatch && textareaRef.current) {
    const fieldType = nextMatch[1] as 'stock' | 'timeframe' | 'sector';
    const newPosition = nextMatch.index + nextMatch[0].length;
    textareaRef.current.focus();
    textareaRef.current.setSelectionRange(newPosition, newPosition);
    
    // Show suggestions for this field type if the callbacks are provided
    if (setShowSuggestions && setSuggestionType) {
      setSuggestionType(fieldType);
      setShowSuggestions(true);
    }
    
    return newPosition;
  }
  
  return cursorPosition;
};

/**
 * Find the first template field in the query string
 */
export const findFirstTemplateField = (
  query: string
) => {
  const fieldPattern = /(stock|timeframe|sector):/g;
  const match = fieldPattern.exec(query);
  
  if (match) {
    return {
      fieldType: match[1] as 'stock' | 'timeframe' | 'sector',
      position: match.index + match[0].length,
      index: match.index
    };
  }
  
  return null;
};

/**
 * Get all template fields in order
 */
export const getAllTemplateFields = (
  query: string
) => {
  const fieldPattern = /(stock|timeframe|sector):/g;
  const fields = [];
  let match;
  
  while ((match = fieldPattern.exec(query)) !== null) {
    fields.push({
      fieldType: match[1] as 'stock' | 'timeframe' | 'sector',
      position: match.index + match[0].length,
      index: match.index
    });
  }
  
  return fields;
};
