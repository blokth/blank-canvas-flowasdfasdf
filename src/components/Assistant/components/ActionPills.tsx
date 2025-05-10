
import React, { useState } from 'react';
import { PieChart, LineChart, BarChart2, Wallet, BarChart, TrendingUp, Calendar, PiggyBank, BadgeDollarSign, Coins, WalletCards, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionPillsProps {
  onPillClick: (templateQuery: string) => void;
}

const ActionPills: React.FC<ActionPillsProps> = ({
  onPillClick
}) => {
  const [showAllPills, setShowAllPills] = useState(false);

  // Initial 6 pills (3x2 grid)
  const initialPills = (
    <div className="grid grid-cols-3 gap-2 mb-2">
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => onPillClick("Show me my portfolio breakdown by sector")}
        className="text-xs h-8 rounded-full border-border/20 whitespace-nowrap"
      >
        <PieChart size={14} className="mr-1" /> Portfolio
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => onPillClick("Show me my performance trend")}
        className="text-xs h-8 rounded-full border-border/20 whitespace-nowrap"
      >
        <LineChart size={14} className="mr-1" /> Trends
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => onPillClick("Compare my top stocks")}
        className="text-xs h-8 rounded-full border-border/20 whitespace-nowrap"
      >
        <BarChart2 size={14} className="mr-1" /> Stocks
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => onPillClick("Show me my wealth overview")}
        className="text-xs h-8 rounded-full border-border/20 whitespace-nowrap"
      >
        <BadgeDollarSign size={14} className="mr-1" /> Wealth
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => onPillClick("Show me my expense categories")}
        className="text-xs h-8 rounded-full border-border/20 whitespace-nowrap"
      >
        <Wallet size={14} className="mr-1" /> Expenses
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => onPillClick("Show me my income sources")}
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
        onClick={() => onPillClick("Show me my portfolio breakdown by sector")}
        className="text-xs h-8 rounded-full border-border/20 whitespace-nowrap"
      >
        <PieChart size={14} className="mr-1" /> Portfolio
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => onPillClick("Show me my performance trend")}
        className="text-xs h-8 rounded-full border-border/20 whitespace-nowrap"
      >
        <LineChart size={14} className="mr-1" /> Trends
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => onPillClick("Compare my top stocks")}
        className="text-xs h-8 rounded-full border-border/20 whitespace-nowrap"
      >
        <BarChart2 size={14} className="mr-1" /> Stocks
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => onPillClick("Show me my wealth overview")}
        className="text-xs h-8 rounded-full border-border/20 whitespace-nowrap"
      >
        <BadgeDollarSign size={14} className="mr-1" /> Wealth
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => onPillClick("Show me my cash accounts")}
        className="text-xs h-8 rounded-full border-border/20 whitespace-nowrap"
      >
        <Coins size={14} className="mr-1" /> Cash
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => onPillClick("Show me my investment allocation")}
        className="text-xs h-8 rounded-full border-border/20 whitespace-nowrap"
      >
        <WalletCards size={14} className="mr-1" /> Invest
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => onPillClick("Show me my savings goals")}
        className="text-xs h-8 rounded-full border-border/20 whitespace-nowrap"
      >
        <PiggyBank size={14} className="mr-1" /> Goals
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => onPillClick("Show me my expense categories")}
        className="text-xs h-8 rounded-full border-border/20 whitespace-nowrap"
      >
        <Wallet size={14} className="mr-1" /> Expenses
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => onPillClick("Show me my income sources")}
        className="text-xs h-8 rounded-full border-border/20 whitespace-nowrap"
      >
        <BarChart size={14} className="mr-1" /> Income
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => onPillClick("Show me a financial forecast")}
        className="text-xs h-8 rounded-full border-border/20 whitespace-nowrap"
      >
        <TrendingUp size={14} className="mr-1" /> Forecast
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => onPillClick("Show me my monthly spending")}
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
