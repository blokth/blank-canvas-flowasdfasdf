
import React, { useState, useEffect, useMemo } from 'react';
import { VisualizationType } from '../components/Assistant/components/VisualizationManager';
import PortfolioOverview from '../components/Dashboard/PortfolioOverview';
import DashboardVisualization from '../components/Dashboard/DashboardVisualization';
import { generateChartData, generatePersonalFinanceData } from '../utils/chartDataGenerators';
import { useMCPConnection } from '../hooks/useMCPConnection';

const Dashboard = () => {
  // Memoize chart data to prevent regeneration on every render
  const stockChartData = useMemo(() => generateChartData(), []);
  const personalFinanceChartData = useMemo(() => generatePersonalFinanceData(), []);

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
    sendMessage,
    setResponse,
    setVisualizationType
  } = useMCPConnection();
  
  const [activeVisualization, setActiveVisualization] = useState<VisualizationType>(null);

  // Update active visualization when MCP provides one
  useEffect(() => {
    if (visualizationType) {
      setActiveVisualization(visualizationType);
    }
  }, [visualizationType]);

  // Handle assistant submission
  const handleAssistantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      sendMessage(query);
    }
  };

  return (
    <div className="pb-28 w-full">
      {/* Page Title */}
      <h3 className="text-lg font-medium mb-4">Financial Overview</h3>
      
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
      
      {/* Visualization Display */}
      <DashboardVisualization
        response={response}
        activeVisualization={activeVisualization}
        showFullscreenChart={false}
        setShowFullscreenChart={() => {}}
        query={query}
        setQuery={setQuery}
        onSubmit={handleAssistantSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Dashboard;
