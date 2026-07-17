"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ParticleField from "./ParticleField";

export default function BackgroundField() {
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function onMove(e: MouseEvent) {
      spotRef.current?.style.setProperty("--mx", `${e.clientX}px`);
      spotRef.current?.style.setProperty("--my", `${e.clientY}px`);
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-ink pointer-events-none">
      {/* Blueprint grid */}
      <div className="absolute inset-0 grid-field opacity-60" />

      {/* Live particle network */}
      <ParticleField />

      {/* Cursor-follow spotlight */}
      <div
        ref={spotRef}
        style={
          {
            "--mx": "50%",
            "--my": "30%",
          } as React.CSSProperties
        }
        className="absolute inset-0 opacity-[0.35]"
      >
        <div
          className="absolute h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/25 blur-[140px]"
          style={{ left: "var(--mx)", top: "var(--my)" }}
        />
      </div>

      {/* Layered color fields — signal + violet + teal, much more present than a flat black bg */}
      <motion.div
        animate={{ x: [-120, 100, -120], y: [-70, 50, -70] }}
        transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
        className="absolute left-[-220px] top-[-240px] h-[760px] w-[760px] rounded-full bg-signal/[0.22] blur-[150px] will-change-transform"
      />
      <motion.div
        animate={{ x: [80, -100, 80], y: [-40, 60, -40] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute right-[-180px] top-[10%] h-[560px] w-[560px] rounded-full bg-violet/[0.18] blur-[140px] will-change-transform"
      />
      <motion.div
        animate={{ x: [60, -60, 60], y: [40, -30, 40] }}
        transition={{ duration: 46, repeat: Infinity, ease: "linear" }}
        className="absolute right-[-200px] bottom-[-240px] h-[680px] w-[680px] rounded-full bg-ok/[0.14] blur-[150px] will-change-transform"
      />

      {/* Grain for texture, keeps flat color fields from looking plasticky */}
      <div className="absolute inset-0 noise-field" />

      {/* Vignette so text stays legible at the edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-transparent to-ink/70" />
    </div>
  );
}
