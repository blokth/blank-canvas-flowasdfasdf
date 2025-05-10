
import React from 'react';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';

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
  return (
    <div className="absolute left-0 right-0 bottom-full mb-1 z-50">
      <Command className="rounded-lg border shadow-md bg-popover">
        <CommandList>
          <CommandGroup heading={suggestionType ? `${suggestionType.charAt(0).toUpperCase() + suggestionType.slice(1)} suggestions` : "Commands"}>
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((item, index) => (
                <CommandItem 
                  key={item} 
                  value={item}
                  onSelect={() => onSuggestionSelect(item)}
                  className={`cursor-pointer ${index === selectedIndex ? 'bg-accent text-accent-foreground' : ''}`}
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
