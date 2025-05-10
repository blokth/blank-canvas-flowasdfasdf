
import React, { useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface AssistantInputProps {
  query: string;
  setQuery: (query: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const AssistantInput: React.FC<AssistantInputProps> = ({
  query,
  setQuery,
  onSubmit,
  isLoading,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (query.trim() && !isLoading) {
        onSubmit(e as unknown as React.FormEvent);
      }
    }
    
    // Special trigger keys for quick templates with selectors
    if (e.key === '/') {
      // Show template options menu in the future
    }
  };

  // Set a template in the assistant input
  const setTemplate = (template: string) => {
    setQuery(template);
    if (textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    }
  };

  // Quick template buttons
  const quickTemplates = [
    { label: "Stock", template: "Show me AAPL performance for the past 3 months" },
    { label: "Forecast", template: "Show me a forecast for MSFT" }
  ];

  return (
    <form onSubmit={onSubmit} className="bg-background border border-border/20 rounded-xl shadow-sm">
      <div className="flex flex-col gap-2 p-2">
        {/* Quick templates */}
        <div className="flex gap-2 px-1">
          {quickTemplates.map((template, index) => (
            <Button 
              key={index}
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => setTemplate(template.template)}
            >
              /{template.label}
            </Button>
          ))}
        </div>

        <div className="relative">
          <Textarea
            ref={textareaRef}
            placeholder="Ask about your finances or portfolio..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="resize-none text-sm border-0 focus-visible:ring-0 shadow-none min-h-10 py-3 bg-transparent pr-10"
            rows={1}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !query.trim()}
            className="absolute right-1 bottom-1 shrink-0 h-8 w-8 rounded-full"
            variant="ghost"
          >
            <Send size={16} className={isLoading ? 'opacity-50' : ''} />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AssistantInput;
