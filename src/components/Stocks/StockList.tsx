
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import StockCard from './StockCard';

// Sample stock data
const STOCKS = [{
  id: 'aapl',
  name: 'Apple Inc.',
  symbol: 'AAPL',
  price: 191.33,
  change: 1.25,
  changePercent: 0.65
}, {
  id: 'msft',
  name: 'Microsoft Corporation',
  symbol: 'MSFT',
  price: 418.20,
  change: -2.30,
  changePercent: -0.55
}, {
  id: 'googl',
  name: 'Alphabet Inc.',
  symbol: 'GOOGL',
  price: 170.87,
  change: 2.54,
  changePercent: 1.51
}, {
  id: 'amzn',
  name: 'Amazon.com Inc.',
  symbol: 'AMZN',
  price: 178.12,
  change: -1.23,
  changePercent: -0.69
}, {
  id: 'meta',
  name: 'Meta Platforms Inc.',
  symbol: 'META',
  price: 474.88,
  change: 3.45,
  changePercent: 0.73
}, {
  id: 'tsla',
  name: 'Tesla Inc.',
  symbol: 'TSLA',
  price: 177.82,
  change: -5.67,
  changePercent: -3.09
}, {
  id: 'nvda',
  name: 'NVIDIA Corporation',
  symbol: 'NVDA',
  price: 950.02,
  change: 15.23,
  changePercent: 1.63
}, {
  id: 'brk-b',
  name: 'Berkshire Hathaway Inc.',
  symbol: 'BRK.B',
  price: 432.18,
  change: 0.87,
  changePercent: 0.20
}];

const StockList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredStocks = STOCKS.filter(stock => 
    stock.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="mb-6">
      <h2 className="text-xl font-medium mb-4">Stocks</h2>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search stocks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="border rounded-lg overflow-hidden">
        {filteredStocks.map(stock => (
          <StockCard
            key={stock.id}
            id={stock.id}
            name={stock.name}
            symbol={stock.symbol}
            price={stock.price}
            change={stock.change}
            changePercent={stock.changePercent}
          />
        ))}
      </div>
    </div>
  );
};

export default StockList;
