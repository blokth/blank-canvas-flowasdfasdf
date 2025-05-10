
import React, { useState, useRef, useEffect } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface NotionLikeSelectProps {
  options: string[];
  onSelect: (selected: string) => void;
  placeholder?: string;
  className?: string;
  value?: string;
}

const NotionLikeSelect: React.FC<NotionLikeSelectProps> = ({
  options,
  onSelect,
  placeholder = "Select...",
  className = "",
  value
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close the popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          size="sm"
          role="combobox"
          className={`h-6 px-2 text-xs font-normal border border-muted justify-between ${className}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <div className="max-h-[200px] overflow-auto">
          {options.map((option) => (
            <div
              key={option}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-muted"
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotionLikeSelect;
