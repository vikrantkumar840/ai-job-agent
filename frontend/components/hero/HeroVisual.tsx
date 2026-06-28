"use client";

import { motion } from "framer-motion";

export default function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full h-[400px] flex items-center justify-center"
    >
      <div className="w-[420px] p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <h2 className="text-xl font-bold mb-4">AI Career Assistant</h2>

        <div className="space-y-3">
          <div className="h-3 bg-cyan-500 rounded-full w-4/5" />
          <div className="h-3 bg-white/20 rounded-full" />
          <div className="h-3 bg-white/20 rounded-full" />
          <div className="h-3 bg-white/20 rounded-full" />

          <div className="mt-6 h-12 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-xl" />
        </div>
      </div>
    </motion.div>
  );
}
