
import React from 'react';
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
  templateField
}) => {
  // Track currently selected suggestion
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [cursorPosition, setCursorPosition] = React.useState(0);
  
  // Reset selected index when suggestions change
  React.useEffect(() => {
    setSelectedIndex(0);
  }, [filteredSuggestions]);
  
  // Enhanced keyboard navigation
  const handleKeyDownWithSuggestion = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
    
    // Update cursor position after key handling
    setTimeout(() => {
      if (textareaRef.current) {
        setCursorPosition(textareaRef.current.selectionStart);
      }
    }, 0);
    
    // Fall back to default handling if no suggestions or other key
    handleKeyDown(e);
  };
  
  // Show suggestions on click
  const handleInputClick = () => {
    if (textareaRef.current) {
      // Update cursor position
      setCursorPosition(textareaRef.current.selectionStart);
      
      // Show command suggestions by simulating a slash command
      const slashCommand = '/';
      const cursorPos = textareaRef.current.selectionStart;
      
      // Only show suggestions if they're not already showing
      if (!showSuggestions) {
        const newQuery = query.substring(0, cursorPos) + slashCommand + query.substring(cursorPos);
        setQuery(newQuery);
        
        // Position cursor after the slash
        setTimeout(() => {
          if (textareaRef.current) {
            const newPosition = cursorPos + 1;
            textareaRef.current.selectionStart = newPosition;
            textareaRef.current.selectionEnd = newPosition;
            setCursorPosition(newPosition);
          }
        }, 0);
      }
    }
  };
  
  // Track cursor position during typing
  const handleChangeWithCursor = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleChange(e);
    setCursorPosition(e.target.selectionStart);
  };
  
  return (
    <div className="relative">
      {/* Suggestion popup ABOVE the input */}
      {showSuggestions && (
        <SuggestionPopup 
          suggestionType={suggestionType}
          filteredSuggestions={filteredSuggestions}
          onSuggestionSelect={handleSuggestionSelect}
          selectedIndex={selectedIndex}
        />
      )}
      
      <div className="relative border border-input rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        {/* Hidden textarea for actual input - make it truly invisible but still interactive */}
        <Textarea
          ref={textareaRef}
          placeholder="Ask about your finances or portfolio... (Type / for commands)"
          value={query}
          onChange={handleChangeWithCursor}
          onKeyDown={handleKeyDownWithSuggestion}
          onClick={handleInputClick}
          className="resize-none text-sm min-h-10 py-3 bg-transparent pr-10 z-10 absolute inset-0 opacity-0 caret-transparent"
          rows={1}
        />
        
        {/* Visible div for highlighting */}
        <InputDisplay query={query} cursorPosition={cursorPosition} />
      </div>
      
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
