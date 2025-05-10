
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
  // Handle template selection
  const handlePillClick = (templateQuery: string) => {
    // Set the query to the template so the user can edit it
    setQuery(templateQuery);

    // Focus the input element
    const inputElement = document.querySelector('textarea');
    if (inputElement) {
      setTimeout(() => {
        inputElement.focus();
      }, 0);
    }
  };

  return <div className="my-4 overflow-x-auto pb-2">
      {/* Original Action Pills */}
      <div className="mb-4">
        <ActionPills onPillClick={handlePillClick} />
      </div>
    </div>;
};

export default DashboardActions;
