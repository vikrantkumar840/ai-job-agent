"use client";

import Navbar from "./Navbar";
import BackgroundGlow from "../effects/BackgroundGlow";
import HeroVisual from "../hero/HeroVisual";
import SmoothScroll from "./SmoothScroll";
import CountUp from "react-countup";
import { useRouter } from "next/navigation";

export default function AppShell() {
  const router = useRouter();

  return (
    <main className="min-h-screen text-white relative overflow-hidden">

      <BackgroundGlow />
      <SmoothScroll />
      <Navbar />

      <section className="max-w-7xl mx-auto px-10 pt-40 relative z-10">
        <div className="grid lg:grid-cols-2 items-center gap-24">

          <div className="space-y-8">

            <h1 className="text-7xl font-extrabold">
              Find.<br />Match.<br />Apply.
            </h1>

            <p className="text-white/60">
              AI-powered job engine that analyzes your resume and builds your career path.
            </p>

            {/* 🔥 ONLY ENTRY POINT */}
            <div className="flex gap-4">

              <button
                onClick={() => {
			router.push("/workflow");
		}}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-bold"
              >
                Start Your Journey
              </button>

              <button
	      	
	      >
	      RESUME
              </button>

            </div>

          </div>

          <HeroVisual />

        </div>
      </section>
    </main>
  );
}
