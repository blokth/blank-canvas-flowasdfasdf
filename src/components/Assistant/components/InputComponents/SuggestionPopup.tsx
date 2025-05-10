
import React from 'react';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';

interface SuggestionPopupProps {
  suggestionType: 'stock' | 'timeframe' | 'sector' | null;
  filteredSuggestions: string[];
  onSuggestionSelect: (value: string) => void;
}

const SuggestionPopup: React.FC<SuggestionPopupProps> = ({
  suggestionType,
  filteredSuggestions,
  onSuggestionSelect,
}) => {
  return (
    <div className="absolute left-0 right-0 bottom-full mb-1 z-50">
      <Command className="rounded-lg border shadow-md bg-popover">
        <CommandList>
          <CommandGroup heading={suggestionType ? `${suggestionType.charAt(0).toUpperCase() + suggestionType.slice(1)} suggestions` : "Commands"}>
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((item) => (
                <CommandItem 
                  key={item} 
                  value={item}
                  onSelect={() => onSuggestionSelect(item)}
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
  );
};

export default SuggestionPopup;
