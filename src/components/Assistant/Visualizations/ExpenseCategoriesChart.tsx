
import React from 'react';

const ExpenseCategoriesChart: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <svg width="100%" height="160" viewBox="0 0 300 100">
        <rect x="10" y="10" width="30" height="90" fill="#6E59A5" />
        <rect x="50" y="30" width="30" height="70" fill="#7E69AB" />
        <rect x="90" y="50" width="30" height="50" fill="#9b87f5" />
        <rect x="130" y="40" width="30" height="60" fill="#D6BCFA" />
        <rect x="170" y="70" width="30" height="30" fill="#6E59A5" />
        <rect x="210" y="60" width="30" height="40" fill="#7E69AB" />
        <rect x="250" y="80" width="30" height="20" fill="#9b87f5" />
        
        <text x="25" y="110" fontSize="8" fill="#8E9196" textAnchor="middle">Housing</text>
        <text x="65" y="110" fontSize="8" fill="#8E9196" textAnchor="middle">Food</text>
        <text x="105" y="110" fontSize="8" fill="#8E9196" textAnchor="middle">Transport</text>
        <text x="145" y="110" fontSize="8" fill="#8E9196" textAnchor="middle">Shopping</text>
        <text x="185" y="110" fontSize="8" fill="#8E9196" textAnchor="middle">Utilities</text>
        <text x="225" y="110" fontSize="8" fill="#8E9196" textAnchor="middle">Healthcare</text>
        <text x="265" y="110" fontSize="8" fill="#8E9196" textAnchor="middle">Other</text>
      </svg>
    </div>
  );
};

export default ExpenseCategoriesChart;
