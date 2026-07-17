"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";

export default function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rX = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const rY = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const glow = useMotionTemplate`radial-gradient(280px circle at ${mx}px ${my}px, rgba(255,90,31,0.14), transparent 70%)`;

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = el.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    mx.set(px);
    my.set(py);

    const nx = px / rect.width - 0.5;
    const ny = py / rect.height - 0.5;
    rY.set(nx * 10);
    rX.set(-ny * 10);
  }

  function onLeave() {
    rX.set(0);
    rY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rX, rotateY: rY, transformPerspective: 800 }}
      className={`group relative ${className}`}
    >
      <motion.div
        style={{ background: glow }}
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      {children}
    </motion.div>
  );
}
