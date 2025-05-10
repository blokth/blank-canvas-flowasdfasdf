
import React, { useRef, useState } from 'react';
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
  isLoading,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  
  // Use the extracted suggestions hook
  const { suggestionType, searchTerm, templateField } = useSuggestions({
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
  });

  const filteredSuggestions = getFilteredSuggestions();

  return (
    <div className="bg-background border border-border/20 rounded-xl shadow-sm p-2">
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
  );
};

export default AssistantInput;
