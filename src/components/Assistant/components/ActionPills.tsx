
import React, { useState } from 'react';
import { PieChart, LineChart, BarChart2, Wallet, BarChart, TrendingUp, Calendar, PiggyBank, BadgeDollarSign, Coins, WalletCards, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionPillsProps {
  onPortfolioBreakdown: () => void;
  onPerformanceTrend: () => void;
  onStockComparison: () => void;
  onExpenseCategories: () => void;
  onIncomeSources: () => void;
  onFinancialForecast: () => void;
  onMonthlySpending: () => void;
  onCashManagement: () => void;
  onWealthOverview: () => void;
  onInvestmentAllocation: () => void;
  onSavingsGoals: () => void;
}

const ActionPills: React.FC<ActionPillsProps> = ({
  onPortfolioBreakdown,
  onPerformanceTrend,
  onStockComparison,
  onExpenseCategories,
  onIncomeSources,
  onFinancialForecast,
  onMonthlySpending,
  onCashManagement,
  onWealthOverview,
  onInvestmentAllocation,
  onSavingsGoals,
}) => {
  const [showAllPills, setShowAllPills] = useState(false);

  // Initial 6 pills (3x2 grid)
  const initialPills = (
    <div className="grid grid-cols-3 gap-2 mb-2">
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onPortfolioBreakdown}
        className="text-xs h-8 rounded-full border-border/20 whitespace-nowrap"
      >
        <PieChart size={14} className="mr-1" /> Portfolio
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onPerformanceTrend}
        className="text-xs h-8 rounded-full border-border/20 whitespace-nowrap"
      >
        <LineChart size={14} className="mr-1" /> Trends
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onStockComparison}
        className="text-xs h-8 rounded-full border-border/20 whitespace-nowrap"
      >
        <BarChart2 size={14} className="mr-1" /> Stocks
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onWealthOverview}
        className="text-xs h-8 rounded-full border-border/20 whitespace-nowrap"
      >
        <BadgeDollarSign size={14} className="mr-1" /> Wealth
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onExpenseCategories}
        className="text-xs h-8 rounded-full border-border/20 whitespace-nowrap"
      >
        <Wallet size={14} className="mr-1" /> Expenses
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onIncomeSources}
        className="text-xs h-8 rounded-full border-border/20 whitespace-nowrap"
      >
        <BarChart size={14} className="mr-1" /> Income
      </Button>
    </div>
  );

  // All pills in a 3-column grid
  const allPills = (
    <div className="grid grid-cols-3 gap-2 mb-2">
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onPortfolioBreakdown}
        className="text-xs h-8 rounded-full border-border/20 whitespace-nowrap"
      >
        <PieChart size={14} className="mr-1" /> Portfolio
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onPerformanceTrend}
        className="text-xs h-8 rounded-full border-border/20 whitespace-nowrap"
      >
        <LineChart size={14} className="mr-1" /> Trends
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onStockComparison}
        className="text-xs h-8 rounded-full border-border/20 whitespace-nowrap"
      >
        <BarChart2 size={14} className="mr-1" /> Stocks
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onWealthOverview}
        className="text-xs h-8 rounded-full border-border/20 whitespace-nowrap"
      >
        <BadgeDollarSign size={14} className="mr-1" /> Wealth
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onCashManagement}
        className="text-xs h-8 rounded-full border-border/20 whitespace-nowrap"
      >
        <Coins size={14} className="mr-1" /> Cash
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onInvestmentAllocation}
        className="text-xs h-8 rounded-full border-border/20 whitespace-nowrap"
      >
        <WalletCards size={14} className="mr-1" /> Invest
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onSavingsGoals}
        className="text-xs h-8 rounded-full border-border/20 whitespace-nowrap"
      >
        <PiggyBank size={14} className="mr-1" /> Goals
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onExpenseCategories}
        className="text-xs h-8 rounded-full border-border/20 whitespace-nowrap"
      >
        <Wallet size={14} className="mr-1" /> Expenses
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onIncomeSources}
        className="text-xs h-8 rounded-full border-border/20 whitespace-nowrap"
      >
        <BarChart size={14} className="mr-1" /> Income
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
        <Calendar size={14} className="mr-1" /> Budget
      </Button>
    </div>
  );

  return (
    <div className="pb-2">
      {!showAllPills ? initialPills : allPills}
      
      <div className="flex justify-center mt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAllPills(!showAllPills)}
          className="text-xs flex items-center gap-1"
        >
          {showAllPills ? (
            <>Less <ChevronUp size={14} /></>
          ) : (
            <>More <ChevronDown size={14} /></>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ActionPills;
