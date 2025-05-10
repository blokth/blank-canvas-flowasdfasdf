
import React from 'react';
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

export interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  height?: number;
  valueKey?: string;
  nameKey?: string;
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
  className?: string;
  colors?: string[];
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  height = 300,
  valueKey = 'value',
  nameKey = 'name',
  innerRadius = 0,
  outerRadius = 80,
  showLegend = true,
  className,
  colors = ['#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA'],
}) => {
  // Create config for each data point
  const config = data.reduce((acc, item, index) => {
    const color = item.color || colors[index % colors.length];
    acc[item.name] = { 
      label: item.name, 
      color: item.color || colors[index % colors.length]
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  return (
    <ChartContainer config={config} className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey={valueKey}
            nameKey={nameKey}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || config[entry.name]?.color || colors[index % colors.length]} 
              />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
          {showLegend && <Legend layout="horizontal" verticalAlign="bottom" align="center" />}
        </RechartsPieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default PieChart;
