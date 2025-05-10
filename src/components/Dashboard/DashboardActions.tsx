
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
  );
};

export default DashboardActions;
