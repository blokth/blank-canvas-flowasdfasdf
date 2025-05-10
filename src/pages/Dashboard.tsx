
import React, { useState, useEffect, useMemo } from 'react';
import PortfolioOverview from '../components/Dashboard/PortfolioOverview';
import { generateChartData, generatePersonalFinanceData } from '../utils/chartDataGenerators';

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
