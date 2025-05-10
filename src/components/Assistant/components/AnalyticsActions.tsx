
import React from 'react';
import { Wallet, BarChart, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AnalyticsActionsProps {
  onExpenseCategories: () => void;
  onIncomeSources: () => void;
  onFinancialForecast: () => void;
  onMonthlySpending: () => void;
}

const AnalyticsActions: React.FC<AnalyticsActionsProps> = ({
  onExpenseCategories,
  onIncomeSources,
  onFinancialForecast,
  onMonthlySpending,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onExpenseCategories}
        className="text-xs h-8 rounded-full border-border/20"
      >
        <Wallet size={14} className="mr-1" /> Expense Analysis
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onIncomeSources}
        className="text-xs h-8 rounded-full border-border/20"
      >
        <BarChart size={14} className="mr-1" /> Income Breakdown
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onFinancialForecast}
        className="text-xs h-8 rounded-full border-border/20"
      >
        <TrendingUp size={14} className="mr-1" /> Financial Forecast
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onMonthlySpending}
        className="text-xs h-8 rounded-full border-border/20"
      >
        <Calendar size={14} className="mr-1" /> Monthly Budget
      </Button>
    </div>
  );
};

export default AnalyticsActions;
