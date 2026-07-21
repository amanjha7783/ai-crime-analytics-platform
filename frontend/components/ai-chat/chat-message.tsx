"use client";

import { UIMessage } from "ai";
import { User, Bot, Wrench, CheckCircle2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";

interface ChatMessageProps {
  message: UIMessage;
  isLast: boolean;
}

// Extract text content from UIMessage parts
function getTextContent(message: UIMessage): string {
  if (!message.parts || message.parts.length === 0) return "";
  return message.parts
    .filter((part: any) => part.type === "text")
    .map((part: any) => part.text)
    .join("");
}

// Extract tool invocations from UIMessage parts
function getToolParts(message: UIMessage): any[] {
  if (!message.parts || message.parts.length === 0) return [];
  return message.parts.filter((part: any) => part.type === "tool-invocation");
}

export function ChatMessage({ message, isLast }: ChatMessageProps) {
  const isUser = message.role === "user";
  const textContent = getTextContent(message);
  const toolParts = getToolParts(message);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-6 gap-4 group`}
    >
      {/* Bot Avatar */}
      {!isUser && (
        <div className="flex shrink-0 h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-[var(--accent)] to-[var(--accent-2)] text-white mt-1 shadow-lg shadow-[var(--accent)]/20">
          <Bot size={16} />
        </div>
      )}

      {/* Message Content */}
      <div 
        className={`max-w-[80%] rounded-2xl px-5 py-3.5 shadow-sm text-sm ${
          isUser 
            ? "bg-slate-900 text-white rounded-tr-sm" 
            : "glass glass-frame rounded-tl-sm text-slate-800"
        }`}
      >
        {isUser && <div className="whitespace-pre-wrap">{textContent}</div>}
        
        {!isUser && (
          <div className="prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:p-3 prose-pre:rounded-lg prose-th:bg-slate-100 prose-th:p-2 prose-td:border-b prose-td:border-slate-200 prose-td:p-2">
            {textContent ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {textContent}
              </ReactMarkdown>
            ) : null}

            {/* Tool Invocations Rendering */}
            {toolParts.length > 0 && (
              <div className="mt-3 flex flex-col gap-2">
                {toolParts.map((toolPart: any) => {
                  const toolInvocation = toolPart.toolInvocation || toolPart;
                  return (
                    <div key={toolInvocation.toolCallId} className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-600">
                      {toolInvocation.state === 'result' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Wrench className="w-4 h-4 text-blue-500 animate-pulse" />
                      )}
                      <span>
                        {toolInvocation.state === 'result' 
                          ? `Completed: ${toolInvocation.toolName}`
                          : `Running task: ${toolInvocation.toolName}...`}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex shrink-0 h-8 w-8 items-center justify-center rounded-lg bg-slate-200 text-slate-700 mt-1 shadow-inner">
          <User size={16} />
        </div>
      )}
    </motion.div>
  );
}
