
import React from 'react';

const PortfolioBreakdownChart: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center flex-col">
      <div className="w-40 h-40 rounded-full border-8 border-tr-purple relative overflow-hidden">
        <div style={{ width: '30%', height: '100%', background: '#9b87f5', position: 'absolute', left: 0 }} />
        <div style={{ width: '25%', height: '100%', background: '#7E69AB', position: 'absolute', left: '30%' }} />
        <div style={{ width: '20%', height: '100%', background: '#6E59A5', position: 'absolute', left: '55%' }} />
        <div style={{ width: '25%', height: '100%', background: '#D6BCFA', position: 'absolute', left: '75%' }} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-tr-purple mr-1 rounded-sm" /> Tech (30%)
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#7E69AB] mr-1 rounded-sm" /> Finance (25%)
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#6E59A5] mr-1 rounded-sm" /> Healthcare (20%)
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#D6BCFA] mr-1 rounded-sm" /> Consumer (25%)
        </div>
      </div>
    </div>
  );
};

export default PortfolioBreakdownChart;
