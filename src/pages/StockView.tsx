
import React from 'react';
import StockDetail from '../components/Stocks/StockDetail';

const StockView = () => {
  return (
    <div className="max-w-md mx-auto">
      <div className="border border-black/20 p-3 rough-edge">
        <StockDetail />
      </div>
    </div>
  );
};

export default StockView;
