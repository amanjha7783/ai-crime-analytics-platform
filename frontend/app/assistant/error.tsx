"use client";

import { useEffect } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function AssistantError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Assistant Page Error:", error);
  }, [error]);

  return (
    <DashboardShell>
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <div className="glass glass-frame rounded-xl p-8 max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center">
              <AlertCircle size={32} />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2 text-[var(--foreground)]">Something went wrong!</h2>
            <p className="text-[var(--muted)] text-sm mb-4">
              We encountered an unexpected error while loading the AI Assistant.
            </p>
            {error.message && (
              <div className="bg-black/40 p-3 rounded-md text-left text-xs font-mono text-red-400 overflow-auto border border-red-900/30">
                {error.message}
              </div>
            )}
          </div>
          <button
            onClick={() => reset()}
            className="w-full flex items-center justify-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white py-2 px-4 rounded-lg transition-colors"
          >
            <RefreshCcw size={16} />
            Try again
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}
