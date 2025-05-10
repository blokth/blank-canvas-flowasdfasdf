
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PortfolioSummary from './PortfolioSummary';
import StockChart from '../common/StockChart';

interface PortfolioOverviewProps {
  stockChartData: {
    '1D': { name: string; value: number }[];
    '1W': { name: string; value: number }[];
    '1M': { name: string; value: number }[];
    '3M': { name: string; value: number }[];
    '1Y': { name: string; value: number }[];
    'All': { name: string; value: number }[];
  };
  personalFinanceChartData: {
    '1D': { name: string; value: number }[];
    '1W': { name: string; value: number }[];
    '1M': { name: string; value: number }[];
    '3M': { name: string; value: number }[];
    '1Y': { name: string; value: number }[];
    'All': { name: string; value: number }[];
  };
  portfolioValue: number;
  portfolioChange: number;
  portfolioChangePercent: number;
  personalFinanceValue: number;
  personalFinanceChange: number;
  personalFinanceChangePercent: number;
  activeDataType: 'wealth' | 'cash';
  setActiveDataType: (value: 'wealth' | 'cash') => void;
}

const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({
  stockChartData,
  personalFinanceChartData,
  portfolioValue,
  portfolioChange,
  portfolioChangePercent,
  personalFinanceValue,
  personalFinanceChange,
  personalFinanceChangePercent,
  activeDataType,
  setActiveDataType
}) => {
  const isPositive = portfolioChangePercent >= 0;
  const isPersonalFinancePositive = personalFinanceChangePercent >= 0;

  return (
    <div className="bg-background/50 rounded-xl shadow-sm overflow-hidden">
      <Tabs 
        value={activeDataType} 
        onValueChange={(value) => setActiveDataType(value as 'wealth' | 'cash')}
        className="flex flex-col"
      >
        <div className="border-b border-border/10">
          <TabsList className="w-full rounded-none bg-transparent h-12 px-4">
            <TabsTrigger 
              value="wealth" 
              className="flex-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Wealth
            </TabsTrigger>
            <TabsTrigger 
              value="cash" 
              className="flex-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Cash
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="wealth" className="p-6" noTopMargin>
          <PortfolioSummary 
            totalValue={portfolioValue}
            changePercentage={portfolioChangePercent}
            changeValue={portfolioChange}
            className="mb-4"
            minimal={true}
            type="wealth"
          />
          
          <div className="mb-2">
            <StockChart 
              data={stockChartData} 
              isPositive={isPositive} 
              activeDataType="wealth"
              cashData={personalFinanceChartData}
              isCashPositive={isPersonalFinancePositive}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="cash" className="p-6" noTopMargin>
          <PortfolioSummary 
            totalValue={personalFinanceValue}
            changePercentage={personalFinanceChangePercent}
            changeValue={personalFinanceChange}
            className="mb-4"
            minimal={true}
            type="cash"
          />
          
          <div className="mb-2">
            <StockChart 
              data={stockChartData} 
              isPositive={isPersonalFinancePositive} 
              activeDataType="cash"
              cashData={personalFinanceChartData}
              isCashPositive={isPersonalFinancePositive}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortfolioOverview;
