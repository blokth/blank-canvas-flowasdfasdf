
import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface ActionPillProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}

const ActionPill: React.FC<ActionPillProps> = ({ icon: Icon, label, onClick }) => {
  return (
    <Button 
      size="sm" 
      variant="outline" 
      onClick={onClick}
      className="text-xs h-8 rounded-full border-border/20 whitespace-nowrap"
    >
      <Icon size={14} className="mr-1" /> {label}
    </Button>
  );
};

export default ActionPill;
