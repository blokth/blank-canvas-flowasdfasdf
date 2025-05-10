
import React from 'react';
import PieChart, { PieChartProps } from './PieChart';

export interface DonutChartProps extends Omit<PieChartProps, 'innerRadius'> {
  innerRadius?: number;
  label?: string;
  subLabel?: string;
}

const DonutChart: React.FC<DonutChartProps> = ({ 
  innerRadius = 60, 
  outerRadius = 80,
  label,
  subLabel,
  ...props 
}) => {
  return (
    <div className="relative">
      <PieChart 
        innerRadius={innerRadius} 
        outerRadius={outerRadius} 
        {...props} 
      />
      
      {(label || subLabel) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {label && <div className="text-xl font-medium">{label}</div>}
          {subLabel && <div className="text-sm text-muted-foreground">{subLabel}</div>}
        </div>
      )}
    </div>
  );
};

export default DonutChart;
