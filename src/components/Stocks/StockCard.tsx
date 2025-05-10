
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
  const changeColor = isPositive ? 'text-tr-green' : 'text-tr-red';
  
  return (
    <Link to={`/stock/${id}`}>
      <div className="border-t border-border/10 py-3 hover:bg-muted/20 transition-colors px-2 rounded-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-sm">{name}</h3>
            <p className="text-xs text-muted-foreground">{symbol}</p>
          </div>
          
          <div className="text-right">
            <p className="font-medium text-sm">${price.toFixed(2)}</p>
            <div className={`flex items-center justify-end ${changeColor} text-xs`}>
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
