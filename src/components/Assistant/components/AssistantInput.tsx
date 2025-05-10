
import React, { useRef, useState, useEffect } from 'react';
import InputArea from './InputComponents/InputArea';
import { useSuggestions, suggestions } from './InputComponents/useSuggestions';

interface AssistantInputProps {
  query: string;
  setQuery: (query: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const AssistantInput: React.FC<AssistantInputProps> = ({
  query,
  setQuery,
  onSubmit,
  isLoading,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  
  // Use the extracted suggestions hook
  const { suggestionType, searchTerm, setSearchTerm, templateField } = useSuggestions({
    query,
    cursorPosition,
    showSuggestions,
    setShowSuggestions
  });

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
      setCursorPosition(textareaRef.current.selectionStart);
    }
  }, [query]);

  // Move to next template field
  const moveToNextTemplateField = () => {
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
      setCursorPosition(newPosition);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle tab navigation between template fields
    if (e.key === 'Tab') {
      e.preventDefault();
      moveToNextTemplateField();
      return;
    }
    
    // When suggestions are shown, Enter key behavior is managed in InputArea component
    if (e.key === 'Enter' && !e.shiftKey) {
      // Check if we're in a template field
      if (templateField) {
        e.preventDefault();
        moveToNextTemplateField();
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

  // Handle click on a suggestion
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
          moveToNextTemplateField();
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

  // Filter suggestions based on search term
  const filteredSuggestions = suggestionType 
    ? suggestions[suggestionType].filter(item => 
        item.toLowerCase().includes(searchTerm.toLowerCase()))
    : ['stock', 'sector', 'timeframe'].filter(item => 
        item.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <form onSubmit={onSubmit} className="bg-background border border-border/20 rounded-xl shadow-sm">
      <div className="flex flex-col gap-2 p-2">
        <InputArea
          query={query}
          setQuery={setQuery}
          isLoading={isLoading}
          handleSubmit={onSubmit}
          handleKeyDown={handleKeyDown}
          handleChange={handleChange}
          showSuggestions={showSuggestions}
          suggestionType={suggestionType}
          filteredSuggestions={filteredSuggestions}
          handleSuggestionSelect={handleSuggestionSelect}
          textareaRef={textareaRef}
          templateField={templateField}
        />
      </div>
    </form>
  );
};

export default AssistantInput;
