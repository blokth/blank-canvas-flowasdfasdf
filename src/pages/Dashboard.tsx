
import React, { useState, useEffect } from 'react';
import { VisualizationType } from '../components/Assistant/components/VisualizationManager';
import PortfolioOverview from '../components/Dashboard/PortfolioOverview';
import DashboardActions from '../components/Dashboard/DashboardActions';
import DashboardVisualization from '../components/Dashboard/DashboardVisualization';
import AssistantInput from '../components/Assistant/components/AssistantInput';
import ConversationView from '../components/Assistant/components/ConversationView';
import { generateChartData, generatePersonalFinanceData } from '../utils/chartDataGenerators';
import { useMCPConnection } from '../hooks/useMCPConnection';

const Dashboard = () => {
  // Generate chart data
  const stockChartData = generateChartData();
  const personalFinanceChartData = generatePersonalFinanceData();

  // Portfolio values
  const portfolioValue = 10800;
  const portfolioChange = 800;
  const portfolioChangePercent = 8.0;
  
  const personalFinanceValue = 5350;
  const personalFinanceChange = 350;
  const personalFinanceChangePercent = 7.0;

  // Assistant state
  const [query, setQuery] = useState('');
  const [activeDataType, setActiveDataType] = useState<'wealth' | 'cash'>('wealth');
  const [showFullscreenChart, setShowFullscreenChart] = useState(false);

  // MCP connection using the updated hook
  const { 
    response, 
    visualizationType, 
    isLoading, 
    chunks,
    sendMessage,
    setResponse,
    setVisualizationType
  } = useMCPConnection();
  
  const [activeVisualization, setActiveVisualization] = useState<VisualizationType>(null);

  // Log chunks when they update
  useEffect(() => {
    if (chunks && chunks.length > 0) {
      console.log('Current chunks in state:', chunks);
    }
  }, [chunks]);

  // Update active visualization when MCP provides one
  useEffect(() => {
    if (visualizationType) {
      setActiveVisualization(visualizationType);
    }
  }, [visualizationType]);

  // Handle template selection from DashboardActions
  const handleTemplateSelection = (template: string) => {
    setQuery(template);
    
    // Focus the input element
    const inputElement = document.querySelector('textarea');
    if (inputElement) {
      setTimeout(() => {
        inputElement.focus();
      }, 0);
    }
  };

  // Handle assistant submission without fullscreen toggle
  const handleAssistantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(query);
    // Removed the automatic fullscreen behavior
  };

  return (
    <div className="pb-28 max-w-lg mx-auto">
      {/* Portfolio Overview with Tabs */}
      <PortfolioOverview 
        stockChartData={stockChartData}
        personalFinanceChartData={personalFinanceChartData}
        portfolioValue={portfolioValue}
        portfolioChange={portfolioChange}
        portfolioChangePercent={portfolioChangePercent}
        personalFinanceValue={personalFinanceValue}
        personalFinanceChange={personalFinanceChange}
        personalFinanceChangePercent={personalFinanceChangePercent}
        activeDataType={activeDataType}
        setActiveDataType={setActiveDataType}
      />
      
      {/* Action Pills with Selection Templates */}
      <DashboardActions 
        setQuery={handleTemplateSelection}
        setActiveVisualization={setVisualizationType}
        setResponse={setResponse}
      />
      
      {/* Conversation View (including streaming chunks) */}
      <div className="mt-4">
        <ConversationView
          chunks={chunks}
          isLoading={isLoading}
        />
      </div>
      
      {/* Visualization Display */}
      <DashboardVisualization
        response={response}
        activeVisualization={activeVisualization}
        showFullscreenChart={false} // Always false to disable fullscreen
        setShowFullscreenChart={() => {}} // Empty function as we're not using fullscreen
        query={query}
        setQuery={setQuery}
        onSubmit={handleAssistantSubmit}
        isLoading={isLoading}
      />
      
      {/* Fixed position input at the bottom */}
      <div className="fixed bottom-4 left-4 right-4 max-w-lg mx-auto">
        <div className="bg-background rounded-xl shadow-sm">
          <AssistantInput
            query={query}
            setQuery={setQuery}
            onSubmit={() => {
              handleAssistantSubmit({ preventDefault: () => {} } as React.FormEvent);
            }}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
