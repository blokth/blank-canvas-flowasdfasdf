
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AssistantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}

const AssistantDialog: React.FC<AssistantDialogProps> = ({ 
  open, 
  onOpenChange, 
  title, 
  children 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-[80vw]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="h-[60vh]">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssistantDialog;
