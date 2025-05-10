import React, { useState } from 'react';
import PortfolioSummary from '../components/Dashboard/PortfolioSummary';
import PerformanceChart from '../components/Dashboard/PerformanceChart';
import AssistantInput from '../components/Assistant/components/AssistantInput';
import VisualizationManager, { VisualizationType } from '../components/Assistant/components/VisualizationManager';
import VisualizationDisplay from '../components/Assistant/components/VisualizationDisplay';
import AssistantDialog from '../components/Assistant/components/AssistantDialog';
import ActionPills from '../components/Assistant/components/ActionPills';
import PersonalFinance from '../components/Dashboard/PersonalFinance';
import StockChart from '../components/common/StockChart';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

// Generate realistic time series data with many data points
const generateRealisticStockData = (baseValue: number, volatility: number, points: number) => {
  const data = [];
  let currentValue = baseValue;
  
  // For realistic stock price movements
  const getNextValue = (current: number, vol: number) => {
    // Random walk with occasional jumps
    const random = Math.random();
    let change;
    
    if (random > 0.97) { // Major event (3% chance)
      change = (Math.random() * 2 - 1) * vol * 3.5;
    } else if (random > 0.85) { // Significant move (12% chance)
      change = (Math.random() * 2 - 1) * vol * 1.8;
    } else if (random > 0.6) { // Medium move (25% chance)
      change = (Math.random() * 2 - 1) * vol * 1.2;
    } else { // Small move (60% chance)
      change = (Math.random() * 2 - 1) * vol * 0.6;
    }
    
    return Math.max(current + change, 1);
  };
  
  for (let i = 0; i < points; i++) {
    currentValue = getNextValue(currentValue, volatility);
    
    let label;
    if (points <= 24) {
      const hour = Math.floor(9 + (i * 7/24)); // Trading hours 9:30 - 16:00
      const minute = (i % 4) * 15;
      label = `${hour}:${minute === 0 ? '00' : minute}`;
    } else if (points <= 100) {
      label = i.toString();
    } else {
      label = '';
    }
    
    data.push({
      name: label,
      value: parseFloat(currentValue.toFixed(2))
    });
  }
  
  return data;
};

// Generate detailed datasets for different time periods
const stockChartData = {
  // 1D - minute by minute data (390 trading minutes in a day)
  '1D': generateRealisticStockData(10000, 15, 390),
  
  // 1W - hourly data (5 trading days * ~7 hours = 35 points)
  '1W': generateRealisticStockData(9800, 45, 35),
  
  // 1M - daily data (~22 trading days)
  '1M': generateRealisticStockData(9500, 80, 22),
  
  // 3M - daily data (~66 trading days)
  '3M': generateRealisticStockData(9000, 120, 66),
  
  // 1Y - daily data (~252 trading days)
  '1Y': generateRealisticStockData(8500, 200, 252),
  
  // All - weekly data (several years worth)
  'All': generateRealisticStockData(7500, 300, 260),
};

const personalFinanceChartData = {
  '1D': generateRealisticStockData(5000, 7, 390),
  '1W': generateRealisticStockData(4900, 20, 35),
  '1M': generateRealisticStockData(4800, 40, 22),
  '3M': generateRealisticStockData(4700, 60, 66),
  '1Y': generateRealisticStockData(4500, 100, 252),
  'All': generateRealisticStockData(4000, 150, 260),
};

// We're no longer defining VisualizationType here, using the imported one instead

