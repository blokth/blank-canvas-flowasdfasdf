
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DataPoint {
  name: string;
  value: number;
}

interface StockChartProps {
  data: {
    '1D': DataPoint[];
    '1W': DataPoint[];
    '1M': DataPoint[];
    '3M': DataPoint[];
    '1Y': DataPoint[];
    'All': DataPoint[];
  };
  isPositive: boolean;
  activeDataType: 'wealth' | 'cash';
  cashData?: {
    '1D': DataPoint[];
    '1W': DataPoint[];
    '1M': DataPoint[];
    '3M': DataPoint[];
    '1Y': DataPoint[];
    'All': DataPoint[];
  };
  isCashPositive?: boolean;
}

interface PeriodButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const PeriodButton: React.FC<PeriodButtonProps> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-full text-xs ${
      active 
        ? 'bg-background border border-border/30 shadow-sm' 
        : 'text-muted-foreground hover:bg-muted/30'
    }`}
  >
    {children}
  </button>
);

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-2 border border-border/20 shadow-sm rounded-md">
        <p className="text-foreground font-medium">${payload[0].value.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

const StockChart: React.FC<StockChartProps> = ({ 
  data, 
  isPositive, 
  activeDataType,
  cashData, 
  isCashPositive = true 
}) => {
  const periods = ['1D', '1W', '1M', '3M', '1Y', 'All'] as const;
  const [activePeriod, setActivePeriod] = useState<typeof periods[number]>('1D');
  
  const gradientId = "stockChartGradient";
  const chartColor = activeDataType === 'wealth' 
    ? (isPositive ? "#4CAF50" : "#F44336") 
    : (isCashPositive ? "#4CAF50" : "#F44336");
  
  const activeData = activeDataType === 'wealth' ? data : cashData || data;
  
  return (
    <Card className="border-border/20 p-3">
      <div className="flex flex-col space-y-4">
        {/* Just the period selector now */}
        <div className="flex justify-end">
          <div className="flex gap-1 p-1 bg-muted/30 rounded-full">
            {periods.map((period) => (
              <PeriodButton
                key={period}
                active={activePeriod === period}
                onClick={() => setActivePeriod(period)}
              >
                {period}
              </PeriodButton>
            ))}
          </div>
        </div>
        
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={activeData[activePeriod]}
              margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: '#8E9196' }}
                interval="preserveStartEnd"
                minTickGap={30}
              />
              <YAxis 
                hide={true}
                domain={['dataMin - 5', 'dataMax + 5']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="linear" // Changed from "monotone" to "linear" for sharper angles
                dataKey="value"
                stroke={chartColor}
                strokeWidth={1.5}
                fillOpacity={1}
                fill={`url(#${gradientId})`}
                connectNulls={false} // Ensures the line breaks at null/undefined points
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};

export default StockChart;
