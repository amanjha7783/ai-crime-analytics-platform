"use client";

import { LogIn } from "lucide-react";
import { useEffect, useState } from "react";

export function LoginPanel() {
  const [username, setUsername] = useState("admin@ksp.local");
  const [password, setPassword] = useState("admin123");
  const [role, setRole] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const token = window.localStorage.getItem("authToken");
    const storedUser = window.localStorage.getItem("authUser");

    if (token) {
      setIsAuthenticated(true);
    }

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser) as { role?: string; full_name?: string };
        setRole(user.role ?? "");
        setFullName(user.full_name ?? "");
      } catch {
        // ignore invalid localStorage state
      }
    }
  }, []);

  async function login() {
    setError("");
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
      const response = await fetch(`${baseUrl}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        setError("Access denied");
        setIsAuthenticated(false);
        return;
      }
      const body = await response.json();
      setRole(body.user.role);
      setFullName(body.user.full_name);
      setIsAuthenticated(true);

      if (typeof window !== "undefined") {
        window.localStorage.setItem("authToken", body.access_token);
        window.localStorage.setItem("authUser", JSON.stringify(body.user));
      }
    } catch {
      setError("Service unavailable");
      setIsAuthenticated(false);
    }
  }

  function logout() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("authToken");
      window.localStorage.removeItem("authUser");
    }
    setIsAuthenticated(false);
    setRole("");
    setFullName("");
    setError("");
  }

  return (
    <div className="glass p-6 glass-frame max-w-md w-full fade-in">
      <h3 className="mb-4 text-lg font-semibold">Sign in to your account</h3>
      <label className="grid gap-2 text-sm font-medium">
        <span className="text-[var(--muted)]">Username</span>
        <input className="input-glass" value={username} onChange={(event) => setUsername(event.target.value)} />
      </label>
      <label className="grid gap-2 text-sm font-medium mt-3">
        <span className="text-[var(--muted)]">Password</span>
        <input className="input-glass" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </label>
      <div className="mt-4 flex items-center justify-between gap-3">
        <button type="button" onClick={login} className="btn-primary inline-flex items-center gap-2">
          <LogIn aria-hidden="true" size={18} />
          Sign In
        </button>
        <button type="button" onClick={logout} className="text-sm text-[var(--muted)]">
          Logout
        </button>
      </div>
      {isAuthenticated && (
        <div className="mt-4 rounded border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-3 text-sm font-semibold text-[var(--accent)]">
          Signed in as {fullName || username} {role && `(${role})`}
        </div>
      )}
      {error && (
        <div className="mt-4 rounded border border-danger/30 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
          {error}
        </div>
      )}
    </div>
  );
}
