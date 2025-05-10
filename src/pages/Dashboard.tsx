
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import StockChart from '../components/common/StockChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalFinance from '../components/Dashboard/PersonalFinance';
import { Save, ArrowRight } from 'lucide-react';

// Sample data for chart
const chartData = [
  { name: '9:30', value: 80.20 },
  { name: '10:00', value: 80.35 },
  { name: '10:30', value: 80.15 },
  { name: '11:00', value: 79.85 },
  { name: '11:30', value: 80.05 },
  { name: '12:00', value: 80.25 },
  { name: '12:30', value: 79.90 },
  { name: '13:00', value: 79.95 },
  { name: '13:30', value: 80.10 },
  { name: '14:00', value: 80.30 },
  { name: '14:30', value: 80.40 },
  { name: '15:00', value: 80.28 },
  { name: '15:30', value: 80.32 },
  { name: '16:00', value: 80.32 },
];

const Dashboard = () => {
  const stockName = "S&P 500 EUR (Acc)";
  const currentValue = 80.32;
  const changePercent = 0.09;
  const isPositive = changePercent >= 0;
  
  // Simple chart data for different time periods
  const simplifiedChartData = {
    '1D': chartData,
    '1W': chartData.map(item => ({ ...item, value: item.value * (1 + Math.random() * 0.05) })),
    '1M': chartData.map(item => ({ ...item, value: item.value * (1 + Math.random() * 0.1) })),
    '3M': chartData.map(item => ({ ...item, value: item.value * (1 + Math.random() * 0.15) })),
    '1Y': chartData.map(item => ({ ...item, value: item.value * (1 + Math.random() * 0.2) })),
    'Max': chartData.map(item => ({ ...item, value: item.value * (1 + Math.random() * 0.3) })),
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black pb-24">
      <div className="flex justify-between items-center py-4 px-4">
        <div className="w-8 h-8"></div>
        <button className="text-sm font-medium">Follow</button>
      </div>
      
      <div className="px-4">
        <h1 className="text-2xl font-bold mb-1">{stockName}</h1>
        
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold">{currentValue}</span>
          <span className="text-sm">{isPositive ? '+' : ''}{changePercent}%</span>
        </div>
        
        <Tabs defaultValue="portfolio" className="w-full">
          <TabsList className="flex w-full mb-8 overflow-x-auto bg-transparent space-x-2 border-0">
            <TabsTrigger 
              value="1D" 
              className="data-[state=active]:bg-black data-[state=active]:text-white rounded-full px-3 py-1 text-sm bg-gray-100"
            >
              1D
            </TabsTrigger>
            <TabsTrigger 
              value="1W" 
              className="data-[state=active]:bg-black data-[state=active]:text-white rounded-full px-3 py-1 text-sm bg-gray-100"
            >
              1W
            </TabsTrigger>
            <TabsTrigger 
              value="1M" 
              className="data-[state=active]:bg-black data-[state=active]:text-white rounded-full px-3 py-1 text-sm bg-gray-100"
            >
              1M
            </TabsTrigger>
            <TabsTrigger 
              value="1Y" 
              className="data-[state=active]:bg-black data-[state=active]:text-white rounded-full px-3 py-1 text-sm bg-gray-100"
            >
              1Y
            </TabsTrigger>
            <TabsTrigger 
              value="Max" 
              className="data-[state=active]:bg-black data-[state=active]:text-white rounded-full px-3 py-1 text-sm bg-gray-100"
            >
              Max
            </TabsTrigger>
          </TabsList>
          
          <div className="h-64 -mx-4 mb-8">
            <svg viewBox="0 0 400 150" className="w-full h-full" preserveAspectRatio="none">
              <path 
                d="M0,75 C50,50 100,100 150,75 C200,50 250,100 300,75 C350,50 400,75 400,75" 
                stroke="black" 
                strokeWidth="1.5" 
                fill="none" 
              />
            </svg>
          </div>
          
          <div className="fixed bottom-24 inset-x-0 px-4">
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-full gap-2 bg-black text-white hover:bg-black/90">
                <Save size={20} />
                Save
              </Button>
              <Button className="flex-1 rounded-full gap-2 bg-black text-white hover:bg-black/90">
                Buy
                <ArrowRight size={20} />
              </Button>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
