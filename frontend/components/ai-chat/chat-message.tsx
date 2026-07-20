"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { UIMessage } from "ai";
import { User, Bot, AlertTriangle, CheckCircle2, ChevronRight, Copy, RefreshCw, ThumbsUp, ThumbsDown, StopCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useChatContext } from "./chat-context";
import { useState } from "react";

export function ChatMessage({ message, isLast }: { message: UIMessage; isLast?: boolean }) {
  const isUser = message.role === "user";
  const router = useRouter();
  const { reload, stop, isLoading } = useChatContext();
  
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);
  
  const textParts = message.parts?.filter(p => p.type === 'text') || [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messageContent = textParts.map((p: any) => p.text).join('\n');

  const toolInvocations = message.parts?.filter(p => p.type === 'tool-invocation').map(p => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (p as any).toolInvocation;
  }) || [];

  const handleCopy = () => {
    navigator.clipboard.writeText(messageContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle tool invocations to display nice UI for loading data or navigation
  const renderToolInvocations = () => {
    if (toolInvocations.length === 0) return null;

    return (
      <div className="flex flex-col gap-2 mt-2">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {toolInvocations.map((tool: any, idx: number) => {
          if (tool.toolName === "navigateDashboard") {
            if ("result" in tool && tool.result) {
              // Execute navigation if it just resolved and is the latest message
              if (isLast && typeof window !== "undefined") {
                router.push(tool.result.url);
              }
              return (
                <div key={idx} className="flex items-center gap-2 p-2 text-sm bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-md">
                  <CheckCircle2 size={16} />
                  <span>Navigating to {tool.result.url}...</span>
                </div>
              );
            }
            return (
              <div key={idx} className="flex items-center gap-2 p-2 text-sm bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 rounded-md">
                <div className="animate-pulse flex items-center gap-2">
                  <ChevronRight size={16} />
                  <span>Preparing to navigate...</span>
                </div>
              </div>
            );
          }

          if (tool.toolName === "getCrimeTrends" || tool.toolName === "getHotspots") {
            if ("result" in tool) {
              return (
                <div key={idx} className="flex items-start gap-2 p-3 text-sm bg-green-500/10 text-green-500 border border-green-500/20 rounded-md">
                  <CheckCircle2 size={16} className="mt-0.5" />
                  <div>
                    <p className="font-semibold">Successfully retrieved data.</p>
                    <pre className="mt-1 text-xs text-green-400 overflow-x-auto p-2 bg-black/20 rounded">
                      {JSON.stringify(tool.result, null, 2)}
                    </pre>
                  </div>
                </div>
              );
            }
            return (
              <div key={idx} className="flex items-center gap-2 p-2 text-sm bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-md">
                <AlertTriangle size={16} className="animate-pulse" />
                <span>Fetching {tool.toolName === "getCrimeTrends" ? "crime trends" : "hotspot data"} from intelligence database...</span>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <div className={`flex w-full gap-4 ${isUser ? "justify-end" : "justify-start"} mb-6`}>
      {!isUser && (
        <div className="flex shrink-0 h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[var(--accent)] to-[var(--accent-2)] text-white mt-1 shadow-lg shadow-[var(--accent)]/20">
          <Bot size={18} />
        </div>
      )}
      
      <div className={`flex flex-col gap-2 max-w-[85%]`}>
        <div
          className={`relative flex flex-col gap-2 rounded-2xl px-5 py-3.5 text-sm md:text-base ${
            isUser
              ? "bg-white text-black rounded-tr-sm shadow-sm"
              : "glass glass-frame rounded-tl-sm text-[var(--foreground)] shadow-sm"
          }`}
        >
          {messageContent && (
            <div className="prose prose-sm dark:prose-invert max-w-none break-words">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ ...props }) => <a className="text-[var(--accent)] hover:underline" {...props} />,
                  table: ({ ...props }) => (
                    <div className="overflow-x-auto my-4 rounded-lg border border-[var(--glass-border)] bg-black/20">
                      <table className="min-w-full divide-y divide-[var(--glass-border)]" {...props} />
                    </div>
                  ),
                  th: ({ ...props }) => <th className="px-4 py-2 text-left font-semibold text-[var(--foreground)]" {...props} />,
                  td: ({ ...props }) => <td className="px-4 py-2 border-t border-[var(--glass-border)]" {...props} />,
                  code: ({ className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || "");
                    return match ? (
                      <div className="rounded-md overflow-hidden my-2 border border-[var(--glass-border)]">
                        <div className="bg-black/40 px-3 py-1 text-xs text-gray-400">{match[1]}</div>
                        <pre className="p-3 bg-black/60 overflow-x-auto text-sm text-gray-300">
                          <code className={className} {...props}>{children}</code>
                        </pre>
                      </div>
                    ) : (
                      <code className="bg-black/20 rounded px-1.5 py-0.5 text-[var(--accent-2)] font-mono text-sm" {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {messageContent}
              </ReactMarkdown>
            </div>
          )}
          
          {renderToolInvocations()}
        </div>

        {/* Action bar for AI messages */}
        {!isUser && (
          <div className="flex items-center gap-2 mt-1 ml-2 text-xs text-[var(--muted)]" data-html2canvas-ignore>
            <button 
              onClick={handleCopy}
              className="flex items-center gap-1 hover:text-[var(--foreground)] transition-colors p-1 rounded hover:bg-white/5"
              title="Copy message"
            >
              {copied ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
            </button>
            <button 
              onClick={() => setLiked(true)}
              className={`flex items-center gap-1 hover:text-[var(--foreground)] transition-colors p-1 rounded hover:bg-white/5 ${liked === true ? 'text-[var(--accent)]' : ''}`}
              title="Helpful"
            >
              <ThumbsUp size={14} />
            </button>
            <button 
              onClick={() => setLiked(false)}
              className={`flex items-center gap-1 hover:text-[var(--foreground)] transition-colors p-1 rounded hover:bg-white/5 ${liked === false ? 'text-red-400' : ''}`}
              title="Not helpful"
            >
              <ThumbsDown size={14} />
            </button>
            {isLast && isLoading && (
              <button 
                onClick={() => stop()}
                className="flex items-center gap-1 text-orange-400 hover:text-orange-300 transition-colors p-1 rounded hover:bg-white/5 ml-auto"
                title="Stop generating"
              >
                <StopCircle size={14} />
                <span>Stop</span>
              </button>
            )}
            {isLast && !isLoading && (
              <button 
                onClick={() => reload()}
                className="flex items-center gap-1 hover:text-[var(--foreground)] transition-colors p-1 rounded hover:bg-white/5 ml-auto"
                title="Regenerate response"
              >
                <RefreshCw size={14} />
                <span>Regenerate</span>
              </button>
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex shrink-0 h-8 w-8 items-center justify-center rounded-full bg-white text-black mt-1 shadow-sm">
          <User size={18} />
        </div>
      )}
    </div>
  );
}
