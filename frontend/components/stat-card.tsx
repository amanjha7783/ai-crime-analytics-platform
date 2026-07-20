import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
}) {
  return (
    <div className="glass p-4 glass-frame">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[var(--muted)]">{label}</p>
          <p className="mt-2 text-3xl font-semibold">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-[var(--accent)] to-[var(--accent-2)] text-white`}> 
          <Icon aria-hidden="true" size={20} />
        </div>
      </div>
    </div>
  );
}
