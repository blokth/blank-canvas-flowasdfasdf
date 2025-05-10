
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  color?: string;
}

const PeriodButton: React.FC<PeriodButtonProps> = ({ active, onClick, children, color = "#8E9196" }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-full text-xs transition-all ${
      active 
        ? 'bg-background border border-border/30 shadow-sm text-foreground' 
        : `text-muted-foreground hover:text-foreground hover:bg-muted/30`
    }`}
    style={{ borderColor: active ? color : 'transparent' }}
  >
    {children}
  </button>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-2 border border-border/20 shadow-sm rounded-md">
        {label && <p className="text-xs text-muted-foreground">{label}</p>}
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
  
  // Different tick counts for different periods for more consistency
  const getTickConfig = (period: typeof periods[number]) => {
    switch (period) {
      case '1D': return { interval: 'preserveEnd', count: 4 };
      case '1W': return { interval: 'preserveEnd', count: 5 };
      case '1M': return { interval: 'preserveEnd', count: 4 };
      case '3M': return { interval: 'preserveEnd', count: 5 };
      case '1Y': return { interval: 'preserveEnd', count: 4 };
      case 'All': return { interval: 'preserveEnd', count: 5 };
    }
  };

  // Custom tick formatter for each period type
  const getTickFormatter = (period: typeof periods[number]) => {
    switch (period) {
      case '1D':
        return (value: string) => value; // Show hours
      case '1W':
        return (value: string) => value; // Show days
      case '1M': 
      case '3M':
      case '1Y':
      case 'All':
        return (value: string) => value; // Show abbreviated months/dates
    }
  };
  
  const tickConfig = getTickConfig(activePeriod);
  const tickFormatter = getTickFormatter(activePeriod);

  return (
    <Card className="border-border/20 p-3">
      <div className="flex flex-col space-y-4">
        {/* Period selector */}
        <div className="flex justify-end">
          <div className="flex gap-1 p-1 bg-muted/30 rounded-full">
            {periods.map((period) => (
              <PeriodButton
                key={period}
                active={activePeriod === period}
                onClick={() => setActivePeriod(period)}
                color={chartColor}
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
                interval={tickConfig.interval as any}
                minTickGap={30}
                height={20}
                padding={{ left: 0, right: 0 }}
                tickFormatter={tickFormatter}
                tickCount={tickConfig.count}
              />
              <YAxis 
                hide={true}
                domain={['auto', 'auto']}
              />
              <Tooltip 
                content={<CustomTooltip />} 
                animationDuration={200}
                cursor={{ stroke: '#8E9196', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area
                type="linear"
                dataKey="value"
                stroke={chartColor}
                strokeWidth={1.5}
                fillOpacity={1}
                fill={`url(#${gradientId})`}
                dot={false}
                activeDot={{ r: 5, fill: chartColor, stroke: '#fff', strokeWidth: 1 }}
                connectNulls={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};

export default StockChart;
