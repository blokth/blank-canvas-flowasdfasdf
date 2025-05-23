
import { RefObject } from 'react';
import { moveToNextTemplateField, findFirstTemplateField, getAllTemplateFields } from '../TemplateNavigator';

interface TemplateNavigationProps {
  query: string;
  cursorPosition: number;
  textareaRef: RefObject<HTMLTextAreaElement>;
  setShowSuggestions: (show: boolean) => void;
  setSuggestionType: (type: 'stock' | 'timeframe' | 'sector' | null) => void;
  setCursorPosition: (position: number) => void;
}

export const useTemplateNavigation = ({
  query,
  cursorPosition,
  textareaRef,
  setShowSuggestions,
  setSuggestionType,
  setCursorPosition
}: TemplateNavigationProps) => {
  // Navigate to the next field when Tab key is pressed
  const navigateToNextField = () => {
    const newPosition = moveToNextTemplateField(
      query,
      cursorPosition,
      textareaRef,
      setShowSuggestions,
      setSuggestionType
    );
    setCursorPosition(newPosition);
    return newPosition;
  };

  // Navigate to the first field in the template
  const navigateToFirstField = () => {
    const firstField = findFirstTemplateField(query);
    
    if (firstField && textareaRef.current) {
      const newPosition = firstField.position;
      
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(newPosition, newPosition);
      
      // Show suggestions for this field type
      setSuggestionType(firstField.fieldType);
      setShowSuggestions(true);
      
      setCursorPosition(newPosition);
      return newPosition;
    }
    
    return cursorPosition;
  };

  // Position cursor after specific field type
  const navigateToField = (fieldType: 'stock' | 'timeframe' | 'sector', position: number) => {
    if (textareaRef.current) {
      // Calculate the exact position after the field: prefix
      const fieldLength = fieldType.length + 1; // +1 for colon
      const cursorPos = position + fieldLength;
      
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(cursorPos, cursorPos);
      setCursorPosition(cursorPos);
      
      // Show suggestions for this field type
      setSuggestionType(fieldType);
      setShowSuggestions(true);
      
      return cursorPos;
    }
    return position;
  };

  return {
    navigateToNextField,
    navigateToField,
    navigateToFirstField
  };
};
