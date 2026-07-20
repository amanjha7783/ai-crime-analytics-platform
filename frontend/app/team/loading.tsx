export default function TeamLoading() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-6 py-10 text-[var(--foreground)] lg:px-20">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="glass glass-frame h-96 animate-pulse rounded-[2rem] border border-white/10" />
        <div className="grid gap-4">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="glass glass-frame h-28 animate-pulse rounded-[1.25rem] border border-white/10" />
          ))}
        </div>
      </div>
    </main>
  );
}
