
import React from 'react';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Sample stock data
const STOCKS = {
  'aapl': {
    name: 'Apple Inc.',
    symbol: 'AAPL',
    price: 191.33,
    change: 1.25,
    changePercent: 0.65,
  },
  'msft': {
    name: 'Microsoft Corporation',
    symbol: 'MSFT',
    price: 418.20,
    change: -2.30,
    changePercent: -0.55,
  },
  'googl': {
    name: 'Alphabet Inc.',
    symbol: 'GOOGL',
    price: 170.87,
    change: 2.54,
    changePercent: 1.51,
  },
  'amzn': {
    name: 'Amazon.com Inc.',
    symbol: 'AMZN',
    price: 178.12,
    change: -1.23,
    changePercent: -0.69,
  },
  'meta': {
    name: 'Meta Platforms Inc.',
    symbol: 'META',
    price: 474.88,
    change: 3.45,
    changePercent: 0.73,
  },
};

const StockDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  if (!id || !STOCKS[id as keyof typeof STOCKS]) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] px-4">
        <h2 className="text-xl font-bold mb-4">Stock Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The stock you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/stocks">
          <Button>Back to Stocks</Button>
        </Link>
      </div>
    );
  }
  
  const stock = STOCKS[id as keyof typeof STOCKS];
  const isPositive = stock.changePercent >= 0;
  
  return (
    <div className="flex flex-col min-h-screen bg-white text-black pb-24">
      <div className="flex justify-between items-center py-4 px-4">
        <Link to="/stocks">
          <ArrowLeft size={20} className="text-black" />
        </Link>
        <button className="text-sm font-medium">Follow</button>
      </div>
      
      <div className="px-4">
        <h1 className="text-2xl font-bold mb-1">{stock.name}</h1>
        
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold">${stock.price.toFixed(2)}</span>
          <span className="text-sm">
            {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
          </span>
        </div>
        
        <div className="flex mb-8 overflow-x-auto space-x-2">
          <button className="rounded-full bg-black text-white px-3 py-1 text-sm">1D</button>
          <button className="rounded-full bg-gray-100 text-black px-3 py-1 text-sm">1W</button>
          <button className="rounded-full bg-gray-100 text-black px-3 py-1 text-sm">1M</button>
          <button className="rounded-full bg-gray-100 text-black px-3 py-1 text-sm">1Y</button>
          <button className="rounded-full bg-gray-100 text-black px-3 py-1 text-sm">Max</button>
        </div>
        
        <div className="h-64 -mx-4 mb-8">
          <svg viewBox="0 0 400 150" className="w-full h-full" preserveAspectRatio="none">
            <path 
              d="M0,75 C50,50 100,100 150,75 C200,50 250,100 300,75 C350,50 400,75 400,75" 
              stroke="black" 
              strokeWidth="1.5" 
              fill="none" 
            />
          </svg>
        </div>
      </div>
      
      <div className="fixed bottom-24 inset-x-0 px-4">
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 rounded-full gap-2 bg-black text-white hover:bg-black/90">
            <Save size={20} />
            Save
          </Button>
          <Button className="flex-1 rounded-full gap-2 bg-black text-white hover:bg-black/90">
            Buy
            <ArrowRight size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StockDetail;
