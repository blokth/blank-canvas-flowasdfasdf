
import React, { useState } from 'react';
import { MessageSquare, Send, BarChart2, PieChart, LineChart, X, BarChart, TrendingUp, Wallet, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FinanceAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeVisualization, setActiveVisualization] = useState<string | null>(null);
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

  const renderVisualization = () => {
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
      default:
        return null;
    }
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
              <Card className="p-3 mb-4 bg-secondary/20 border-border/10">
                <p className="mb-3 text-sm">{response}</p>
                <div 
                  className="h-64 bg-background rounded-md border border-border/10 relative"
                  onClick={() => activeVisualization && setShowFullscreenChart(true)}
                >
                  {renderVisualization()}
                  {activeVisualization && (
                    <div className="absolute top-2 right-2 bg-white/80 rounded-full p-1 text-xs text-muted-foreground">
                      Click to expand
                    </div>
                  )}
                </div>
              </Card>
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
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      setQuery("Show me my portfolio breakdown by sector");
                      setActiveVisualization('portfolio-breakdown');
                      setResponse("Here's your portfolio breakdown by sector:");
                    }}
                    className="text-xs h-8 rounded-full border-border/20"
                  >
                    <PieChart size={14} className="mr-1" /> Portfolio Breakdown
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      setQuery("Show me my performance trend");
                      setActiveVisualization('performance-trend');
                      setResponse("Here's your portfolio performance over time:");
                    }}
                    className="text-xs h-8 rounded-full border-border/20"
                  >
                    <LineChart size={14} className="mr-1" /> Performance Trend
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      setQuery("Compare my top stocks");
                      setActiveVisualization('stock-comparison');
                      setResponse("Here's how your selected stocks compare:");
                    }}
                    className="text-xs h-8 rounded-full border-border/20"
                  >
                    <BarChart2 size={14} className="mr-1" /> Compare Stocks
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="analytics">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      setQuery("Show me my expense categories");
                      setActiveVisualization('expense-categories');
                      setResponse("Here's a breakdown of your spending by category:");
                    }}
                    className="text-xs h-8 rounded-full border-border/20"
                  >
                    <Wallet size={14} className="mr-1" /> Expense Analysis
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      setQuery("Show me my income sources");
                      setActiveVisualization('income-sources');
                      setResponse("Here's a breakdown of your income sources:");
                    }}
                    className="text-xs h-8 rounded-full border-border/20"
                  >
                    <BarChart size={14} className="mr-1" /> Income Breakdown
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      setQuery("Show me a financial forecast");
                      setActiveVisualization('forecast');
                      setResponse("Based on your current financial patterns, here's a 6-month forecast:");
                    }}
                    className="text-xs h-8 rounded-full border-border/20"
                  >
                    <TrendingUp size={14} className="mr-1" /> Financial Forecast
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      setQuery("Show me my monthly spending");
                      setActiveVisualization('expense-categories');
                      setResponse("Here's your monthly spending pattern:");
                    }}
                    className="text-xs h-8 rounded-full border-border/20"
                  >
                    <Calendar size={14} className="mr-1" /> Monthly Budget
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
            
            <form onSubmit={handleSubmit} className="mt-auto">
              <div className="flex items-center gap-2">
                <Textarea
                  placeholder="Ask about your finances or portfolio..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="resize-none text-sm border-border/20"
                  rows={2}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={isLoading || !query.trim()}
                  className="shrink-0 h-10 w-10 rounded-full"
                  variant="outline"
                >
                  <Send size={16} />
                </Button>
              </div>
            </form>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Fullscreen chart dialog */}
      <Dialog open={showFullscreenChart} onOpenChange={setShowFullscreenChart}>
        <DialogContent className="max-w-3xl w-[80vw]">
          <DialogHeader>
            <DialogTitle>{response}</DialogTitle>
          </DialogHeader>
          <div className="h-[60vh]">
            {renderVisualization()}
          </div>
        </DialogContent>
      </Dialog>
    </>
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

