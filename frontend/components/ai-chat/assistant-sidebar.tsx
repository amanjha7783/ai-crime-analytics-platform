"use client";

import { Download, History, Search, Trash2, Sparkles } from "lucide-react";
import { useChatContext } from "./chat-context";
import { useState } from "react";

const SUGGESTED_PROMPTS = [
  "Show crime trends in Bengaluru during the last 6 months.",
  "Which district has the highest cybercrime rate?",
  "Predict burglary hotspots for next month.",
  "Generate a crime report for Mysuru.",
  "Compare crime rates between Hubballi and Mangaluru."
];

export function AssistantSidebar() {
  const { sendMessage, clearChat, exportToPDF } = useChatContext();
  const [isClearing, setIsClearing] = useState(false);

  const handlePromptClick = (prompt: string) => {
    sendMessage({ role: "user", parts: [{ type: "text", text: prompt }] });
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear the conversation?")) {
      setIsClearing(true);
      clearChat();
      setTimeout(() => setIsClearing(false), 500);
    }
  };

  const handleSearch = () => {
    window.prompt("Enter keyword to search past chats (local search coming soon):");
  };

  return (
    <div className="hidden lg:flex w-64 flex-col gap-4">
      <div className="glass glass-frame rounded-xl p-4 border border-[var(--glass-border)] bg-black/40">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-[var(--accent)]" />
          AI Tools
        </h3>
        <div className="space-y-2">
          <button className="w-full flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors p-2 rounded-md hover:bg-white/5">
            <History size={16} />
            <span>Chat History</span>
          </button>
          <button 
            onClick={handleSearch}
            className="w-full flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors p-2 rounded-md hover:bg-white/5"
          >
            <Search size={16} />
            <span>Search Past Chats</span>
          </button>
          <button 
            onClick={exportToPDF}
            className="w-full flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors p-2 rounded-md hover:bg-white/5"
          >
            <Download size={16} />
            <span>Export Report (PDF)</span>
          </button>
          <div className="my-2 border-t border-[var(--glass-border)]" />
          <button 
            onClick={handleClear}
            disabled={isClearing}
            className="w-full flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors p-2 rounded-md hover:bg-red-500/10 disabled:opacity-50"
          >
            <Trash2 size={16} />
            <span>{isClearing ? "Clearing..." : "Clear Conversation"}</span>
          </button>
        </div>
      </div>
      
      <div className="glass glass-frame rounded-xl p-4 flex-1 border border-[var(--glass-border)] bg-black/40">
        <h3 className="font-semibold text-sm mb-3">Suggested Prompts</h3>
        <div className="space-y-2 text-xs text-[var(--muted)]">
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <div 
              key={idx}
              onClick={() => handlePromptClick(prompt)}
              className="p-2 border border-[var(--glass-border)] bg-black/20 rounded-md cursor-pointer hover:border-[var(--accent)] hover:text-[var(--foreground)] transition-colors"
            >
              &quot;{prompt}&quot;
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
