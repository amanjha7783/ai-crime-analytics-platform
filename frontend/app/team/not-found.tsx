import AppLink from "@/components/app-link";

export default function TeamNotFound() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-16 text-[var(--foreground)] lg:px-20">
      <section className="glass glass-frame mx-auto max-w-3xl rounded-[2rem] border border-white/10 p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">Team profile</p>
        <h1 className="mt-4 text-4xl font-semibold">Team profile not found</h1>
        <p className="mt-4 text-[var(--muted)]">
          The requested team is not registered in the KSP Intelligence Portal team directory.
        </p>
        <AppLink href="/#team" className="btn-primary mt-8 inline-flex">
          Return to team directory
        </AppLink>
      </section>
    </main>
  );
}
