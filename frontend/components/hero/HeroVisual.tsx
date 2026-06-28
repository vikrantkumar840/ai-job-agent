"use client";

import { motion } from "framer-motion";

export default function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="w-[420px]"
    >
      <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-xl shadow-cyan-500/10">
        
        <h2 className="text-lg font-semibold text-white/90 mb-6">
          AI Career Assistant
        </h2>

        <div className="space-y-3">
          <div className="h-3 bg-cyan-500 rounded-full w-4/5" />
          <div className="h-3 bg-white/10 rounded-full w-full" />
          <div className="h-3 bg-white/10 rounded-full w-3/4" />
          <div className="h-3 bg-white/10 rounded-full w-2/3" />
        </div>

        <div className="mt-8 h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500" />

      </div>
    </motion.div>
  );
}
