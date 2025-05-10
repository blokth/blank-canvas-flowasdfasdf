
import React, { useState, useEffect } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { useToast } from '@/hooks/use-toast';
import ConversationView from './components/ConversationView';
import AssistantInput from './components/AssistantInput';

const FinanceAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [chunks, setChunks] = useState<string[]>([]);
  const { toast } = useToast();

  // Handle query submission with minimized setTimeout usage
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // Store current query before clearing
    const currentQuery = query.trim();
    
    // Start loading and prepare for response
    setIsLoading(true);
    
    // Generate mock responses based on query content
    let mockChunks: string[] = [];
    
    if (currentQuery.toLowerCase().includes('portfolio')) {
      mockChunks = ['Here is', 'Here is your', 'Here is your portfolio', 'Here is your portfolio breakdown'];
    } else if (currentQuery.toLowerCase().includes('invest')) {
      mockChunks = ['Based on', 'Based on your', 'Based on your risk profile', 'Based on your risk profile, I recommend'];
    } else {
      mockChunks = ['I can', 'I can help', 'I can help you', 'I can help you with your financial questions'];
    }
    
    // Use a single timeout to start streaming chunks
    const chunkInterval = 300; // milliseconds between chunks
    
    // Simulate streaming with a fixed delay instead of multiple setTimeout calls
    const streamChunks = () => {
      mockChunks.forEach((chunk, index) => {
        // Use a single timeout with calculated delay
        const delay = index * chunkInterval + 500;
        
        setTimeout(() => {
          setChunks([chunk]);
          
          if (index === mockChunks.length - 1) {
            setResponse(chunk);
            setIsLoading(false);
          }
        }, delay);
      });
    };
    
    // Start the streaming process
    streamChunks();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setChunks([]);
      setResponse(null);
    };
  }, []);

  return (
    <>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button
            className="fixed bottom-20 right-4 z-40 rounded-full h-12 w-12 shadow-md flex items-center justify-center bg-primary text-primary-foreground hover:scale-105 transition-all duration-300"
            variant="default"
          >
            <MessageSquare size={20} />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[85vh] border-t border-border/20">
          <DrawerHeader className="flex justify-between items-center border-b border-border/10 pb-2">
            <DrawerTitle className="text-base font-medium">Finance Assistant</DrawerTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 hover:bg-muted/80">
              <X size={16} />
            </Button>
          </DrawerHeader>
          
          <div className="p-4 flex flex-col h-full">
            <ConversationView
              chunks={chunks}
              isLoading={isLoading}
              query={query}
              setQuery={setQuery}
              onSubmit={handleSubmit}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default FinanceAssistant;
