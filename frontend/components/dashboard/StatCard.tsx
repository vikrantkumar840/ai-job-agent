"use client";

interface Props {
  title: string;
  value: string | number;
  color?: string;
}

export default function StatCard({
  title,
  value,
  color = "text-signal",
}: Props) {
  return (
    <div className="glass-surface rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1 hover:border-signal/40">
      <p className="text-sm text-paper-dim">{title}</p>
      <h2 className={`mt-3 font-display text-4xl font-bold ${color}`}>
        {value}
      </h2>
    </div>
  );
}
