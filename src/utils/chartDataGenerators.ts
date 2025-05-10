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

// New function to generate financial data for charts
export const generateFinancialData = (
  periods: number, 
  baseValue: number = 1000, 
  volatility: number = 100, 
  isPositive: boolean = true,
  labels?: string[],
  includeForecast: boolean = false,
  periodType: 'monthly' | 'daily' | 'yearly' = 'monthly'
) => {
  const data = [];
  let currentValue = baseValue;
  let currentExpense = baseValue * 0.7;
  
  // For data with period labels
  const getMonthName = (index: number) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[index % 12];
  };
  
  const getDayLabel = (index: number) => {
    return `Day ${index + 1}`;
  };
  
  const getYearLabel = (index: number) => {
    return `${2023 + index}`;
  };
  
  const getPeriodLabel = (index: number) => {
    switch (periodType) {
      case 'daily': return getDayLabel(index);
      case 'yearly': return getYearLabel(index);
      default: return getMonthName(index);
    }
  };
  
  // Randomize value changes
  for (let i = 0; i < periods; i++) {
    // Decide if increase or decrease
    let direction = Math.random();
    let change = Math.random() * volatility;
    
    if (isPositive && i > 0) {
      direction = direction > 0.4 ? 1 : -1; // 60% chance of going up if isPositive
    } else if (i > 0) {
      direction = direction > 0.6 ? 1 : -1; // 40% chance of going up otherwise
    } else {
      direction = 1; // First point always goes up
    }
    
    currentValue = Math.max(currentValue + (direction * change), baseValue * 0.1);
    currentExpense = Math.max(currentExpense + (Math.random() * 2 - 1) * volatility * 0.2, baseValue * 0.05);
    
    // For comparison charts
    const prevValue = currentValue * (0.7 + Math.random() * 0.6);
    
    // For stacked bar/area charts
    const housing = currentValue * (0.3 + Math.random() * 0.05);
    const food = currentValue * (0.2 + Math.random() * 0.05);
    const transport = currentValue * (0.15 + Math.random() * 0.05);
    const shopping = currentValue * (0.1 + Math.random() * 0.05);
    const utilities = currentValue * (0.1 + Math.random() * 0.05);
    const other = currentValue * (0.15 + Math.random() * 0.05);
    
    // For wealth overview
    const cash = currentValue * (0.2 + Math.random() * 0.05);
    const investments = currentValue * (0.4 + Math.random() * 0.1);
    const realEstate = currentValue * (0.3 + Math.random() * 0.05);
    const otherAssets = currentValue * (0.1 + Math.random() * 0.03);
    
    if (labels && i < labels.length) {
      data.push({
        month: getPeriodLabel(i),
        day: getDayLabel(i),
        year: getYearLabel(i),
        name: labels[i],
        value: Math.round(currentValue),
        prevValue: Math.round(prevValue),
        income: Math.round(currentValue),
        expenses: Math.round(currentExpense),
        housing: Math.round(housing),
        food: Math.round(food),
        transport: Math.round(transport),
        shopping: Math.round(shopping),
        utilities: Math.round(utilities),
        other: Math.round(other),
        cash: Math.round(cash),
        investments: Math.round(investments),
        realEstate: Math.round(realEstate),
        otherAssets: Math.round(otherAssets)
      });
    } else {
      data.push({
        month: getPeriodLabel(i),
        day: getDayLabel(i),
        year: getYearLabel(i),
        value: Math.round(currentValue),
        prevValue: Math.round(prevValue),
        income: Math.round(currentValue),
        expenses: Math.round(currentExpense),
        housing: Math.round(housing),
        food: Math.round(food),
        transport: Math.round(transport),
        shopping: Math.round(shopping),
        utilities: Math.round(utilities),
        other: Math.round(other),
        cash: Math.round(cash),
        investments: Math.round(investments),
        realEstate: Math.round(realEstate),
        otherAssets: Math.round(otherAssets)
      });
    }
  }
  
  // Add forecast if requested
  if (includeForecast) {
    let forecastBaseValue = currentValue;
    let forecastExpenseValue = currentExpense;
    
    for (let i = 0; i < 3; i++) {
      const forecastIndex = periods + i;
      
      // Forecast values with different volatility
      let direction = Math.random();
      let change = Math.random() * volatility * 0.7;
      
      if (isPositive) {
        direction = direction > 0.2 ? 1 : -1; // 80% chance of going up in forecasts
      } else {
        direction = direction > 0.5 ? 1 : -1;
      }
      
      forecastBaseValue = Math.max(forecastBaseValue + (direction * change), baseValue * 0.1);
      forecastExpenseValue = Math.max(forecastExpenseValue + (Math.random() * 2 - 1) * volatility * 0.15, baseValue * 0.05);
      
      data.push({
        month: `${getMonthName(forecastIndex)} (F)`,
        day: `${getDayLabel(forecastIndex)} (F)`,
        year: `${getYearLabel(forecastIndex)} (F)`,
        value: Math.round(forecastBaseValue),
        income: Math.round(forecastBaseValue),
        expenses: Math.round(forecastExpenseValue),
        forecast: true
      });
    }
  }
  
  return data;
};

// Generate pie chart data
export const generatePieData = (labels: string[], values: number[]) => {
  const colors = ['#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA', '#8E9196'];
  
  return labels.map((label, index) => ({
    name: label,
    value: values[index] || Math.round(Math.random() * 100),
    color: colors[index % colors.length]
  }));
};
