
import React from 'react';
import ActionPills from '../Assistant/components/ActionPills';
import { VisualizationType } from '../Assistant/components/VisualizationManager';

interface DashboardActionsProps {
  setQuery: (query: string) => void;
  setActiveVisualization: (visualization: VisualizationType) => void;
  setResponse: (response: string | null) => void;
}

const DashboardActions: React.FC<DashboardActionsProps> = ({
  setQuery,
  setActiveVisualization,
  setResponse
}) => {
  // Single handler for all pill clicks that inserts the template into the input
  const handlePillClick = (templateQuery: string) => {
    // Set the query to the template so the user can edit it
    setQuery(templateQuery);
    
    // Focus the input element (handled in the Dashboard component)
    const inputElement = document.querySelector('textarea');
    if (inputElement) {
      setTimeout(() => {
        inputElement.focus();
      }, 0);
    }
  };

  return (
    <div className="my-4 overflow-x-auto pb-2">
      <ActionPills onPillClick={handlePillClick} />
    </div>
  );
};

export default DashboardActions;
