
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
  
  // Personal finance values
  const personalFinanceValue = 5350;
  const personalFinanceChange = 350;
  const personalFinanceChangePercent = 7.0;

  // Assistant state
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [activeVisualization, setActiveVisualization] = useState<VisualizationType>(null);
  const [showFullscreenChart, setShowFullscreenChart] = useState(false);
  const [activeDataType, setActiveDataType] = useState<'wealth' | 'cash'>('wealth');
  const [isLoading, setIsLoading] = useState(false);

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

  // Handle assistant submission with fullscreen toggle
  const handleAssistantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    // Process query to determine visualization and response
    setTimeout(() => {
      // Set visualization based on query keywords (similar to DashboardAssistant logic)
      if (query.toLowerCase().includes('portfolio') && query.toLowerCase().includes('breakdown')) {
        setActiveVisualization('portfolio-breakdown');
        setResponse(`Here's your portfolio breakdown by sector:`);
      } else if (query.toLowerCase().includes('compare')) {
        setActiveVisualization('stock-comparison');
        setResponse(`Comparing stocks in your portfolio:`);
      } else if (query.toLowerCase().includes('performance') || query.toLowerCase().includes('trend')) {
        setActiveVisualization('performance-trend');
        setResponse(`Here's the performance trend:`);
      } else if (query.toLowerCase().includes('forecast') || query.toLowerCase().includes('prediction')) {
        setActiveVisualization('forecast');
        setResponse(`Based on current market trends, here's a forecast:`);
      } else if (query.toLowerCase().includes('expense') || query.toLowerCase().includes('spending')) {
        setActiveVisualization('expense-categories');
        setResponse(`Here's a breakdown of your spending by category:`);
      } else if (query.toLowerCase().includes('income') || query.toLowerCase().includes('earnings')) {
        setActiveVisualization('income-sources');
        setResponse(`Here's a breakdown of your income sources:`);
      } else {
        setActiveVisualization(null);
        setResponse("I can help you analyze your finances. Try asking about portfolio breakdowns, performance trends, or stock comparisons.");
      }
      
      // Automatically show fullscreen on successful response
      setShowFullscreenChart(true);
      setIsLoading(false);
    }, 800);
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
        onSubmit={handleAssistantSubmit}
        isLoading={isLoading}
      />
      
      {/* Assistant Input - shown when not in fullscreen mode */}
      {!showFullscreenChart && (
        <div className="fixed bottom-4 left-4 right-4 max-w-lg mx-auto">
          <DashboardAssistant
            setActiveVisualization={setActiveVisualization}
            setResponse={setResponse}
            query={query}
            setQuery={setQuery}
            onSubmit={() => {
              handleAssistantSubmit({ preventDefault: () => {} } as React.FormEvent);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
