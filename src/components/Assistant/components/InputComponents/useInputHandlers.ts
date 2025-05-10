
import { useState, useEffect, RefObject, useCallback } from 'react';
import { useTemplateNavigation } from './hooks/useTemplateNavigation';
import { useSuggestionSelection } from './hooks/useSuggestionSelection';
import { useKeyboardHandling } from './hooks/useKeyboardHandling';
import { useCursorHandling } from './hooks/useCursorHandling';
import { useSuggestionFiltering } from './hooks/useSuggestionFiltering';
import { suggestions } from './useSuggestions';
import { findFirstTemplateField } from './TemplateNavigator';

interface InputHandlersProps {
  query: string;
  setQuery: (query: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  textareaRef: RefObject<HTMLTextAreaElement>;
  isLoading: boolean;
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  suggestionType: 'stock' | 'timeframe' | 'sector' | null;
  setSuggestionType: (type: 'stock' | 'timeframe' | 'sector' | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  templateField: string | null;
  cursorPosition: number;
  setCursorPosition: (position: number) => void;
}

export const useInputHandlers = ({
  query,
  setQuery,
  onSubmit,
  textareaRef,
  isLoading,
  showSuggestions,
  setShowSuggestions,
  suggestionType,
  setSuggestionType,
  searchTerm,
  setSearchTerm,
  templateField,
  cursorPosition,
  setCursorPosition
}: InputHandlersProps) => {
  // Use template navigation logic
  const { navigateToNextField, navigateToField, navigateToFirstField } = useTemplateNavigation({
    query,
    cursorPosition,
    textareaRef,
    setShowSuggestions,
    setSuggestionType,
    setCursorPosition
  });
  
  // Use suggestion selection logic - pass the setSuggestionType and setSearchTerm
  const { handleSuggestionSelect } = useSuggestionSelection({
    query,
    setQuery,
    textareaRef,
    cursorPosition,
    setCursorPosition,
    setShowSuggestions,
    suggestionType,
    searchTerm,
    setSuggestionType,
    setSearchTerm
  });
  
  // Use keyboard handling logic
  const { handleKeyDown } = useKeyboardHandling({
    query,
    setQuery,
    onSubmit,
    textareaRef,
    isLoading,
    showSuggestions,
    setShowSuggestions,
    suggestionType,
    setSuggestionType,
    searchTerm,
    setSearchTerm,
    cursorPosition,
    setCursorPosition,
    handleSuggestionSelect,
    navigateToNextField,
    suggestions
  });
  
  // Use cursor handling logic
  const { handleChange: handleCursorChange } = useCursorHandling({
    query,
    textareaRef,
    setCursorPosition,
    setShowSuggestions,
    setSuggestionType,
    setSearchTerm,
    showSuggestions
  });

  // Use suggestion filtering logic
  const { filteredSuggestions } = useSuggestionFiltering({
    suggestionType,
    searchTerm
  });

  // Navigate to the first field when a template is selected or created
  useEffect(() => {
    // Check if the query contains a template pattern and cursor is at start or end
    const hasTemplatePattern = /(stock|timeframe|sector):/.test(query);
    const isAtStartOrEnd = cursorPosition === 0 || cursorPosition === query.length;
    
    if (hasTemplatePattern && isAtStartOrEnd) {
      // Find the first template field
      const firstField = findFirstTemplateField(query);
      
      if (firstField) {
        // Small delay to let the UI update
        setTimeout(() => {
          if (textareaRef.current) {
            const newPosition = firstField.position;
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(newPosition, newPosition);
            setCursorPosition(newPosition);
            
            // Show suggestions for this field type
            setSuggestionType(firstField.fieldType);
            setShowSuggestions(true);
          }
        }, 10);
      }
    }
  }, [query, setCursorPosition, setSuggestionType, setShowSuggestions, textareaRef]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    handleCursorChange(e);
  };

  // Field click handler (for visual highlighting)
  const handleFieldClick = (fieldType: 'stock' | 'timeframe' | 'sector', position: number) => {
    navigateToField(fieldType, position);
  };
  
  // Get filtered suggestions - memoized to avoid recalculation
  const getFilteredSuggestions = useCallback(() => {
    return filteredSuggestions;
  }, [filteredSuggestions]);
  
  return {
    handleKeyDown,
    handleChange,
    handleSuggestionSelect,
    getFilteredSuggestions,
    handleFieldClick,
    navigateToFirstField
  };
};
