
import React, { useState } from 'react';
import { VisualizationType } from '../Assistant/components/VisualizationManager';
import AssistantInput from '../Assistant/components/AssistantInput';

interface DashboardAssistantProps {
  setActiveVisualization: (visualization: VisualizationType) => void;
  setResponse: (response: string | null) => void;
  query?: string;
  setQuery?: (query: string) => void;
  onSubmit?: (fullscreen?: boolean) => void;
  isConnected?: boolean;
  isLoading?: boolean;
  chunks?: string[];
}

const DashboardAssistant: React.FC<DashboardAssistantProps> = ({
  setActiveVisualization,
  setResponse,
  query: externalQuery,
  setQuery: setExternalQuery,
  onSubmit: parentOnSubmit,
  isLoading: externalIsLoading = false,
  chunks = []
}) => {
  const [internalQuery, setInternalQuery] = useState('');
  const [internalIsLoading, setInternalIsLoading] = useState(false);
  const [isInTransition, setIsInTransition] = useState(false);
  const [showChunks, setShowChunks] = useState(false);
  
  // Use either external or internal state
  const query = externalQuery !== undefined ? externalQuery : internalQuery;
  const setQuery = setExternalQuery !== undefined ? setExternalQuery : setInternalQuery;
  const isLoading = externalIsLoading || internalIsLoading;

  // Handle submit - if parent provided onSubmit use that, otherwise handle locally
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim() || isInTransition) return;
    
    // Set transition state to prevent multiple submissions during animation
    setIsInTransition(true);

    if (parentOnSubmit) {
      parentOnSubmit();
    } else {
      setInternalIsLoading(true);
      
      // Simulate AI response delay
      setTimeout(() => {
        // Demo responses based on certain keywords (simplified from the original)
        if (query.toLowerCase().includes('portfolio')) {
          setActiveVisualization('portfolio-breakdown');
          setResponse("Here's your portfolio breakdown by sector:");
        } else {
          setActiveVisualization(null);
          setResponse("I can help you analyze your finances. Try asking about portfolio breakdowns.");
        }
        setInternalIsLoading(false);
      }, 1000);
    }
    
    // Reset transition state after animation would complete
    setTimeout(() => {
      setIsInTransition(false);
    }, 550); // Changed from 1100ms to 550ms (slightly longer than animation duration)
  };

  return (
    <div className="relative">
      {chunks && chunks.length > 0 && showChunks && (
        <div className="mb-2 p-2 bg-slate-50 border rounded-md overflow-auto max-h-32">
          <h3 className="font-medium text-xs mb-1">Stream Chunks:</h3>
          <pre className="text-xs whitespace-pre-wrap">{chunks.join('')}</pre>
        </div>
      )}
      
      {chunks && chunks.length > 0 && (
        <button 
          onClick={() => setShowChunks(!showChunks)} 
          className="mb-2 text-xs text-blue-600 hover:text-blue-800"
        >
          {showChunks ? 'Hide' : 'Show'} Stream Data
        </button>
      )}
      
      <AssistantInput
        query={query}
        setQuery={setQuery}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default DashboardAssistant;
