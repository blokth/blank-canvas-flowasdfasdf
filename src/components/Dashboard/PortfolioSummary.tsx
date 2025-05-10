
import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PortfolioSummaryProps {
  totalValue: number;
  changePercentage: number;
  changeValue: number;
  period?: string;
  className?: string;
}

const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({
  totalValue,
  changePercentage,
  changeValue,
  period = '1D',
  className,
}) => {
  const isPositive = changePercentage >= 0;
  const changeColor = isPositive ? 'text-tr-green' : 'text-tr-red';
  const formattedTotalValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(totalValue);
  
  const formattedChangeValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(changeValue));

  return (
    <Card className={cn("border-border/20 p-4", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">{period}</span>
      </div>
      
      <div className="flex flex-col">
        <span className="text-3xl font-medium mb-1">{formattedTotalValue}</span>
        
        <div className="flex items-center space-x-2">
          <div className={`flex items-center ${changeColor}`}>
            {isPositive ? (
              <TrendingUp size={14} className="mr-1" />
            ) : (
              <TrendingUp size={14} className="mr-1 rotate-180" />
            )}
            <span>
              {isPositive ? '+' : '-'}{Math.abs(changePercentage).toFixed(2)}%
            </span>
          </div>
          
          <span className={`${changeColor} text-sm`}>
            {isPositive ? '+' : '-'}{formattedChangeValue}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default PortfolioSummary;
