
import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  CircleDollarSign, 
  PieChart, 
  Wallet, 
  CreditCard, 
  TrendingUp,
  CirclePercent,
  LayoutGrid,
  Category
} from 'lucide-react';

const Dashboard = () => {
  // Finance categories with their respective icons and labels
  const categories = [
    { icon: <Wallet size={24} />, label: 'Budget', color: 'bg-tr-purple' },
    { icon: <PieChart size={24} />, label: 'Investments', color: 'bg-[#4CAF50]' },
    { icon: <CreditCard size={24} />, label: 'Expenses', color: 'bg-[#FF9800]' },
    { icon: <TrendingUp size={24} />, label: 'Income', color: 'bg-[#2196F3]' },
    { icon: <CircleDollarSign size={24} />, label: 'Savings', color: 'bg-[#E91E63]' },
    { icon: <CirclePercent size={24} />, label: 'Goals', color: 'bg-[#9C27B0]' },
    { icon: <Category size={24} />, label: 'Categories', color: 'bg-[#607D8B]' },
    { icon: <LayoutGrid size={24} />, label: 'Overview', color: 'bg-[#FF5722]' },
  ];

  return (
    <div className="pb-16">
      <h1 className="text-2xl font-bold mb-6">Finance Assistant</h1>
      
      <div className="flex flex-col items-center justify-center">
        <div className="relative mb-8">
          {/* Central circle */}
          <div className="w-28 h-28 rounded-full bg-tr-purple/20 border-4 border-tr-purple flex items-center justify-center shadow-lg z-10 relative">
            <div className="text-center">
              <CircleDollarSign className="w-10 h-10 text-tr-purple mx-auto" />
              <p className="text-xs font-medium mt-1">Finance</p>
            </div>
          </div>
          
          {/* Categories around the circle */}
          <div className="absolute top-1/2 left-1/2 w-64 h-64 -translate-x-1/2 -translate-y-1/2 z-0">
            {categories.map((category, index) => {
              // Calculate position in a circle
              const angle = (index * (360 / categories.length)) * (Math.PI / 180);
              const x = Math.cos(angle) * 110;
              const y = Math.sin(angle) * 110;
              
              return (
                <div
                  key={category.label}
                  className={`absolute w-16 h-16 ${category.color} rounded-full flex items-center justify-center text-white shadow-md transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-110`}
                  style={{ 
                    left: `calc(50% + ${x}px)`, 
                    top: `calc(50% + ${y}px)` 
                  }}
                >
                  <div className="text-center">
                    <div className="mx-auto">{category.icon}</div>
                    <p className="text-[10px] font-medium mt-0.5">{category.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <Card className="tr-card w-full max-w-md mt-10">
          <h2 className="text-lg font-medium mb-4">Finance Overview</h2>
          <p className="text-muted-foreground text-sm">
            Welcome to your personal finance assistant. Tap on any category to manage your finances.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
