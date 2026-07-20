import { Metadata } from "next";
import { ChatInterface } from "@/components/ai-chat/chat-interface";
import { DashboardShell } from "@/components/dashboard-shell";
import { Bot } from "lucide-react";
import { AssistantSidebar } from "@/components/ai-chat/assistant-sidebar";

export const metadata: Metadata = {
  title: "AI Intelligence Assistant - Crime Analytics",
  description: "AI-powered assistant for crime data analysis and visualization.",
};

export default function AssistantPage() {
  return (
    <DashboardShell>
      <div className="flex h-[calc(100vh-8rem)] gap-6">
        <AssistantSidebar />

        {/* Main chat interface */}
        <div className="flex-1 glass glass-frame rounded-xl overflow-hidden flex flex-col bg-black/40 border border-[var(--glass-border)] shadow-xl relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 via-transparent to-transparent pointer-events-none" />
          <div className="px-6 py-4 border-b border-[var(--glass-border)] bg-black/60 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-tr from-[var(--accent)] to-[var(--accent-2)] text-white shadow-lg">
                <Bot size={20} />
              </div>
              <div>
                <h2 className="font-bold text-lg">Intelligence Assistant</h2>
                <p className="text-xs text-[var(--accent-2)]">Connected • Powered by Google Gemini</p>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-hidden relative z-10">
            <ChatInterface />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
