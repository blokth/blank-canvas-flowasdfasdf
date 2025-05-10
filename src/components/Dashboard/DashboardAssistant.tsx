
import React, { useState } from 'react';
import { VisualizationType } from '../Assistant/components/VisualizationManager';
import AssistantInput from '../Assistant/components/AssistantInput';

interface DashboardAssistantProps {
  setActiveVisualization: (visualization: VisualizationType) => void;
  setResponse: (response: string | null) => void;
  query?: string;
  setQuery?: (query: string) => void;
}

const DashboardAssistant: React.FC<DashboardAssistantProps> = ({
  setActiveVisualization,
  setResponse,
  query: externalQuery,
  setQuery: setExternalQuery
}) => {
  const [internalQuery, setInternalQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Use either external or internal state
  const query = externalQuery !== undefined ? externalQuery : internalQuery;
  const setQuery = setExternalQuery !== undefined ? setExternalQuery : setInternalQuery;

  // Process query to replace any remaining placeholders
  const processQuery = (rawQuery: string) => {
    // Replace any placeholder that wasn't filled
    let processed = rawQuery
      .replace(/{{stock}}/g, "AAPL")
      .replace(/{{timeframe}}/g, "3 months")
      .replace(/{{sector}}/g, "Technology");
    
    return processed;
  };

  // Handle assistant input submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // Process any remaining placeholders before submitting
    const processedQuery = processQuery(query);
    
    setIsLoading(true);
    
    // Simulate AI response delay
    setTimeout(() => {
      // Demo responses based on certain keywords
      if (processedQuery.toLowerCase().includes('portfolio') && processedQuery.toLowerCase().includes('breakdown')) {
        setActiveVisualization('portfolio-breakdown');
        setResponse("Here's your portfolio breakdown by sector:");
      } else if (processedQuery.toLowerCase().includes('performance') || processedQuery.toLowerCase().includes('trend')) {
        setActiveVisualization('performance-trend');
        setResponse("Here's your portfolio performance over time:");
      } else if (processedQuery.toLowerCase().includes('compare') || processedQuery.toLowerCase().includes('vs')) {
        setActiveVisualization('stock-comparison');
        setResponse("Here's how your selected stocks compare:");
      } else if (processedQuery.toLowerCase().includes('expense') || processedQuery.toLowerCase().includes('spending')) {
        setActiveVisualization('expense-categories');
        setResponse("Here's a breakdown of your spending by category:");
      } else if (processedQuery.toLowerCase().includes('income') || processedQuery.toLowerCase().includes('earnings')) {
        setActiveVisualization('income-sources');
        setResponse("Here's a breakdown of your income sources:");
      } else if (processedQuery.toLowerCase().includes('forecast') || processedQuery.toLowerCase().includes('prediction')) {
        setActiveVisualization('forecast');
        setResponse("Based on your current financial patterns, here's a 6-month forecast:");
      } else if (processedQuery.toLowerCase().includes('wealth') || processedQuery.toLowerCase().includes('overview')) {
        setActiveVisualization('wealth-overview');
        setResponse("Here's an overview of your total wealth:");
      } else if (processedQuery.toLowerCase().includes('cash') || processedQuery.toLowerCase().includes('management')) {
        setActiveVisualization('cash-management');
        setResponse("Here's a summary of your cash accounts:");
      } else if (processedQuery.toLowerCase().includes('investment') || processedQuery.toLowerCase().includes('allocation')) {
        setActiveVisualization('investment-allocation');
        setResponse("Here's how your investments are allocated:");
      } else if (processedQuery.toLowerCase().includes('savings') || processedQuery.toLowerCase().includes('goals')) {
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
