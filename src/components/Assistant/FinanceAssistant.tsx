
import React, { useState } from 'react';
import { MessageSquare, Send, BarChart2, PieChart, LineChart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';

const FinanceAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeVisualization, setActiveVisualization] = useState<string | null>(null);

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
      } else {
        setActiveVisualization(null);
        setResponse("I can help you with portfolio breakdowns, performance trends, and stock comparisons. Try asking something like 'Show me my portfolio breakdown by sector'.");
      }
      setIsLoading(false);
    }, 1000);
  };

  const renderVisualization = () => {
    switch (activeVisualization) {
      case 'portfolio-breakdown':
        return <PortfolioBreakdownChart />;
      case 'performance-trend':
        return <PerformanceTrendChart />;
      case 'stock-comparison':
        return <StockComparisonChart />;
      default:
        return null;
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          className="fixed bottom-20 right-4 z-40 rounded-full h-12 w-12 shadow-lg flex items-center justify-center"
          variant="secondary"
        >
          <MessageSquare size={20} />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader className="flex justify-between items-center">
          <DrawerTitle>Finance Assistant</DrawerTitle>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X size={18} />
          </Button>
        </DrawerHeader>
        
        <div className="p-4 flex flex-col h-full max-h-[calc(80vh-4rem)] overflow-y-auto">
          {response && (
            <Card className="p-4 mb-4 bg-secondary/50">
              <p className="mb-3 text-sm">{response}</p>
              <div className="h-64 bg-background rounded-lg">
                {renderVisualization()}
              </div>
            </Card>
          )}
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => {
                setQuery("Show me my portfolio breakdown by sector");
                setActiveVisualization('portfolio-breakdown');
                setResponse("Here's your portfolio breakdown by sector:");
              }}
            >
              <PieChart size={16} className="mr-2" /> Portfolio Breakdown
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => {
                setQuery("Show me my performance trend");
                setActiveVisualization('performance-trend');
                setResponse("Here's your portfolio performance over time:");
              }}
            >
              <LineChart size={16} className="mr-2" /> Performance Trend
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => {
                setQuery("Compare my top stocks");
                setActiveVisualization('stock-comparison');
                setResponse("Here's how your selected stocks compare:");
              }}
            >
              <BarChart2 size={16} className="mr-2" /> Compare Stocks
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-auto">
            <div className="flex items-center gap-2">
              <Textarea
                placeholder="Ask about your finances or portfolio..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="resize-none"
                rows={2}
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={isLoading || !query.trim()}
                className="shrink-0 h-12 w-12"
              >
                <Send size={18} />
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default FinanceAssistant;

// Demo visualization components
const PortfolioBreakdownChart = () => {
  // This would be replaced with a real chart library like recharts
  return (
    <div className="h-full flex items-center justify-center flex-col">
      <div className="w-40 h-40 rounded-full border-8 border-tr-purple relative overflow-hidden">
        <div style={{ width: '30%', height: '100%', background: '#9b87f5', position: 'absolute', left: 0 }} />
        <div style={{ width: '25%', height: '100%', background: '#7E69AB', position: 'absolute', left: '30%' }} />
        <div style={{ width: '20%', height: '100%', background: '#6E59A5', position: 'absolute', left: '55%' }} />
        <div style={{ width: '25%', height: '100%', background: '#D6BCFA', position: 'absolute', left: '75%' }} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-tr-purple mr-1 rounded-sm" /> Tech (30%)
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#7E69AB] mr-1 rounded-sm" /> Finance (25%)
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#6E59A5] mr-1 rounded-sm" /> Healthcare (20%)
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#D6BCFA] mr-1 rounded-sm" /> Consumer (25%)
        </div>
      </div>
    </div>
  );
};

const PerformanceTrendChart = () => {
  // This would be replaced with a real chart library like recharts
  return (
    <div className="h-full flex items-center justify-center">
      <svg width="100%" height="160" viewBox="0 0 300 100">
        <path
          d="M0,80 C20,70 40,90 60,75 C80,60 100,50 120,55 C140,60 160,30 180,25 C200,20 220,30 240,20 C260,10 280,5 300,0"
          fill="none"
          stroke="#4CAF50"
          strokeWidth="2"
        />
        <line x1="0" y1="100" x2="300" y2="100" stroke="#8E9196" strokeWidth="1" />
        
        <text x="0" y="115" fontSize="8" fill="#8E9196">Jan</text>
        <text x="60" y="115" fontSize="8" fill="#8E9196">Mar</text>
        <text x="120" y="115" fontSize="8" fill="#8E9196">May</text>
        <text x="180" y="115" fontSize="8" fill="#8E9196">Jul</text>
        <text x="240" y="115" fontSize="8" fill="#8E9196">Sep</text>
        <text x="300" y="115" fontSize="8" fill="#8E9196">Nov</text>
      </svg>
    </div>
  );
};

const StockComparisonChart = () => {
  // This would be replaced with a real chart library like recharts
  return (
    <div className="h-full flex items-center justify-center">
      <svg width="100%" height="160" viewBox="0 0 300 100">
        <rect x="30" y="20" width="40" height="80" fill="#9b87f5" />
        <rect x="90" y="40" width="40" height="60" fill="#7E69AB" />
        <rect x="150" y="10" width="40" height="90" fill="#6E59A5" />
        <rect x="210" y="50" width="40" height="50" fill="#D6BCFA" />
        
        <text x="50" y="110" fontSize="8" fill="#8E9196" textAnchor="middle">AAPL</text>
        <text x="110" y="110" fontSize="8" fill="#8E9196" textAnchor="middle">MSFT</text>
        <text x="170" y="110" fontSize="8" fill="#8E9196" textAnchor="middle">GOOGL</text>
        <text x="230" y="110" fontSize="8" fill="#8E9196" textAnchor="middle">AMZN</text>
      </svg>
    </div>
  );
};
