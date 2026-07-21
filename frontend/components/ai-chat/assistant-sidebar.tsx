"use client";

import { Clock, Download, MessageSquare, Search, Trash2, Zap } from "lucide-react";
import { useChatContext } from "./chat-context";

const suggestedPrompts = [
  "Which district has the highest cyber crime rate?",
  "Show me the predictive hotspots for Bengaluru",
  "Summarize the recent crime analytics",
  "Show me the list of top repeat offenders",
  "Open the network analysis dashboard",
];

export function AssistantSidebar() {
  const { setMessages, sendMessage, setInput } = useChatContext();

  const handleSuggestionClick = (prompt: string) => {
    setInput(prompt);
    setTimeout(() => {
      sendMessage(prompt);
      setInput("");
    }, 100);
  };

  return (
    <div className="w-80 shrink-0 flex flex-col gap-6">
      {/* Tools Panel */}
      <div className="glass glass-frame rounded-xl p-5 flex flex-col gap-4">
        <h3 className="font-semibold text-sm text-[var(--muted)] flex items-center gap-2">
          <Zap size={16} className="text-[var(--accent)]" />
          AI Tools
        </h3>
        
        <div className="flex flex-col gap-2">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-[var(--accent)]/10 transition-colors text-left w-full text-slate-700">
            <Clock size={16} /> Chat History
          </button>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-[var(--accent)]/10 transition-colors text-left w-full text-slate-700">
            <Search size={16} /> Search Past Chats
          </button>
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-[var(--accent)]/10 transition-colors text-left w-full text-slate-700">
            <Download size={16} /> Export Report (PDF)
          </button>
          
          <div className="h-px bg-slate-200 my-1" />
          
          <button 
            onClick={() => setMessages([])}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-red-50 text-red-500 transition-colors text-left w-full"
          >
            <Trash2 size={16} /> Clear Conversation
          </button>
        </div>
      </div>

      {/* Suggested Prompts */}
      <div className="glass glass-frame rounded-xl p-5 flex-1 overflow-y-auto">
        <h3 className="font-semibold text-sm text-[var(--muted)] flex items-center gap-2 mb-4">
          <MessageSquare size={16} className="text-[var(--accent)]" />
          Suggested Prompts
        </h3>
        
        <div className="flex flex-col gap-3">
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestionClick(prompt)}
              className="text-left p-3 rounded-lg bg-white/50 border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm leading-tight"
            >
              &quot;{prompt}&quot;
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
