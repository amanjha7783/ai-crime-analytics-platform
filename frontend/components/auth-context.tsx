"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
export type AuthUser = {
  username: string;
  full_name: string;
  role: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (
    username: string,
    password: string,
    fullName: string,
    role?: string
  ) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */
const TOKEN_KEY = "authToken";
const USER_KEY = "authUser";

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // true while hydrating

  /* Hydrate from localStorage on mount */
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser) as AuthUser);
        /* Ensure the middleware cookie stays in sync */
        document.cookie = "authed=1; path=/; max-age=86400; SameSite=Lax";
      }
    } catch {
      // corrupt localStorage – ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* Cookie helpers – the Next.js middleware reads this to gate routes */
  const setAuthedCookie = () => {
    document.cookie = "authed=1; path=/; max-age=86400; SameSite=Lax";
  };
  const clearAuthedCookie = () => {
    document.cookie = "authed=; path=/; max-age=0";
  };

  /* Persist helpers */
  const persist = useCallback((t: string, u: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, t);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setAuthedCookie();
    setToken(t);
    setUser(u);
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    clearAuthedCookie();
    setToken(null);
    setUser(null);
  }, []);

  /* ---- login ------------------------------------------------------ */
  const login = useCallback(
    async (username: string, password: string) => {
      const res = await fetch(`/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      /* Read the body exactly once as text, then parse */
      const bodyText = await res.text();

      if (!res.ok) {
        let detail = `HTTP ${res.status}`;
        try {
          const json = JSON.parse(bodyText);
          if (json?.detail) detail = String(json.detail);
        } catch {
          if (bodyText) detail = bodyText;
        }
        throw new Error(detail);
      }

      const data = JSON.parse(bodyText) as {
        access_token: string;
        user: AuthUser;
      };
      persist(data.access_token, data.user);
    },
    [persist]
  );

  /* ---- signup ----------------------------------------------------- */
  const signup = useCallback(
    async (
      username: string,
      password: string,
      fullName: string,
      role = "Analyst"
    ) => {
      const res = await fetch(`/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          full_name: fullName,
          role,
        }),
      });

      const bodyText = await res.text();

      if (!res.ok) {
        let detail = `HTTP ${res.status}`;
        try {
          const json = JSON.parse(bodyText);
          if (json?.detail) detail = String(json.detail);
        } catch {
          if (bodyText) detail = bodyText;
        }
        throw new Error(detail);
      }

      /* After successful signup, auto-login */
      await login(username, password);
    },
    [login]
  );

  /* ---- logout ----------------------------------------------------- */
  const logout = useCallback(() => {
    /* Fire-and-forget call to backend */
    fetch(`/api/logout`, { method: "POST" }).catch(() => {});
    clear();
  }, [clear]);

  /* ---- context value --------------------------------------------- */
  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: !!token && !!user,
      isLoading,
      login,
      signup,
      logout,
    }),
    [user, token, isLoading, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
