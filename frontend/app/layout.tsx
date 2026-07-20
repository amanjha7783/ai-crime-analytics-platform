import type { Metadata } from "next";
import type { ReactNode } from "react";

import "leaflet/dist/leaflet.css";
import "nprogress/nprogress.css";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "AI-Driven Crime Analytics Platform",
  description: "Police intelligence dashboard for crime analytics, hotspots, trends, and network analysis."
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
