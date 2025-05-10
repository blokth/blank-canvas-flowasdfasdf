
import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMCPConnection } from '@/hooks/useMCPConnection';

// Import smaller components
import VisualizationManager from './components/VisualizationManager';
import AssistantDialog from './components/AssistantDialog';
import VisualizationDisplay from './components/VisualizationDisplay';
import ConversationView from './components/ConversationView';
import QuickActions from './components/QuickActions';
import AnalyticsActions from './components/AnalyticsActions';

const FinanceAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [showFullscreenChart, setShowFullscreenChart] = useState(false);

  // Use the MCP connection hook for API streaming
  const {
    response,
    visualizationType,
    isLoading,
    chunks,
    sendMessage,
  } = useMCPConnection();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // Send message to backend API
    sendMessage(query);
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
            {response && visualizationType && (
              <VisualizationDisplay
                response={response}
                visualization={<VisualizationManager activeVisualization={visualizationType} />}
                onClick={() => visualizationType && setShowFullscreenChart(true)}
                showExpandHint={!!visualizationType}
              />
            )}
            
            <Tabs defaultValue="chat" className="w-full mb-4">
              <TabsList className="w-full grid grid-cols-2 rough-tabs-list">
                <TabsTrigger 
                  value="chat" 
                  className="rough-tab data-[state=active]:bg-white"
                >
                  Chat
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="rough-tab data-[state=active]:bg-white"
                >
                  Analytics
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="chat">
                <ConversationView 
                  chunks={chunks}
                  isLoading={isLoading}
                  query={query}
                  setQuery={setQuery}
                  onSubmit={handleSubmit}
                />
              </TabsContent>
              
              <TabsContent value="analytics">
                <AnalyticsActions 
                  onExpenseCategories={() => sendMessage("Show me my expense categories")}
                  onIncomeSources={() => sendMessage("Show me my income sources")}
                  onFinancialForecast={() => sendMessage("Show me a financial forecast")}
                  onMonthlySpending={() => sendMessage("Show me my monthly spending")}
                />
              </TabsContent>
            </Tabs>
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
