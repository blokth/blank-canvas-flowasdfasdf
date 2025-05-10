import React, { useState } from 'react';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import StockChart from '../common/StockChart';
import { Button } from '@/components/ui/button';
import {
  ToggleGroup,
  ToggleGroupItem
} from "@/components/ui/toggle-group";

// Improved function to generate highly realistic market data with sharp price movements
// and consistent patterns across different time periods
const generateChartData = (baseValue: number, volatility: number, points: number, periodType: string) => {
  const data = [];
  let currentValue = baseValue;
  
  // For realistic stock price movements with different patterns based on the period
  const getNextValue = (current: number, vol: number, i: number, total: number, period: string) => {
    // Random walk with occasional jumps and realistic market patterns
    const random = Math.random();
    let change;
    
    // Add time-specific patterns
    if (period === '1D') {
      // More micro-movements for intraday
      if (random > 0.98) { // Very rare event (2% chance)
        change = (Math.random() * 2 - 1) * vol * 4;
      } else if (random > 0.92) { // Small spike (6% chance)
        change = (Math.random() * 2 - 1) * vol * 2;
      } else { // Normal small movements (92% chance)
        change = (Math.random() * 2 - 1) * vol * 0.8;
      }
      
      // Add pattern for morning volatility and end-of-day movements
      if (i < points * 0.2) change *= 1.2; // Higher volatility at open
      if (i > points * 0.8) change *= 1.1; // Higher volatility at close
    } 
    else if (period === '1W') {
      // Daily movements for week view
      if (random > 0.95) { // Rare event (5% chance)
        change = (Math.random() * 2 - 1) * vol * 3;
      } else { // Normal daily movements
        change = (Math.random() * 2 - 1) * vol * 1.2;
      }
    }
    else if (period === '1M' || period === '3M') {
      // More significant trends for monthly views
      if (random > 0.97) { // News event (3% chance)
        change = (Math.random() * 2 - 1) * vol * 3.5;
      } else if (random > 0.85) { // Market shift (12% chance)
        change = (Math.random() * 2 - 1) * vol * 1.8;
      } else { // Normal movement
        change = (Math.random() * 2 - 1) * vol * 1;
      }
    }
    else {
      // Longer term trends for yearly views
      if (random > 0.98) { // Major market event (2% chance)
        change = (Math.random() * 2 - 1) * vol * 5;
      } else if (random > 0.9) { // Earnings/quarterly reports (8% chance)
        change = (Math.random() * 2 - 1) * vol * 2.5;
      } else { // Regular trading
        change = (Math.random() * 2 - 1) * vol * 1.2;
      }
      
      // Add some trending bias (either up or down) for longer periods
      const trendBias = (Math.random() > 0.5 ? 0.1 : -0.1) * vol;
      change += trendBias;
    }
    
    return Math.max(current + change, 0.1);
  };
  
  // Generate appropriate labels based on the period
  for (let i = 0; i < points; i++) {
    currentValue = getNextValue(currentValue, volatility, i, points, periodType);
    
    // Generate data point label based on period
    let label;
    if (periodType === '1D') { 
      // For 1D: Show hours with consistent spacing
      const hour = Math.floor(9 + (i * (7 / points))); // Trading hours 9:30 - 16:00
      const minute = Math.floor((i % (points / 7)) * (60 / (points / 7)));
      if (i === 0) label = '9:30';
      else if (i === points - 1) label = '16:00';
      else if (i % Math.floor(points / 4) === 0) {
        label = `${hour}:${minute === 0 ? '00' : minute < 10 ? '0' + minute : minute}`;
      } else {
        label = '';
      }
    } 
    else if (periodType === '1W') {
      // For 1W: Show day labels (Mon, Tue, etc.)
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
      if (i === 0 || i === points - 1 || i % Math.floor(points / 5) === 0) {
        const dayIndex = Math.floor(i / (points / 5));
        label = days[Math.min(dayIndex, 4)];
      } else {
        label = '';
      }
    }
    else if (periodType === '1M') {
      // For 1M: Show dates like "1", "8", "15", "22", "29"
      if (i === 0 || i === points - 1 || i % Math.floor(points / 4) === 0) {
        const weekNum = Math.floor(i / (points / 4));
        label = (weekNum * 7 + 1).toString();
      } else {
        label = '';
      }
    }
    else if (periodType === '3M') {
      // For 3M: Show month + week notation
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr'];
      if (i === 0 || i === points - 1 || i % Math.floor(points / 3) === 0) {
        const monthIndex = Math.floor(i / (points / 3));
        label = monthNames[Math.min(monthIndex, 3)];
      } else {
        label = '';
      }
    }
    else if (periodType === '1Y') {
      // For 1Y: Show month abbreviations
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      if (i === 0 || i === points - 1 || i % Math.floor(points / 6) === 0) {
        const monthIndex = Math.floor(i / (points / 12));
        label = monthNames[Math.min(monthIndex, 11)];
      } else {
        label = '';
      }
    }
    else { // All
      // For All: Show years
      if (i === 0 || i === points - 1 || i % Math.floor(points / 5) === 0) {
        const yearOffset = Math.floor(i / (points / 5));
        label = (2020 + yearOffset).toString();
      } else {
        label = '';
      }
    }
    
    data.push({
      name: label,
      value: parseFloat(currentValue.toFixed(2)),
    });
  }
  
  return data;
};

