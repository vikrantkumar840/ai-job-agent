"use client";

interface Props {
  title: string;
  value: string | number;
  color?: string;
}

export default function StatCard({
  title,
  value,
  color = "text-cyan-400",
}: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-500/30">

      <p className="text-sm text-white/50">
        {title}
      </p>

      <h2 className={`mt-3 text-4xl font-bold ${color}`}>
        {value}
      </h2>

    </div>
  );
}
