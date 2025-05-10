
import React, { memo } from 'react';
import AssistantInput from './AssistantInput';

interface ConversationViewProps {
  chunks: string[];
  isLoading: boolean;
  query?: string;
  setQuery?: (query: string) => void;
  onSubmit?: (e: React.FormEvent) => void;
}

const ConversationView: React.FC<ConversationViewProps> = ({
  isLoading,
  query = '',
  setQuery = () => {},
  onSubmit = () => {}
}) => {
  return (
    <div className="flex flex-col h-full border border-border/20 rounded-xl bg-background/80 shadow-sm">
      {/* Input area only */}
      <div className="border-t border-border/10 p-4">
        <AssistantInput
          query={query}
          setQuery={setQuery}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

// Memoize the component to avoid unnecessary rerenders
export default memo(ConversationView);
