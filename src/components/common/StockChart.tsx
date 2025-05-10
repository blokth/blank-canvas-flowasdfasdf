
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface DataPoint {
  name: string;
  value: number;
}

interface MultiDataPoint {
  name: string;
  wealth?: number;
  finance?: number;
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
  secondaryData?: {
    '1D': DataPoint[];
    '1W': DataPoint[];
    '1M': DataPoint[];
    '3M': DataPoint[];
    '1Y': DataPoint[];
    'All': DataPoint[];
  };
  isSecondaryPositive?: boolean;
  showBothSeries?: boolean;
  primaryLabel?: string;
  secondaryLabel?: string;
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

const CustomTooltip = ({ active, payload, showBothSeries }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-2 border border-border/20 shadow-sm rounded-md">
        {showBothSeries ? (
          <>
            {payload[0]?.value !== undefined && (
              <p className="text-foreground font-medium text-purple-600">{payload[0].name}: ${payload[0].value.toFixed(2)}</p>
            )}
            {payload[1]?.value !== undefined && (
              <p className="text-foreground font-medium text-indigo-400">{payload[1].name}: ${payload[1].value.toFixed(2)}</p>
            )}
          </>
        ) : (
          <p className="text-foreground font-medium">${payload[0].value.toFixed(2)}</p>
        )}
      </div>
    );
  }
  return null;
};

const StockChart: React.FC<StockChartProps> = ({ 
  data, 
  isPositive, 
  secondaryData, 
  isSecondaryPositive = true,
  showBothSeries = false,
  primaryLabel = "Wealth",
  secondaryLabel = "Personal Finance"
}) => {
  const periods = ['1D', '1W', '1M', '3M', '1Y', 'All'] as const;
  const [activePeriod, setActivePeriod] = useState<typeof periods[number]>('1D');
  
  const primaryGradientId = "primaryChartGradient";
  const secondaryGradientId = "secondaryChartGradient";
  
  const primaryColor = isPositive ? "#4CAF50" : "#F44336";
  const secondaryColor = isSecondaryPositive ? "#7E69AB" : "#F44336";

  // Combine data if showing both series
  const combinedData = showBothSeries && secondaryData ? data[activePeriod].map((item, index) => {
    const secondaryItem = secondaryData[activePeriod][index];
    return {
      name: item.name,
      [primaryLabel]: item.value,
      [secondaryLabel]: secondaryItem ? secondaryItem.value : 0
    };
  }) : data[activePeriod];
  
  return (
    <Card className="border-border/20 p-3">
      <div className="flex items-center justify-center mb-4">
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
            data={combinedData}
            margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id={primaryGradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={primaryColor} stopOpacity={0.2} />
                <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
              </linearGradient>
              {showBothSeries && (
                <linearGradient id={secondaryGradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={secondaryColor} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={secondaryColor} stopOpacity={0} />
                </linearGradient>
              )}
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
            <Tooltip content={<CustomTooltip showBothSeries={showBothSeries} />} />
            
            {showBothSeries ? (
              <>
                <Area
                  type="monotone"
                  dataKey={primaryLabel}
                  stroke={primaryColor}
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill={`url(#${primaryGradientId})`}
                />
                <Area
                  type="monotone"
                  dataKey={secondaryLabel}
                  stroke={secondaryColor}
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill={`url(#${secondaryGradientId})`}
                />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  iconType="circle" 
                  iconSize={8}
                  wrapperStyle={{ fontSize: '11px' }}
                />
              </>
            ) : (
              <Area
                type="monotone"
                dataKey="value"
                stroke={primaryColor}
                strokeWidth={1.5}
                fillOpacity={1}
                fill={`url(#${primaryGradientId})`}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default StockChart;
