"use client";

import { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatInterface } from "./chat-interface";
import { usePathname } from "next/navigation";

export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Do not show the floating widget if we are on the dedicated assistant page
  if (pathname === "/assistant") {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] h-[600px] max-h-[80vh] flex flex-col glass glass-frame rounded-2xl shadow-2xl overflow-hidden bg-black/80 backdrop-blur-xl border border-[var(--glass-border)]"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--glass-border)] bg-black/40">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                <h3 className="font-semibold text-sm">AI Intelligence Assistant</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden relative">
              <ChatInterface />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[var(--accent)] to-[var(--accent-2)] text-white shadow-lg shadow-[var(--accent)]/30 hover:shadow-[var(--accent)]/50 transition-all"
        title="Open AI Assistant"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>
    </>
  );
}
