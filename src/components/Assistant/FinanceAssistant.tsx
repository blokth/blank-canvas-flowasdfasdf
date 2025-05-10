
import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { useMCPConnection } from '@/hooks/useMCPConnection';

// Import smaller components
import AssistantInput from './components/AssistantInput';

const FinanceAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  // Use the MCP connection hook for API streaming
  const {
    isLoading,
    sendMessage,
  } = useMCPConnection();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // Send message to backend API
    sendMessage(query);
  };

  return (
    <>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button
            className="fixed bottom-20 right-4 z-40 rounded-full h-10 w-10 shadow-md flex items-center justify-center bg-background border border-border/20"
            variant="outline"
          >
            <MessageSquare size={18} />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[80vh] border-t border-border/20">
          <DrawerHeader className="flex justify-between items-center border-b border-border/10 pb-2">
            <DrawerTitle className="text-base font-medium">Finance Assistant</DrawerTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
              <X size={16} />
            </Button>
          </DrawerHeader>
          
          <div className="p-4 flex flex-col h-full">
            <div className="border border-border/20 rounded-xl bg-background/80 p-4 shadow-sm">
              <AssistantInput
                query={query}
                setQuery={setQuery}
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default FinanceAssistant;
