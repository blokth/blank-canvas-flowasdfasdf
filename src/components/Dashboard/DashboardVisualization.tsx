
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
  // Add preloaded state to track when the visualization is ready
  const [isPreloaded, setIsPreloaded] = useState(false);
  // Add transition state to ensure smooth animation
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Effect to handle automatic fullscreen when showFullscreenChart changes
  useEffect(() => {
    if (showFullscreenChart && !isFullscreen) {
      // Set transitioning state first
      setIsTransitioning(true);
      
      // Then set fullscreen after a very small delay to ensure
      // the browser applies the transition correctly
      requestAnimationFrame(() => {
        setIsFullscreen(true);
      });
    } else if (!showFullscreenChart && isFullscreen) {
      setIsTransitioning(true);
      setIsFullscreen(false);
    }
  }, [showFullscreenChart, isFullscreen]);
  
  // Reset transitioning state after animation completes
  useEffect(() => {
    const transitionEndHandler = () => {
      setIsTransitioning(false);
    };
    
    const timeout = setTimeout(() => {
      setIsTransitioning(false);
    }, 550); // Changed from 1100ms to 550ms (slightly longer than animation duration to ensure it completes)
    
    return () => clearTimeout(timeout);
  }, [isFullscreen]);
  
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
  
  const toggleFullscreen = () => {
    // Always go through the showFullscreenChart prop to ensure
    // we trigger the animation effect
    const newFullscreenState = !isFullscreen;
    setShowFullscreenChart(newFullscreenState);
    // Note: setIsFullscreen is now handled by the effect above
  };
  
  return (
    <>
      {/* Hidden preloader that renders offscreen */}
      {response && !isPreloaded && (
        <div className="fixed opacity-0 pointer-events-none" aria-hidden="true">
          <VisualizationManager activeVisualization={activeVisualization} />
        </div>
      )}
      
      <div 
        className={`transition-all duration-500 ease-in-out will-change-transform will-change-opacity
        ${isFullscreen 
          ? 'fixed inset-0 z-50 bg-background p-4 scale-100 opacity-100' 
          : 'mb-20 scale-100 opacity-100 transform translate-y-0'}`}
        style={{
          transformOrigin: 'bottom center',
          backfaceVisibility: 'hidden',
          willChange: 'transform, opacity',
          transform: isFullscreen ? 'translateY(0)' : 'translateY(20px)',
          opacity: isFullscreen || isPreloaded ? 1 : 0,
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
        <div 
          className={`transition-all duration-500 ${isFullscreen ? 'h-[calc(100%-120px)]' : ''}`}
          style={{ contain: 'paint layout' }} // Optimize rendering performance
        >
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
    </>
  );
};

export default DashboardVisualization;
