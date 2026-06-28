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
      <section className="max-w-7xl mx-auto px-10 pt-40 relative z-10">

        <div className="grid lg:grid-cols-2 items-center gap-24">

          {/* LEFT */}
          <div className="space-y-8">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs text-cyan-300">
              ⚡ AI Powered Job Engine
            </div>

            <h1 className="text-7xl font-extrabold leading-[1.05] tracking-tight">
              Find.<br />
              Match.<br />
              Apply.
            </h1>

            <p className="text-white/60 text-lg max-w-md leading-relaxed">
              One Resume AI system that analyzes your profile,
              matches high-paying jobs, and auto-applies in seconds.
            </p>

            <div className="flex gap-4">
              <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-bold hover:scale-105 transition">
                Start Searching 🚀
              </button>

              <button className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition">
                View Demo
              </button>
            </div>

            {/* stats */}
            <div className="flex gap-8 pt-6 text-sm text-white/50">

              <div>
                <p className="text-white text-xl font-bold">10K+</p>
                Jobs Matched
              </div>

              <div>
                <p className="text-white text-xl font-bold">95%</p>
                Accuracy
              </div>

              <div>
                <p className="text-white text-xl font-bold">1 Click</p>
                Apply System
              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div className="flex justify-center">
            <HeroVisual />
          </div>

        </div>

      </section>

    </main>
  );
}
