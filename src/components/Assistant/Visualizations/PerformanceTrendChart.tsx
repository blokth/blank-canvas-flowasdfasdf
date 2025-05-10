
import React from 'react';

const PerformanceTrendChart: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <svg width="100%" height="160" viewBox="0 0 300 100">
        <path
          d="M0,80 C20,70 40,90 60,75 C80,60 100,50 120,55 C140,60 160,30 180,25 C200,20 220,30 240,20 C260,10 280,5 300,0"
          fill="none"
          stroke="#4CAF50"
          strokeWidth="2"
        />
        <line x1="0" y1="100" x2="300" y2="100" stroke="#8E9196" strokeWidth="1" />
        
        <text x="0" y="115" fontSize="8" fill="#8E9196">Jan</text>
        <text x="60" y="115" fontSize="8" fill="#8E9196">Mar</text>
        <text x="120" y="115" fontSize="8" fill="#8E9196">May</text>
        <text x="180" y="115" fontSize="8" fill="#8E9196">Jul</text>
        <text x="240" y="115" fontSize="8" fill="#8E9196">Sep</text>
        <text x="300" y="115" fontSize="8" fill="#8E9196">Nov</text>
      </svg>
    </div>
  );
};

export default PerformanceTrendChart;
