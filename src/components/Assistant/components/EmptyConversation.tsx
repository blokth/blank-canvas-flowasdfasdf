
import React from 'react';
import ActionPills from './ActionPills';

interface EmptyConversationProps {
  onPillClick: (templateQuery: string) => void;
}

const EmptyConversation: React.FC<EmptyConversationProps> = ({ onPillClick }) => {
  return (
    <div className="flex flex-col h-full justify-center space-y-6">
      <h3 className="text-lg font-medium">
        Ask me about your finances
      </h3>
      <ActionPills onPillClick={onPillClick} />
    </div>
  );
};

export default EmptyConversation;
