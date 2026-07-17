"use client";

import { useRef } from "react";
import clsx from "clsx";

export default function MagneticButton({
  children,
  onClick,
  variant = "primary",
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  className?: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  function handleMove(e: React.MouseEvent<HTMLButtonElement>) {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
  }

  function reset() {
    const el = ref.current;
    if (el) el.style.transform = "translate(0,0)";
  }

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={clsx(
        "group relative inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-medium transition-[transform,background-color,color] duration-300 ease-out will-change-transform",
        variant === "primary" &&
          "bg-signal text-ink hover:bg-signal-2",
        variant === "ghost" &&
          "border border-line-strong text-paper hover:border-signal/50 hover:text-signal",
        className,
      )}
    >
      {children}
    </button>
  );
}