// New visualization components
const ExpenseCategoriesChart = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <svg width="100%" height="160" viewBox="0 0 300 100">
        <rect x="10" y="10" width="30" height="90" fill="#6E59A5" />
        <rect x="50" y="30" width="30" height="70" fill="#7E69AB" />
        <rect x="90" y="50" width="30" height="50" fill="#9b87f5" />
        <rect x="130" y="40" width="30" height="60" fill="#D6BCFA" />
        <rect x="170" y="70" width="30" height="30" fill="#6E59A5" />
        <rect x="210" y="60" width="30" height="40" fill="#7E69AB" />
        <rect x="250" y="80" width="30" height="20" fill="#9b87f5" />
        
        <text x="25" y="110" fontSize="8" fill="#8E9196" textAnchor="middle">Housing</text>
        <text x="65" y="110" fontSize="8" fill="#8E9196" textAnchor="middle">Food</text>
        <text x="105" y="110" fontSize="8" fill="#8E9196" textAnchor="middle">Transport</text>
        <text x="145" y="110" fontSize="8" fill="#8E9196" textAnchor="middle">Shopping</text>
        <text x="185" y="110" fontSize="8" fill="#8E9196" textAnchor="middle">Utilities</text>
        <text x="225" y="110" fontSize="8" fill="#8E9196" textAnchor="middle">Healthcare</text>
        <text x="265" y="110" fontSize="8" fill="#8E9196" textAnchor="middle">Other</text>
      </svg>
    </div>
  );
};

const IncomeSourcesChart = () => {
  return (
    <div className="h-full flex items-center justify-center flex-col">
      <div className="w-40 h-40 rounded-full border-8 border-tr-purple relative overflow-hidden">
        <div style={{ width: '60%', height: '100%', background: '#6E59A5', position: 'absolute', left: 0 }} />
        <div style={{ width: '25%', height: '100%', background: '#9b87f5', position: 'absolute', left: '60%' }} />
        <div style={{ width: '15%', height: '100%', background: '#D6BCFA', position: 'absolute', left: '85%' }} />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#6E59A5] mr-1 rounded-sm" /> Salary (60%)
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#9b87f5] mr-1 rounded-sm" /> Investments (25%)
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#D6BCFA] mr-1 rounded-sm" /> Side Income (15%)
        </div>
      </div>
    </div>
  );
};

const ForecastChart = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <svg width="100%" height="160" viewBox="0 0 300 100">
        <path
          d="M0,70 L50,65 L100,68 L150,60 L200,55 L250,45 L300,42"
          fill="none"
          stroke="#4CAF50"
          strokeWidth="2"
        />
        <path
          d="M0,40 L50,45 L100,43 L150,48 L200,50 L250,58 L300,62"
          fill="none"
          stroke="#F44336"
          strokeWidth="2"
          strokeDasharray="3,3"
        />
        <line x1="0" y1="100" x2="300" y2="100" stroke="#8E9196" strokeWidth="1" />
        
        <text x="0" y="115" fontSize="8" fill="#8E9196">Jun</text>
        <text x="50" y="115" fontSize="8" fill="#8E9196">Jul</text>
        <text x="100" y="115" fontSize="8" fill="#8E9196">Aug</text>
        <text x="150" y="115" fontSize="8" fill="#8E9196">Sep</text>
        <text x="200" y="115" fontSize="8" fill="#8E9196">Oct</text>
        <text x="250" y="115" fontSize="8" fill="#8E9196">Nov</text>
        <text x="300" y="115" fontSize="8" fill="#8E9196">Dec</text>
        
        <circle cx="0" cy="70" r="2" fill="#4CAF50" />
        <circle cx="50" cy="65" r="2" fill="#4CAF50" />
        <circle cx="100" cy="68" r="2" fill="#4CAF50" />
        <circle cx="150" cy="60" r="2" fill="#4CAF50" />
        <circle cx="200" cy="55" r="2" fill="#4CAF50" />
        <circle cx="250" cy="45" r="2" fill="#4CAF50" />
        <circle cx="300" cy="42" r="2" fill="#4CAF50" />
        
        <text x="150" y="20" fontSize="8" fill="#4CAF50" textAnchor="middle">Income (Actual & Projected)</text>
        <text x="150" y="35" fontSize="8" fill="#F44336" textAnchor="middle">Expenses (Actual & Projected)</text>
      </svg>
    </div>
  );
};
