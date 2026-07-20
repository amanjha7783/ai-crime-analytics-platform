import AppLink from "@/components/app-link";
import { ArrowRight, Shield } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-command text-white">
      <section className="flex min-h-screen flex-col justify-between px-6 py-8 lg:px-16">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded bg-signal">
              <Shield aria-hidden="true" size={24} />
            </div>
            <span className="font-semibold">KSP Intelligence Portal</span>
          </div>
          <AppLink href="/" className="inline-flex items-center gap-2 rounded bg-white px-4 py-2 text-sm font-semibold text-command">
            Open Dashboard
            <ArrowRight aria-hidden="true" size={16} />
          </AppLink>
        </nav>
        <div className="max-w-4xl py-20">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-200">Datathon 2026</p>
          <h1 className="mt-4 text-5xl font-semibold leading-tight lg:text-7xl">AI-Driven Crime Analytics Platform</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
            Transform fragmented FIR records into hotspot intelligence, offender networks, risk scoring, anomaly alerts, explainable predictions, and district-level command decisions.
          </p>
        </div>
        <div className="grid gap-3 border-t border-white/10 pt-6 md:grid-cols-4">
          {["Hotspots", "Network Graph", "Risk Scores", "Reports"].map((item) => (
            <div key={item} className="rounded border border-white/10 px-4 py-3 text-white/80">
              {item}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
