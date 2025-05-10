
import { useState, useEffect, RefObject, useCallback } from 'react';

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
  // Use animation frame request ID instead of timer
  const [rafId, setRafId] = useState<number | null>(null);
  
  // Handle input changes with debounced cursor position updates
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    
    // Cancel any pending animation frame
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
    
    // Use requestAnimationFrame instead of setTimeout
    const id = requestAnimationFrame(() => {
      if (textareaRef.current) {
        setCursorPosition(textareaRef.current.selectionStart || 0);
      }
    });
    
    setRafId(id);
    
    return newValue;
  }, [textareaRef, setCursorPosition, rafId]);
  
  // Handle cursor position changes from arrow keys
  const handleCursorPositionChange = useCallback(() => {
    // Cancel any pending animation frame
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
    
    // Use requestAnimationFrame instead of setTimeout
    const id = requestAnimationFrame(() => {
      if (textareaRef.current) {
        setCursorPosition(textareaRef.current.selectionStart || 0);
      }
    });
    
    setRafId(id);
  }, [textareaRef, setCursorPosition, rafId]);
  
  // Auto-resize textarea with the cursor position update - Fix the infinite loop here
  useEffect(() => {
    const checkCursorAndSuggestions = () => {
      if (!textareaRef.current) return;
      
      // Adjust textarea height based on content
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
      
      const cursorPos = textareaRef.current.selectionStart || 0;
      
      // Only update cursor position if it's changed to prevent loops
      if (cursorPos !== prevCursorPos.current) {
        setCursorPosition(cursorPos);
        prevCursorPos.current = cursorPos;
      }
      
      // Check if cursor is positioned after a field: pattern
      const textBeforeCursor = query.substring(0, cursorPos);
      const pattern = /(stock|timeframe|sector):(\w*)$/;
      const match = textBeforeCursor.match(pattern);
      
      if (match) {
        const fieldType = match[1] as 'stock' | 'timeframe' | 'sector';
        const searchValue = match[2] || '';
        
        // Only show suggestions if we're directly after a field: pattern and it's changed
        if (prevFieldType.current !== fieldType || prevSearchValue.current !== searchValue) {
          setSuggestionType(fieldType);
          setSearchTerm(searchValue);
          setShowSuggestions(true);
          
          prevFieldType.current = fieldType;
          prevSearchValue.current = searchValue;
        }
      } else {
        // Check for slash commands
        const slashMatch = /\/(\w*)$/.exec(textBeforeCursor);
        if (slashMatch) {
          const currentSearchTerm = slashMatch[1] || '';
          
          if (prevSlashSearchTerm.current !== currentSearchTerm) {
            setShowSuggestions(true);
            setSuggestionType(null); // null indicates we're showing command suggestions
            setSearchTerm(currentSearchTerm);
            
            prevSlashSearchTerm.current = currentSearchTerm;
          }
        } else if (showSuggestions) {
          // Don't hide suggestions if we're navigating within them
          // Only hide if we've moved to a position without a field: or / pattern
          if (!textareaRef.current.selectionDirection && prevShowSuggestions.current) {
            setShowSuggestions(false);
            prevShowSuggestions.current = false;
          }
        }
      }
    };
    
    // Use refs to track previous values and prevent unnecessary state updates
    const prevCursorPos = { current: 0 };
    const prevFieldType = { current: null as 'stock' | 'timeframe' | 'sector' | null };
    const prevSearchValue = { current: '' };
    const prevSlashSearchTerm = { current: '' };
    const prevShowSuggestions = { current: showSuggestions };
    
    // Run once immediately
    checkCursorAndSuggestions();
    
    // Cancel any pending animation frame
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
    
    // Clean up
    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [query, textareaRef, setSuggestionType, setSearchTerm, setShowSuggestions, setCursorPosition, rafId]);

  return {
    handleChange,
    handleCursorPositionChange
  };
};
