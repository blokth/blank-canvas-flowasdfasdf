
import React from 'react';
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
  return (
    <form onSubmit={onSubmit}>
      <div className="flex items-center gap-2">
        <Textarea
          placeholder="Ask about your finances or portfolio..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="resize-none text-sm border-border/20"
          rows={2}
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={isLoading || !query.trim()}
          className="shrink-0 h-10 w-10 rounded-full"
          variant="outline"
        >
          <Send size={16} />
        </Button>
      </div>
    </form>
  );
};

export default AssistantInput;
