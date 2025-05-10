
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
  
  // Find all the template fields
  const matches = [];
  while ((match = fieldPattern.exec(query)) !== null) {
    matches.push({
      fieldType: match[1] as 'stock' | 'timeframe' | 'sector',
      position: match.index + match[0].length,
      index: match.index
    });
  }
  
  // If no matches, return the current cursor position
  if (matches.length === 0) {
    return cursorPosition;
  }
  
  // Find the current field based on cursor position
  let currentFieldIndex = -1;
  for (let i = 0; i < matches.length; i++) {
    const fieldStart = matches[i].index;
    const fieldEnd = i < matches.length - 1 ? matches[i + 1].index : query.length;
    
    if (cursorPosition >= fieldStart && cursorPosition < fieldEnd) {
      currentFieldIndex = i;
      break;
    }
  }
  
  // Determine the next field index (wrap around if necessary)
  const nextFieldIndex = currentFieldIndex === -1 || currentFieldIndex === matches.length - 1 
    ? 0 
    : currentFieldIndex + 1;
  
  // Navigate to the next field
  const nextField = matches[nextFieldIndex];
  
  // Move cursor to the beginning of the next field
  if (nextField && textareaRef.current) {
    const newPosition = nextField.position;
    textareaRef.current.focus();
    textareaRef.current.setSelectionRange(newPosition, newPosition);
    
    // Show suggestions for this field type if the callbacks are provided
    if (setShowSuggestions && setSuggestionType) {
      setSuggestionType(nextField.fieldType);
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
