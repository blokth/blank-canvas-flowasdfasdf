
import React from 'react';
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
  if (!response) return null;
  
  return (
    <div className="mb-20"> {/* Added bottom margin to make space for assistant input */}
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
        <VisualizationManager activeVisualization={activeVisualization} />
      </AssistantDialog>
    </div>
  );
};

export default DashboardVisualization;
