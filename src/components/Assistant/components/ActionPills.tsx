
import React, { useState } from 'react';
import { 
  PieChart, LineChart, BarChart2, Wallet, BarChart, 
  Calendar, PiggyBank, BadgeDollarSign, Coins, WalletCards 
} from 'lucide-react';
import PillsCollection from './Pills/PillsCollection';
import PillsToggle from './Pills/PillsToggle';

interface ActionPillsProps {
  onPillClick: (templateQuery: string) => void;
}

const ActionPills: React.FC<ActionPillsProps> = ({ onPillClick }) => {
  const [showAllPills, setShowAllPills] = useState(false);

  // Define initial pills with field:value style
  const initialPills = [
    { icon: PieChart, label: 'Portfolio', command: "Show me my portfolio breakdown by sector:" },
    { icon: LineChart, label: 'Trends', command: "Show stock: performance trend for timeframe:" },
    { icon: BarChart2, label: 'Stocks', command: "Compare stock: with other stocks" },
    { icon: BadgeDollarSign, label: 'Wealth', command: "Show me my wealth overview for timeframe:" },
    { icon: Wallet, label: 'Expenses', command: "Show my timeframe: expense categories" },
    { icon: BarChart, label: 'Income', command: "Show my income sources for timeframe:" }
  ];

  // Define all pills
  const allPills = [
    ...initialPills,
    { icon: Coins, label: 'Cash', command: "Show me my cash accounts for timeframe:" },
    { icon: WalletCards, label: 'Invest', command: "Show my investment allocation in sector:" },
    { icon: PiggyBank, label: 'Goals', command: "Show my savings goals progress for timeframe:" },
    { icon: Calendar, label: 'Budget', command: "Show my monthly spending in sector: sector" }
  ];

  const handleToggle = () => {
    setShowAllPills(!showAllPills);
  };

  return (
    <div className="pb-2">
      <PillsCollection 
        pills={showAllPills ? allPills : initialPills} 
        onPillClick={onPillClick} 
      />
      
      <PillsToggle 
        showAllPills={showAllPills} 
        onToggle={handleToggle} 
      />
    </div>
  );
};

export default ActionPills;
