
import React, { useState } from 'react';
import { VisualizationType } from '../components/Assistant/components/VisualizationManager';
import PortfolioOverview from '../components/Dashboard/PortfolioOverview';
import DashboardActions from '../components/Dashboard/DashboardActions';
import DashboardVisualization from '../components/Dashboard/DashboardVisualization';
import DashboardAssistant from '../components/Dashboard/DashboardAssistant';
import { generateChartData, generatePersonalFinanceData } from '../utils/chartDataGenerators';

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
  const [response, setResponse] = useState<string | null>(null);
  const [activeVisualization, setActiveVisualization] = useState<VisualizationType>(null);

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

  // Simple mock function for demo purposes
  const handleAssistantSubmit = () => {
    // Demo responses based on certain keywords
    if (query.toLowerCase().includes('portfolio')) {
      setActiveVisualization('portfolio-breakdown');
      setResponse("Here's your portfolio breakdown by sector:");
    } else if (query.toLowerCase().includes('performance')) {
      setActiveVisualization('performance-trend');
      setResponse("Here's your portfolio performance over time:");
    } else {
      setActiveVisualization(null);
      setResponse("I can help you analyze your finances. Try asking about portfolio breakdowns.");
    }
    
    // Show fullscreen on successful response
    if (response) {
      setShowFullscreenChart(true);
    }
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
        setActiveVisualization={setActiveVisualization}
        setResponse={setResponse}
      />
      
      {/* Visualization Display */}
      <DashboardVisualization
        response={response}
        activeVisualization={activeVisualization}
        showFullscreenChart={showFullscreenChart}
        setShowFullscreenChart={setShowFullscreenChart}
        query={query}
        setQuery={setQuery}
        onSubmit={() => handleAssistantSubmit()}
        isLoading={false}
      />
      
      {/* Assistant Input - shown when not in fullscreen mode */}
      {!showFullscreenChart && (
        <div className="fixed bottom-4 left-4 right-4 max-w-lg mx-auto">
          <DashboardAssistant
            setActiveVisualization={setActiveVisualization}
            setResponse={setResponse}
            query={query}
            setQuery={setQuery}
            onSubmit={() => handleAssistantSubmit()}
            isLoading={false}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
