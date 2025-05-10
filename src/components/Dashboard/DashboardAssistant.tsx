
import React, { useState, useRef } from 'react';
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
  const submissionInProgressRef = useRef(false);
  
  // Use either external or internal state
  const query = externalQuery !== undefined ? externalQuery : internalQuery;
  const setQuery = setExternalQuery !== undefined ? setExternalQuery : setInternalQuery;
  const isLoading = externalIsLoading || internalIsLoading;

  // Handle submit without nested setTimeouts
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim() || submissionInProgressRef.current) return;
    
    // Set submission flag to prevent multiple submissions
    submissionInProgressRef.current = true;
    
    // Store current query before it gets cleared
    const currentQuery = query.trim(); 

    // Clear response immediately
    setResponse(null);
    
    // Clear query immediately
    if (setExternalQuery) {
      setExternalQuery('');
    } else {
      setInternalQuery('');
    }

    // Handle submission based on whether a parent handler exists
    if (parentOnSubmit) {
      // Call the parent submit handler directly
      parentOnSubmit(e);
      // Reset submission flag after a short delay
      setTimeout(() => {
        submissionInProgressRef.current = false;
      }, 500);
    } else {
      // Handle locally - simulate AI response
      setInternalIsLoading(true);
      
      // Use a single timeout for the response simulation
      setTimeout(() => {
        // Demo responses based on certain keywords
        if (currentQuery.toLowerCase().includes('portfolio')) {
          setActiveVisualization('portfolio-breakdown');
          setResponse("Here's your portfolio breakdown by sector:");
        } else {
          setActiveVisualization(null);
          setResponse("I can help you analyze your finances. Try asking about portfolio breakdowns.");
        }
        setInternalIsLoading(false);
        submissionInProgressRef.current = false;
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
