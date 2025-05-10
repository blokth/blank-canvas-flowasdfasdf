
import { useState, useEffect, useRef, useCallback } from 'react';

interface SuggestionsHookProps {
  query: string;
  cursorPosition: number;
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
}

interface SuggestionsHookResult {
  suggestionType: 'stock' | 'timeframe' | 'sector' | null;
  setSuggestionType: (type: 'stock' | 'timeframe' | 'sector' | null) => void;
  searchTerm: string;
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
  
  // Add refs to track previous values and prevent unnecessary state updates
  const prevQueryRef = useRef<string>('');
  const prevCursorPosRef = useRef<number>(0);
  const prevSuggestionTypeRef = useRef<'stock' | 'timeframe' | 'sector' | null>(null);
  const prevSearchTermRef = useRef<string>('');
  const debounceTimerRef = useRef<number | null>(null);
  
  // Memoized checkForTrigger to prevent recreating the function on each render
  const checkForTrigger = useCallback(() => {
    // Exit early if cursor position is not set
    if (!cursorPosition) return;
    
    // Exit early if query and cursor position haven't changed
    if (prevQueryRef.current === query && prevCursorPosRef.current === cursorPosition) {
      return;
    }
    
    // Update refs
    prevQueryRef.current = query;
    prevCursorPosRef.current = cursorPosition;
    
    // Get text before the cursor
    const textBeforeCursor = query.substring(0, cursorPosition);
    
    // Primary pattern detection: check for colon patterns (stock:, timeframe:, sector:)
    const stockMatch = /stock:(\w*)$/.exec(textBeforeCursor);
    const timeframeMatch = /timeframe:(\w*)$/.exec(textBeforeCursor);
    const sectorMatch = /sector:(\w*)$/.exec(textBeforeCursor);
    
    if (stockMatch) {
      const searchValue = stockMatch[1] || '';
      if (prevSuggestionTypeRef.current !== 'stock' || prevSearchTermRef.current !== searchValue) {
        setSuggestionType('stock');
        setSearchTerm(searchValue);
        setTemplateField(null);
        setShowSuggestions(true);
        prevSuggestionTypeRef.current = 'stock';
        prevSearchTermRef.current = searchValue;
      }
      return;
    } else if (timeframeMatch) {
      const searchValue = timeframeMatch[1] || '';
      if (prevSuggestionTypeRef.current !== 'timeframe' || prevSearchTermRef.current !== searchValue) {
        setSuggestionType('timeframe');
        setSearchTerm(searchValue);
        setTemplateField(null);
        setShowSuggestions(true);
        prevSuggestionTypeRef.current = 'timeframe';
        prevSearchTermRef.current = searchValue;
      }
      return;
    } else if (sectorMatch) {
      const searchValue = sectorMatch[1] || '';
      if (prevSuggestionTypeRef.current !== 'sector' || prevSearchTermRef.current !== searchValue) {
        setSuggestionType('sector');
        setSearchTerm(searchValue);
        setTemplateField(null);
        setShowSuggestions(true);
        prevSuggestionTypeRef.current = 'sector';
        prevSearchTermRef.current = searchValue;
      }
      return;
    }
    
    // Check for basic slash command
    const slashMatch = /\/(\w*)$/.exec(textBeforeCursor);
    if (slashMatch) {
      const searchValue = slashMatch[1] || '';
      if (prevSuggestionTypeRef.current !== null || prevSearchTermRef.current !== searchValue) {
        // Show quick templates
        setShowSuggestions(true);
        setSuggestionType(null);
        setSearchTerm(searchValue);
        setTemplateField(null);
        prevSuggestionTypeRef.current = null;
        prevSearchTermRef.current = searchValue;
      }
      return;
    }
    
    // If no matches and suggestions are showing, hide them
    if (showSuggestions) {
      setShowSuggestions(false);
      prevSuggestionTypeRef.current = null;
      prevSearchTermRef.current = '';
    }
    setTemplateField(null);
  }, [query, cursorPosition, setShowSuggestions, showSuggestions]);
  
  // Check for autocompletion trigger with debounce and RAF instead of setTimeout
  useEffect(() => {
    // Cancel any existing RAF
    if (debounceTimerRef.current !== null) {
      cancelAnimationFrame(debounceTimerRef.current);
    }
    
    // Schedule a new RAF
    debounceTimerRef.current = requestAnimationFrame(() => {
      checkForTrigger();
      debounceTimerRef.current = null;
    });
    
    // Cleanup on unmount
    return () => {
      if (debounceTimerRef.current !== null) {
        cancelAnimationFrame(debounceTimerRef.current);
      }
    };
  }, [query, cursorPosition, checkForTrigger]);
  
  return {
    suggestionType,
    setSuggestionType,
    searchTerm,
    setSearchTerm,
    templateField
  };
};

export { suggestions };
