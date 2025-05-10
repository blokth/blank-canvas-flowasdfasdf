
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
  // Track current cursor position for visual cursor display
  const [visualCursorPosition, setVisualCursorPosition] = React.useState(0);
  
  // Reset selected index when suggestions change
  React.useEffect(() => {
    setSelectedIndex(0);
  }, [filteredSuggestions]);
  
  // Update visual cursor position whenever real cursor position changes
  React.useEffect(() => {
    if (textareaRef.current) {
      setVisualCursorPosition(textareaRef.current.selectionStart);
    }
  }, [textareaRef]);
  
  // Enhanced keyboard navigation and cursor tracking
  const handleKeyDownWithSuggestion = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Update cursor position after key press
    setTimeout(() => {
      if (textareaRef.current) {
        setVisualCursorPosition(textareaRef.current.selectionStart);
      }
    }, 0);
    
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
  };
  
  // Track cursor position on click events
  const handleClick = () => {
    if (textareaRef.current) {
      setVisualCursorPosition(textareaRef.current.selectionStart);
    }
  };
  
  // Enhanced onChange to track cursor position
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleChange(e);
    setVisualCursorPosition(e.target.selectionStart);
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
      
      <div className="relative">
        {/* Hidden textarea for actual input */}
        <Textarea
          ref={textareaRef}
          placeholder="Ask about your finances or portfolio... (Type / for commands)"
          value={query}
          onChange={handleInputChange}
          onClick={handleClick}
          onKeyDown={handleKeyDownWithSuggestion}
          className="resize-none text-sm border-0 focus-visible:ring-0 shadow-none min-h-10 py-3 bg-transparent pr-10 absolute inset-0 opacity-0"
          rows={1}
        />
        
        {/* Visible div for highlighting */}
        <InputDisplay query={query} cursorPosition={visualCursorPosition} />
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
