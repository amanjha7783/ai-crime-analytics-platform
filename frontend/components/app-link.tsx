"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import { useRouteProgress } from "@/components/nprogress";

type AppLinkProps = ComponentProps<typeof Link>;
type NavigateEvent = Parameters<NonNullable<AppLinkProps["onNavigate"]>>[0];

function shouldStartProgress(href: AppLinkProps["href"]) {
  if (typeof window === "undefined" || typeof href !== "string") {
    return true;
  }

  const targetUrl = new URL(href, window.location.href);
  const currentUrl = new URL(window.location.href);

  if (targetUrl.origin !== currentUrl.origin) {
    return false;
  }

  return targetUrl.pathname !== currentUrl.pathname || targetUrl.search !== currentUrl.search;
}

export default function AppLink({ href, onNavigate, ...props }: AppLinkProps) {
  const { start } = useRouteProgress();

  return (
    <Link
      {...props}
      href={href}
      onNavigate={(event) => {
        let defaultPrevented = false;
        const guardedEvent: NavigateEvent = {
          preventDefault: () => {
            defaultPrevented = true;
            event.preventDefault();
          }
        };

        onNavigate?.(guardedEvent);

        if (!defaultPrevented && shouldStartProgress(href)) {
          start();
        }
      }}
    />
  );
}
