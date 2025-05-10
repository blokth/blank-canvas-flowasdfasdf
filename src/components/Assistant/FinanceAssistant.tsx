
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

// Import MCP connection hook
import { useMCPConnection } from '../../hooks/useMCPConnection';

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
  const [showFullscreenChart, setShowFullscreenChart] = useState(false);

  // MCP connection using the hook
  const { 
    response, 
    visualizationType, 
    isLoading,
    chunks, 
    sendMessage,
    setResponse,
    setVisualizationType
  } = useMCPConnection();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(query);
  };

  // Use query state from the hook
  const [query, setQuery] = useState('');
  
  // Quick action handlers
  const handlePortfolioBreakdown = () => {
    setQuery("Show me my portfolio breakdown by sector");
    sendMessage("Show me my portfolio breakdown by sector");
  };

  const handlePerformanceTrend = () => {
    setQuery("Show me my performance trend");
    sendMessage("Show me my performance trend");
  };

  const handleStockComparison = () => {
    setQuery("Compare my top stocks");
    sendMessage("Compare my top stocks");
  };

  // Analytics action handlers
  const handleExpenseCategories = () => {
    setQuery("Show me my expense categories");
    sendMessage("Show me my expense categories");
  };

  const handleIncomeSources = () => {
    setQuery("Show me my income sources");
    sendMessage("Show me my income sources");
  };

  const handleFinancialForecast = () => {
    setQuery("Show me a financial forecast");
    sendMessage("Show me a financial forecast");
  };

  const handleMonthlySpending = () => {
    setQuery("Show me my monthly spending");
    sendMessage("Show me my monthly spending");
  };

  // Determine if we're actively streaming
  const isStreaming = chunks.length > 0;

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
                visualization={<VisualizationManager activeVisualization={visualizationType} />}
                onClick={() => visualizationType && setShowFullscreenChart(true)}
                showExpandHint={!!visualizationType}
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
              streamingChunks={chunks}
              isStreaming={isStreaming}
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
        <VisualizationManager activeVisualization={visualizationType} />
      </AssistantDialog>
    </>
  );
};

export default FinanceAssistant;
