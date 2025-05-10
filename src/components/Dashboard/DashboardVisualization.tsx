
import React, { useState } from 'react';
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
}

const DashboardVisualization: React.FC<DashboardVisualizationProps> = ({
  response,
  activeVisualization,
  showFullscreenChart,
  setShowFullscreenChart
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  if (!response) return null;
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
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
      <VisualizationDisplay
        response={response}
        visualization={<VisualizationManager activeVisualization={activeVisualization} />}
        onClick={() => activeVisualization && setShowFullscreenChart(true)}
        showExpandHint={!!activeVisualization}
        minimal={true}
      />
      
      {/* Fullscreen chart dialog */}
      <AssistantDialog
        open={showFullscreenChart}
        onOpenChange={setShowFullscreenChart}
        title={response || ""}
      >
        <div className="p-4">
          <VisualizationManager activeVisualization={activeVisualization} />
        </div>
      </AssistantDialog>
    </div>
  );
};

export default DashboardVisualization;
