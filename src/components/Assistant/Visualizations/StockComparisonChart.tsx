
import React from 'react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// More distinctive data with better separation between stocks and finances values
const data = [
  { name: 'Jan', stocks: 4000, finances: 2400 },
  { name: 'Feb', stocks: 3000, finances: 2800 },
  { name: 'Mar', stocks: 5000, finances: 3200 },
  { name: 'Apr', stocks: 4500, finances: 3800 },
  { name: 'May', stocks: 6000, finances: 4500 },
  { name: 'Jun', stocks: 5500, finances: 5200 },
];

const stocksData = [
  { name: 'AAPL', value: 80 },
  { name: 'MSFT', value: 60 },
  { name: 'GOOGL', value: 90 },
  { name: 'AMZN', value: 50 },
];

const StockComparisonChart: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col">
      {/* Line chart comparing stocks vs personal finances */}
      <div className="mb-6 h-1/2">
        <h3 className="text-sm font-medium mb-2 text-foreground/70">Performance Over Time</h3>
        <ResponsiveContainer width="100%" height="90%">
          <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <defs>
              <linearGradient id="colorStocks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#9b87f5" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorFinances" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7E69AB" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#7E69AB" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 10, fill: '#8E9196' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '8px', 
                border: '1px solid rgba(0, 0, 0, 0.05)', 
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                fontSize: '12px'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="stocks" 
              stroke="#9b87f5" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorStocks)" 
              name="Stocks"
            />
            <Area 
              type="monotone" 
              dataKey="finances" 
              stroke="#7E69AB" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorFinances)" 
              name="Personal Finances"
            />
            <Legend 
              verticalAlign="top" 
              height={36} 
              iconType="circle" 
              iconSize={8}
              wrapperStyle={{
                fontSize: '11px',
                paddingTop: '8px'
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bar chart for stock values */}
      <div className="h-1/2">
        <h3 className="text-sm font-medium mb-2 text-foreground/70">Stock Performance</h3>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={stocksData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 10, fill: '#8E9196' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '8px', 
                border: '1px solid rgba(0, 0, 0, 0.05)', 
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                fontSize: '12px'
              }} 
            />
            <Bar dataKey="value" fill="#9b87f5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockComparisonChart;