// Generate detailed datasets for different time periods with consistent appearance
const generateTimeSeriesData = (stock: any) => {
  return {
    // 1D - minute by minute data (78 points for 6.5 hours of trading)
    '1D': generateChartData(stock.price, stock.price * 0.0012, 78, '1D'),
    
    // 1W - hourly data (5 trading days * ~7 hours = 35 points)
    '1W': generateChartData(stock.price - stock.change * 5, stock.price * 0.003, 35, '1W'),
    
    // 1M - daily data (~22 trading days)
    '1M': generateChartData(stock.price - stock.change * 20, stock.price * 0.007, 22, '1M'),
    
    // 3M - daily data (~66 trading days)
    '3M': generateChartData(stock.price - stock.change * 60, stock.price * 0.011, 66, '3M'),
    
    // 1Y - weekly data (~52 weeks)
    '1Y': generateChartData(stock.price - stock.change * 200, stock.price * 0.016, 52, '1Y'),
    
    // All - monthly data (several years worth)
    'All': generateChartData(stock.price / 2, stock.price * 0.025, 60, 'All'),
  };
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
  const [activeDataType, setActiveDataType] = useState<'wealth' | 'cash'>('wealth');
  
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
  
  // Generate chart data with the new function
  const chartData = generateTimeSeriesData(stock);
  
  // Generate sample cash data (similar structure but different values)
  const cashData = {
    '1D': generateChartData(stock.price / 2, stock.price * 0.0008, 390, '1D'),
    '1W': generateChartData(stock.price / 2 - stock.change * 2, stock.price * 0.002, 35, '1W'),
    '1M': generateChartData(stock.price / 2 - stock.change * 10, stock.price * 0.005, 22, '1M'),
    '3M': generateChartData(stock.price / 2 - stock.change * 30, stock.price * 0.008, 66, '3M'),
    '1Y': generateChartData(stock.price / 2 - stock.change * 100, stock.price * 0.012, 252, '1Y'),
    'All': generateChartData(stock.price / 4, stock.price * 0.02, 60, 'All'),
  };
  
  const isCashPositive = true; // For demo purposes
  
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
      
      {/* View selector moved to top */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-medium">View:</span>
        <ToggleGroup 
          type="single" 
          value={activeDataType} 
          onValueChange={(value) => {
            if (value) setActiveDataType(value as 'wealth' | 'cash');
          }}
          size="sm"
        >
          <ToggleGroupItem value="wealth" className="text-xs px-2 py-1 h-7">
            Wealth
          </ToggleGroupItem>
          <ToggleGroupItem value="cash" className="text-xs px-2 py-1 h-7">
            Cash
          </ToggleGroupItem>
        </ToggleGroup>
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
        activeDataType={activeDataType}
        cashData={cashData}
        isCashPositive={isCashPositive}
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
