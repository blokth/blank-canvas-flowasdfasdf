
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
}

interface PeriodButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const PeriodButton: React.FC<PeriodButtonProps> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-md text-sm font-medium ${
      active 
        ? 'bg-tr-purple text-white' 
        : 'text-muted-foreground hover:bg-secondary'
    }`}
  >
    {children}
  </button>
);

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-tr-darker p-2 rounded border border-border/30 shadow-lg">
        <p className="text-foreground font-medium">{`$${payload[0].value.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};

const StockChart: React.FC<StockChartProps> = ({ data, isPositive }) => {
  const periods = ['1D', '1W', '1M', '3M', '1Y', 'All'] as const;
  const [activePeriod, setActivePeriod] = useState<typeof periods[number]>('1D');
  
  const gradientId = "stockChartGradient";
  const chartColor = isPositive ? "#4CAF50" : "#F44336";
  
  return (
    <Card className="tr-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
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
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data[activePeriod]}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: '#8E9196' }}
            />
            <YAxis 
              hide={true}
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={chartColor}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default StockChart;
