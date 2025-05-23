import React, { memo, useMemo } from 'react';
import { LineChart, AreaChart, BarChart, PieChart, DonutChart, ChartType } from './index';

interface ChartRendererProps {
  chartType: ChartType;
  data: any[];
  height?: number;
  config: {
    xAxisKey?: string;
    series?: Array<{
      name: string;
      key: string;
      color: string;
    }>;
    colors?: string[];
  };
}

// Create component ID to ensure stable props comparison
const getChartKey = (chartType: ChartType, data: any[], config: any) => {
  return `${chartType}-${JSON.stringify(config)}`;
};

const ChartRenderer: React.FC<ChartRendererProps> = ({ 
  chartType, 
  data, 
  height = 300,
  config 
}) => {
  // Generate a stable key for this chart configuration
  const chartKey = useMemo(() => getChartKey(chartType, data, config), [chartType, config]);
  
  // Use useMemo to prevent re-rendering if inputs remain the same
  const memoizedContent = useMemo(() => {
    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-48 border border-dashed rounded-md border-border bg-muted/20">
          <p className="text-sm text-muted-foreground">No data available</p>
        </div>
      );
    }

    switch (chartType) {
      case 'line':
        return (
          <LineChart 
            data={data} 
            height={height}
            xAxisKey={config.xAxisKey}
            series={config.series || []}
          />
        );
      
      case 'area':
        return (
          <AreaChart 
            data={data} 
            height={height}
            xAxisKey={config.xAxisKey}
            series={config.series || []}
            stackSeries={false}
          />
        );
        
      case 'stacked-area':
        return (
          <AreaChart 
            data={data} 
            height={height}
            xAxisKey={config.xAxisKey}
            series={config.series || []}
            stackSeries={true}
          />
        );
        
      case 'bar':
        return (
          <BarChart 
            data={data} 
            height={height}
            xAxisKey={config.xAxisKey}
            series={config.series || []}
            stackSeries={false}
          />
        );
        
      case 'stacked-bar':
        return (
          <BarChart 
            data={data} 
            height={height}
            xAxisKey={config.xAxisKey}
            series={config.series || []}
            stackSeries={true}
          />
        );
        
      case 'pie':
        return (
          <PieChart 
            data={data.map((item) => ({
              name: item[config.xAxisKey || 'name'],
              value: item.value,
              color: item.color
            }))} 
            height={height}
            colors={config.colors}
          />
        );
        
      case 'donut':
        return (
          <DonutChart 
            data={data.map((item) => ({
              name: item[config.xAxisKey || 'name'],
              value: item.value,
              color: item.color
            }))} 
            height={height}
            colors={config.colors}
          />
        );
        
      default:
        return (
          <div className="flex items-center justify-center h-48 border border-dashed rounded-md border-border bg-muted/20">
            <p className="text-sm text-muted-foreground">Unknown chart type</p>
          </div>
        );
    }
  }, [chartType, data, height, config, chartKey]);
  
  return memoizedContent;
};

// Apply strict memo comparison to prevent unnecessary re-renders
export default memo(ChartRenderer, (prevProps, nextProps) => {
  // Only re-render if key aspects actually change
  return (
    prevProps.chartType === nextProps.chartType &&
    prevProps.height === nextProps.height &&
    prevProps.data === nextProps.data &&
    JSON.stringify(prevProps.config) === JSON.stringify(nextProps.config)
  );
});
