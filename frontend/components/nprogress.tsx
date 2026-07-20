"use client";

import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import {
  Suspense,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode
} from "react";

type RouteProgressContextValue = {
  start: () => void;
  complete: () => void;
};

const noopRouteProgress: RouteProgressContextValue = {
  start: () => {},
  complete: () => {}
};

const RouteProgressContext = createContext<RouteProgressContextValue>(noopRouteProgress);

export function useRouteProgress() {
  return useContext(RouteProgressContext);
}

function RouteProgressCompletion({ complete }: { complete: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  useEffect(() => {
    complete();
  }, [complete, pathname, search]);

  return null;
}

export default function RouteProgressProvider({ children }: { children: ReactNode }) {
  const startedRef = useRef(false);
  const safetyTimerRef = useRef<number | null>(null);
  const completeTimerRef = useRef<number | null>(null);

  const clearSafetyTimer = useCallback(() => {
    if (safetyTimerRef.current) {
      window.clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }
  }, []);

  const clearCompleteTimer = useCallback(() => {
    if (completeTimerRef.current) {
      window.clearTimeout(completeTimerRef.current);
      completeTimerRef.current = null;
    }
  }, []);

  const complete = useCallback(() => {
    clearSafetyTimer();
    clearCompleteTimer();
    completeTimerRef.current = window.setTimeout(() => {
      NProgress.done();
      startedRef.current = false;
      completeTimerRef.current = null;
    }, 120);
  }, [clearCompleteTimer, clearSafetyTimer]);

  const start = useCallback(() => {
    clearCompleteTimer();

    if (startedRef.current) {
      NProgress.inc();
    } else {
      NProgress.start();
      startedRef.current = true;
    }

    clearSafetyTimer();
    safetyTimerRef.current = window.setTimeout(complete, 15000);
  }, [clearCompleteTimer, clearSafetyTimer, complete]);

  useEffect(() => {
    NProgress.configure({ showSpinner: false, minimum: 0.08, speed: 400, trickleSpeed: 200 });

    window.addEventListener("popstate", start);
    return () => {
      window.removeEventListener("popstate", start);
      clearSafetyTimer();
      clearCompleteTimer();
      NProgress.remove();
    };
  }, [clearCompleteTimer, clearSafetyTimer, start]);

  const contextValue = useMemo(() => ({ start, complete }), [complete, start]);

  return (
    <RouteProgressContext.Provider value={contextValue}>
      <Suspense fallback={null}>
        <RouteProgressCompletion complete={complete} />
      </Suspense>
      {children}
    </RouteProgressContext.Provider>
  );
}
