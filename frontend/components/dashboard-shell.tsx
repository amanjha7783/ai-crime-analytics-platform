"use client";

import type { ReactNode } from "react";
import {
  AlertTriangle,
  BarChart3,
  Flame,
  FileText,
  Gauge,
  Home,
  LogIn,
  LogOut,
  Map,
  Network,
  Radar,
  Repeat,
  Search,
  Settings,
  Shield,
  User,
  Bot,
} from "lucide-react";

import AppLink from "@/components/app-link";
import { useAuth } from "@/components/auth-context";
import { AiChatWidget } from "@/components/ai-chat/ai-chat-widget";
import { ChatProvider } from "@/components/ai-chat/chat-context";
import { LiveDemoFeed } from "@/components/live-demo-feed";

const sidebarItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/assistant", label: "AI Assistant", icon: Bot },
  { href: "/search", label: "Search", icon: Search },
  { href: "/crime-map", label: "Crime Map", icon: Map },
  { href: "/heatmaps", label: "Heatmaps", icon: Flame },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/network-analysis", label: "Network", icon: Network },
  { href: "/predictions", label: "Predictions", icon: Radar },
  { href: "/risk-score", label: "Risk Score", icon: Gauge },
  { href: "/hotspots", label: "Hotspots", icon: AlertTriangle },
  { href: "/repeat-offenders", label: "Repeat Offenders", icon: Repeat },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/login", label: "Login", icon: LogIn },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <ChatProvider>
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <aside className="fixed inset-y-0 left-0 hidden w-80 lg:block px-4 py-6">
          <div className="glass glass-frame p-5 h-full flex flex-col">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-[var(--accent)] to-[var(--accent-2)] text-white">
                <Shield aria-hidden="true" size={22} />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Karnataka State Police</p>
                <h1 className="text-lg font-semibold">Intelligence Portal</h1>
              </div>
            </div>
            <nav className="mt-6 space-y-1 flex-1 overflow-y-auto">
              {sidebarItems.map((item) => (
                <AppLink
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-[var(--muted)] transition hover:bg-white/6 hover:text-[var(--foreground)]"
                >
                  <item.icon aria-hidden="true" size={16} />
                  <span>{item.label}</span>
                </AppLink>
              ))}
            </nav>

            {/* ---- User section at bottom of sidebar ---- */}
            {isAuthenticated && user ? (
              <div className="mt-4 pt-4 border-t border-[var(--glass-border)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[var(--accent)] to-[var(--accent-2)] text-white text-xs font-bold">
                    {user.full_name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{user.full_name}</p>
                    <p className="text-[10px] text-[var(--muted)] truncate">{user.role}</p>
                  </div>
                  <button
                    type="button"
                    onClick={logout}
                    title="Sign out"
                    className="shrink-0 rounded-md p-1.5 text-[var(--muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t border-[var(--glass-border)]">
                <AppLink
                  href="/login"
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition"
                >
                  <User size={16} />
                  <span>Sign in</span>
                </AppLink>
              </div>
            )}
          </div>
        </aside>
        <main className="lg:pl-80">
          <header className="sticky top-0 z-10 px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">AI-Driven Crime Analytics</p>
                <h2 className="text-2xl font-semibold">Police Intelligence Command Center</h2>
              </div>
              <div className="flex items-center gap-2">
                <LiveDemoFeed />
              </div>
            </div>
          </header>
          <div className="px-5 py-6 lg:px-8">{children}</div>
        </main>
        
        {/* Global AI Chat Widget */}
        <AiChatWidget />
      </div>
    </ChatProvider>
  );
}
