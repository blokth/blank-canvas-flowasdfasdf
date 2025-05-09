
import React from 'react';
import { Card } from '@/components/ui/card';
import { CircleDollarSign } from 'lucide-react';

const Dashboard = () => {
  // Finance categories with monochrome colors
  const categories = [
    { label: 'Budget', color: 'bg-black/80' },
    { label: 'Investments', color: 'bg-black/75' },
    { label: 'Expenses', color: 'bg-black/70' },
    { label: 'Income', color: 'bg-black/65' },
    { label: 'Savings', color: 'bg-black/60' },
    { label: 'Goals', color: 'bg-black/55' },
    { label: 'Categories', color: 'bg-black/50' },
    { label: 'Overview', color: 'bg-black/45' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] pb-16">
      <h1 className="text-2xl font-bold mb-10 text-center">Finance Assistant</h1>
      
      <div className="flex flex-col items-center justify-center w-full">
        <div className="relative mb-12">
          {/* Central circle */}
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-white to-white/20 flex items-center justify-center shadow-lg backdrop-blur-sm z-10 relative animate-pulse-gentle">
            <div className="text-center">
              <CircleDollarSign className="w-12 h-12 text-black mx-auto" />
              <p className="text-sm font-medium mt-1 text-black">Finance</p>
            </div>
          </div>
          
          {/* Categories around the circle */}
          <div className="absolute top-1/2 left-1/2 w-72 h-72 -translate-x-1/2 -translate-y-1/2 z-0">
            {categories.map((category, index) => {
              // Calculate position in a circle
              const angle = (index * (360 / categories.length)) * (Math.PI / 180);
              const x = Math.cos(angle) * 120;
              const y = Math.sin(angle) * 120;
              
              return (
                <div
                  key={category.label}
                  className={`absolute rounded-full flex items-center justify-center text-white shadow-md transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-110`}
                  style={{ 
                    left: `calc(50% + ${x}px)`, 
                    top: `calc(50% + ${y}px)` 
                  }}
                >
                  <div className={`${category.color} px-4 py-2 rounded-full backdrop-blur-sm`}>
                    <p className="text-sm font-medium whitespace-nowrap">{category.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <Card className="tr-card w-full max-w-md mt-10 backdrop-blur-sm bg-white/10 border-white/20 animate-fade-in mx-auto">
          <h2 className="text-lg font-medium mb-4 text-center">Finance Overview</h2>
          <p className="text-muted-foreground text-sm text-center">
            Welcome to your personal finance assistant. Select any category to manage your finances.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
