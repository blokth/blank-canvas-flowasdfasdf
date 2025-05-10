
import React, { memo, useEffect, useRef } from 'react';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';

interface SuggestionPopupProps {
  suggestionType: 'stock' | 'timeframe' | 'sector' | null;
  filteredSuggestions: string[];
  onSuggestionSelect: (value: string) => void;
  selectedIndex?: number;
}

// Use memo to prevent unnecessary re-renders
const SuggestionPopup: React.FC<SuggestionPopupProps> = ({
  suggestionType,
  filteredSuggestions,
  onSuggestionSelect,
  selectedIndex = 0
}) => {
  // Reference to track popup visibility and prevent unnecessary animations
  const popupRef = useRef<HTMLDivElement>(null);
  
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
  
  // Help stabilize the popup from re-renders
  useEffect(() => {
    const popupElement = popupRef.current;
    if (popupElement) {
      popupElement.style.opacity = '0';
      
      // Micro-delay to let the component fully render before showing
      const timer = setTimeout(() => {
        popupElement.style.opacity = '1';
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [suggestionType]); // Only when suggestion type changes to prevent flicker

  return (
    <div 
      ref={popupRef}
      className="absolute left-0 right-0 bottom-full mb-1 z-50 transition-opacity duration-150"
    >
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

// Use React.memo with custom comparison to prevent unnecessary re-renders
export default memo(SuggestionPopup, (prevProps, nextProps) => {
  // Only re-render when these specific props change
  return (
    prevProps.suggestionType === nextProps.suggestionType &&
    prevProps.selectedIndex === nextProps.selectedIndex &&
    prevProps.filteredSuggestions.length === nextProps.filteredSuggestions.length &&
    // Only check first/last items for performance
    (prevProps.filteredSuggestions.length === 0 || 
      (prevProps.filteredSuggestions[0] === nextProps.filteredSuggestions[0] &&
       prevProps.filteredSuggestions[prevProps.filteredSuggestions.length - 1] === 
       nextProps.filteredSuggestions[nextProps.filteredSuggestions.length - 1]))
  );
});
