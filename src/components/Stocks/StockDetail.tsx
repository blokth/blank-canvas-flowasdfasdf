
import React from 'react';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import StockChart from '../common/StockChart';
import { Button } from '@/components/ui/button';

// Sample data for charts
const generateChartData = (baseValue: number, volatility: number, points: number) => {
  const data = [];
  let currentValue = baseValue;
  
  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.5) * volatility;
    currentValue = Math.max(currentValue + change, 1); // Ensure value stays above 1
    data.push({
      name: i.toString(),
      value: parseFloat(currentValue.toFixed(2)),
    });
  }
  
  return data;
};

// Sample stock data
const STOCKS = {
  'aapl': {
    name: 'Apple Inc.',
    symbol: 'AAPL',
    price: 191.33,
    change: 1.25,
    changePercent: 0.65,
    high: 192.43,
    low: 190.21,
    volume: '58.3M',
    marketCap: '2.94T',
    peRatio: 31.55,
  },
  'msft': {
    name: 'Microsoft Corporation',
    symbol: 'MSFT',
    price: 418.20,
    change: -2.30,
    changePercent: -0.55,
    high: 421.35,
    low: 417.50,
    volume: '22.1M',
    marketCap: '3.11T',
    peRatio: 35.2,
  },
  'googl': {
    name: 'Alphabet Inc.',
    symbol: 'GOOGL',
    price: 170.87,
    change: 2.54,
    changePercent: 1.51,
    high: 171.45,
    low: 168.29,
    volume: '28.5M',
    marketCap: '2.15T',
    peRatio: 25.7,
  },
  'amzn': {
    name: 'Amazon.com Inc.',
    symbol: 'AMZN',
    price: 178.12,
    change: -1.23,
    changePercent: -0.69,
    high: 180.32,
    low: 177.89,
    volume: '33.7M',
    marketCap: '1.84T',
    peRatio: 48.3,
  },
  'meta': {
    name: 'Meta Platforms Inc.',
    symbol: 'META',
    price: 474.88,
    change: 3.45,
    changePercent: 0.73,
    high: 476.23,
    low: 471.12,
    volume: '15.6M',
    marketCap: '1.22T',
    peRatio: 32.1,
  },
};

const StockDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  if (!id || !STOCKS[id as keyof typeof STOCKS]) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] px-4">
        <h2 className="text-lg font-medium mb-4">Stock Not Found</h2>
        <p className="text-muted-foreground mb-6 text-sm">
          The stock you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/stocks">
          <Button variant="outline" size="sm" className="rounded-full">Back to Stocks</Button>
        </Link>
      </div>
    );
  }
  
  const stock = STOCKS[id as keyof typeof STOCKS];
  const isPositive = stock.changePercent >= 0;
  const changeColor = isPositive ? 'text-tr-green' : 'text-tr-red';
  
  // Generate chart data for different time periods
  const chartData = {
    '1D': generateChartData(stock.price - stock.change, 0.5, 24),
    '1W': generateChartData(stock.price - stock.change * 5, 2, 7),
    '1M': generateChartData(stock.price - stock.change * 20, 5, 30),
    '3M': generateChartData(stock.price - stock.change * 60, 10, 90),
    '1Y': generateChartData(stock.price - stock.change * 200, 20, 365),
    'All': generateChartData(stock.price / 2, 50, 1500),
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-4">
        <Link to="/stocks" className="mr-3">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft size={16} className="text-muted-foreground" />
          </Button>
        </Link>
        <h1 className="text-lg font-medium">{stock.name}</h1>
      </div>
      
      <div className="mb-6">
        <div className="flex items-baseline">
          <h2 className="text-2xl font-medium mr-3">${stock.price.toFixed(2)}</h2>
          <div className={`flex items-center ${changeColor}`}>
            {isPositive ? (
              <TrendingUp size={14} className="mr-1" />
            ) : (
              <TrendingUp size={14} className="mr-1 rotate-180" />
            )}
            <span className="text-sm">
              {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{stock.symbol}</p>
      </div>
      
      <StockChart 
        data={chartData} 
        isPositive={isPositive} 
        activeDataType="wealth" 
      />
      
      <div className="mt-6 p-4 border border-border/20 rounded-lg bg-card">
        <h3 className="text-sm font-medium mb-4">Stock Information</h3>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">High</p>
            <p className="font-medium">${stock.high}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Low</p>
            <p className="font-medium">${stock.low}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Volume</p>
            <p className="font-medium">{stock.volume}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Market Cap</p>
            <p className="font-medium">{stock.marketCap}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">P/E Ratio</p>
            <p className="font-medium">{stock.peRatio}</p>
          </div>
        </div>
      </div>
      
      <div className="fixed bottom-20 inset-x-0 px-4 max-w-md mx-auto">
        <div className="flex gap-3 mb-4">
          <Button className="flex-1 rounded-full h-10 bg-tr-green hover:bg-tr-green/90 text-sm">
            Buy
          </Button>
          <Button className="flex-1 rounded-full h-10 text-sm" variant="outline">
            Sell
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StockDetail;
