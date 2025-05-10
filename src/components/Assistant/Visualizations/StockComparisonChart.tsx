
import React from 'react';

const StockComparisonChart: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <svg width="100%" height="160" viewBox="0 0 300 100">
        <rect x="30" y="20" width="40" height="80" fill="#9b87f5" />
        <rect x="90" y="40" width="40" height="60" fill="#7E69AB" />
        <rect x="150" y="10" width="40" height="90" fill="#6E59A5" />
        <rect x="210" y="50" width="40" height="50" fill="#D6BCFA" />
        
        <text x="50" y="110" fontSize="8" fill="#8E9196" textAnchor="middle">AAPL</text>
        <text x="110" y="110" fontSize="8" fill="#8E9196" textAnchor="middle">MSFT</text>
        <text x="170" y="110" fontSize="8" fill="#8E9196" textAnchor="middle">GOOGL</text>
        <text x="230" y="110" fontSize="8" fill="#8E9196" textAnchor="middle">AMZN</text>
      </svg>
    </div>
  );
};

export default StockComparisonChart;
