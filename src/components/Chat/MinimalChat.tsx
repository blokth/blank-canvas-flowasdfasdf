import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ChatBubble from './ChatBubble';
import { useChat } from '@/hooks/useChat';
const MinimalChat: React.FC = () => {
  const {
    messages,
    input,
    setInput,
    isLoading,
    sendMessage,
    chunks
  } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages, chunks]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage();
  };
  return <div className="w-full bg-background border border-border/10 rounded-xl overflow-hidden shadow-sm">
      
      
      
    </div>;
};
export default MinimalChat;