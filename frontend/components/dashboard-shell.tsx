import Link from "next/link";
import type { ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Flame,
  FileText,
  Gauge,
  Home,
  LogIn,
  Map,
  Network,
  Radar,
  Repeat,
  Search,
  Settings,
  Shield
} from "lucide-react";

const navigation = [
  { href: "/", label: "Dashboard", icon: Home },
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
  { href: "/settings", label: "Settings", icon: Settings }
];

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <aside className="fixed inset-y-0 left-0 hidden w-80 lg:block px-4 py-6">
        <div className="glass glass-frame p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-[var(--accent)] to-[var(--accent-2)] text-white">
              <Shield aria-hidden="true" size={22} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">Karnataka State Police</p>
              <h1 className="text-lg font-semibold">Intelligence Portal</h1>
            </div>
          </div>
          <nav className="mt-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-[var(--muted)] transition hover:bg-white/6 hover:text-[var(--foreground)]"
              >
                <item.icon aria-hidden="true" size={16} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
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
              <div className="glass px-3 py-2 rounded-md flex items-center gap-2 text-sm">
                <Activity aria-hidden="true" size={16} className="text-[var(--accent)]" />
                <span className="text-[var(--muted)]">Live demo feed</span>
              </div>
            </div>
          </div>
        </header>
        <div className="px-5 py-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
