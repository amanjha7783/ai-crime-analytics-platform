"use client";

import { LogIn, UserPlus, Loader2, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/components/auth-context";

const DEMO_ACCOUNTS = [
  { username: "admin@ksp.local", password: "admin123", label: "Admin" },
  { username: "officer@ksp.local", password: "officer123", label: "Officer" },
  { username: "investigator@ksp.local", password: "investigator123", label: "Investigator" },
  { username: "analyst@ksp.local", password: "analyst123", label: "Analyst" },
];

export function LoginPanel() {
  const { isAuthenticated, user, login, signup, logout } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("admin@ksp.local");
  const [password, setPassword] = useState("admin123");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login(username, password);
      } else {
        if (!fullName.trim()) {
          setError("Full name is required");
          setLoading(false);
          return;
        }
        await signup(username, password, fullName);
      }
      router.push("/");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    logout();
    setError("");
  }

  function fillDemo(account: (typeof DEMO_ACCOUNTS)[number]) {
    setUsername(account.username);
    setPassword(account.password);
    setMode("login");
    setError("");
  }

  /* ---- Authenticated state ---- */
  if (isAuthenticated && user) {
    return (
      <div className="glass p-6 glass-frame max-w-md w-full fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-[var(--accent)] to-[var(--accent-2)] text-white font-bold text-sm">
            {user.full_name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div>
            <p className="font-semibold">{user.full_name}</p>
            <p className="text-xs text-[var(--muted)]">
              {user.role} &middot; {user.username}
            </p>
          </div>
        </div>
        <div className="rounded border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-3 text-sm font-semibold text-[var(--accent)] mb-4">
          ✓ Authenticated &amp; session active
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="btn-primary inline-flex items-center gap-2 text-sm"
          >
            Go to Dashboard
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  /* ---- Login / Signup form ---- */
  return (
    <div className="glass p-6 glass-frame max-w-md w-full fade-in">
      {/* Tab switcher */}
      <div className="flex border-b border-[var(--glass-border)] mb-5">
        <button
          type="button"
          onClick={() => { setMode("login"); setError(""); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
            mode === "login"
              ? "border-[var(--accent)] text-[var(--accent)]"
              : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
        >
          <LogIn size={16} /> Sign In
        </button>
        <button
          type="button"
          onClick={() => { setMode("signup"); setError(""); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
            mode === "signup"
              ? "border-[var(--accent)] text-[var(--accent)]"
              : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
        >
          <UserPlus size={16} /> Create Account
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Full Name (signup only) */}
        {mode === "signup" && (
          <label className="grid gap-1.5 text-sm font-medium mb-3">
            <span className="text-[var(--muted)]">Full Name</span>
            <input
              className="input-glass"
              placeholder="e.g. Arun Kumar"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </label>
        )}

        <label className="grid gap-1.5 text-sm font-medium">
          <span className="text-[var(--muted)]">Username</span>
          <input
            className="input-glass"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>

        <label className="grid gap-1.5 text-sm font-medium mt-3">
          <span className="text-[var(--muted)]">Password</span>
          <div className="relative">
            <input
              className="input-glass w-full pr-10"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
              minLength={mode === "signup" ? 6 : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {mode === "signup" && (
            <span className="text-xs text-[var(--muted)]">Minimum 6 characters</span>
          )}
        </label>

        <div className="mt-5">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary inline-flex items-center gap-2 w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : mode === "login" ? (
              <LogIn size={18} />
            ) : (
              <UserPlus size={18} />
            )}
            {loading
              ? "Please wait…"
              : mode === "login"
              ? "Sign In"
              : "Create Account"}
          </button>
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Demo accounts (login mode only) */}
      {mode === "login" && (
        <div className="mt-5 pt-4 border-t border-[var(--glass-border)]">
          <p className="text-xs font-medium text-[var(--muted)] mb-2">Demo accounts — click to auto-fill</p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((acct) => (
              <button
                key={acct.username}
                type="button"
                onClick={() => fillDemo(acct)}
                className="text-left rounded-md px-3 py-2 text-xs bg-white/40 dark:bg-white/5 border border-[var(--glass-border)] hover:border-[var(--accent)]/40 transition-colors"
              >
                <span className="font-semibold block">{acct.label}</span>
                <span className="text-[var(--muted)] text-[10px]">{acct.username}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
