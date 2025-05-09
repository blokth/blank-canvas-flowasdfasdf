
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
      <div className="tr-card mb-3 hover:border-tr-purple/30 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-medium">{name}</h3>
            <p className="text-sm text-muted-foreground">{symbol}</p>
          </div>
          
          <div className="text-right">
            <p className="font-medium">${price.toFixed(2)}</p>
            <div className={`flex items-center justify-end ${changeColor} text-sm`}>
              {isPositive ? (
                <TrendingUp size={14} className="mr-1" />
              ) : (
                <TrendingUp size={14} className="mr-1 rotate-180" />
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
