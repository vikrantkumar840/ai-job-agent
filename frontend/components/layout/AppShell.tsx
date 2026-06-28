"use client";

import Navbar from "./Navbar";
import BackgroundGlow from "../effects/BackgroundGlow";
import HeroVisual from "../hero/HeroVisual";

export default function AppShell() {
  return (
    <main className="min-h-screen text-white relative overflow-hidden">
      {/* BACKGROUND */}
      <BackgroundGlow />

      {/* NAV */}
      <Navbar />

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-10 pt-36 relative z-10">
        <div className="grid lg:grid-cols-2 items-center gap-24">

          {/* LEFT TEXT */}
          <div className="space-y-6">

            <p className="text-cyan-400 tracking-[8px] uppercase text-xs">
              AI Career Platform
            </p>

            <h1 className="text-7xl font-extrabold leading-[1.1]">
              Find.<br />
              Match.<br />
              Apply.
            </h1>

            <p className="text-white/60 text-lg max-w-md leading-relaxed">
              One Resume AI system that analyzes your profile, matches best jobs,
              and applies automatically in seconds.
            </p>

            <button className="mt-4 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-bold shadow-lg shadow-cyan-500/20 hover:scale-105 transition">
              Start Searching 🚀
            </button>

            {/* mini stats */}
            <div className="flex gap-6 pt-6 text-sm text-white/50">
              <span>⚡ AI Matching</span>
              <span>🤖 Auto Apply</span>
              <span>📄 Resume Optimizer</span>
            </div>

          </div>

          {/* RIGHT VISUAL */}
          <div className="flex justify-center">
            <HeroVisual />
          </div>

        </div>
      </section>

    </main>
  );
}
