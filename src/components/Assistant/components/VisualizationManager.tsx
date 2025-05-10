
import React from 'react';
import PortfolioBreakdownChart from '../Visualizations/PortfolioBreakdownChart';
import PerformanceTrendChart from '../Visualizations/PerformanceTrendChart';
import StockComparisonChart from '../Visualizations/StockComparisonChart';
import ExpenseCategoriesChart from '../Visualizations/ExpenseCategoriesChart';
import IncomeSourcesChart from '../Visualizations/IncomeSourcesChart';
import ForecastChart from '../Visualizations/ForecastChart';

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

const VisualizationManager: React.FC<VisualizationManagerProps> = ({ activeVisualization }) => {
  switch (activeVisualization) {
    case 'portfolio-breakdown':
      return <PortfolioBreakdownChart />;
    case 'performance-trend':
      return <PerformanceTrendChart />;
    case 'stock-comparison':
      return <StockComparisonChart />;
    case 'expense-categories':
      return <ExpenseCategoriesChart />;
    case 'income-sources':
      return <IncomeSourcesChart />;
    case 'forecast':
      return <ForecastChart />;
    // For the new visualization types, fallback to existing visualizations for now
    case 'wealth-overview':
      return <PortfolioBreakdownChart />;
    case 'cash-management':
      return <IncomeSourcesChart />;
    case 'investment-allocation':
      return <PortfolioBreakdownChart />;
    case 'savings-goals':
      return <ForecastChart />;
    default:
      return null;
  }
};

export default VisualizationManager;
