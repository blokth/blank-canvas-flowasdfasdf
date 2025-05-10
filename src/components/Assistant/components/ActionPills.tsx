
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

  // Define initial pills (3x2 grid)
  const initialPills = [
    { icon: PieChart, label: 'Portfolio', command: "Show me my portfolio breakdown by sector" },
    { icon: LineChart, label: 'Trends', command: "Show me my performance trend" },
    { icon: BarChart2, label: 'Stocks', command: "Show me my top stocks" },
    { icon: BadgeDollarSign, label: 'Wealth', command: "Show me my wealth overview" },
    { icon: Wallet, label: 'Expenses', command: "Show me my expense categories" },
    { icon: BarChart, label: 'Income', command: "Show me my income sources" }
  ];

  // Define all pills
  const allPills = [
    ...initialPills,
    { icon: Coins, label: 'Cash', command: "Show me my cash accounts" },
    { icon: WalletCards, label: 'Invest', command: "Show me my investment allocation" },
    { icon: PiggyBank, label: 'Goals', command: "Show me my savings goals" },
    { icon: Calendar, label: 'Budget', command: "Show me my monthly spending" }
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
