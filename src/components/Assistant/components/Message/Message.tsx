
import React, { useEffect, useRef, useMemo } from 'react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import mermaid from 'mermaid';

// Initialize mermaid
mermaid.initialize({
  startOnLoad: true,
  theme: 'neutral',
  securityLevel: 'loose',
  fontFamily: 'inherit',
});

export interface MessageProps {
  role: 'user' | 'assistant';
  content: string;
  id: string;
}

// Component to render Mermaid diagrams
const MermaidRenderer = ({ code }: { code: string }) => {
  const mermaidRef = useRef<HTMLDivElement>(null);
  
  // Generate a stable mermaid ID using useMemo
  const mermaidId = useMemo(() => 
    `mermaid-${Math.random().toString(36).substring(2, 11)}`, 
    []
  );

  // Use useMemo to prevent re-rendering the diagram unnecessarily
  const renderMermaid = useMemo(() => {
    return () => {
      if (mermaidRef.current) {
        try {
          mermaidRef.current.innerHTML = '';
          mermaid.render(mermaidId, code).then(({ svg }) => {
            if (mermaidRef.current) {
              mermaidRef.current.innerHTML = svg;
            }
          });
        } catch (error) {
          console.error('Mermaid rendering failed', error);
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = `<pre className="text-red-500">Diagram rendering failed: ${error}</pre>`;
          }
        }
      }
    };
  }, [code, mermaidId]);

  // Call the memoized render function when needed
  useEffect(() => {
    renderMermaid();
  }, [renderMermaid]);

  return <div ref={mermaidRef} className="my-4 overflow-auto" />;
};

const Message: React.FC<MessageProps> = ({ role, content, id }) => {
  return (
    <div 
      key={id}
      className={cn(
        "flex flex-col space-y-2 animate-fade-in",
        role === 'user' ? "items-end" : "items-start"
      )}
    >
      <div className={cn(
        "px-4 py-3 rounded-lg max-w-[80%] shadow-sm",
        role === 'user' 
          ? "bg-primary text-primary-foreground rounded-br-none" 
          : "bg-muted rounded-bl-none"
      )}>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown
            components={{
              code({ node, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const language = match && match[1];
                
                // Handle mermaid code blocks
                if (language === 'mermaid') {
                  return <MermaidRenderer code={String(children).replace(/\n$/, '')} />;
                }
                
                // Determine if this is an inline code block
                // We can check if there are any line breaks in the content
                const value = String(children);
                const isInline = !value.includes('\n');
                
                // For other code blocks
                return !isInline ? (
                  <pre className={cn("p-2 rounded bg-slate-800 dark:bg-slate-900 overflow-auto", className)}>
                    <code className={cn("text-sm", className)} {...props}>
                      {children}
                    </code>
                  </pre>
                ) : (
                  <code className={cn("px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-sm", className)} {...props}>
                    {children}
                  </code>
                );
              },
              p({ children }) {
                return <p className="mb-2 last:mb-0">{children}</p>;
              },
              ul({ children }) {
                return <ul className="list-disc pl-6 mb-4">{children}</ul>;
              },
              ol({ children }) {
                return <ol className="list-decimal pl-6 mb-4">{children}</ol>;
              },
              li({ children }) {
                return <li className="mb-1">{children}</li>;
              },
              h1({ children }) {
                return <h1 className="text-xl font-bold mb-2">{children}</h1>;
              },
              h2({ children }) {
                return <h2 className="text-lg font-bold mb-2">{children}</h2>;
              },
              h3({ children }) {
                return <h3 className="text-md font-bold mb-2">{children}</h3>;
              },
              a({ children, href }) {
                return <a href={href} className="text-blue-500 hover:underline" target="_blank" rel="noreferrer">{children}</a>;
              },
              table({ children }) {
                return <table className="border-collapse border border-slate-300 my-4 w-full">{children}</table>;
              },
              thead({ children }) {
                return <thead className="bg-slate-100 dark:bg-slate-800">{children}</thead>;
              },
              tbody({ children }) {
                return <tbody>{children}</tbody>;
              },
              tr({ children }) {
                return <tr className="border-b border-slate-300">{children}</tr>;
              },
              th({ children }) {
                return <th className="border border-slate-300 p-2 text-left font-bold">{children}</th>;
              },
              td({ children }) {
                return <td className="border border-slate-300 p-2">{children}</td>;
              },
              blockquote({ children }) {
                return <blockquote className="border-l-4 border-slate-300 pl-4 italic my-4">{children}</blockquote>;
              },
              hr() {
                return <hr className="my-4 border-slate-300" />;
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default Message;
