
import React from 'react';
import { Button } from '@/components/ui/button';

interface CommandButton {
  label: string;
  command: string;
}

interface CommandButtonsProps {
  commandButtons: CommandButton[];
  onCommandClick: (command: string) => void;
}

const CommandButtons: React.FC<CommandButtonsProps> = ({
  commandButtons,
  onCommandClick
}) => {
  return (
    <div className="flex flex-wrap gap-2 px-1">
      {commandButtons.map((btn, index) => (
        <Button 
          key={index}
          type="button"
          variant="outline"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={() => onCommandClick(btn.command)}
        >
          {btn.label}
        </Button>
      ))}
    </div>
  );
};

export default CommandButtons;
