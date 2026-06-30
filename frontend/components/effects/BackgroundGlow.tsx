"use client";

import { motion } from "framer-motion";

export default function BackgroundGlow() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">

      {/* Left Glow */}
      <motion.div
        animate={{
          opacity: [0.25, 0.55, 0.25],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          -top-48
          -left-48
          w-[700px]
          h-[700px]
          rounded-full
          bg-cyan-500/30
          blur-[180px]
        "
      />

      {/* Right Glow */}
      <motion.div
        animate={{
          opacity: [0.20, 0.45, 0.20],
          scale: [1.1, 0.95, 1.1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          -bottom-48
          -right-48
          w-[650px]
          h-[650px]
          rounded-full
          bg-emerald-500/25
          blur-[180px]
        "
      />

    </div>
  );
}
