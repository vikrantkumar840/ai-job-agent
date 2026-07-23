// frontend/components/landing/AIAgentLanding.tsx
"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { Bot, Sparkles, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AIAgentLanding() {
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/10 to-transparent" />

      <nav className="relative z-10 flex justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <Bot className="w-8 h-8 text-purple-400" />
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI Agent
          </span>
        </div>
        <button
          onClick={() => router.push("/register")}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full hover:shadow-lg"
        >
          Get Started
        </button>
      </nav>

      <motion.div style={{ opacity, scale }} className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4">
        <motion.div initial={{ y: 20 }} animate={{ y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-400">AI-Powered Job Search</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              Autonomous AI Agents
            </span>
            <br />
            <span className="text-white">That Apply for You</span>
          </h1>
          <p className="mt-6 text-xl text-gray-400 max-w-2xl mx-auto">
            Search, rank, tailor, and apply to jobs automatically. Let our agents do the work.
          </p>
          <motion.div initial={{ y: 20 }} animate={{ y: 0 }} transition={{ delay: 0.2 }} className="mt-10">
            <button
              onClick={() => router.push("/register")}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center gap-2 hover:shadow-lg"
            >
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
