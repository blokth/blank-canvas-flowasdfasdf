import { useState, useEffect, RefObject } from 'react';
import { moveToNextTemplateField } from './TemplateNavigator';
import { suggestions } from './useSuggestions';

interface InputHandlersProps {
  query: string;
  setQuery: (query: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  textareaRef: RefObject<HTMLTextAreaElement>;
  isLoading: boolean;
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  suggestionType: 'stock' | 'timeframe' | 'sector' | null;
  setSuggestionType: (type: 'stock' | 'timeframe' | 'sector' | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  templateField: string | null;
  cursorPosition: number;
  setCursorPosition: (position: number) => void;
}

export const useInputHandlers = ({
  query,
  setQuery,
  onSubmit,
  textareaRef,
  isLoading,
  showSuggestions,
  setShowSuggestions,
  suggestionType,
  setSuggestionType,
  searchTerm,
  setSearchTerm,
  templateField,
  cursorPosition,
  setCursorPosition
}: InputHandlersProps) => {
  // Add transitioning state to prevent multiple rapid submissions
  const [isTransitioning, setIsTransitioning] = useState(false);
  // Add a debounce timer to prevent frequent cursor position updates
  const [cursorUpdateTimer, setCursorUpdateTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Auto-resize textarea height with debounced cursor updates
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
      
      // Debounce the cursor position update to reduce re-renders
      if (cursorUpdateTimer) {
        clearTimeout(cursorUpdateTimer);
      }
      
      const timer = setTimeout(() => {
        setCursorPosition(textareaRef.current?.selectionStart || 0);
        
        // Check if cursor is positioned after a field: pattern
        const textBeforeCursor = query.substring(0, textareaRef.current?.selectionStart || 0);
        const pattern = /(stock|timeframe|sector):(\w*)$/;
        const match = textBeforeCursor.match(pattern);
        
        if (match) {
          const fieldType = match[1] as 'stock' | 'timeframe' | 'sector';
          const searchValue = match[2] || '';
          
          // Only show suggestions if we're directly after a field: pattern
          setSuggestionType(fieldType);
          setSearchTerm(searchValue);
          setShowSuggestions(true);
        } else {
          // Check for slash commands
          const slashMatch = /\/(\w*)$/.exec(textBeforeCursor);
          if (slashMatch) {
            setShowSuggestions(true);
            setSuggestionType(null); // null indicates we're showing command suggestions
            setSearchTerm(slashMatch[1] || '');
          } else if (showSuggestions) {
            // Don't hide suggestions if we're navigating within them
            // Only hide if we've moved to a position without a field: or / pattern
            if (!textareaRef.current?.selectionDirection) {
              setShowSuggestions(false);
            }
          }
        }
      }, 50); // 50ms debounce
      
      setCursorUpdateTimer(timer);
    }
    
    return () => {
      if (cursorUpdateTimer) {
        clearTimeout(cursorUpdateTimer);
      }
    };
  }, [query, setCursorPosition, textareaRef, cursorUpdateTimer, setShowSuggestions, setSuggestionType, setSearchTerm, showSuggestions]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle command conversion on space key
    if (e.key === ' ') {
      const textBeforeCursor = query.substring(0, cursorPosition);
      const commandMatch = /\/(stock|timeframe|sector)$/.exec(textBeforeCursor);
      
      if (commandMatch) {
        e.preventDefault();
        const commandType = commandMatch[1];
        const beforeCommand = query.substring(0, cursorPosition - (commandType.length + 1)); // +1 for the '/'
        const afterCommand = query.substring(cursorPosition);
        
        // Replace command with pattern format
        const newQuery = beforeCommand + commandType + ':' + afterCommand;
        setQuery(newQuery);
        
        // Set cursor position right after the colon
        setTimeout(() => {
          const newCursorPosition = beforeCommand.length + commandType.length + 1; // +1 for the ':'
          if (textareaRef.current) {
            textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
            setCursorPosition(newCursorPosition);
            
            // Show suggestions when positioning after colon
            setSuggestionType(commandType as 'stock' | 'timeframe' | 'sector');
            setShowSuggestions(true);
            setSearchTerm('');
          }
        }, 0);
        return;
      }
    }
    
    // Handle tab navigation between template fields
    if (e.key === 'Tab') {
      e.preventDefault();
      const newPosition = moveToNextTemplateField(
        query, 
        cursorPosition, 
        textareaRef, 
        setShowSuggestions, 
        setSuggestionType
      );
      setCursorPosition(newPosition);
      setSearchTerm('');
      return;
    }
    
    // When suggestions are shown, Enter key behavior is managed in InputArea component
    if (e.key === 'Enter' && !e.shiftKey) {
      // Check if we're after a field: pattern
      if (/(stock|timeframe|sector):$/.test(query.substring(0, cursorPosition))) {
        e.preventDefault();
        const fieldMatch = /(stock|timeframe|sector):$/.exec(query.substring(0, cursorPosition));
        if (fieldMatch) {
          const fieldType = fieldMatch[1] as 'stock' | 'timeframe' | 'sector';
          setSuggestionType(fieldType);
          setShowSuggestions(true);
          setSearchTerm('');
        }
        
        const newPosition = moveToNextTemplateField(
          query, 
          cursorPosition, 
          textareaRef, 
          setShowSuggestions, 
          setSuggestionType
        );
        setCursorPosition(newPosition);
        return;
      }
      
      // Don't submit during transitions
      if (isTransitioning) {
        e.preventDefault();
        return;
      }
      
      // Only submit if there are no suggestions showing
      if (!showSuggestions) {
        e.preventDefault();
        if (query.trim() && !isLoading) {
          // Set transitioning state to prevent multiple submissions
          setIsTransitioning(true);
          onSubmit(e as unknown as React.FormEvent);
          
          // Reset after animation would complete
          setTimeout(() => {
            setIsTransitioning(false);
          }, 1100);
        }
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
    
    // Use a debounced update for arrow key cursor position changes
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      // Clear existing timer
      if (cursorUpdateTimer) {
        clearTimeout(cursorUpdateTimer);
      }
      
      // Add small delay to ensure DOM updates first
      const timer = setTimeout(() => {
        if (textareaRef.current) {
          setCursorPosition(textareaRef.current.selectionStart || 0);
        }
      }, 50);
      
      setCursorUpdateTimer(timer);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    
    // Only update cursor position after a debounce
    if (cursorUpdateTimer) {
      clearTimeout(cursorUpdateTimer);
    }
    
    const timer = setTimeout(() => {
      if (textareaRef.current) {
        setCursorPosition(textareaRef.current.selectionStart || 0);
      }
    }, 50);
    
    setCursorUpdateTimer(timer);
  };

  const handleSuggestionSelect = (value: string) => {
    // Handle field: style selections
    if (/(stock|timeframe|sector):$/.test(query.substring(0, cursorPosition))) {
      // Find the field: pattern before the cursor
      const match = /(stock|timeframe|sector):$/.exec(query.substring(0, cursorPosition));
      if (match) {
        const field = match[0];
        const fieldPos = query.substring(0, cursorPosition).lastIndexOf(field);
        
        // Insert the selected value after the field:
        const beforeField = query.substring(0, fieldPos + field.length);
        const afterCursor = query.substring(cursorPosition);
        const newQuery = beforeField + value + afterCursor;
        
        setQuery(newQuery);
        
        // Set cursor position AFTER the inserted value
        setTimeout(() => {
          if (textareaRef.current) {
            const newPosition = fieldPos + field.length + value.length;
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(newPosition, newPosition);
            setCursorPosition(newPosition);
            
            // After inserting, hide suggestions by default
            setShowSuggestions(false);
          }
        }, 0);
        return;
      }
    }
    
    // Extract value from pattern like stock:AAPL to find field type
    const fieldValuePattern = /(stock|timeframe|sector):(\w*)/.exec(query.substring(0, cursorPosition));
    if (fieldValuePattern && suggestionType) {
      const fieldType = fieldValuePattern[1];
      const fieldWithColon = fieldType + ':';
      const fieldStartPos = query.substring(0, cursorPosition).lastIndexOf(fieldWithColon);
      const fieldEndPos = fieldStartPos + fieldWithColon.length + (fieldValuePattern[2] || '').length;
      
      // Replace existing value with new selection
      const beforeField = query.substring(0, fieldStartPos + fieldWithColon.length);
      const afterField = query.substring(fieldEndPos);
      const newQuery = beforeField + value + afterField;
      
      setQuery(newQuery);
      
      // Position cursor after the inserted value
      setTimeout(() => {
        if (textareaRef.current) {
          const newPosition = fieldStartPos + fieldWithColon.length + value.length;
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newPosition, newPosition);
          setCursorPosition(newPosition);
          
          // Hide suggestions after selection
          setShowSuggestions(false);
        }
      }, 0);
      return;
    }
    
    if (!suggestionType) {
      // Handle command quick templates - replace the slash command with the pattern
      const commandType = value.toLowerCase();
      const beforeSlashCommand = query.substring(0, cursorPosition - (searchTerm.length + 1)); // +1 for the '/'
      const afterSlashCommand = query.substring(cursorPosition);
      const newQuery = beforeSlashCommand + commandType + ':' + afterSlashCommand;
      
      setQuery(newQuery);
      
      // Set cursor position after the colon
      setTimeout(() => {
        if (textareaRef.current) {
          const newCursorPosition = beforeSlashCommand.length + commandType.length + 1; // +1 for the colon
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
          setCursorPosition(newCursorPosition);
          
          // Show suggestions for this field type
          setSuggestionType(commandType as 'stock' | 'timeframe' | 'sector');
          setShowSuggestions(true);
          setSearchTerm('');
        }
      }, 0);
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
          
          // Hide suggestions after selection
          setShowSuggestions(false);
        }
      }, 0);
    }
  };

  // Get filtered suggestions based on search term
  const getFilteredSuggestions = () => {
    return suggestionType 
      ? suggestions[suggestionType].filter(item => 
          item.toLowerCase().includes(searchTerm.toLowerCase()))
      : ['stock', 'sector', 'timeframe'].filter(item => 
          item.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  return {
    handleKeyDown,
    handleChange,
    handleSuggestionSelect,
    getFilteredSuggestions
  };
};
