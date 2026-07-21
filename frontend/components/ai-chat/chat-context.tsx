"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { UIMessage } from "ai";
import { useAuth } from "@/components/auth-context";

interface ChatContextType {
  messages: UIMessage[];
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: (text: string) => void;
  reload: () => void;
  stop: () => void;
  isLoading: boolean;
  error: Error | undefined;
  clearChat: () => void;
  exportToPDF: () => void;
  isInitialized: boolean;
  setMessages: (messages: UIMessage[] | ((messages: UIMessage[]) => UIMessage[])) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [input, setInput] = useState("");

  const {
    messages,
    setMessages,
    sendMessage: aiSendMessage,
    status,
    error,
    stop,
    regenerate,
  } = useChat();

  // Derive isLoading from the SDK 4.x status field
  const isLoading = status === "submitted" || status === "streaming";

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    
    // AI SDK 4.x sendMessage expects { text: string } object
    aiSendMessage({ text });
  };

  useEffect(() => {
    // Load from local storage on mount
    const saved = localStorage.getItem("crime_analytics_chat_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      } catch (e) {
        console.error("Failed to parse chat history", e);
      }
    }
    setIsInitialized(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isInitialized && messages.length > 0) {
      localStorage.setItem("crime_analytics_chat_history", JSON.stringify(messages));
    }
  }, [messages, isInitialized]);

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("crime_analytics_chat_history");
  };

  const exportToPDF = async () => {
    const element = document.getElementById("ai-chat-history-container");
    if (!element) return;
    
    // Dynamically import html2pdf to avoid SSR issues
    const html2pdf = (await import("html2pdf.js")).default;
    
    const opt = {
      margin:       1,
      filename:     `Crime_Intelligence_Report_${new Date().toISOString().split('T')[0]}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in' as const, format: 'letter' as const, orientation: 'portrait' as const }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        input,
        setInput,
        sendMessage,
        reload: regenerate,
        stop,
        isLoading,
        error,
        clearChat,
        exportToPDF,
        isInitialized,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}
