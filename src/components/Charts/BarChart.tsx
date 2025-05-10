
import React from 'react';
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

export interface BarChartProps {
  data: Array<Record<string, any>>;
  height?: number;
  xAxisKey?: string;
  series: Array<{
    name: string;
    key: string;
    color: string;
  }>;
  layout?: 'vertical' | 'horizontal';
  showGrid?: boolean;
  showLegend?: boolean;
  stackSeries?: boolean;
  className?: string;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 300,
  xAxisKey = 'name',
  series,
  layout = 'horizontal',
  showGrid = true,
  showLegend = true,
  stackSeries = false,
  className,
}) => {
  const config = series.reduce((acc, item) => {
    acc[item.key] = { label: item.name, color: item.color };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  return (
    <ChartContainer config={config} className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart 
          data={data} 
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          layout={layout}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.2} />}
          <XAxis 
            dataKey={layout === 'horizontal' ? xAxisKey : undefined}
            type={layout === 'horizontal' ? 'category' : 'number'}
            axisLine={false} 
            tickLine={false}
            tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
          />
          <YAxis 
            dataKey={layout === 'vertical' ? xAxisKey : undefined}
            type={layout === 'vertical' ? 'category' : 'number'}
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          {series.map((s) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.name}
              fill={`var(--color-${s.key})`}
              radius={[4, 4, 0, 0]}
              stackId={stackSeries ? 'stack' : undefined}
            />
          ))}
          {showLegend && <Legend />}
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default BarChart;
