
import React, { useState, useEffect } from 'react';
import { VisualizationType } from '../components/Assistant/components/VisualizationManager';
import PortfolioOverview from '../components/Dashboard/PortfolioOverview';
import DashboardActions from '../components/Dashboard/DashboardActions';
import DashboardVisualization from '../components/Dashboard/DashboardVisualization';
import DashboardAssistant from '../components/Dashboard/DashboardAssistant';
import { generateChartData, generatePersonalFinanceData } from '../utils/chartDataGenerators';
import { useMCPConnection } from '../hooks/useMCPConnection';
import { AlertCircle } from 'lucide-react';

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

  // MCP connection
  const { 
    response, 
    visualizationType, 
    isLoading: mcpLoading, 
    isConnected, 
    connectionError,
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
  const handleAssistantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // If connected to MCP, send message to server
    if (isConnected) {
      const success = await sendMessage(query);
      
      // Show fullscreen on successful response
      if (success && response) {
        setShowFullscreenChart(true);
      }
    } else {
      // Fallback behavior if MCP server is not available
      setTimeout(() => {
        // Demo responses based on query keywords
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
      }, 800);
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
      
      {/* MCP Connection Status Indicator */}
      <div className="mx-4 mb-2">
        {connectionError ? (
          <div className="px-3 py-2 text-xs rounded-md bg-amber-50 text-amber-800 border border-amber-200">
            <div className="flex items-center gap-1 mb-1">
              <AlertCircle size={12} />
              <span className="font-medium">MCP Connection Issue</span>
            </div>
            <p className="text-xs opacity-90">{connectionError}</p>
          </div>
        ) : (
          <div className={`px-2 py-1 text-xs rounded-full inline-flex items-center ${isConnected ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            <div className={`w-2 h-2 rounded-full mr-1 ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            {isConnected ? 'MCP Connected' : 'MCP Offline - Using Fallback Mode'}
          </div>
        )}
      </div>
      
      {/* Action Pills with Selection Templates */}
      <DashboardActions 
        setQuery={handleTemplateSelection}
        setActiveVisualization={setVisualizationType}
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
        isLoading={mcpLoading}
      />
      
      {/* Assistant Input - shown when not in fullscreen mode */}
      {!showFullscreenChart && (
        <div className="fixed bottom-4 left-4 right-4 max-w-lg mx-auto">
          <DashboardAssistant
            setActiveVisualization={setVisualizationType}
            setResponse={setResponse}
            query={query}
            setQuery={setQuery}
            onSubmit={() => {
              handleAssistantSubmit({ preventDefault: () => {} } as React.FormEvent);
            }}
            isConnected={isConnected}
            isLoading={mcpLoading}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
