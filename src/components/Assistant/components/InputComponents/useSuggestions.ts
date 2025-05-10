
import { useState, useEffect, useRef } from 'react';

interface SuggestionsHookProps {
  query: string;
  cursorPosition: number;
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
}

interface SuggestionsHookResult {
  suggestionType: 'stock' | 'timeframe' | 'sector' | null;
  searchTerm: string;
  setSuggestionType: (type: 'stock' | 'timeframe' | 'sector' | null) => void;
  setSearchTerm: (term: string) => void;
  templateField: string | null;
}

// Sample data for suggestions
const suggestions = {
  stock: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'TSLA', 'JPM', 'V', 'WMT'],
  timeframe: ['1d', '1w', '1m', '3m', '6m', '1y', '5y', 'ytd'],
  sector: ['Technology', 'Healthcare', 'Finance', 'Energy', 'Consumer', 'Industrial', 'Telecom', 'Materials', 'Utilities', 'Real Estate']
};

// Command suggestions mapping
const commandSuggestions = {
  '/stock': 'stock',
  '/timeframe': 'timeframe',
  '/sector': 'sector'
};

export const useSuggestions = ({ 
  query, 
  cursorPosition, 
  showSuggestions, 
  setShowSuggestions 
}: SuggestionsHookProps): SuggestionsHookResult => {
  const [suggestionType, setSuggestionType] = useState<'stock' | 'timeframe' | 'sector' | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [templateField, setTemplateField] = useState<string | null>(null);
  // Add debounce timer to prevent frequent UI updates
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  // Keep track of the previous query to prevent unnecessary updates
  const prevQueryRef = useRef<string>('');
  const prevCursorPosRef = useRef<number>(0);
  
  // Check for autocompletion trigger with debounce
  useEffect(() => {
    // Skip if no changes in inputs that would affect suggestions
    if (
      prevQueryRef.current === query && 
      prevCursorPosRef.current === cursorPosition &&
      !showSuggestions
    ) {
      return;
    }
    
    // Update refs
    prevQueryRef.current = query;
    prevCursorPosRef.current = cursorPosition;
    
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set a new debounce timer
    debounceTimerRef.current = setTimeout(() => {
      checkForTrigger();
    }, 100); // 100ms debounce
    
    // Cleanup on unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, cursorPosition, showSuggestions]);
  
  // The actual check function - extracted to keep code clean
  const checkForTrigger = () => {
    // Exit early if cursor position is not set
    if (!cursorPosition) return;
    
    // Check if cursor is inside a template field
    const templatePattern = /\{\{(stock|timeframe|sector)\}\}/g;
    let match;
    while ((match = templatePattern.exec(query)) !== null) {
      const startPos = match.index;
      const endPos = startPos + match[0].length;
      
      if (cursorPosition >= startPos && cursorPosition <= endPos) {
        // Cursor is inside a template field
        setSuggestionType(match[1] as 'stock' | 'timeframe' | 'sector');
        setSearchTerm('');
        setTemplateField(match[0]);
        setShowSuggestions(true);
        return;
      }
    }
    
    // Get text before the cursor
    const textBeforeCursor = query.substring(0, cursorPosition);
    
    // Check for enhanced command suggestions - directly detect command patterns
    const commandMatch = /\/(stock|timeframe|sector)(\w*)$/.exec(textBeforeCursor);
    if (commandMatch) {
      const commandType = commandMatch[1] as 'stock' | 'timeframe' | 'sector';
      const commandParam = commandMatch[2] || '';
      
      setSuggestionType(commandType);
      setSearchTerm(commandParam);
      setTemplateField(null);
      setShowSuggestions(true);
      return;
    }
    
    // Check for specific patterns (original behavior)
    const stockMatch = /stock:(\w*)$/.exec(textBeforeCursor);
    const timeframeMatch = /timeframe:(\w*)$/.exec(textBeforeCursor);
    const sectorMatch = /sector:(\w*)$/.exec(textBeforeCursor);
    
    if (stockMatch) {
      setSuggestionType('stock');
      setSearchTerm(stockMatch[1] || '');
      setTemplateField(null);
      setShowSuggestions(true);
      return;
    } else if (timeframeMatch) {
      setSuggestionType('timeframe');
      setSearchTerm(timeframeMatch[1] || '');
      setTemplateField(null);
      setShowSuggestions(true);
      return;
    } else if (sectorMatch) {
      setSuggestionType('sector');
      setSearchTerm(sectorMatch[1] || '');
      setTemplateField(null);
      setShowSuggestions(true);
      return;
    }
    
    // Check for basic slash command
    const slashMatch = /\/(\w*)$/.exec(textBeforeCursor);
    if (slashMatch) {
      // Show quick templates
      setShowSuggestions(true);
      setSuggestionType(null);
      setSearchTerm(slashMatch[1] || '');
      setTemplateField(null);
      return;
    }
    
    // If no matches, hide suggestions
    if (showSuggestions) {
      setShowSuggestions(false);
    }
    setTemplateField(null);
  };
  
  return {
    suggestionType,
    searchTerm,
    setSuggestionType,
    setSearchTerm,
    templateField
  };
};

export { suggestions };
