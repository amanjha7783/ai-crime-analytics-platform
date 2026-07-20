import AppLink from "@/components/app-link";
import type { landingTeams } from "@/lib/team-data";

type TeamCardData = (typeof landingTeams)[number];

export function TeamCard({ team }: { team: TeamCardData }) {
  return (
    <AppLink
      href={`/team/${team.slug}`}
      className="glass glass-frame group block rounded-[1.75rem] border border-white/10 p-8 text-center transition hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_24px_75px_rgba(15,23,42,0.18)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
      aria-label={`Open ${team.name} team profile`}
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent)]/15 text-[var(--accent)] transition group-hover:scale-105">
        <team.icon size={28} />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-[var(--foreground)]">{team.name}</h3>
      <p className="mt-2 text-sm text-[var(--muted)]">{team.role}</p>
      <span className="mt-6 inline-flex text-sm font-semibold text-[var(--accent)]">View complete profile</span>
    </AppLink>
  );
}
