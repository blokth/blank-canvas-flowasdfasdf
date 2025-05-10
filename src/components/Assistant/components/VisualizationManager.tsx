
import React, { memo } from 'react';
import { ChartRenderer, ChartType } from '@/components/Charts';

// Sample chart data - would be replaced with LLM data in real implementation
import { generateFinancialData, generatePieData } from '@/utils/chartDataGenerators';

export type VisualizationType = 
  'portfolio-breakdown' | 
  'performance-trend' | 
  'stock-comparison' | 
  'expense-categories' | 
  'income-sources' | 
  'forecast' | 
  'wealth-overview' |
  'cash-management' |
  'investment-allocation' |
  'savings-goals' |
  null;

interface VisualizationManagerProps {
  activeVisualization: VisualizationType;
}

// Mapping from visualization types to chart types
const visualizationToChartMap: Record<NonNullable<VisualizationType>, {
  chartType: ChartType;
  getData: () => any[];
  config: any;
}> = {
  'portfolio-breakdown': {
    chartType: 'donut',
    getData: () => generatePieData(['Tech', 'Finance', 'Healthcare', 'Consumer'], [30, 25, 20, 25]),
    config: {
      xAxisKey: 'name',
      colors: ['#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA']
    }
  },
  'performance-trend': {
    chartType: 'line',
    getData: () => generateFinancialData(12, 10000, 200, true),
    config: {
      xAxisKey: 'month',
      series: [
        { name: 'Portfolio Value', key: 'value', color: '#4CAF50' }
      ]
    }
  },
  'stock-comparison': {
    chartType: 'bar',
    getData: () => generateFinancialData(5, 0, 0, false, ['AAPL', 'MSFT', 'GOOG', 'AMZN', 'META']),
    config: {
      xAxisKey: 'month',
      series: [
        { name: 'Return (%)', key: 'value', color: '#9b87f5' },
        { name: 'Previous Period', key: 'prevValue', color: '#D6BCFA' }
      ]
    }
  },
  'expense-categories': {
    chartType: 'stacked-bar',
    getData: () => generateFinancialData(6, 0, 0, false, ['Housing', 'Food', 'Transport', 'Shopping', 'Utilities', 'Other']),
    config: {
      xAxisKey: 'month',
      series: [
        { name: 'Housing', key: 'housing', color: '#6E59A5' },
        { name: 'Food', key: 'food', color: '#7E69AB' },
        { name: 'Transport', key: 'transport', color: '#9b87f5' },
        { name: 'Shopping', key: 'shopping', color: '#D6BCFA' },
        { name: 'Utilities', key: 'utilities', color: '#6E59A5' },
        { name: 'Other', key: 'other', color: '#7E69AB' }
      ]
    }
  },
  'income-sources': {
    chartType: 'pie',
    getData: () => generatePieData(['Salary', 'Investments', 'Side Income'], [60, 25, 15]),
    config: {
      xAxisKey: 'name',
      colors: ['#6E59A5', '#9b87f5', '#D6BCFA']
    }
  },
  'forecast': {
    chartType: 'area',
    getData: () => generateFinancialData(12, 5000, 100, true, undefined, true),
    config: {
      xAxisKey: 'month',
      series: [
        { name: 'Income', key: 'income', color: '#4CAF50' },
        { name: 'Expenses', key: 'expenses', color: '#F44336' }
      ]
    }
  },
  'wealth-overview': {
    chartType: 'stacked-area',
    getData: () => generateFinancialData(12, 10000, 200, true),
    config: {
      xAxisKey: 'month',
      series: [
        { name: 'Cash', key: 'cash', color: '#9b87f5' },
        { name: 'Investments', key: 'investments', color: '#6E59A5' },
        { name: 'Real Estate', key: 'realEstate', color: '#D6BCFA' },
        { name: 'Other Assets', key: 'otherAssets', color: '#7E69AB' }
      ]
    }
  },
  'cash-management': {
    chartType: 'line',
    getData: () => generateFinancialData(30, 5000, 50, true, undefined, false, 'daily'),
    config: {
      xAxisKey: 'day',
      series: [
        { name: 'Cash Balance', key: 'value', color: '#9b87f5' }
      ]
    }
  },
  'investment-allocation': {
    chartType: 'donut',
    getData: () => generatePieData(['Stocks', 'Bonds', 'Cash', 'Real Estate', 'Crypto'], [45, 25, 15, 10, 5]),
    config: {
      xAxisKey: 'name',
      colors: ['#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA', '#8E9196']
    }
  },
  'savings-goals': {
    chartType: 'bar',
    getData: () => {
      return [
        { name: 'Emergency Fund', target: 10000, current: 8000 },
        { name: 'Home Down Payment', target: 50000, current: 25000 },
        { name: 'Retirement', target: 150000, current: 75000 },
        { name: 'Vacation', target: 5000, current: 3500 }
      ];
    },
    config: {
      xAxisKey: 'name',
      series: [
        { name: 'Current', key: 'current', color: '#9b87f5' },
        { name: 'Target', key: 'target', color: '#D6BCFA' }
      ]
    }
  }
};

const VisualizationManager: React.FC<VisualizationManagerProps> = ({ activeVisualization }) => {
  if (!activeVisualization) return null;
  
  const visualConfig = visualizationToChartMap[activeVisualization];
  if (!visualConfig) return null;
  
  const { chartType, getData, config } = visualConfig;
  // Memoize data generation by moving it outside the component
  const data = getData();
  
  return (
    <div className="w-full h-full p-2">
      <ChartRenderer 
        chartType={chartType} 
        data={data} 
        config={config} 
        height={300}
      />
    </div>
  );
};

// Use React.memo to prevent re-renders when props don't change
export default memo(VisualizationManager);
