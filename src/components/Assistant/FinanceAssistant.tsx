
import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import smaller components
import VisualizationManager from './components/VisualizationManager';
import AssistantDialog from './components/AssistantDialog';
import VisualizationDisplay from './components/VisualizationDisplay';
import AssistantInput from './components/AssistantInput';
import QuickActions from './components/QuickActions';
import AnalyticsActions from './components/AnalyticsActions';

// Types
type VisualizationType = 
  'portfolio-breakdown' | 
  'performance-trend' | 
  'stock-comparison' | 
  'expense-categories' | 
  'income-sources' | 
  'forecast' | 
  null;

const FinanceAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeVisualization, setActiveVisualization] = useState<VisualizationType>(null);
  const [showFullscreenChart, setShowFullscreenChart] = useState(false);

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
      } else {
        setActiveVisualization(null);
        setResponse("I can help you analyze your finances. Try asking about portfolio breakdowns, performance trends, stock comparisons, expense categories, income sources, or financial forecasts.");
      }
      setIsLoading(false);
    }, 1000);
  };

  // Quick action handlers
  const handlePortfolioBreakdown = () => {
    setQuery("Show me my portfolio breakdown by sector");
    setActiveVisualization('portfolio-breakdown');
    setResponse("Here's your portfolio breakdown by sector:");
  };

  const handlePerformanceTrend = () => {
    setQuery("Show me my performance trend");
    setActiveVisualization('performance-trend');
    setResponse("Here's your portfolio performance over time:");
  };

  const handleStockComparison = () => {
    setQuery("Compare my top stocks");
    setActiveVisualization('stock-comparison');
    setResponse("Here's how your selected stocks compare:");
  };

  // Analytics action handlers
  const handleExpenseCategories = () => {
    setQuery("Show me my expense categories");
    setActiveVisualization('expense-categories');
    setResponse("Here's a breakdown of your spending by category:");
  };

  const handleIncomeSources = () => {
    setQuery("Show me my income sources");
    setActiveVisualization('income-sources');
    setResponse("Here's a breakdown of your income sources:");
  };

  const handleFinancialForecast = () => {
    setQuery("Show me a financial forecast");
    setActiveVisualization('forecast');
    setResponse("Based on your current financial patterns, here's a 6-month forecast:");
  };

  const handleMonthlySpending = () => {
    setQuery("Show me my monthly spending");
    setActiveVisualization('expense-categories');
    setResponse("Here's your monthly spending pattern:");
  };

  return (
    <>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button
            className="fixed bottom-20 right-4 z-40 rounded-full h-10 w-10 shadow-md flex items-center justify-center bg-background border border-border/20"
            variant="outline"
          >
            <MessageSquare size={18} />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[80vh] border-t border-border/20">
          <DrawerHeader className="flex justify-between items-center border-b border-border/10 pb-2">
            <DrawerTitle className="text-base font-medium">Finance Assistant</DrawerTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
              <X size={16} />
            </Button>
          </DrawerHeader>
          
          <div className="p-4 flex flex-col h-full max-h-[calc(80vh-4rem)] overflow-y-auto">
            {response && (
              <VisualizationDisplay
                response={response}
                visualization={<VisualizationManager activeVisualization={activeVisualization} />}
                onClick={() => activeVisualization && setShowFullscreenChart(true)}
                showExpandHint={!!activeVisualization}
              />
            )}
            
            <Tabs defaultValue="quick-actions" className="w-full mb-4">
              <TabsList className="w-full grid grid-cols-2 rough-tabs-list">
                <TabsTrigger 
                  value="quick-actions" 
                  className="rough-tab data-[state=active]:bg-white"
                >
                  Quick Actions
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="rough-tab data-[state=active]:bg-white"
                >
                  Analytics
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="quick-actions">
                <QuickActions 
                  onPortfolioBreakdown={handlePortfolioBreakdown}
                  onPerformanceTrend={handlePerformanceTrend}
                  onStockComparison={handleStockComparison}
                />
              </TabsContent>
              
              <TabsContent value="analytics">
                <AnalyticsActions 
                  onExpenseCategories={handleExpenseCategories}
                  onIncomeSources={handleIncomeSources}
                  onFinancialForecast={handleFinancialForecast}
                  onMonthlySpending={handleMonthlySpending}
                />
              </TabsContent>
            </Tabs>
            
            <AssistantInput
              query={query}
              setQuery={setQuery}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </DrawerContent>
      </Drawer>

      {/* Fullscreen chart dialog */}
      <AssistantDialog
        open={showFullscreenChart}
        onOpenChange={setShowFullscreenChart}
        title={response || ""}
      >
        <VisualizationManager activeVisualization={activeVisualization} />
      </AssistantDialog>
    </>
  );
};

export default FinanceAssistant;
