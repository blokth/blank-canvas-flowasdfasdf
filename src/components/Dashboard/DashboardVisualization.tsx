
import React, { useState, useEffect } from 'react';
import { VisualizationType } from '../Assistant/components/VisualizationManager';
import VisualizationDisplay from '../Assistant/components/VisualizationDisplay';
import AssistantInput from '../Assistant/components/AssistantInput';
import { VisualizationManager } from '../Assistant/components/VisualizationManager';

interface DashboardVisualizationProps {
  response: string | null;
  activeVisualization: VisualizationType;
  showFullscreenChart: boolean;
  setShowFullscreenChart: (value: boolean) => void;
  query: string;
  setQuery: (query: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

const DashboardVisualization: React.FC<DashboardVisualizationProps> = ({
  response,
  activeVisualization,
  query,
  setQuery,
  onSubmit,
  isLoading = false
}) => {
  // Add preloaded state to track when the visualization is ready
  const [isPreloaded, setIsPreloaded] = useState(false);
  
  // Preload the visualization component as soon as we have a response
  useEffect(() => {
    if (response) {
      // Immediate loading flag to start browser work
      requestAnimationFrame(() => {
        // Use this to trigger layout calculations ahead of time
        setIsPreloaded(true);
      });
    }
  }, [response, activeVisualization]);
  
  if (!response) return null;
  
  return (
    <div className="mb-20 animate-fade-in">
      {/* Hidden preloader that renders offscreen */}
      {response && !isPreloaded && (
        <div className="fixed opacity-0 pointer-events-none" aria-hidden="true">
          <VisualizationManager activeVisualization={activeVisualization} />
        </div>
      )}
      
      <div className="transform translate-y-0 opacity-100">
        {/* Display visualization if available */}
        <div>
          <VisualizationDisplay
            visualization={<VisualizationManager activeVisualization={activeVisualization} />}
            minimal={true}
            response={response}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardVisualization;
