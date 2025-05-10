import { useState, useEffect, useRef } from 'react';

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
    
    // Get text before the cursor
    const textBeforeCursor = query.substring(0, cursorPosition);
    
    // Primary pattern detection: check for colon patterns (stock:, timeframe:, sector:)
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
    setSuggestionType,
    searchTerm,
    setSearchTerm,
    templateField
  };
};

export { suggestions };
