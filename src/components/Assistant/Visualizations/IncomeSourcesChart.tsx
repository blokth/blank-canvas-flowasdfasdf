
import React from 'react';

const IncomeSourcesChart: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center flex-col">
      <div className="w-40 h-40 rounded-full border-8 border-tr-purple relative overflow-hidden">
        <div style={{ width: '60%', height: '100%', background: '#6E59A5', position: 'absolute', left: 0 }} />
        <div style={{ width: '25%', height: '100%', background: '#9b87f5', position: 'absolute', left: '60%' }} />
        <div style={{ width: '15%', height: '100%', background: '#D6BCFA', position: 'absolute', left: '85%' }} />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#6E59A5] mr-1 rounded-sm" /> Salary (60%)
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#9b87f5] mr-1 rounded-sm" /> Investments (25%)
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#D6BCFA] mr-1 rounded-sm" /> Side Income (15%)
        </div>
      </div>
    </div>
  );
};

export default IncomeSourcesChart;
