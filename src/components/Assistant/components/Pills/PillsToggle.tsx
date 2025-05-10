
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface PillsToggleProps {
  showAllPills: boolean;
  onToggle: () => void;
}

const PillsToggle: React.FC<PillsToggleProps> = ({ showAllPills, onToggle }) => {
  return (
    <div className="flex justify-center mt-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="text-xs flex items-center gap-1"
      >
        {showAllPills ? (
          <>Less <ChevronUp size={14} /></>
        ) : (
          <>More <ChevronDown size={14} /></>
        )}
      </Button>
    </div>
  );
};

export default PillsToggle;
