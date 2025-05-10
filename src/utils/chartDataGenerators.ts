
// Generate realistic time series data with many data points
export const generateRealisticStockData = (baseValue: number, volatility: number, points: number) => {
  const data = [];
  let currentValue = baseValue;
  
  // For realistic stock price movements
  const getNextValue = (current: number, vol: number) => {
    // Random walk with occasional jumps
    const random = Math.random();
    let change;
    
    if (random > 0.97) { // Major event (3% chance)
      change = (Math.random() * 2 - 1) * vol * 3.5;
    } else if (random > 0.85) { // Significant move (12% chance)
      change = (Math.random() * 2 - 1) * vol * 1.8;
    } else if (random > 0.6) { // Medium move (25% chance)
      change = (Math.random() * 2 - 1) * vol * 1.2;
    } else { // Small move (60% chance)
      change = (Math.random() * 2 - 1) * vol * 0.6;
    }
    
    return Math.max(current + change, 1);
  };
  
  for (let i = 0; i < points; i++) {
    currentValue = getNextValue(currentValue, volatility);
    
    let label;
    if (points <= 24) {
      const hour = Math.floor(9 + (i * 7/24)); // Trading hours 9:30 - 16:00
      const minute = (i % 4) * 15;
      label = `${hour}:${minute === 0 ? '00' : minute}`;
    } else if (points <= 100) {
      label = i.toString();
    } else {
      label = '';
    }
    
    data.push({
      name: label,
      value: parseFloat(currentValue.toFixed(2))
    });
  }
  
  return data;
};

// Generate chart data for different time periods
export const generateChartData = () => {
  return {
    // 1D - minute by minute data (390 trading minutes in a day)
    '1D': generateRealisticStockData(10000, 15, 390),
    
    // 1W - hourly data (5 trading days * ~7 hours = 35 points)
    '1W': generateRealisticStockData(9800, 45, 35),
    
    // 1M - daily data (~22 trading days)
    '1M': generateRealisticStockData(9500, 80, 22),
    
    // 3M - daily data (~66 trading days)
    '3M': generateRealisticStockData(9000, 120, 66),
    
    // 1Y - daily data (~252 trading days)
    '1Y': generateRealisticStockData(8500, 200, 252),
    
    // All - weekly data (several years worth)
    'All': generateRealisticStockData(7500, 300, 260),
  };
};

export const generatePersonalFinanceData = () => {
  return {
    '1D': generateRealisticStockData(5000, 7, 390),
    '1W': generateRealisticStockData(4900, 20, 35),
    '1M': generateRealisticStockData(4800, 40, 22),
    '3M': generateRealisticStockData(4700, 60, 66),
    '1Y': generateRealisticStockData(4500, 100, 252),
    'All': generateRealisticStockData(4000, 150, 260),
  };
};
