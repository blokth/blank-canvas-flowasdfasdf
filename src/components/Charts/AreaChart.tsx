
import React from 'react';
import {
  ResponsiveContainer,
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

export interface AreaChartProps {
  data: Array<Record<string, any>>;
  height?: number;
  xAxisKey?: string;
  series: Array<{
    name: string;
    key: string;
    color: string;
  }>;
  showGrid?: boolean;
  className?: string;
  stackSeries?: boolean;
}

const AreaChart: React.FC<AreaChartProps> = ({
  data,
  height = 300,
  xAxisKey = 'name',
  series,
  showGrid = false,
  className,
  stackSeries = false,
}) => {
  const config = series.reduce((acc, item) => {
    acc[item.key] = { label: item.name, color: item.color };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  return (
    <ChartContainer config={config} className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsAreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.2} />}
          <XAxis
            dataKey={xAxisKey}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
            dx={-10}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          {series.map((s, index) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={`var(--color-${s.key})`}
              fill={`var(--color-${s.key})`}
              fillOpacity={0.2}
              stackId={stackSeries ? "stack" : index}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default AreaChart;
