"use client";

import type { ReactNode } from "react";

import { AuthProvider } from "@/components/auth-context";
import RouteProgressProvider from "@/components/nprogress";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <RouteProgressProvider>{children}</RouteProgressProvider>
    </AuthProvider>
  );
}
