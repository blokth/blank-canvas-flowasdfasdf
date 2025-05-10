
import React, { useState, useEffect } from 'react';
import { Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VisualizationManager, { VisualizationType } from '../Assistant/components/VisualizationManager';
import VisualizationDisplay from '../Assistant/components/VisualizationDisplay';
import AssistantDialog from '../Assistant/components/AssistantDialog';

interface DashboardVisualizationProps {
  response: string | null;
  activeVisualization: VisualizationType;
  showFullscreenChart: boolean;
  setShowFullscreenChart: (value: boolean) => void;
  query?: string;
}

const DashboardVisualization: React.FC<DashboardVisualizationProps> = ({
  response,
  activeVisualization,
  showFullscreenChart,
  setShowFullscreenChart,
  query
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Effect to handle automatic fullscreen when showFullscreenChart changes
  useEffect(() => {
    if (showFullscreenChart) {
      setIsFullscreen(true);
    }
  }, [showFullscreenChart]);
  
  if (!response) return null;
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      setShowFullscreenChart(true);
    }
  };
  
  return (
    <div className={`transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 bg-background p-4' : 'mb-20'}`}>
      <div className="flex justify-between items-center mb-2">
        <div></div> {/* Empty div for flex alignment */}
        {response && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="ml-auto"
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            <span className="ml-2">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </Button>
        )}
      </div>
      
      {/* Display visualization if available */}
      <div className={`${isFullscreen ? 'h-[calc(100%-80px)]' : ''}`}>
        <VisualizationDisplay
          response={response}
          visualization={<VisualizationManager activeVisualization={activeVisualization} />}
          onClick={() => activeVisualization && setShowFullscreenChart(true)}
          showExpandHint={!!activeVisualization && !isFullscreen}
          minimal={true}
        />
      </div>
      
      {/* Display query at the bottom of fullscreen view */}
      {isFullscreen && query && (
        <div className="absolute bottom-4 left-4 right-4 bg-muted/30 p-3 rounded-lg border border-border/30">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Query:</span> {query}
          </p>
        </div>
      )}
      
      {/* Fullscreen chart dialog */}
      <AssistantDialog
        open={showFullscreenChart && !isFullscreen}
        onOpenChange={setShowFullscreenChart}
        title={response || ""}
      >
        <div className="p-4">
          <VisualizationManager activeVisualization={activeVisualization} />
          
          {/* Display query at the bottom of dialog */}
          {query && (
            <div className="mt-4 bg-muted/30 p-3 rounded-lg border border-border/30">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Query:</span> {query}
              </p>
            </div>
          )}
        </div>
      </AssistantDialog>
    </div>
  );
};

export default DashboardVisualization;
