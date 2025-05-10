
import React from 'react';
import { PieChart, LineChart, BarChart2, Wallet, BarChart, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionPillsProps {
  onPortfolioBreakdown: () => void;
  onPerformanceTrend: () => void;
  onStockComparison: () => void;
  onExpenseCategories: () => void;
  onIncomeSources: () => void;
  onFinancialForecast: () => void;
  onMonthlySpending: () => void;
}

const ActionPills: React.FC<ActionPillsProps> = ({
  onPortfolioBreakdown,
  onPerformanceTrend,
  onStockComparison,
  onExpenseCategories,
  onIncomeSources,
  onFinancialForecast,
  onMonthlySpending,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onPortfolioBreakdown}
        className="text-xs h-8 rounded-full border-border/20 whitespace-nowrap"
      >
        <PieChart size={14} className="mr-1" /> Portfolio Breakdown
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onPerformanceTrend}
        className="text-xs h-8 rounded-full border-border/20 whitespace-nowrap"
      >
        <LineChart size={14} className="mr-1" /> Performance Trend
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onStockComparison}
        className="text-xs h-8 rounded-full border-border/20 whitespace-nowrap"
      >
        <BarChart2 size={14} className="mr-1" /> Compare Stocks
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onExpenseCategories}
        className="text-xs h-8 rounded-full border-border/20 whitespace-nowrap"
      >
        <Wallet size={14} className="mr-1" /> Expense Analysis
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onIncomeSources}
        className="text-xs h-8 rounded-full border-border/20 whitespace-nowrap"
      >
        <BarChart size={14} className="mr-1" /> Income Sources
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onFinancialForecast}
        className="text-xs h-8 rounded-full border-border/20 whitespace-nowrap"
      >
        <TrendingUp size={14} className="mr-1" /> Forecast
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onMonthlySpending}
        className="text-xs h-8 rounded-full border-border/20 whitespace-nowrap"
      >
        <Calendar size={14} className="mr-1" /> Monthly Budget
      </Button>
    </div>
  );
};

export default ActionPills;
