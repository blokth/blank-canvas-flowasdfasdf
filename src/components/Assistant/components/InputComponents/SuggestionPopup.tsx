
import React from 'react';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';

interface SuggestionPopupProps {
  suggestionType: 'stock' | 'timeframe' | 'sector' | null;
  filteredSuggestions: string[];
  onSuggestionSelect: (value: string) => void;
  selectedIndex?: number;
}

const SuggestionPopup: React.FC<SuggestionPopupProps> = ({
  suggestionType,
  filteredSuggestions,
  onSuggestionSelect,
  selectedIndex = 0
}) => {
  // Customize heading based on suggestion type and context
  const getHeadingText = () => {
    if (!suggestionType) return "Commands";
    
    const typeLabels = {
      'stock': 'Stock symbols',
      'timeframe': 'Time periods',
      'sector': 'Market sectors'
    };
    
    return typeLabels[suggestionType] || `${suggestionType.charAt(0).toUpperCase() + suggestionType.slice(1)} suggestions`;
  };

  return (
    <div className="absolute left-0 right-0 bottom-full mb-1 z-50 animate-fade-in">
      <Command className="rounded-lg border shadow-md bg-popover">
        <CommandList>
          <CommandGroup heading={getHeadingText()}>
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((item, index) => (
                <CommandItem 
                  key={item} 
                  value={item}
                  onSelect={() => onSuggestionSelect(item)}
                  className={cn(
                    "cursor-pointer transition-colors duration-150",
                    index === selectedIndex ? "bg-accent text-accent-foreground" : ""
                  )}
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
  );
};

export default SuggestionPopup;
