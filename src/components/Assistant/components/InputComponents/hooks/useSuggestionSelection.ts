
import { RefObject } from 'react';

interface SuggestionSelectionProps {
  query: string;
  setQuery: (query: string) => void;
  textareaRef: RefObject<HTMLTextAreaElement>;
  cursorPosition: number;
  setCursorPosition: (position: number) => void;
  setShowSuggestions: (show: boolean) => void;
  suggestionType: 'stock' | 'timeframe' | 'sector' | null;
  searchTerm: string;
}

export const useSuggestionSelection = ({
  query,
  setQuery,
  textareaRef,
  cursorPosition,
  setCursorPosition,
  setShowSuggestions,
  suggestionType,
  searchTerm
}: SuggestionSelectionProps) => {
  
  const handleSuggestionSelect = (value: string) => {
    // Handle field: style selections
    if (/(stock|timeframe|sector):$/.test(query.substring(0, cursorPosition))) {
      // Find the field: pattern before the cursor
      const match = /(stock|timeframe|sector):$/.exec(query.substring(0, cursorPosition));
      if (match) {
        const field = match[0];
        const fieldPos = query.substring(0, cursorPosition).lastIndexOf(field);
        
        // Insert the selected value after the field:
        const beforeField = query.substring(0, fieldPos + field.length);
        const afterCursor = query.substring(cursorPosition);
        const newQuery = beforeField + value + afterCursor;
        
        setQuery(newQuery);
        
        // Set cursor position AFTER the inserted value
        setTimeout(() => {
          if (textareaRef.current) {
            const newPosition = fieldPos + field.length + value.length;
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(newPosition, newPosition);
            setCursorPosition(newPosition);
            
            // After inserting, hide suggestions by default
            setShowSuggestions(false);
          }
        }, 0);
        return;
      }
    }
    
    // Extract value from pattern like stock:AAPL to find field type
    const fieldValuePattern = /(stock|timeframe|sector):(\w*)/.exec(query.substring(0, cursorPosition));
    if (fieldValuePattern && suggestionType) {
      const fieldType = fieldValuePattern[1];
      const fieldWithColon = fieldType + ':';
      const fieldStartPos = query.substring(0, cursorPosition).lastIndexOf(fieldWithColon);
      const fieldEndPos = fieldStartPos + fieldWithColon.length + (fieldValuePattern[2] || '').length;
      
      // Replace existing value with new selection
      const beforeField = query.substring(0, fieldStartPos + fieldWithColon.length);
      const afterField = query.substring(fieldEndPos);
      const newQuery = beforeField + value + afterField;
      
      setQuery(newQuery);
      
      // Position cursor after the inserted value
      setTimeout(() => {
        if (textareaRef.current) {
          const newPosition = fieldStartPos + fieldWithColon.length + value.length;
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newPosition, newPosition);
          setCursorPosition(newPosition);
          
          // Hide suggestions after selection
          setShowSuggestions(false);
        }
      }, 0);
      return;
    }
    
    if (!suggestionType) {
      // Handle command quick templates - replace the slash command with the pattern
      const commandType = value.toLowerCase();
      const beforeSlashCommand = query.substring(0, cursorPosition - (searchTerm.length + 1)); // +1 for the '/'
      const afterSlashCommand = query.substring(cursorPosition);
      const newQuery = beforeSlashCommand + commandType + ':' + afterSlashCommand;
      
      setQuery(newQuery);
      
      // Set cursor position after the colon
      setTimeout(() => {
        if (textareaRef.current) {
          const newCursorPosition = beforeSlashCommand.length + commandType.length + 1; // +1 for the colon
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
          setCursorPosition(newCursorPosition);
          
          // Show suggestions for this field type
          setSuggestionType(commandType as 'stock' | 'timeframe' | 'sector');
          setShowSuggestions(true);
          setSearchTerm('');
        }
      }, 0);
    } else {
      // Replace the search term with the selected suggestion
      const beforePattern = query.substring(0, cursorPosition - searchTerm.length);
      const afterPattern = query.substring(cursorPosition);
      const newQuery = beforePattern + value + afterPattern;
      setQuery(newQuery);
      
      // Set cursor position after the inserted suggestion
      setTimeout(() => {
        if (textareaRef.current) {
          const newPosition = beforePattern.length + value.length;
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newPosition, newPosition);
          setCursorPosition(newPosition);
          
          // Hide suggestions after selection
          setShowSuggestions(false);
        }
      }, 0);
    }
  };

  // Add function to set SearchTerm
  const setSuggestionType = (type: 'stock' | 'timeframe' | 'sector' | null) => {
    // This function will be provided by the parent component
  };

  // Add function to set SearchTerm
  const setSearchTerm = (term: string) => {
    // This function will be provided by the parent component
  };
  
  return {
    handleSuggestionSelect
  };
};
