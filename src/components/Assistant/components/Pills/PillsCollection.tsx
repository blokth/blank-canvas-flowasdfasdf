
import React from 'react';
import ActionPill from './ActionPill';
import { LucideIcon } from 'lucide-react';

interface PillItem {
  icon: LucideIcon;
  label: string;
  command: string;
}

interface PillsCollectionProps {
  pills: PillItem[];
  onPillClick: (command: string) => void;
}

const PillsCollection: React.FC<PillsCollectionProps> = ({ pills, onPillClick }) => {
  return (
    <div className="grid grid-cols-3 gap-2 mb-2">
      {pills.map((pill, index) => (
        <ActionPill
          key={index}
          icon={pill.icon}
          label={pill.label}
          onClick={() => onPillClick(pill.command)}
        />
      ))}
    </div>
  );
};

export default PillsCollection;
