import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bolt,
  CheckCircle2,
  Globe2,
  Mail,
  MapPin,
  Shield,
  ShieldAlert,
  Sparkles,
  Users
} from "lucide-react";

const features = [
  {
    title: "Predictive Hotspots",
    description: "Detect critical zones using historical FIR, time windows, and geospatial risk patterns.",
    icon: MapPin
  },
  {
    title: "Offender Network",
    description: "Visualize connections between suspects, vehicles, and incident clusters.",
    icon: Users
  },
  {
    title: "Explainable AI",
    description: "See model confidence, SHAP insight, and trust signals for every prediction.",
    icon: Sparkles
  },
  {
    title: "Dashboard Intelligence",
    description: "Built for command centers with incident feeds, trend charts, and district scoring.",
    icon: BarChart3
  }
];

const stats = [
  { label: "Records Processed", value: "120k+" },
  { label: "Zones Monitored", value: "38" },
  { label: "Predictive Alerts", value: "91% accuracy" },
  { label: "Analyst Ready", value: "24/7" }
];

const team = [
  { name: "KSP Data Science", role: "AI & Analytics" },
  { name: "CrimeOps Command", role: "Operations" },
  { name: "Geo Surveillance", role: "GIS & Mapping" },
  { name: "Security & Trust", role: "Risk & Compliance" }
];

