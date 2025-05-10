
import React, { useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import SuggestionPopup from './SuggestionPopup';

interface InputAreaProps {
  query: string;
  setQuery: (query: string) => void;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  showSuggestions: boolean;
  suggestionType: 'stock' | 'timeframe' | 'sector' | null;
  filteredSuggestions: string[];
  handleSuggestionSelect: (value: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

const InputArea: React.FC<InputAreaProps> = ({
  query,
  setQuery,
  isLoading,
  handleSubmit,
  handleKeyDown,
  handleChange,
  showSuggestions,
  suggestionType,
  filteredSuggestions,
  handleSuggestionSelect,
  textareaRef
}) => {
  return (
    <div className="relative">
      {/* Suggestion popup ABOVE the input */}
      {showSuggestions && (
        <SuggestionPopup 
          suggestionType={suggestionType}
          filteredSuggestions={filteredSuggestions}
          onSuggestionSelect={handleSuggestionSelect}
        />
      )}
      
      <Textarea
        ref={textareaRef}
        placeholder="Ask about your finances or portfolio... (Type / for commands)"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="resize-none text-sm border-0 focus-visible:ring-0 shadow-none min-h-10 py-3 bg-transparent pr-10"
        rows={1}
      />
      
      <Button 
        type="submit" 
        size="icon" 
        disabled={isLoading || !query.trim()}
        className="absolute right-1 bottom-1 shrink-0 h-8 w-8 rounded-full"
        variant="ghost"
      >
        <Send size={16} className={isLoading ? 'opacity-50' : ''} />
      </Button>
    </div>
  );
};

export default InputArea;
