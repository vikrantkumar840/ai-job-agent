"use client";

import { useRouter } from "next/navigation";

interface TopbarProps {
  active: string;
  credits?: number;
}

export default function Topbar({ active, credits }: TopbarProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-ink/70 backdrop-blur-2xl">
      <div className="flex h-16 items-center justify-between px-8">
        <div>
          <h2 className="font-display text-xl font-semibold">{active}</h2>
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-paper-dim/50">
            AI-powered career workspace
          </p>
        </div>

        {typeof credits === "number" && (
          <button
            onClick={() => router.push("/billing")}
            className="glass-surface flex items-center gap-2 rounded-full px-4 py-2 text-sm transition hover:border-signal/40"
          >
            <span className="h-2 w-2 rounded-full bg-ok" />
            <span className="font-mono text-signal">{credits}</span>
            <span className="text-paper-dim/60">credits</span>
          </button>
        )}
      </div>
    </header>
  );
}
