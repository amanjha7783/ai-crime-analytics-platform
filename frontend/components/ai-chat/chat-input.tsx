"use client";

import { Send, Square, Sparkles } from "lucide-react";
import { FormEvent, useRef, KeyboardEvent, useEffect } from "react";
import { ChatRequestOptions } from "ai";

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>, chatRequestOptions?: ChatRequestOptions) => void;
  isLoading: boolean;
  stop: () => void;
}

export function ChatInput({ input = "", handleInputChange, handleSubmit, isLoading, stop }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const safeInput = input || ""; // Fallback to empty string if undefined

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [safeInput]);

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (safeInput.trim() && !isLoading) {
        handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
      }
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="relative flex items-end w-full gap-2 p-2 glass glass-frame rounded-xl focus-within:ring-2 focus-within:ring-[var(--accent)] transition-all bg-white/50 dark:bg-black/40 border border-gray-200 dark:border-gray-800"
    >
      <div className="flex shrink-0 h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-tr from-[var(--accent)]/20 to-[var(--accent-2)]/20 text-[var(--accent-2)]">
        <Sparkles size={20} />
      </div>
      
      <textarea
        ref={textareaRef}
        value={safeInput}
        onChange={handleInputChange}
        onKeyDown={onKeyDown}
        placeholder="Ask the Intelligence Assistant (e.g. 'Show crime trends in Bengaluru')..."
        className="max-h-[200px] min-h-[44px] w-full resize-none bg-transparent py-3 px-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
        rows={1}
      />
      
      {isLoading ? (
        <button
          type="button"
          onClick={stop}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
          title="Stop generating"
        >
          <Square size={18} fill="currentColor" />
        </button>
      ) : (
        <button
          type="submit"
          disabled={!safeInput.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-black hover:bg-gray-200 disabled:bg-white/10 disabled:text-gray-500 transition-colors"
          title="Send message"
        >
          <Send size={18} />
        </button>
      )}
    </form>
  );
}
