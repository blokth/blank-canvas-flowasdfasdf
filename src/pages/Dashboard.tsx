
import React, { useState, useMemo } from 'react';
import PortfolioOverview from '../components/Dashboard/PortfolioOverview';

// Simple data generator function
const generateChartData = () => {
  const generateDataPoints = (baseValue: number, points: number) => {
    const data = [];
    let value = baseValue;
    
    for (let i = 0; i < points; i++) {
      value = Math.max(value + (Math.random() * 20 - 10), baseValue * 0.8);
      data.push({
        name: i.toString(),
        value: parseFloat(value.toFixed(2))
      });
    }
    
    return data;
  };
  
  return {
    '1D': generateDataPoints(10000, 24),
    '1W': generateDataPoints(9800, 7),
    '1M': generateDataPoints(9500, 30),
    '3M': generateDataPoints(9000, 90),
    '1Y': generateDataPoints(8500, 365),
    'All': generateDataPoints(7500, 500),
  };
};

// Simple data generator for personal finance
const generatePersonalFinanceData = () => {
  const generateDataPoints = (baseValue: number, points: number) => {
    const data = [];
    let value = baseValue;
    
    for (let i = 0; i < points; i++) {
      value = Math.max(value + (Math.random() * 10 - 5), baseValue * 0.8);
      data.push({
        name: i.toString(),
        value: parseFloat(value.toFixed(2))
      });
    }
    
    return data;
  };
  
  return {
    '1D': generateDataPoints(5000, 24),
    '1W': generateDataPoints(4900, 7),
    '1M': generateDataPoints(4800, 30),
    '3M': generateDataPoints(4700, 90),
    '1Y': generateDataPoints(4500, 365),
    'All': generateDataPoints(4000, 500),
  };
};

const Dashboard = () => {
  // Memoize chart data to prevent regeneration on every render
  const stockChartData = useMemo(() => generateChartData(), []);
  const personalFinanceChartData = useMemo(() => generatePersonalFinanceData(), []);

  // Portfolio values
  const portfolioValue = 10800;
  const portfolioChange = 800;
  const portfolioChangePercent = 8.0;
  const personalFinanceValue = 5350;
  const personalFinanceChange = 350;
  const personalFinanceChangePercent = 7.0;
  
  // State for active data type
  const [activeDataType, setActiveDataType] = useState<'wealth' | 'cash'>('wealth');

  return (
    <div className="pb-28 w-full">
      {/* Portfolio Overview with Tabs */}
      <PortfolioOverview 
        stockChartData={stockChartData} 
        personalFinanceChartData={personalFinanceChartData} 
        portfolioValue={portfolioValue} 
        portfolioChange={portfolioChange} 
        portfolioChangePercent={portfolioChangePercent} 
        personalFinanceValue={personalFinanceValue} 
        personalFinanceChange={personalFinanceChange} 
        personalFinanceChangePercent={personalFinanceChangePercent} 
        activeDataType={activeDataType} 
        setActiveDataType={setActiveDataType} 
      />
    </div>
  );
};

export default Dashboard;
