import React, { useEffect, useRef } from 'react';
interface ConversationViewProps {
  chunks: string[];
  isLoading: boolean;
}
const ConversationView: React.FC<ConversationViewProps> = ({
  chunks,
  isLoading
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new chunks arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chunks]);
  if (chunks.length === 0) {
    return null;
  }
  return;
};
export default ConversationView;