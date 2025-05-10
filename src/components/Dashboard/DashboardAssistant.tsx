
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

  // Process query to extract keywords
  const processQuery = (rawQuery: string) => {
    // Extract stock, timeframe, and sector keywords
    const stockMatch = /stock:(\w+)/g.exec(rawQuery);
    const timeframeMatch = /timeframe:(\w+)/g.exec(rawQuery);
    const sectorMatch = /sector:(\w+)/g.exec(rawQuery);
    
    const extractedStock = stockMatch ? stockMatch[1] : "AAPL";
    const extractedTimeframe = timeframeMatch ? timeframeMatch[1] : "3m";
    const extractedSector = sectorMatch ? sectorMatch[1] : "Technology";
    
    // Create a processed query for display in the UI
    const processedQuery = rawQuery
      .replace(/stock:(\w+)/g, extractedStock)
      .replace(/timeframe:(\w+)/g, extractedTimeframe)
      .replace(/sector:(\w+)/g, extractedSector);
    
    return {
      processedQuery,
      stock: extractedStock,
      timeframe: extractedTimeframe,
      sector: extractedSector
    };
  };

  // Handle assistant input submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // Process keywords in the query
    const { processedQuery, stock, timeframe, sector } = processQuery(query);
    
    setIsLoading(true);
    
    // Determine response based on keywords and query content
    setTimeout(() => {
      console.log(`Processed query with: Stock=${stock}, Timeframe=${timeframe}, Sector=${sector}`);
      
      // Custom responses based on keywords in the query
      if (processedQuery.toLowerCase().includes('portfolio') && processedQuery.toLowerCase().includes('breakdown')) {
        setActiveVisualization('portfolio-breakdown');
        setResponse(`Here's your portfolio breakdown by sector (focusing on ${sector}):`);
      } else if (processedQuery.toLowerCase().includes('compare')) {
        setActiveVisualization('stock-comparison');
        setResponse(`Comparing ${stock} with other stocks in your portfolio:`);
      } else if (processedQuery.toLowerCase().includes('performance') || processedQuery.toLowerCase().includes('trend')) {
        setActiveVisualization('performance-trend');
        setResponse(`Here's ${stock}'s performance over the past ${timeframe}:`);
      } else if (processedQuery.toLowerCase().includes('forecast') || processedQuery.toLowerCase().includes('prediction')) {
        setActiveVisualization('forecast');
        setResponse(`Based on current market trends, here's a ${timeframe} forecast for ${stock}:`);
      } else if (processedQuery.toLowerCase().includes('expense') || processedQuery.toLowerCase().includes('spending')) {
        setActiveVisualization('expense-categories');
        setResponse(`Here's a breakdown of your spending by category for the past ${timeframe}:`);
      } else if (processedQuery.toLowerCase().includes('income') || processedQuery.toLowerCase().includes('earnings')) {
        setActiveVisualization('income-sources');
        setResponse(`Here's a breakdown of your income sources over the past ${timeframe}:`);
      } else if (stock && !processedQuery.toLowerCase().includes('compare')) {
        // Default stock view if stock is mentioned
        setActiveVisualization('performance-trend');
        setResponse(`Here's the performance data for ${stock} over ${timeframe}:`);
      } else if (sector && !processedQuery.toLowerCase().includes('portfolio')) {
        // Sector view
        setActiveVisualization('portfolio-breakdown');
        setResponse(`Here's an overview of the ${sector} sector performance:`);
      } else {
        setActiveVisualization(null);
        setResponse("I can help you analyze your finances. Try using keywords like 'stock:AAPL', 'timeframe:1m', or 'sector:Technology' in your queries.");
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
