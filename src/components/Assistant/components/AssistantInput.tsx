
import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import InputArea from './InputComponents/InputArea';
import { useSuggestions } from './InputComponents/useSuggestions';
import { useInputHandlers } from './InputComponents/useInputHandlers';

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
  isLoading
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const prevQueryRef = useRef(query);
  
  // Process query for display (show only values) while maintaining original for submission
  const processedQuery = useMemo(() => {
    // Replace patterns like "stock:TSLA" with just "TSLA" for display and processing
    return query.replace(/(stock:|timeframe:|sector:)(\w+)/g, "$2");
  }, [query]);
  
  // Submit handler that processes the query - memoized to prevent re-creation
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new form event to pass to the onSubmit handler
    const newEvent = { ...e, preventDefault: () => {} };
    
    // Call the submit handler directly
    onSubmit(newEvent);
  }, [onSubmit]);
  
  // Use the extracted suggestions hook with memoization to prevent unnecessary re-renders
  const { 
    suggestionType, 
    setSuggestionType, 
    searchTerm,
    setSearchTerm, 
    templateField 
  } = useSuggestions({
    query,
    cursorPosition,
    showSuggestions,
    setShowSuggestions
  });

  // Use the input handlers hook - memoizing references to prevent unnecessary re-renders
  const {
    handleKeyDown,
    handleChange,
    handleSuggestionSelect,
    getFilteredSuggestions,
    handleFieldClick,
    navigateToFirstField
  } = useInputHandlers({
    query,
    setQuery,
    onSubmit: handleSubmit,
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
  });

  // When a template is pasted or selected, navigate to the first field
  useEffect(() => {
    // Check if query has changed and contains template patterns
    if (query !== prevQueryRef.current && query.includes(':')) {
      // Use a short timeout to ensure the DOM is updated
      setTimeout(() => {
        navigateToFirstField();
      }, 50);
    }
    
    // Update the previous query ref
    prevQueryRef.current = query;
  }, [query, navigateToFirstField]);

  // Memoize filtered suggestions to prevent re-rendering
  const filteredSuggestions = useMemo(() => getFilteredSuggestions(), [getFilteredSuggestions]);

  return (
    <div className="bg-background border border-border/40 rounded-xl shadow-sm hover:border-border/60 transition-colors duration-200 w-full">
      <div className="flex flex-col gap-2 p-2">
        <InputArea
          query={query}
          setQuery={setQuery}
          isLoading={isLoading}
          handleSubmit={handleSubmit}
          handleKeyDown={handleKeyDown}
          handleChange={handleChange}
          showSuggestions={showSuggestions}
          suggestionType={suggestionType}
          filteredSuggestions={filteredSuggestions}
          handleSuggestionSelect={handleSuggestionSelect}
          textareaRef={textareaRef}
          templateField={templateField}
          handleFieldClick={handleFieldClick}
        />
      </div>
    </div>
  );
};

export default AssistantInput;
