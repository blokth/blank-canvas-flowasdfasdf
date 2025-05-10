
import React, { useRef, useState, useCallback } from 'react';
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
  
  // Process query for display (show only values) while maintaining original for submission
  const processedQuery = useCallback((q: string) => {
    // Replace patterns like "stock:TSLA" with just "TSLA" for display and processing
    return q.replace(/(stock:|timeframe:|sector:)(\w+)/g, "$2");
  }, []);
  
  // Submit handler that processes the query
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const processedQuery = query.replace(/(stock:|timeframe:|sector:)(\w+)/g, "$2");
    
    // Create a new form event to pass to the onSubmit handler
    const newEvent = { ...e, preventDefault: () => {} };
    
    // Use the processed query text for the actual submission
    const originalQuery = query;
    setQuery(processedQuery);
    
    // Use setTimeout to ensure React has time to process state updates
    setTimeout(() => {
      onSubmit(newEvent);
      // If needed, we can restore the original query format after submission
    }, 0);
  }, [query, setQuery, onSubmit]);
  
  // Use the extracted suggestions hook
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

  // Use the input handlers hook
  const {
    handleKeyDown,
    handleChange,
    handleSuggestionSelect,
    getFilteredSuggestions
  } = useInputHandlers({
    query,
    setQuery,
    onSubmit: handleSubmit, // Use our custom submit handler
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

  const filteredSuggestions = getFilteredSuggestions();

  return (
    <div className="bg-background border border-border/40 rounded-xl shadow-sm hover:border-border/60 transition-colors duration-200 w-full">
      <div className="flex flex-col gap-2 p-2">
        <InputArea
          query={query}
          setQuery={setQuery}
          isLoading={isLoading}
          handleSubmit={handleSubmit} // Use our custom submit handler
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
    </div>
  );
};

export default AssistantInput;
