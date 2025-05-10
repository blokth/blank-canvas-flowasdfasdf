
import React, { useState, useEffect } from 'react';
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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);
  
  // Reset selected index when suggestions change
  useEffect(() => {
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
  
  // Show suggestions when clicking on template fields
  const handleInputClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    if (textareaRef.current) {
      // Update cursor position
      const cursorPos = textareaRef.current.selectionStart;
      setCursorPosition(cursorPos);
      
      // Check if click is within a template field
      const text = query;
      const templateRegex = /\{\{(stock|timeframe|sector)\}\}/g;
      let match;
      
      while ((match = templateRegex.exec(text)) !== null) {
        const start = match.index;
        const end = start + match[0].length;
        
        if (cursorPos >= start && cursorPos <= end) {
          // Clicked on a template field, show suggestions
          // No need to insert slash, just activate the suggestion for the field type
          const fieldType = match[1] as 'stock' | 'timeframe' | 'sector';
          
          // We don't modify the query here, just trigger suggestions
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(start, end);
          return;
        }
      }
    }
  };
  
  // Track cursor position during typing
  const handleChangeWithCursor = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleChange(e);
    setCursorPosition(e.target.selectionStart);
  };

  // Highlight text and template fields
  const highlightText = (text: string) => {
    if (!text) {
      return (
        <span className="text-muted-foreground">
          Ask about your finances or portfolio... (Type / for commands)
        </span>
      );
    }

    const parts = [];
    const pattern = /(\{\{(stock|timeframe|sector)\}\})/g;
    let lastIndex = 0;
    let match;
    
    while ((match = pattern.exec(text)) !== null) {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {text.substring(lastIndex, match.index)}
          </span>
        );
      }
      
      // Add highlighted template field
      parts.push(
        <span 
          key={`field-${match.index}`} 
          className="bg-primary/20 text-primary rounded px-1 cursor-pointer"
          onClick={() => handleTemplateFieldClick(match[0], match.index, match.index + match[0].length)}
        >
          {match[0]}
        </span>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add any remaining text
    if (lastIndex < text.length) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {text.substring(lastIndex)}
        </span>
      );
    }
    
    return parts;
  };

  // Handle clicks on template fields
  const handleTemplateFieldClick = (field: string, startPos: number, endPos: number) => {
    if (textareaRef.current) {
      // Focus the textarea
      textareaRef.current.focus();
      
      // Select the field
      textareaRef.current.setSelectionRange(startPos, endPos);
      setCursorPosition(startPos);
      
      // Extract field type from {{field}}
      const fieldType = field.match(/\{\{(stock|timeframe|sector)\}\}/)?.[1] as 'stock' | 'timeframe' | 'sector' | undefined;
      
      if (fieldType) {
        // Add a slash command before the cursor to trigger suggestions
        const textBeforeCursor = query.substring(0, startPos);
        const textAfterCursor = query.substring(startPos);
        const slashCommand = '/';
        
        const newQuery = textBeforeCursor + slashCommand + textAfterCursor;
        setQuery(newQuery);
        
        // Reposition cursor after the slash
        setTimeout(() => {
          if (textareaRef.current) {
            const newPosition = startPos + 1;
            textareaRef.current.selectionStart = newPosition;
            textareaRef.current.selectionEnd = newPosition;
            setCursorPosition(newPosition);
          }
        }, 0);
      }
    }
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
      
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative border border-input rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          {/* Hidden but interactive textarea for capturing input */}
          <Textarea
            ref={textareaRef}
            placeholder="Ask about your finances or portfolio... (Type / for commands)"
            value={query}
            onChange={handleChangeWithCursor}
            onKeyDown={handleKeyDownWithSuggestion}
            onClick={handleInputClick}
            className="resize-none text-sm min-h-10 py-3 px-3 bg-transparent pr-10 z-10 absolute inset-0 opacity-0 caret-transparent"
            rows={1}
          />
          
          {/* Visual display of text with highlighting */}
          <div className="resize-none text-sm min-h-10 py-3 px-3 pr-10 whitespace-pre-wrap pointer-events-none">
            {highlightText(query)}
            {/* Render cursor */}
            {cursorPosition !== undefined && (
              <span
                className="absolute h-5 w-0.5 bg-primary animate-blink"
                style={{
                  left: `calc(${cursorPosition}ch + 0.75rem)`, // Adjust for padding
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'inline-block',
                }}
              />
            )}
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
      </form>
    </div>
  );
};

export default InputArea;
