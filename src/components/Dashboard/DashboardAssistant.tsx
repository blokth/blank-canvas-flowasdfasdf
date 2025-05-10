
import React, { useState } from 'react';
import { VisualizationType } from '../Assistant/components/VisualizationManager';
import ConversationView from '../Assistant/components/ConversationView';

interface DashboardAssistantProps {
  setActiveVisualization: (visualization: VisualizationType) => void;
  setResponse: (response: string | null) => void;
  query?: string;
  setQuery?: (query: string) => void;
  onSubmit?: (e: React.FormEvent) => void;
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
  
  // Use either external or internal state
  const query = externalQuery !== undefined ? externalQuery : internalQuery;
  const setQuery = setExternalQuery !== undefined ? setExternalQuery : setInternalQuery;
  const isLoading = externalIsLoading || internalIsLoading;

  // Handle submit - if parent provided onSubmit use that, otherwise handle locally
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;

    if (parentOnSubmit) {
      parentOnSubmit(e);
    } else {
      setInternalIsLoading(true);
      
      // Simulate AI response delay
      setTimeout(() => {
        // Demo responses based on certain keywords
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
  };

  return (
    <div className="relative h-full">
      {/* Full conversation view with input */}
      <ConversationView
        chunks={chunks}
        isLoading={isLoading}
        query={query}
        setQuery={setQuery}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default DashboardAssistant;
