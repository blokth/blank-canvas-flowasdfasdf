
import React, { useState } from 'react';
import ActionPills from '../Assistant/components/ActionPills';
import { VisualizationType } from '../Assistant/components/VisualizationManager';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface DashboardActionsProps {
  setQuery: (query: string) => void;
  setActiveVisualization: (visualization: VisualizationType) => void;
  setResponse: (response: string | null) => void;
}

const DashboardActions: React.FC<DashboardActionsProps> = ({
  setQuery,
  setActiveVisualization,
  setResponse
}) => {
  // Sample data for selections
  const stocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META'];
  const timeframes = ['1 week', '1 month', '3 months', '6 months', '1 year'];
  const sectors = ['Technology', 'Healthcare', 'Finance', 'Energy', 'Consumer Goods'];
  
  // State for selected values
  const [selectedStock, setSelectedStock] = useState(stocks[0]);
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframes[2]);

  // Handle template selection
  const handlePillClick = (templateQuery: string) => {
    // Set the query to the template so the user can edit it
    setQuery(templateQuery);
    
    // Focus the input element
    const inputElement = document.querySelector('textarea');
    if (inputElement) {
      setTimeout(() => {
        inputElement.focus();
      }, 0);
    }
  };

  // Handle template with selection
  const handleTemplateWithSelection = (baseTemplate: string, selection: string) => {
    const template = baseTemplate.replace('{{selection}}', selection);
    handlePillClick(template);
  };

  return (
    <div className="my-4 overflow-x-auto pb-2">
      {/* Original Action Pills */}
      <div className="mb-4">
        <ActionPills onPillClick={handlePillClick} />
      </div>
      
      {/* Enhanced Templates with Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {/* Stock Performance Template */}
        <div className="flex items-center gap-2 bg-muted/20 rounded-lg p-3">
          <Select value={selectedStock} onValueChange={setSelectedStock}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select stock" />
            </SelectTrigger>
            <SelectContent>
              {stocks.map((stock) => (
                <SelectItem key={stock} value={stock}>{stock}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            className="flex-1 justify-start"
            onClick={() => handleTemplateWithSelection(`Show me ${selectedStock} performance for the past {{selection}}`, selectedTimeframe)}
          >
            Show performance
            <DropdownMenu>
              <DropdownMenuTrigger className="ml-2">
                <ChevronDown size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {timeframes.map((timeframe) => (
                  <DropdownMenuItem 
                    key={timeframe}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTimeframe(timeframe);
                    }}
                  >
                    {timeframe}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </Button>
        </div>

        {/* Forecast Template */}
        <div className="flex items-center gap-2 bg-muted/20 rounded-lg p-3">
          <Select value={selectedStock} onValueChange={setSelectedStock}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select stock" />
            </SelectTrigger>
            <SelectContent>
              {stocks.map((stock) => (
                <SelectItem key={stock} value={stock}>{stock}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            className="flex-1 justify-start"
            onClick={() => handlePillClick(`Show me a forecast for ${selectedStock} for the next ${selectedTimeframe}`)}
          >
            Show forecast
          </Button>
        </div>

        {/* Sector Analysis Template */}
        <div className="flex items-center gap-2 bg-muted/20 rounded-lg p-3">
          <Select defaultValue={sectors[0]}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select sector" />
            </SelectTrigger>
            <SelectContent>
              {sectors.map((sector) => (
                <SelectItem key={sector} value={sector}>{sector}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            className="flex-1 justify-start"
            onClick={(e) => {
              const sector = (e.currentTarget.previousSibling as HTMLElement).querySelector('[data-value]')?.getAttribute('data-value') || sectors[0];
              handlePillClick(`Compare stocks in the ${sector} sector`);
            }}
          >
            Analyze sector
          </Button>
        </div>

        {/* Portfolio Comparison Template */}
        <div className="flex items-center gap-2 bg-muted/20 rounded-lg p-3">
          <Select defaultValue={timeframes[2]}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {timeframes.map((timeframe) => (
                <SelectItem key={timeframe} value={timeframe}>{timeframe}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            className="flex-1 justify-start"
            onClick={(e) => {
              const timeframe = (e.currentTarget.previousSibling as HTMLElement).querySelector('[data-value]')?.getAttribute('data-value') || timeframes[2];
              handlePillClick(`Compare my portfolio performance for the past ${timeframe}`);
            }}
          >
            Portfolio comparison
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardActions;
