"use client";

export default function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`
        rounded-3xl
        border border-white/10
        bg-white/5
        backdrop-blur-xl
        shadow-[0_0_50px_rgba(0,255,255,.08)]
        hover:scale-[1.02]
        transition-all
        duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
}
