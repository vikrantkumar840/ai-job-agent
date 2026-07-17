"use client";

interface Props {
  user?: string;
}

export default function DashboardHero({ user }: Props) {
  return (
    <div className="glass-surface glow-signal rounded-3xl p-8">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-signal">
        AI career workspace
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold">
        Welcome{user ? `, ${user}` : ""}
      </h1>
      <p className="mt-3 max-w-2xl leading-7 text-paper-dim">
        Your resume has been analyzed, matched against real roles, and
        tailored automatically. ATS scoring, interview prep and applying are
        one click away below.
      </p>
    </div>
  );
}
