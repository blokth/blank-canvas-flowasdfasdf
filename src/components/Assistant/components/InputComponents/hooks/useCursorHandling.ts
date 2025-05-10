
import { useState, useEffect, RefObject } from 'react';

interface CursorHandlingProps {
  query: string;
  textareaRef: RefObject<HTMLTextAreaElement>;
  setCursorPosition: (position: number) => void;
  setShowSuggestions: (show: boolean) => void;
  setSuggestionType: (type: 'stock' | 'timeframe' | 'sector' | null) => void;
  setSearchTerm: (term: string) => void;
  showSuggestions: boolean;
}

export const useCursorHandling = ({
  query,
  textareaRef,
  setCursorPosition,
  setShowSuggestions,
  setSuggestionType,
  setSearchTerm,
  showSuggestions
}: CursorHandlingProps) => {
  // Add a debounce timer to prevent frequent cursor position updates
  const [cursorUpdateTimer, setCursorUpdateTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Handle input changes with debounced cursor position updates
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    
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
    
    return newValue;
  };
  
  // Handle cursor position changes from arrow keys
  const handleCursorPositionChange = () => {
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
  };
  
  // Auto-resize textarea with the cursor position update
  useEffect(() => {
    if (textareaRef.current) {
      // Adjust textarea height based on content
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
      
      // Debounce the cursor position update to reduce re-renders
      if (cursorUpdateTimer) {
        clearTimeout(cursorUpdateTimer);
      }
      
      const timer = setTimeout(() => {
        const cursorPos = textareaRef.current?.selectionStart || 0;
        setCursorPosition(cursorPos);
        
        // Check if cursor is positioned after a field: pattern
        const textBeforeCursor = query.substring(0, cursorPos);
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
  }, [query, textareaRef, cursorUpdateTimer]);

  return {
    handleChange,
    handleCursorPositionChange,
    cursorUpdateTimer
  };
};
