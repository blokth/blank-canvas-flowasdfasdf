
import React from 'react';
import PortfolioSummary from '../components/Dashboard/PortfolioSummary';
import PerformanceChart from '../components/Dashboard/PerformanceChart';
import StockList from '../components/Stocks/StockList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalFinance from '../components/Dashboard/PersonalFinance';
import FinanceAssistant from '../components/Assistant/FinanceAssistant';

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
    <div className="pb-16 max-w-md mx-auto">
      <h1 className="text-xl font-medium mb-6 text-center">Portfolio Overview</h1>
      
      <Tabs defaultValue="portfolio" className="w-full mb-6">
        <TabsList className="w-full grid grid-cols-2 h-11 rounded-full p-1 bg-muted/30">
          <TabsTrigger value="portfolio" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm">
            Portfolio
          </TabsTrigger>
          <TabsTrigger value="personal" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm">
            Personal Finance
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="portfolio" className="mt-4 space-y-6">
          <PortfolioSummary 
            totalValue={portfolioValue}
            changePercentage={portfolioChangePercent}
            changeValue={portfolioChange}
          />
          
          <PerformanceChart data={chartData} isPositive={isPositive} />
          
          <div>
            <h2 className="text-base font-medium mb-3">Top Performers</h2>
            <StockList />
          </div>
        </TabsContent>
        
        <TabsContent value="personal" className="mt-4">
          <PersonalFinance />
        </TabsContent>
      </Tabs>
      
      <FinanceAssistant />
    </div>
  );
};

export default Dashboard;
