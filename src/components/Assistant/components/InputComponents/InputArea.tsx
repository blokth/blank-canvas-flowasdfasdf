
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
    
    // Fall back to default handling if no suggestions or other key
    handleKeyDown(e);
  };

  // Function to highlight template fields
  const highlightTemplateFields = () => {
    if (!query) return null;
    
    const parts = [];
    const pattern = /(\{\{(stock|timeframe|sector)\}\})/g;
    let lastIndex = 0;
    let match;
    
    while ((match = pattern.exec(query)) !== null) {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {query.substring(lastIndex, match.index)}
          </span>
        );
      }
      
      // Add highlighted template field
      parts.push(
        <span 
          key={`field-${match.index}`} 
          className="bg-primary/20 text-primary rounded px-1"
        >
          {match[0]}
        </span>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add any remaining text
    if (lastIndex < query.length) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {query.substring(lastIndex)}
        </span>
      );
    }
    
    return parts;
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
          onChange={handleChange}
          onKeyDown={handleKeyDownWithSuggestion}
          className="resize-none text-sm border-0 focus-visible:ring-0 shadow-none min-h-10 py-3 bg-transparent pr-10 absolute inset-0 opacity-0"
          rows={1}
        />
        
        {/* Visible div for highlighting */}
        <div className="resize-none text-sm border-0 focus-visible:ring-0 shadow-none min-h-10 py-3 bg-transparent pr-10 whitespace-pre-wrap">
          {highlightTemplateFields() || 
            <span className="text-muted-foreground">
              Ask about your finances or portfolio... (Type / for commands)
            </span>
          }
        </div>
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