export default function LandingPage() {
  return (
    <main className="relative overflow-hidden landing-gradient bg-[var(--background)] text-[var(--foreground)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[linear-gradient(180deg,_rgba(15,23,42,0.24),_transparent_90%)]" />
      <section className="relative px-6 py-8 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <header className="mb-14 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3 text-sm font-semibold text-[var(--foreground)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent)]/20 text-[var(--accent)] shadow-sm">
                <Shield aria-hidden="true" size={20} />
              </div>
              <span>KSP Intelligence Portal</span>
            </div>
            <nav className="flex flex-wrap items-center gap-4 text-sm text-[var(--foreground)]">
              {[
                ["Overview", "overview"],
                ["Features", "features"],
                ["Datathon", "datathon"],
                ["Team", "team"],
                ["Contact", "contact"]
              ].map(([label, href]) => (
                <a key={href} href={`#${href}`} className="transition hover:text-[var(--accent)]">
                  {label}
                </a>
              ))}
            </nav>
          </header>

          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-[var(--muted)] backdrop-blur">
                <Bolt size={16} className="text-[var(--accent)]" />
                Datathon 2026 flagship showcase
              </span>
              <div className="space-y-6">
                <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-[var(--foreground)] sm:text-6xl">
                  AI-Driven Crime Analytics for Secure, Smart Command Centers
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
                  Transform FIR records into hotspot intelligence, offender networks, risk scoring, anomaly alerts, explainable predictions, and district-level command decisions.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <a href="#features" className="btn-primary inline-flex items-center gap-2">
                  Explore features
                  <ArrowRight aria-hidden="true" size={16} />
                </a>
                <Link href="/login" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm text-[var(--foreground)] transition hover:bg-white/15">
                  Open dashboard
                </Link>
              </div>
            </div>

            <div className="glass glass-frame relative overflow-hidden rounded-[2rem] border border-white/10 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.15)] backdrop-blur">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.12),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(6,182,212,0.16),_transparent_25%)]" />
              <div className="relative space-y-8">
                <div className="flex items-center justify-between gap-4 rounded-[1.75rem] border border-white/10 bg-black/10 p-5 backdrop-blur-sm">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-[var(--muted)]">Command-ready</p>
                    <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">Live threat posture</h2>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[var(--accent)]/15 text-[var(--accent)] shadow-sm">
                    <Globe2 size={24} />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {stats.map((item) => (
                    <div key={item.label} className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5">
                      <p className="text-sm text-[var(--muted)]">{item.label}</p>
                      <p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="overview" className="px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/10 p-10 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">Project overview</p>
              <h2 className="mt-4 text-4xl font-semibold text-[var(--foreground)]">A premium analytics experience for police decision-making.</h2>
              <p className="mt-6 leading-8 text-[var(--muted)]">
                This platform blends geospatial intelligence, incident analytics, and machine-driven predictions into a unified UI. Mission teams can move from raw incident data to high-confidence operational actions faster than ever.
              </p>
            </div>
            <div className="space-y-6 rounded-[1.75rem] border border-white/10 bg-black/5 p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[var(--accent)]/15 text-[var(--accent)]">
                  <Sparkles size={20} />
                </div>
                <div>
                  <p className="font-semibold text-[var(--foreground)]">Designed for rapid decisions</p>
                  <p className="text-sm text-[var(--muted)]">Real-time alerts, visual filters, and geospatial summaries create a faster command workflow.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[var(--accent-2)]/15 text-[var(--accent-2)]">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="font-semibold text-[var(--foreground)]">Explainable AI built in</p>
                  <p className="text-sm text-[var(--muted)]">Transparent predictions and risk signals help operators trust model outcomes.</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white/10 text-white">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <p className="font-semibold text-[var(--foreground)]">Secure by design</p>
                  <p className="text-sm text-[var(--muted)]">Access controls and data auditability are core to the platform architecture.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="space-y-3 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">Feature showcase</p>
            <h2 className="text-4xl font-semibold text-[var(--foreground)]">Everything teams need to analyze, predict, and respond.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="glass glass-frame rounded-[1.75rem] border border-white/10 p-8 transition hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_24px_75px_rgba(15,23,42,0.18)]">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10 text-[var(--accent)] shadow-sm">
                  <feature.icon size={24} />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-[var(--foreground)]">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="datathon" className="px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/10 p-10 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_0.85fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">About the datathon</p>
              <h2 className="mt-4 text-4xl font-semibold text-[var(--foreground)]">A mission-driven showcase of public safety intelligence.</h2>
              <p className="mt-6 leading-8 text-[var(--muted)]">
                Built for the datathon with actionable insights, geospatial analysis, and real-world policing workflows. This platform demonstrates how analytics can support faster investigations, tactical deployments, and community protection.
              </p>
            </div>
            <div className="grid gap-4 rounded-[1.75rem] bg-black/5 p-8">
              <div className="rounded-3xl border border-white/10 bg-[var(--panel)] p-6">
                <p className="text-sm font-semibold text-[var(--accent)]">Trusted data sources</p>
                <p className="mt-3 text-sm text-[var(--muted)]">Incident reports, spatial records, historical FIRs, and event metadata are fused into a unified view.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-[var(--panel)] p-6">
                <p className="text-sm font-semibold text-[var(--accent)]">Operational readiness</p>
                <p className="mt-3 text-sm text-[var(--muted)]">Dashboard widgets, alerts, and risk scores are aligned to command decisions and area deployment planning.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="team" className="px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="space-y-3 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">Team information</p>
            <h2 className="text-4xl font-semibold text-[var(--foreground)]">A cross-functional police analytics squad.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {team.map((member) => (
              <div key={member.name} className="glass glass-frame rounded-[1.75rem] border border-white/10 p-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent)]/15 text-[var(--accent)]">
                  <Users size={28} />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-[var(--foreground)]">{member.name}</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="px-6 py-20 lg:px-20">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/10 p-10 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_0.85fr] lg:items-center">
            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">Contact</p>
              <h2 className="text-4xl font-semibold text-[var(--foreground)]">Ready to demo the platform?</h2>
              <p className="leading-8 text-[var(--muted)]">
                Get in touch for access, collaboration, or further customization of the crime intelligence solution.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <a href="mailto:hello@kspdatathon.local" className="btn-primary inline-flex items-center gap-2">
                  <Mail size={16} /> Contact us
                </a>
                <Link href="/login" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm text-[var(--foreground)] transition hover:bg-white/15">
                  Launch dashboard
                </Link>
              </div>
            </div>
            <div className="grid gap-4 rounded-[1.75rem] bg-black/5 p-8">
              <div className="flex items-center gap-4">
                <div className="rounded-3xl bg-[var(--accent)]/15 p-3 text-[var(--accent)]">
                  <ArrowRight size={20} />
                </div>
                <div>
                  <p className="font-semibold text-[var(--foreground)]">Venue</p>
                  <p className="text-sm text-[var(--muted)]">Innovation Command Center, Bengaluru</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-3xl bg-[var(--accent-2)]/15 p-3 text-[var(--accent-2)]">
                  <Globe2 size={20} />
                </div>
                <div>
                  <p className="font-semibold text-[var(--foreground)]">Timing</p>
                  <p className="text-sm text-[var(--muted)]">Datathon sprint: 48 hours of rapid analytics build</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-3xl bg-white/10 p-3 text-white">
                  <Shield size={20} />
                </div>
                <div>
                  <p className="font-semibold text-[var(--foreground)]">Security</p>
                  <p className="text-sm text-[var(--muted)]">Data privacy and operations-ready analytics at the core.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
