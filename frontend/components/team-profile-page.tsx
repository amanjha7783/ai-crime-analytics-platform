import { ArrowLeft, ArrowRight, Activity, CheckCircle2, Clock, LayoutDashboard, Users } from "lucide-react";
import type { ReactNode } from "react";

import AppLink from "@/components/app-link";
import type { TeamProfile } from "@/lib/team-data";
import { teamPageQuickLinks } from "@/lib/team-data";

function ProfileSection({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="glass glass-frame rounded-[1.5rem] border border-white/10 p-6">
      <h2 className="text-xl font-semibold text-[var(--foreground)]">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function TeamProfilePage({ profile }: { profile: TeamProfile }) {
  const Icon = profile.icon;

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="relative overflow-hidden px-6 py-8 lg:px-20">
        <div className={`absolute inset-x-0 top-0 h-80 bg-gradient-to-br ${profile.accent} opacity-20 blur-3xl`} />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <AppLink
              href="/#team"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-[var(--foreground)] transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              <ArrowLeft size={16} />
              Back to team
            </AppLink>
            <div className="flex flex-wrap gap-2">
              {teamPageQuickLinks.map((link) => (
                <AppLink
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-medium text-[var(--muted)] transition hover:text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                >
                  <link.icon size={14} />
                  {link.label}
                </AppLink>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
            <div className="glass glass-frame rounded-[2rem] border border-white/10 p-8 lg:p-10">
              <div className={`flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br ${profile.accent} text-white shadow-lg`}>
                <Icon size={30} />
              </div>
              <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">{profile.role}</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--foreground)] lg:text-6xl">{profile.name}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--muted)]">{profile.subtitle}</p>
              <p className="mt-8 leading-8 text-[var(--muted)]">{profile.overview}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {profile.metrics.map((metric) => (
                <article key={metric.label} className="glass glass-frame rounded-[1.25rem] border border-white/10 p-5">
                  <p className="text-sm text-[var(--muted)]">{metric.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-[var(--foreground)]">{metric.value}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{metric.detail}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <ProfileSection title="Members And Roles">
              <div className="grid gap-4 md:grid-cols-2">
                {profile.members.map((member) => (
                  <article key={member.name} className="rounded-2xl border border-white/10 bg-white/10 p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)]">
                        <Users size={18} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[var(--foreground)]">{member.name}</h3>
                        <p className="mt-1 text-sm text-[var(--muted)]">{member.role}</p>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">{member.unit}</p>
                        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{member.focus}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </ProfileSection>

            <ProfileSection title="Responsibilities">
              <div className="grid gap-3">
                {profile.responsibilities.map((item) => (
                  <div key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-white/10 p-4">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-[var(--accent)]" size={18} />
                    <p className="text-sm leading-6 text-[var(--muted)]">{item}</p>
                  </div>
                ))}
              </div>
            </ProfileSection>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <ProfileSection title="Operational Dashboards">
              <div className="grid gap-4 sm:grid-cols-2">
                {profile.dashboards.map((dashboard) => (
                  <div key={dashboard} className="rounded-2xl border border-white/10 bg-black/5 p-5">
                    <LayoutDashboard className="text-[var(--accent)]" size={20} />
                    <h3 className="mt-4 font-semibold text-[var(--foreground)]">{dashboard}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Live operational panel connected to the intelligence platform workflow.</p>
                  </div>
                ))}
              </div>
            </ProfileSection>

            <ProfileSection title="Recent Activities">
              <div className="space-y-4">
                {profile.activities.map((activity) => (
                  <article key={`${activity.time}-${activity.title}`} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                      <Clock size={14} />
                      {activity.time}
                    </div>
                    <h3 className="mt-3 font-semibold text-[var(--foreground)]">{activity.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{activity.description}</p>
                  </article>
                ))}
              </div>
            </ProfileSection>
          </div>

          <div className="mt-8">
            <ProfileSection title="Projects And Impact">
              <div className="grid gap-4 lg:grid-cols-3">
                {profile.projects.map((project) => (
                  <article key={project.name} className="rounded-2xl border border-white/10 bg-white/10 p-5">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                      <Activity size={14} />
                      {project.status}
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">{project.name}</h3>
                    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{project.impact}</p>
                  </article>
                ))}
              </div>
            </ProfileSection>
          </div>

          <div className="mt-8 flex justify-end">
            <AppLink href="/login" className="btn-primary inline-flex items-center gap-2">
              Open secure dashboard
              <ArrowRight size={16} />
            </AppLink>
          </div>
        </div>
      </section>
    </main>
  );
}
