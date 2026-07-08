"use client";

interface Props {
  user?: string;
}

export default function DashboardHero({ user }: Props) {
  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-slate-900 to-emerald-500/10 p-8">

      <p className="text-cyan-400 text-sm uppercase tracking-widest">
        AI Career Workspace
      </p>

      <h1 className="mt-3 text-4xl font-bold">
        Welcome{user ? `, ${user}` : ""}
      </h1>

      <p className="mt-3 max-w-2xl text-white/60 leading-7">
        Your resume has been analyzed successfully. AI has searched,
        ranked and optimized your job applications. Everything is ready
        for review.
      </p>

    </div>
  );
}
