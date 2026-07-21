"use client";

import { useEffect, useRef } from "react";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { useChatContext } from "./chat-context";

export function ChatInterface() {
  const { messages, input, setInput, sendMessage, stop, isLoading, error } = useChatContext();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading, error]);

  return (
    <div className="flex flex-col h-full w-full" id="ai-chat-history-container">
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center text-[var(--muted)]">
            <p>Start a conversation...</p>
          </div>
        )}
        {messages.map((m, idx) => (
          <ChatMessage key={m.id} message={m} isLast={idx === messages.length - 1} />
        ))}
        
        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex justify-start mb-6 gap-4">
            <div className="flex shrink-0 h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[var(--accent)] to-[var(--accent-2)] text-white mt-1 shadow-lg shadow-[var(--accent)]/20 animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <div className="glass glass-frame rounded-2xl rounded-tl-sm px-5 py-3.5 shadow-sm text-sm text-[var(--muted)]">
              Thinking...
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-start mb-6 gap-4">
            <div className="glass glass-frame rounded-2xl rounded-tl-sm px-5 py-3.5 shadow-sm text-sm text-red-400 bg-red-500/10 border-red-500/20">
              <p className="font-semibold mb-1">Error</p>
              <p>{error instanceof Error ? error.message : "An error occurred while generating a response. Please try again."}</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 shrink-0" data-html2canvas-ignore>
        <ChatInput 
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
          isLoading={isLoading}
          stop={stop}
        />
        <div className="text-center mt-2 text-[10px] text-[var(--muted)]">
          AI can make mistakes. Verify important information with raw data.
        </div>
      </div>
    </div>
  );
}
