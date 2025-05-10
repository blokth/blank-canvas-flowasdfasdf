
import { useState, useEffect, RefObject } from 'react';

interface KeyboardHandlingProps {
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
  cursorPosition: number;
  setCursorPosition: (position: number) => void;
  handleSuggestionSelect: (value: string) => void;
  navigateToNextField: () => number;
  suggestions: Record<string, string[]>;
}

export const useKeyboardHandling = ({
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
}: KeyboardHandlingProps) => {
  // Add transitioning state to prevent multiple rapid submissions
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle command conversion on space key
    if (e.key === ' ') {
      const textBeforeCursor = query.substring(0, cursorPosition);
      const commandMatch = /\/(stock|timeframe|sector)$/.exec(textBeforeCursor);
      
      if (commandMatch) {
        e.preventDefault();
        const commandType = commandMatch[1];
        const beforeCommand = query.substring(0, cursorPosition - (commandType.length + 1)); // +1 for the '/'
        const afterCommand = query.substring(cursorPosition);
        
        // Replace command with pattern format
        const newQuery = beforeCommand + commandType + ':' + afterCommand;
        setQuery(newQuery);
        
        // Set cursor position right after the colon
        setTimeout(() => {
          const newCursorPosition = beforeCommand.length + commandType.length + 1; // +1 for the ':'
          if (textareaRef.current) {
            textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
            setCursorPosition(newCursorPosition);
            
            // Show suggestions when positioning after colon
            setSuggestionType(commandType as 'stock' | 'timeframe' | 'sector');
            setShowSuggestions(true);
            setSearchTerm('');
          }
        }, 0);
        return;
      }
    }
    
    // Handle tab navigation between template fields
    if (e.key === 'Tab') {
      e.preventDefault();
      navigateToNextField();
      setSearchTerm('');
      return;
    }
    
    // When suggestions are shown, Enter key behavior is managed in InputArea component
    if (e.key === 'Enter' && !e.shiftKey) {
      // Check if we're after a field: pattern
      if (/(stock|timeframe|sector):$/.test(query.substring(0, cursorPosition))) {
        e.preventDefault();
        const fieldMatch = /(stock|timeframe|sector):$/.exec(query.substring(0, cursorPosition));
        if (fieldMatch) {
          const fieldType = fieldMatch[1] as 'stock' | 'timeframe' | 'sector';
          setSuggestionType(fieldType);
          setShowSuggestions(true);
          setSearchTerm('');
        }
        
        navigateToNextField();
        return;
      }
      
      // Don't submit during transitions
      if (isTransitioning) {
        e.preventDefault();
        return;
      }
      
      // Only submit if there are no suggestions showing
      if (!showSuggestions) {
        e.preventDefault();
        if (query.trim() && !isLoading) {
          // Set transitioning state to prevent multiple submissions
          setIsTransitioning(true);
          onSubmit(e as unknown as React.FormEvent);
          
          // Reset after animation would complete
          setTimeout(() => {
            setIsTransitioning(false);
          }, 1100);
        }
      }
      return;
    }
    
    // Handle tab completion
    if (e.key === 'Tab' && showSuggestions) {
      e.preventDefault();
      
      if (suggestionType && searchTerm) {
        const matches = suggestions[suggestionType].filter(item => 
          item.toLowerCase().startsWith(searchTerm.toLowerCase()));
        
        if (matches.length > 0) {
          handleSuggestionSelect(matches[0]);
        }
      }
    }
    
    // Close suggestions on Escape
    if (e.key === 'Escape' && showSuggestions) {
      e.preventDefault();
      setShowSuggestions(false);
    }
  };

  return {
    handleKeyDown,
    isTransitioning,
    setIsTransitioning
  };
};
