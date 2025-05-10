
// Utility for navigating between template fields in the assistant input

/**
 * Navigate to the next template field in the query string
 */
export const moveToNextTemplateField = (
  query: string,
  cursorPosition: number,
  textareaRef: React.RefObject<HTMLTextAreaElement>
) => {
  const fieldPattern = /\{\{(stock|timeframe|sector)\}\}/g;
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
    const newPosition = nextMatch.index;
    textareaRef.current.focus();
    textareaRef.current.setSelectionRange(newPosition, newPosition + nextMatch[0].length);
    return newPosition;
  }
  
  return cursorPosition;
};
