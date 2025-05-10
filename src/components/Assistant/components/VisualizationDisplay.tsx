
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface VisualizationDisplayProps {
  response: string | null;
  visualization: React.ReactNode;
  onClick?: () => void;
  showExpandHint?: boolean;
  minimal?: boolean;
}

const VisualizationDisplay: React.FC<VisualizationDisplayProps> = ({
  response,
  visualization,
  onClick,
  showExpandHint = false,
  minimal = false,
}) => {
  if (minimal) {
    return (
      <div 
        className="mb-4 bg-background/80 rounded-lg border border-border/5 overflow-hidden"
        onClick={onClick}
      >
        <p className="p-3 text-sm">{response}</p>
        <div className="h-64 bg-background/60 relative">
          {visualization}
          {showExpandHint && (
            <div className="absolute top-2 right-2 bg-white/80 rounded-full p-1 text-xs text-muted-foreground">
              Click to expand
            </div>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <Card className="p-3 mb-4 bg-secondary/20 border-border/10">
      <p className="mb-3 text-sm">{response}</p>
      <div 
        className="h-64 bg-background rounded-md border border-border/10 relative"
        onClick={onClick}
      >
        {visualization}
        {showExpandHint && (
          <div className="absolute top-2 right-2 bg-white/80 rounded-full p-1 text-xs text-muted-foreground">
            Click to expand
          </div>
        )}
      </div>
    </Card>
  );
};

export default VisualizationDisplay;
