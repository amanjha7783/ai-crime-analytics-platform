"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useChat } from "@ai-sdk/react";
import { UIMessage, DefaultChatTransport } from "ai";
import { useAuth } from "@/components/auth-context";

interface ChatContextType {
  messages: UIMessage[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendMessage: (message: any) => void;
  reload: () => void;
  stop: () => void;
  isLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  clearChat: () => void;
  exportToPDF: () => void;
  isInitialized: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [input, setInput] = useState("");

  const chatConfig = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: {
        userRole: user?.role || "analyst",
      }
    }),
  });

  const { messages, setMessages, sendMessage, stop, status, error } = chatConfig;
  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    // Load from local storage on mount
    const saved = localStorage.getItem("crime_analytics_chat_history");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse chat history", e);
      }
    } else {
      setMessages([
        {
          id: "welcome-1",
          role: "assistant",
          parts: [{ type: "text", text: "Hello! I am the **AI Crime Intelligence Assistant**. I can help you analyze crime trends, identify hotspots, generate reports, and navigate the platform. \n\nHow can I assist you today?" }]
        }
      ]);
    }
    setIsInitialized(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ role: "user", parts: [{ type: "text", text: input.trim() }] });
    setInput("");
  };

  // Re-map reload to regenerate for this SDK version, or just pass empty if unsupported
  const reload = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((chatConfig as any).reload) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (chatConfig as any).reload();
    }
  };

  useEffect(() => {
    if (isInitialized && messages.length > 0) {
      localStorage.setItem("crime_analytics_chat_history", JSON.stringify(messages));
    }
  }, [messages, isInitialized]);

  const clearChat = () => {
    const welcomeMessage: UIMessage = {
      id: `welcome-${Date.now()}`,
      role: "assistant",
      parts: [{ type: "text", text: "Hello! I am the **AI Crime Intelligence Assistant**. I can help you analyze crime trends, identify hotspots, generate reports, and navigate the platform. \n\nHow can I assist you today?" }]
    };
    setMessages([welcomeMessage]);
    localStorage.setItem("crime_analytics_chat_history", JSON.stringify([welcomeMessage]));
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
        input,
        setInput,
        handleInputChange,
        handleSubmit,
        sendMessage,
        reload,
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
