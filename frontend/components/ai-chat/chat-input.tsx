"use client";

import { Send, Square, Sparkles, Paperclip, Mic } from "lucide-react";
import { FormEvent, useRef, KeyboardEvent, useEffect, Dispatch, SetStateAction } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatInputProps {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  sendMessage: (text: string) => void;
  isLoading: boolean;
  stop: () => void;
}

export function ChatInput({ input, setInput, sendMessage, isLoading, stop }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const safeInput = input || "";

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [safeInput]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (safeInput.trim() && !isLoading) {
        sendMessage(safeInput);
        setInput(""); // clear input after sending
      }
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (safeInput.trim() && !isLoading) {
      sendMessage(safeInput);
      setInput("");
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center">
      <form 
        onSubmit={onSubmit}
        className="relative flex flex-col w-full glass glass-frame rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-[var(--accent)] transition-all bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
      >
        <div className="flex w-full items-end p-2 gap-2">
          <button 
            type="button" 
            className="flex shrink-0 h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Attach File (Coming soon)"
          >
            <Paperclip size={18} />
          </button>

          <textarea
            ref={textareaRef}
            value={safeInput}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask the Intelligence Assistant (e.g. 'Show crime trends in Bengaluru')..."
            className="max-h-[200px] min-h-[44px] w-full resize-none bg-transparent py-3 px-1 text-[15px] text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
            rows={1}
            autoFocus
          />

          {isLoading ? (
            <button
              type="button"
              onClick={stop}
              className="flex shrink-0 h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
              title="Stop generating"
            >
              <Square size={16} fill="currentColor" />
            </button>
          ) : (
            <AnimatePresence mode="wait">
              {safeInput.trim() ? (
                <motion.button
                  key="send-btn"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  type="submit"
                  className="flex shrink-0 h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)] text-white shadow-md shadow-[var(--accent)]/30 hover:bg-[var(--accent-2)] transition-colors"
                  title="Send message"
                >
                  <Send size={16} />
                </motion.button>
              ) : (
                <motion.button
                  key="mic-btn"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  type="button"
                  className="flex shrink-0 h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  title="Voice input (Coming soon)"
                >
                  <Mic size={18} />
                </motion.button>
              )}
            </AnimatePresence>
          )}
        </div>
      </form>
      
      <div className="flex justify-between w-full px-2 mt-2">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
          <Sparkles size={12} className="text-[var(--accent)]" />
          Powered by Gemini 2.5 Pro
        </div>
        {safeInput.length > 0 && (
          <div className="text-[11px] text-slate-400">
            {safeInput.length} chars
          </div>
        )}
      </div>
    </div>
  );
}
