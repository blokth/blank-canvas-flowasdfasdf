
import React from 'react';
import PortfolioSummary from '../components/Dashboard/PortfolioSummary';
import PerformanceChart from '../components/Dashboard/PerformanceChart';
import StockList from '../components/Stocks/StockList';

// Sample data for chart
const chartData = [
  { name: '9:30', value: 10000 },
  { name: '10:00', value: 10200 },
  { name: '10:30', value: 10150 },
  { name: '11:00', value: 10300 },
  { name: '11:30', value: 10250 },
  { name: '12:00', value: 10400 },
  { name: '12:30', value: 10350 },
  { name: '13:00', value: 10500 },
  { name: '13:30', value: 10450 },
  { name: '14:00', value: 10600 },
  { name: '14:30', value: 10650 },
  { name: '15:00', value: 10700 },
  { name: '15:30', value: 10750 },
  { name: '16:00', value: 10800 },
];

const Dashboard = () => {
  const portfolioValue = 10800;
  const portfolioChange = 800;
  const portfolioChangePercent = 8.0;
  const isPositive = portfolioChangePercent >= 0;

  return (
    <div className="pb-16">
      <h1 className="text-2xl font-bold mb-6">Your Portfolio</h1>
      
      <PortfolioSummary 
        totalValue={portfolioValue}
        changePercentage={portfolioChangePercent}
        changeValue={portfolioChange}
      />
      
      <PerformanceChart data={chartData} isPositive={isPositive} />
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Top Performers</h2>
        <StockList />
      </div>
    </div>
  );
};

export default Dashboard;
