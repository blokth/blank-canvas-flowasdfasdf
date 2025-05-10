
import React, { useRef, useState } from 'react';
import CommandButtons from './InputComponents/CommandButtons';
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
  
  // Command buttons for quick access - removed "Compare" and "Forecast"
  const commandButtons = [
    { label: "Stock", command: "stock:" },
    { label: "Timeframe", command: "timeframe:" },
    { label: "Sector", command: "sector:" },
  ];
  
  // Use the extracted suggestions hook
  const { suggestionType, searchTerm, setSearchTerm } = useSuggestions({
    query,
    cursorPosition,
    showSuggestions,
    setShowSuggestions
  });

  // Auto-resize textarea height
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
      setCursorPosition(textareaRef.current.selectionStart);
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // When suggestions are shown, Enter key behavior is managed in InputArea component
    if (e.key === 'Enter' && !e.shiftKey) {
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
    if (!suggestionType) {
      // Handle command quick templates
      const templates: Record<string, string> = {
        'stock': 'Show me data for stock:',
        'sector': 'Show performance of sector:'
      };
      
      if (templates[value.toLowerCase()]) {
        const template = templates[value.toLowerCase()];
        // Insert at cursor position
        const newQuery = query.substring(0, cursorPosition - (searchTerm.length + 1)) + 
                        template + 
                        query.substring(cursorPosition);
        setQuery(newQuery);
        
        // Set cursor position after the template
        setTimeout(() => {
          if (textareaRef.current) {
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

  // Handle click on a command button
  const handleCommandClick = (command: string) => {
    // Insert command at cursor position or at the end if no cursor
    const insertPosition = cursorPosition || query.length;
    const newQuery = query.substring(0, insertPosition) + command + query.substring(insertPosition);
    setQuery(newQuery);
    
    // Set cursor position after the inserted command
    setTimeout(() => {
      if (textareaRef.current) {
        const newPosition = insertPosition + command.length;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newPosition, newPosition);
        setCursorPosition(newPosition);
      }
    }, 0);
  };

  // Filter suggestions based on search term
  const filteredSuggestions = suggestionType 
    ? suggestions[suggestionType].filter(item => 
        item.toLowerCase().includes(searchTerm.toLowerCase()))
    : ['stock', 'sector'].filter(item => 
        item.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <form onSubmit={onSubmit} className="bg-background border border-border/20 rounded-xl shadow-sm">
      <div className="flex flex-col gap-2 p-2">
        {/* Command buttons row */}
        <CommandButtons 
          commandButtons={commandButtons} 
          onCommandClick={handleCommandClick} 
        />

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
        />
      </div>
    </form>
  );
};

export default AssistantInput;
