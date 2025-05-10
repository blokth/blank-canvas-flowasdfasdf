
import React, { useEffect, useState, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import SuggestionPopup from './SuggestionPopup';
import InputDisplay from './InputDisplay';

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
  templateField: string | null;
  handleFieldClick?: (fieldType: 'stock' | 'timeframe' | 'sector', position: number) => void;
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
  textareaRef,
  templateField,
  handleFieldClick
}) => {
  // Track currently selected suggestion
  const [selectedIndex, setSelectedIndex] = useState(0);
  // Track if we're in transition state
  const [isInTransition, setIsInTransition] = useState(false);
  
  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredSuggestions]);
  
  // Form submit handler with animation protection - memoize to prevent rerenders
  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent rapid repeated submissions 
    if (isInTransition) return;
    
    setIsInTransition(true);
    handleSubmit(e);
    
    // Reset transition state after animation would complete
    setTimeout(() => {
      setIsInTransition(false);
    }, 1100);
  }, [handleSubmit, isInTransition]);
  
  // Enhanced keyboard navigation - memoize to prevent rerenders
  const handleKeyDownWithSuggestion = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSuggestions && filteredSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredSuggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredSuggestions.length) % filteredSuggestions.length);
      } else if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        // Apply the currently selected suggestion
        handleSuggestionSelect(filteredSuggestions[selectedIndex]);
        return;
      } else if (e.key === 'Escape') {
        // Close suggestions on Escape
        e.preventDefault();
        return;
      }
    }
    
    // Fall back to default handling if no suggestions or other key
    handleKeyDown(e);
  }, [showSuggestions, filteredSuggestions, selectedIndex, handleSuggestionSelect, handleKeyDown]);
  
  return (
    <form onSubmit={handleFormSubmit} className="relative">
      {/* Suggestion popup ABOVE the input */}
      {showSuggestions && (
        <SuggestionPopup 
          suggestionType={suggestionType}
          filteredSuggestions={filteredSuggestions}
          onSuggestionSelect={handleSuggestionSelect}
          selectedIndex={selectedIndex}
        />
      )}
      
      <div className="relative">
        {/* Hidden textarea for actual input */}
        <Textarea
          ref={textareaRef}
          placeholder="Ask about your finances or portfolio... (Type / for commands)"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDownWithSuggestion}
          className="resize-none text-sm border-0 focus-visible:ring-1 focus-visible:ring-primary/30 shadow-none min-h-10 py-3 bg-transparent pr-10 absolute inset-0 opacity-0"
          rows={1}
        />
        
        {/* Visible div for highlighting */}
        <InputDisplay 
          query={query} 
          onFieldClick={handleFieldClick} 
        />
      </div>
      
      <Button 
        type="submit" 
        size="icon" 
        disabled={isLoading || !query.trim() || isInTransition}
        className="absolute right-2 bottom-2 shrink-0 h-8 w-8 rounded-full transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
        variant={query.trim() ? "default" : "ghost"}
      >
        <Send size={16} className={isLoading || isInTransition ? 'opacity-50' : ''} />
      </Button>
    </form>
  );
};

// Memoize the component to prevent unnecessary rerenders
export default React.memo(InputArea);
