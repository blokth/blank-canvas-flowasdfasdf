
import { useState, useMemo } from 'react';
import { suggestions } from '../useSuggestions';

interface SuggestionFilteringProps {
  suggestionType: 'stock' | 'timeframe' | 'sector' | null;
  searchTerm: string;
}

export const useSuggestionFiltering = ({
  suggestionType,
  searchTerm
}: SuggestionFilteringProps) => {
  // Get filtered suggestions based on search term - memoized for performance
  const getFilteredSuggestions = useMemo(() => {
    return suggestionType 
      ? suggestions[suggestionType].filter(item => 
          item.toLowerCase().includes(searchTerm.toLowerCase()))
      : ['stock', 'sector', 'timeframe'].filter(item => 
          item.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [suggestionType, searchTerm]);

  return {
    filteredSuggestions: getFilteredSuggestions
  };
};
