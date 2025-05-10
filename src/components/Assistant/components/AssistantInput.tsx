import React, { useRef, useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';

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
  const [suggestionType, setSuggestionType] = useState<'stock' | 'timeframe' | 'sector' | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  
  // Command buttons for quick access - removed "Compare" and "Forecast"
  const commandButtons = [
    { label: "Stock", command: "stock:" },
    { label: "Timeframe", command: "timeframe:" },
    { label: "Sector", command: "sector:" },
  ];
  
  // Sample data for suggestions
  const suggestions = {
    stock: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'TSLA', 'JPM', 'V', 'WMT'],
    timeframe: ['1d', '1w', '1m', '3m', '6m', '1y', '5y', 'ytd'],
    sector: ['Technology', 'Healthcare', 'Finance', 'Energy', 'Consumer', 'Industrial', 'Telecom', 'Materials', 'Utilities', 'Real Estate']
  };

  // Detect cursor position to place the suggestion popup
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
      setCursorPosition(textareaRef.current.selectionStart);
    }
  }, [query]);

  // Check for autocompletion trigger
  useEffect(() => {
    const checkForTrigger = () => {
      // Exit early if cursor position is not set
      if (!cursorPosition) return;
      
      // Get text before the cursor
      const textBeforeCursor = query.substring(0, cursorPosition);
      
      // Check for specific patterns
      const stockMatch = /stock:(\w*)$/.exec(textBeforeCursor);
      const timeframeMatch = /timeframe:(\w*)$/.exec(textBeforeCursor);
      const sectorMatch = /sector:(\w*)$/.exec(textBeforeCursor);
      
      if (stockMatch) {
        setSuggestionType('stock');
        setSearchTerm(stockMatch[1] || '');
        setShowSuggestions(true);
        return;
      } else if (timeframeMatch) {
        setSuggestionType('timeframe');
        setSearchTerm(timeframeMatch[1] || '');
        setShowSuggestions(true);
        return;
      } else if (sectorMatch) {
        setSuggestionType('sector');
        setSearchTerm(sectorMatch[1] || '');
        setShowSuggestions(true);
        return;
      }
      
      // Check for slash command
      const slashMatch = /\/(\w*)$/.exec(textBeforeCursor);
      if (slashMatch && !showSuggestions) {
        // Show quick templates
        setShowSuggestions(true);
        setSuggestionType(null);
        setSearchTerm(slashMatch[1] || '');
        return;
      }
      
      // If no matches, hide suggestions
      if (showSuggestions) {
        setShowSuggestions(false);
      }
    };
    
    checkForTrigger();
  }, [query, cursorPosition, showSuggestions]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (query.trim() && !isLoading) {
        onSubmit(e as unknown as React.FormEvent);
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
        <div className="flex flex-wrap gap-2 px-1">
          {commandButtons.map((btn, index) => (
            <Button 
              key={index}
              type="button"
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => handleCommandClick(btn.command)}
            >
              {btn.label}
            </Button>
          ))}
        </div>

        <div className="relative">
          {/* Suggestion popup ABOVE the input */}
          {showSuggestions && (
            <div className="absolute left-0 right-0 bottom-full mb-1 z-50">
              <Command className="rounded-lg border shadow-md bg-popover">
                <CommandList>
                  <CommandGroup heading={suggestionType ? `${suggestionType.charAt(0).toUpperCase() + suggestionType.slice(1)} suggestions` : "Commands"}>
                    {filteredSuggestions.length > 0 ? (
                      filteredSuggestions.map((item) => (
                        <CommandItem 
                          key={item} 
                          value={item}
                          onSelect={() => handleSuggestionSelect(item)}
                          className="cursor-pointer"
                        >
                          {item}
                        </CommandItem>
                      ))
                    ) : (
                      <CommandItem disabled>No results found</CommandItem>
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
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
      </div>
    </form>
  );
};

export default AssistantInput;
