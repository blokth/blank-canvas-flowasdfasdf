
import React, { useState } from 'react';
import PortfolioSummary from '../components/Dashboard/PortfolioSummary';
import PerformanceChart from '../components/Dashboard/PerformanceChart';
import AssistantInput from '../components/Assistant/components/AssistantInput';
import VisualizationManager from '../components/Assistant/components/VisualizationManager';
import VisualizationDisplay from '../components/Assistant/components/VisualizationDisplay';
import AssistantDialog from '../components/Assistant/components/AssistantDialog';
import ActionPills from '../components/Assistant/components/ActionPills';
import PersonalFinance from '../components/Dashboard/PersonalFinance';

// Sample data for chart
const chartData = [
  { name: '9:30', value: 10000 },
  { name: '10:00', value: 10200 },
  { name: '10:30', value: 10150 },
  { name: '11:00', value: 10300 },
  { name: '11:30', value: 10250 },
  { name: '12:00', value: 10400 },
  { name: '12:30', value: 10350 },
  { name: '13:00', value: 10500 },
  { name: '13:30', value: 10450 },
  { name: '14:00', value: 10600 },
  { name: '14:30', value: 10650 },
  { name: '15:00', value: 10700 },
  { name: '15:30', value: 10750 },
  { name: '16:00', value: 10800 },
];

// Types
type VisualizationType = 
  'portfolio-breakdown' | 
  'performance-trend' | 
  'stock-comparison' | 
  'expense-categories' | 
  'income-sources' | 
  'forecast' | 
  null;

const Dashboard = () => {
  const portfolioValue = 10800;
  const portfolioChange = 800;
  const portfolioChangePercent = 8.0;
  const isPositive = portfolioChangePercent >= 0;

  // Assistant state
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeVisualization, setActiveVisualization] = useState<VisualizationType>(null);
  const [showFullscreenChart, setShowFullscreenChart] = useState(false);

  // Handle assistant input submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    // Simulate AI response delay
    setTimeout(() => {
      // Demo responses based on certain keywords
      if (query.toLowerCase().includes('portfolio') && query.toLowerCase().includes('breakdown')) {
        setActiveVisualization('portfolio-breakdown');
        setResponse("Here's your portfolio breakdown by sector:");
      } else if (query.toLowerCase().includes('performance') || query.toLowerCase().includes('trend')) {
        setActiveVisualization('performance-trend');
        setResponse("Here's your portfolio performance over time:");
      } else if (query.toLowerCase().includes('compare') || query.toLowerCase().includes('vs')) {
        setActiveVisualization('stock-comparison');
        setResponse("Here's how your selected stocks compare:");
      } else if (query.toLowerCase().includes('expense') || query.toLowerCase().includes('spending')) {
        setActiveVisualization('expense-categories');
        setResponse("Here's a breakdown of your spending by category:");
      } else if (query.toLowerCase().includes('income') || query.toLowerCase().includes('earnings')) {
        setActiveVisualization('income-sources');
        setResponse("Here's a breakdown of your income sources:");
      } else if (query.toLowerCase().includes('forecast') || query.toLowerCase().includes('prediction')) {
        setActiveVisualization('forecast');
        setResponse("Based on your current financial patterns, here's a 6-month forecast:");
      } else {
        setActiveVisualization(null);
        setResponse("I can help you analyze your finances. Try asking about portfolio breakdowns, performance trends, stock comparisons, expense categories, income sources, or financial forecasts.");
      }
      setIsLoading(false);
    }, 1000);
  };

  // Action handlers
  const handlePortfolioBreakdown = () => {
    setQuery("Show me my portfolio breakdown by sector");
    setActiveVisualization('portfolio-breakdown');
    setResponse("Here's your portfolio breakdown by sector:");
  };

  const handlePerformanceTrend = () => {
    setQuery("Show me my performance trend");
    setActiveVisualization('performance-trend');
    setResponse("Here's your portfolio performance over time:");
  };

  const handleStockComparison = () => {
    setQuery("Compare my top stocks");
    setActiveVisualization('stock-comparison');
    setResponse("Here's how your selected stocks compare:");
  };

  const handleExpenseCategories = () => {
    setQuery("Show me my expense categories");
    setActiveVisualization('expense-categories');
    setResponse("Here's a breakdown of your spending by category:");
  };

  const handleIncomeSources = () => {
    setQuery("Show me my income sources");
    setActiveVisualization('income-sources');
    setResponse("Here's a breakdown of your income sources:");
  };

  const handleFinancialForecast = () => {
    setQuery("Show me a financial forecast");
    setActiveVisualization('forecast');
    setResponse("Based on your current financial patterns, here's a 6-month forecast:");
  };

  const handleMonthlySpending = () => {
    setQuery("Show me my monthly spending");
    setActiveVisualization('expense-categories');
    setResponse("Here's your monthly spending pattern:");
  };

  return (
    <div className="pb-16 max-w-lg mx-auto">
      <div className="bg-background/50 rounded-xl p-6 my-4 shadow-sm">
        {/* Minimal Portfolio Summary */}
        <PortfolioSummary 
          totalValue={portfolioValue}
          changePercentage={portfolioChangePercent}
          changeValue={portfolioChange}
          className="mb-4"
          minimal={true}
        />
        
        {/* Minimal Chart */}
        <div className="mb-6">
          <PerformanceChart data={chartData} isPositive={isPositive} minimal={true} />
        </div>
      </div>
      
      {/* All Actions as Pills */}
      <div className="my-4 overflow-x-auto pb-2">
        <ActionPills 
          onPortfolioBreakdown={handlePortfolioBreakdown}
          onPerformanceTrend={handlePerformanceTrend}
          onStockComparison={handleStockComparison} 
          onExpenseCategories={handleExpenseCategories}
          onIncomeSources={handleIncomeSources}
          onFinancialForecast={handleFinancialForecast}
          onMonthlySpending={handleMonthlySpending}
        />
      </div>
      
      {/* Display visualization if available */}
      {response && (
        <VisualizationDisplay
          response={response}
          visualization={<VisualizationManager activeVisualization={activeVisualization} />}
          onClick={() => activeVisualization && setShowFullscreenChart(true)}
          showExpandHint={!!activeVisualization}
          minimal={true}
        />
      )}
      
      {/* ChatGPT-like input */}
      <div className="fixed bottom-20 left-4 right-4 max-w-lg mx-auto">
        <AssistantInput
          query={query}
          setQuery={setQuery}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
      
      {/* Fullscreen chart dialog */}
      <AssistantDialog
        open={showFullscreenChart}
        onOpenChange={setShowFullscreenChart}
        title={response || ""}
      >
        <VisualizationManager activeVisualization={activeVisualization} />
      </AssistantDialog>
    </div>
  );
};

export default Dashboard;
