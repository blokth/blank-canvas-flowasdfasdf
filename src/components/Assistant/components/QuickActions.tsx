
import React from 'react';
import { PieChart, LineChart, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickActionProps {
  onPortfolioBreakdown: () => void;
  onPerformanceTrend: () => void;
  onStockComparison: () => void;
}

const QuickActions: React.FC<QuickActionProps> = ({
  onPortfolioBreakdown,
  onPerformanceTrend,
  onStockComparison,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onPortfolioBreakdown}
        className="text-xs h-8 rounded-full border-border/20"
      >
        <PieChart size={14} className="mr-1" /> Portfolio Breakdown
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onPerformanceTrend}
        className="text-xs h-8 rounded-full border-border/20"
      >
        <LineChart size={14} className="mr-1" /> Performance Trend
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onStockComparison}
        className="text-xs h-8 rounded-full border-border/20"
      >
        <BarChart2 size={14} className="mr-1" /> Compare Stocks
      </Button>
    </div>
  );
};

export default QuickActions;
