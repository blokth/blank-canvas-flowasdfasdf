
import { useState, useEffect, RefObject } from 'react';
import { moveToNextTemplateField } from './TemplateNavigator';
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
  searchTerm: string;
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
  searchTerm,
  templateField,
  cursorPosition,
  setCursorPosition
}: InputHandlersProps) => {
  
  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
      setCursorPosition(textareaRef.current.selectionStart);
    }
  }, [query, setCursorPosition, textareaRef]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle tab navigation between template fields
    if (e.key === 'Tab') {
      e.preventDefault();
      const newPosition = moveToNextTemplateField(query, cursorPosition, textareaRef);
      setCursorPosition(newPosition);
      return;
    }
    
    // When suggestions are shown, Enter key behavior is managed in InputArea component
    if (e.key === 'Enter' && !e.shiftKey) {
      // Check if we're in a template field
      if (templateField) {
        e.preventDefault();
        const newPosition = moveToNextTemplateField(query, cursorPosition, textareaRef);
        setCursorPosition(newPosition);
        return;
      }
      
      // Only submit if there are no suggestions showing
      if (!showSuggestions) {
        e.preventDefault();
        if (query.trim() && !isLoading) {
          onSubmit(e as unknown as React.FormEvent);
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
    
    // Update cursor position on arrow keys
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      // Use setTimeout to get updated cursor position after default action
      setTimeout(() => {
        if (textareaRef.current) {
          setCursorPosition(textareaRef.current.selectionStart);
        }
      }, 0);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
    
    // Update cursor position
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart);
    }
  };

  const handleSuggestionSelect = (value: string) => {
    // Handle template field selections
    if (templateField) {
      // Replace the template field with the selected value
      const beforeTemplate = query.substring(0, query.indexOf(templateField));
      const afterTemplate = query.substring(query.indexOf(templateField) + templateField.length);
      const newQuery = beforeTemplate + value + afterTemplate;
      setQuery(newQuery);
      
      // Set cursor position after the inserted value
      setTimeout(() => {
        if (textareaRef.current) {
          const newPosition = beforeTemplate.length + value.length;
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newPosition, newPosition);
          setCursorPosition(newPosition);
          moveToNextTemplateField(newQuery, newPosition, textareaRef);
        }
      }, 0);
      setShowSuggestions(false);
      return;
    }
    
    if (!suggestionType) {
      // Handle command quick templates
      const templates: Record<string, string> = {
        'stock': 'Show me data for {{stock}}',
        'sector': 'Show performance of {{sector}}',
        'timeframe': 'Show data for the past {{timeframe}}'
      };
      
      if (templates[value.toLowerCase()]) {
        const template = templates[value.toLowerCase()];
        // Insert at cursor position
        const newQuery = query.substring(0, cursorPosition - (searchTerm.length + 1)) + 
                        template + 
                        query.substring(cursorPosition);
        setQuery(newQuery);
        
        // Set cursor position to the first template field
        setTimeout(() => {
          const fieldPattern = /\{\{(stock|timeframe|sector)\}\}/;
          const match = fieldPattern.exec(newQuery);
          
          if (match && textareaRef.current) {
            const fieldPos = match.index;
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(fieldPos, fieldPos + match[0].length);
            setCursorPosition(fieldPos);
          } else if (textareaRef.current) {
            const newPosition = cursorPosition - (searchTerm.length + 1) + template.length;
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(newPosition, newPosition);
            setCursorPosition(newPosition);
          }
        }, 0);
      }
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
        }
      }, 0);
    }
    
    setShowSuggestions(false);
  };

  // Get filtered suggestions based on search term
  const getFilteredSuggestions = () => {
    return suggestionType 
      ? suggestions[suggestionType].filter(item => 
          item.toLowerCase().includes(searchTerm.toLowerCase()))
      : ['stock', 'sector', 'timeframe'].filter(item => 
          item.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  return {
    handleKeyDown,
    handleChange,
    handleSuggestionSelect,
    getFilteredSuggestions
  };
};
