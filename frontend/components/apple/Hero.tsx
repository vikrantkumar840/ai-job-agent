"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex items-center">

      <div className="max-w-7xl mx-auto w-full px-8 lg:px-12">

        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* Left */}

          <div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300"
            >
              <Sparkles size={16} />
              AI Career Copilot
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="mt-8 text-6xl md:text-7xl xl:text-8xl font-black leading-[0.95]"
            >
              Your Next
              <br />

              <span className="bg-gradient-to-r from-cyan-400 via-white to-emerald-400 bg-clip-text text-transparent">
                Job
              </span>

              <br />

              Generated
              <br />

              by AI.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: .35 }}
              className="mt-8 max-w-xl text-lg leading-8 text-white/65"
            >
              Upload your resume once.

              Our AI understands your experience, discovers relevant jobs,
              optimizes your resume, generates personalized cover letters,
              and prepares you for interviews automatically.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: .5 }}
              className="mt-10 flex gap-5"
            >

              <button
                onClick={() => router.push("/workflow")}
                className="rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-8 py-4 font-semibold text-black transition hover:scale-105"
              >
                Start Journey
              </button>

              <button className="rounded-2xl border border-white/10 px-8 py-4 hover:bg-white/5 transition">
                Learn More
              </button>

            </motion.div>

          </div>

          {/* Right */}

          <motion.div
            initial={{ opacity: 0, scale: .92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9 }}
            className="relative"
          >

            <div className="rounded-[34px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 shadow-[0_0_80px_rgba(34,211,238,.12)]">

              <div className="flex justify-between items-center mb-8">

                <h2 className="text-xl font-semibold">
                  AI Workflow
                </h2>

                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300">
                  Live
                </span>

              </div>

              {[
                "Resume Upload",
                "Profile Extraction",
                "Semantic Job Search",
                "AI Ranking",
                "Resume Builder",
                "Cover Letter",
                "Interview Prep",
              ].map((item, index) => (

                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: .4 + index * .08,
                  }}
                  className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4"
                >

                  <span>{item}</span>

                  <div className="h-2 w-24 overflow-hidden rounded-full bg-white/10">

                    <motion.div
                      animate={{
                        width: ["10%", "100%", "100%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * .2,
                      }}
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                    />

                  </div>

                </motion.div>

              ))}

            </div>

          </motion.div>

        </div>

      </div>

      <motion.div
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40"
      >
        ↓ Scroll
      </motion.div>

    </section>
  );
}
