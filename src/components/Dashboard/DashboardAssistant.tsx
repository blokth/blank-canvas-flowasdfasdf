
import React, { useState } from 'react';
import { VisualizationType } from '../Assistant/components/VisualizationManager';
import AssistantInput from '../Assistant/components/AssistantInput';

interface DashboardAssistantProps {
  setActiveVisualization: (visualization: VisualizationType) => void;
  setResponse: (response: string | null) => void;
}

const DashboardAssistant: React.FC<DashboardAssistantProps> = ({
  setActiveVisualization,
  setResponse
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle assistant input submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    // Simulate AI response delay
    setTimeout(() => {
      // Demo responses based on certain keywords
      if (query.toLowerCase().includes('portfolio') && query.toLowerCase().includes('breakdown')) {
        setActiveVisualization('portfolio-breakdown');
        setResponse("Here's your portfolio breakdown by sector:");
      } else if (query.toLowerCase().includes('performance') || query.toLowerCase().includes('trend')) {
        setActiveVisualization('performance-trend');
        setResponse("Here's your portfolio performance over time:");
      } else if (query.toLowerCase().includes('compare') || query.toLowerCase().includes('vs')) {
        setActiveVisualization('stock-comparison');
        setResponse("Here's how your selected stocks compare:");
      } else if (query.toLowerCase().includes('expense') || query.toLowerCase().includes('spending')) {
        setActiveVisualization('expense-categories');
        setResponse("Here's a breakdown of your spending by category:");
      } else if (query.toLowerCase().includes('income') || query.toLowerCase().includes('earnings')) {
        setActiveVisualization('income-sources');
        setResponse("Here's a breakdown of your income sources:");
      } else if (query.toLowerCase().includes('forecast') || query.toLowerCase().includes('prediction')) {
        setActiveVisualization('forecast');
        setResponse("Based on your current financial patterns, here's a 6-month forecast:");
      } else if (query.toLowerCase().includes('wealth') || query.toLowerCase().includes('overview')) {
        setActiveVisualization('wealth-overview');
        setResponse("Here's an overview of your total wealth:");
      } else if (query.toLowerCase().includes('cash') || query.toLowerCase().includes('management')) {
        setActiveVisualization('cash-management');
        setResponse("Here's a summary of your cash accounts:");
      } else if (query.toLowerCase().includes('investment') || query.toLowerCase().includes('allocation')) {
        setActiveVisualization('investment-allocation');
        setResponse("Here's how your investments are allocated:");
      } else if (query.toLowerCase().includes('savings') || query.toLowerCase().includes('goals')) {
        setActiveVisualization('savings-goals');
        setResponse("Here's your progress towards savings goals:");
      } else {
        setActiveVisualization(null);
        setResponse("I can help you analyze your finances. Try asking about portfolio breakdowns, performance trends, stock comparisons, expense categories, income sources, or financial forecasts.");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <AssistantInput
      query={query}
      setQuery={setQuery}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};

export default DashboardAssistant;
