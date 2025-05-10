
import React from 'react';
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

export interface LineChartProps {
  data: Array<Record<string, any>>;
  height?: number;
  xAxisKey?: string;
  series: Array<{
    name: string;
    key: string;
    color: string;
  }>;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  className?: string;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  height = 300,
  xAxisKey = 'name',
  series,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  className,
}) => {
  const config = series.reduce((acc, item) => {
    acc[item.key] = { label: item.name, color: item.color };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  return (
    <ChartContainer config={config} className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
          {showTooltip && (
            <ChartTooltip content={<ChartTooltipContent />} />
          )}
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              stroke={`var(--color-${s.key})`}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          ))}
          {showLegend && <Legend />}
        </RechartsLineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default LineChart;
