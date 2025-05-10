
import React, { useState } from 'react';
import { VisualizationType } from '../Assistant/components/VisualizationManager';
import AssistantInput from '../Assistant/components/AssistantInput';

interface DashboardAssistantProps {
  setActiveVisualization: (visualization: VisualizationType) => void;
  setResponse: (response: string | null) => void;
  query?: string;
  setQuery?: (query: string) => void;
  onSubmit?: (fullscreen?: boolean) => void;
}

const DashboardAssistant: React.FC<DashboardAssistantProps> = ({
  setActiveVisualization,
  setResponse,
  query: externalQuery,
  setQuery: setExternalQuery,
  onSubmit: parentOnSubmit
}) => {
  const [internalQuery, setInternalQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Add transition state to prevent multiple rapid submissions
  const [isInTransition, setIsInTransition] = useState(false);
  
  // Use either external or internal state
  const query = externalQuery !== undefined ? externalQuery : internalQuery;
  const setQuery = setExternalQuery !== undefined ? setExternalQuery : setInternalQuery;

  // Handle submit - if parent provided onSubmit use that, otherwise handle locally
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim() || isInTransition) return;
    
    // Set transition state to prevent multiple submissions during animation
    setIsInTransition(true);

    if (parentOnSubmit) {
      parentOnSubmit();
    } else {
      setIsLoading(true);
      
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
        setIsLoading(false);
      }, 1000);
    }
    
    // Reset transition state after animation would complete
    setTimeout(() => {
      setIsInTransition(false);
    }, 1100); // slightly longer than animation duration
  };

  return (
    <AssistantInput
      query={query}
      setQuery={setQuery}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};

export default DashboardAssistant;
