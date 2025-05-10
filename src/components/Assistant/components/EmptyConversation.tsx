import React from 'react';
import { Lightbulb } from 'lucide-react';
import ActionPills from './ActionPills';

interface EmptyConversationProps {
  onPillClick: (templateQuery: string) => void;
}

const EmptyConversation: React.FC<EmptyConversationProps> = ({ onPillClick }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
      <h2 className="text-lg font-semibold text-center">
        How can I help you with your finances?
      </h2>
      <p className="text-sm text-muted-foreground text-center mb-4">
        Choose a common action or type your request below.
      </p>
      <ActionPills onPillClick={onPillClick} />
    </div>
  );
};

export default EmptyConversation;

