
import { useState, useEffect, RefObject } from 'react';
import { useTemplateNavigation } from './hooks/useTemplateNavigation';
import { useSuggestionSelection } from './hooks/useSuggestionSelection';
import { useKeyboardHandling } from './hooks/useKeyboardHandling';
import { useCursorHandling } from './hooks/useCursorHandling';
import { useSuggestionFiltering } from './hooks/useSuggestionFiltering';
import { suggestions } from './useSuggestions';

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
  const { navigateToNextField, navigateToField } = useTemplateNavigation({
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
  
  return {
    handleKeyDown,
    handleChange,
    handleSuggestionSelect,
    getFilteredSuggestions: () => filteredSuggestions,
    handleFieldClick
  };
};
