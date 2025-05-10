
import { useState, useEffect } from 'react';

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
}

// Sample data for suggestions
const suggestions = {
  stock: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'TSLA', 'JPM', 'V', 'WMT'],
  timeframe: ['1d', '1w', '1m', '3m', '6m', '1y', '5y', 'ytd'],
  sector: ['Technology', 'Healthcare', 'Finance', 'Energy', 'Consumer', 'Industrial', 'Telecom', 'Materials', 'Utilities', 'Real Estate']
};

export const useSuggestions = ({ 
  query, 
  cursorPosition, 
  showSuggestions, 
  setShowSuggestions 
}: SuggestionsHookProps): SuggestionsHookResult => {
  const [suggestionType, setSuggestionType] = useState<'stock' | 'timeframe' | 'sector' | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
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
      
      // Check for template fields
      const stockTemplateMatch = /\{\{stock(\w*)\}\}$/.exec(textBeforeCursor) || 
                              /\{\{stock:(\w*)\}\}$/.exec(textBeforeCursor);
      const timeframeTemplateMatch = /\{\{timeframe(\w*)\}\}$/.exec(textBeforeCursor) || 
                                  /\{\{timeframe:(\w*)\}\}$/.exec(textBeforeCursor);
      const sectorTemplateMatch = /\{\{sector(\w*)\}\}$/.exec(textBeforeCursor) || 
                               /\{\{sector:(\w*)\}\}$/.exec(textBeforeCursor);
      
      if (stockMatch || stockTemplateMatch) {
        setSuggestionType('stock');
        setSearchTerm((stockMatch?.[1] || stockTemplateMatch?.[1] || ''));
        setShowSuggestions(true);
        return;
      } else if (timeframeMatch || timeframeTemplateMatch) {
        setSuggestionType('timeframe');
        setSearchTerm((timeframeMatch?.[1] || timeframeTemplateMatch?.[1] || ''));
        setShowSuggestions(true);
        return;
      } else if (sectorMatch || sectorTemplateMatch) {
        setSuggestionType('sector');
        setSearchTerm((sectorMatch?.[1] || sectorTemplateMatch?.[1] || ''));
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
  }, [query, cursorPosition, showSuggestions, setShowSuggestions]);
  
  return {
    suggestionType,
    searchTerm,
    setSuggestionType,
    setSearchTerm
  };
};

export { suggestions };
