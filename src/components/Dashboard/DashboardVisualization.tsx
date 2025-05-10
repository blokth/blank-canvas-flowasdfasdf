
import React, { useState, useEffect } from 'react';
import { Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VisualizationManager, { VisualizationType } from '../Assistant/components/VisualizationManager';
import VisualizationDisplay from '../Assistant/components/VisualizationDisplay';
import AssistantInput from '../Assistant/components/AssistantInput';

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
  showFullscreenChart,
  setShowFullscreenChart,
  query,
  setQuery,
  onSubmit,
  isLoading = false
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
    const newFullscreenState = !isFullscreen;
    setIsFullscreen(newFullscreenState);
    setShowFullscreenChart(newFullscreenState);
  };
  
  return (
    <div 
      className={`origin-bottom transition-all duration-700 ease-in-out 
      ${isFullscreen 
        ? 'fixed inset-0 z-50 bg-background p-4 scale-100 opacity-100' 
        : 'mb-20 scale-95 opacity-100'}`}
      style={{
        transformOrigin: 'bottom center',
        backfaceVisibility: 'hidden',
        willChange: 'transform, opacity',
      }}
    >
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
      <div className={`transition-all duration-700 ${isFullscreen ? 'h-[calc(100%-120px)]' : ''}`}>
        <VisualizationDisplay
          response={response}
          visualization={<VisualizationManager activeVisualization={activeVisualization} />}
          onClick={() => activeVisualization && setShowFullscreenChart(true)}
          showExpandHint={!!activeVisualization && !isFullscreen}
          minimal={true}
        />
      </div>
      
      {/* Input area in fullscreen mode */}
      {isFullscreen && (
        <div className="absolute bottom-4 left-4 right-4">
          <AssistantInput
            query={query}
            setQuery={setQuery}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
};

export default DashboardVisualization;
