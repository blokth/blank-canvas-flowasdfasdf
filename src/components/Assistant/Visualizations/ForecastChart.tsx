
import React from 'react';

const ForecastChart: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <svg width="100%" height="160" viewBox="0 0 300 100">
        <path
          d="M0,70 L50,65 L100,68 L150,60 L200,55 L250,45 L300,42"
          fill="none"
          stroke="#4CAF50"
          strokeWidth="2"
        />
        <path
          d="M0,40 L50,45 L100,43 L150,48 L200,50 L250,58 L300,62"
          fill="none"
          stroke="#F44336"
          strokeWidth="2"
          strokeDasharray="3,3"
        />
        <line x1="0" y1="100" x2="300" y2="100" stroke="#8E9196" strokeWidth="1" />
        
        <text x="0" y="115" fontSize="8" fill="#8E9196">Jun</text>
        <text x="50" y="115" fontSize="8" fill="#8E9196">Jul</text>
        <text x="100" y="115" fontSize="8" fill="#8E9196">Aug</text>
        <text x="150" y="115" fontSize="8" fill="#8E9196">Sep</text>
        <text x="200" y="115" fontSize="8" fill="#8E9196">Oct</text>
        <text x="250" y="115" fontSize="8" fill="#8E9196">Nov</text>
        <text x="300" y="115" fontSize="8" fill="#8E9196">Dec</text>
        
        <circle cx="0" cy="70" r="2" fill="#4CAF50" />
        <circle cx="50" cy="65" r="2" fill="#4CAF50" />
        <circle cx="100" cy="68" r="2" fill="#4CAF50" />
        <circle cx="150" cy="60" r="2" fill="#4CAF50" />
        <circle cx="200" cy="55" r="2" fill="#4CAF50" />
        <circle cx="250" cy="45" r="2" fill="#4CAF50" />
        <circle cx="300" cy="42" r="2" fill="#4CAF50" />
        
        <text x="150" y="20" fontSize="8" fill="#4CAF50" textAnchor="middle">Income (Actual & Projected)</text>
        <text x="150" y="35" fontSize="8" fill="#F44336" textAnchor="middle">Expenses (Actual & Projected)</text>
      </svg>
    </div>
  );
};

export default ForecastChart;
