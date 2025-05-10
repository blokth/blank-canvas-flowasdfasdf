
import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';

interface StockCardProps {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

const StockCard: React.FC<StockCardProps> = ({
  id,
  name,
  symbol,
  price,
  change,
  changePercent,
}) => {
  const isPositive = changePercent >= 0;
  const changeColor = isPositive ? 'text-black' : 'text-gray-700';
  const changeBg = isPositive ? 'bg-black/5' : 'bg-black/10';
  
  return (
    <Link to={`/stock/${id}`}>
      <div className="border-t border-black/10 py-3 hover:bg-black/5 transition-colors px-2 transform hover:-translate-y-[1px] hover:translate-x-[1px]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-sm">{name}</h3>
            <p className="text-xs text-gray-600">{symbol}</p>
          </div>
          
          <div className="text-right">
            <p className="font-medium text-sm">${price.toFixed(2)}</p>
            <div className={`flex items-center justify-end ${changeColor} ${changeBg} px-2 py-0.5 text-xs rounded-none`}>
              {isPositive ? (
                <TrendingUp size={12} className="mr-1" />
              ) : (
                <TrendingUp size={12} className="mr-1 rotate-180" />
              )}
              <span>
                {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StockCard;
