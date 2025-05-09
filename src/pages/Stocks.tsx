
import React from 'react';
import StockList from '../components/Stocks/StockList';

const Stocks = () => {
  return (
    <div className="pb-16">
      <h1 className="text-2xl font-bold mb-6">Discover Stocks</h1>
      <StockList />
    </div>
  );
};

export default Stocks;