const Dashboard = () => {
  const portfolioValue = 10800;
  const portfolioChange = 800;
  const portfolioChangePercent = 8.0;
  const isPositive = portfolioChangePercent >= 0;

  // Personal finance values
  const personalFinanceValue = 5350;
  const personalFinanceChange = 350;
  const personalFinanceChangePercent = 7.0;
  const isPersonalFinancePositive = personalFinanceChangePercent >= 0;

  // Assistant state
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeVisualization, setActiveVisualization] = useState<VisualizationType>(null);
  const [showFullscreenChart, setShowFullscreenChart] = useState(false);
  const [activeDataType, setActiveDataType] = useState<'wealth' | 'cash'>('wealth');

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
      } else if (query.toLowerCase().includes('wealth') || query.toLowerCase().includes('overview')) {
        setActiveVisualization('wealth-overview');
        setResponse("Here's an overview of your total wealth:");
      } else if (query.toLowerCase().includes('cash') || query.toLowerCase().includes('management')) {
        setActiveVisualization('cash-management');
        setResponse("Here's a summary of your cash accounts:");
      } else if (query.toLowerCase().includes('investment') || query.toLowerCase().includes('allocation')) {
        setActiveVisualization('investment-allocation');
        setResponse("Here's how your investments are allocated:");
      } else if (query.toLowerCase().includes('savings') || query.toLowerCase().includes('goals')) {
        setActiveVisualization('savings-goals');
        setResponse("Here's your progress towards savings goals:");
      } else {
        setActiveVisualization(null);
        setResponse("I can help you analyze your finances. Try asking about portfolio breakdowns, performance trends, stock comparisons, expense categories, income sources, or financial forecasts.");
      }
      setIsLoading(false);
    }, 1000);
  };

  // Action handlers for existing pills
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

  // New action handlers for personal finance pills
  const handleWealthOverview = () => {
    setQuery("Show me my wealth overview");
    setActiveVisualization('wealth-overview');
    setResponse("Here's an overview of your total wealth:");
  };

  const handleCashManagement = () => {
    setQuery("Show me my cash accounts");
    setActiveVisualization('cash-management');
    setResponse("Here's a summary of your cash accounts:");
  };

  const handleInvestmentAllocation = () => {
    setQuery("Show me my investment allocation");
    setActiveVisualization('investment-allocation');
    setResponse("Here's how your investments are allocated:");
  };

  const handleSavingsGoals = () => {
    setQuery("Show me my savings goals");
    setActiveVisualization('savings-goals');
    setResponse("Here's your progress towards savings goals:");
  };

  return (
    <div className="pb-16 max-w-lg mx-auto">
      {/* Integrated Portfolio Overview with Tabs */}
      <div className="bg-background/50 rounded-xl shadow-sm overflow-hidden">
        <Tabs 
          value={activeDataType} 
          onValueChange={(value) => setActiveDataType(value as 'wealth' | 'cash')}
          className="flex flex-col"
        >
          <div className="border-b border-border/10">
            <TabsList className="w-full rounded-none bg-transparent h-12 px-4">
              <TabsTrigger 
                value="wealth" 
                className="flex-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                Wealth
              </TabsTrigger>
              <TabsTrigger 
                value="cash" 
                className="flex-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                Cash
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="wealth" className="p-6" noTopMargin>
            <PortfolioSummary 
              totalValue={portfolioValue}
              changePercentage={portfolioChangePercent}
              changeValue={portfolioChange}
              className="mb-4"
              minimal={true}
              type="wealth"
            />
            
            <div className="mb-2">
              <StockChart 
                data={stockChartData} 
                isPositive={isPositive} 
                activeDataType="wealth"
                cashData={personalFinanceChartData}
                isCashPositive={isPersonalFinancePositive}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="cash" className="p-6" noTopMargin>
            <PortfolioSummary 
              totalValue={personalFinanceValue}
              changePercentage={personalFinanceChangePercent}
              changeValue={personalFinanceChange}
              className="mb-4"
              minimal={true}
              type="cash"
            />
            
            <div className="mb-2">
              <StockChart 
                data={stockChartData} 
                isPositive={isPersonalFinancePositive} 
                activeDataType="cash"
                cashData={personalFinanceChartData}
                isCashPositive={isPersonalFinancePositive}
              />
            </div>
          </TabsContent>
        </Tabs>
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
          onWealthOverview={handleWealthOverview}
          onCashManagement={handleCashManagement}
          onInvestmentAllocation={handleInvestmentAllocation}
          onSavingsGoals={handleSavingsGoals}
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
