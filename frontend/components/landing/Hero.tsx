"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import MagneticButton from "./MagneticButton";

const MANIFEST = [
  { label: "Resume Upload", status: "DONE" },
  { label: "Profile Extraction", status: "DONE" },
  { label: "LinkedIn Search", status: "RUNNING" },
  { label: "Fit Ranking", status: "QUEUED" },
  { label: "Resume Tailoring", status: "QUEUED" },
  { label: "Cover Letter", status: "QUEUED" },
];

const ON_DEMAND = ["ATS Check", "Interview Prep", "Apply & Track"];

const statusColor: Record<string, string> = {
  DONE: "text-ok",
  RUNNING: "text-signal",
  QUEUED: "text-paper-dim/50",
};

export default function Hero() {
  const router = useRouter();

  return (
    <section id="hero" className="relative flex min-h-screen items-center pt-32 pb-20">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-16 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:px-8">
        {/* Left — thesis */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-surface inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-[0.25em] text-paper-dim"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ok" />
            </span>
            Pipeline status: active
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.7 }}
            className="mt-8 text-balance font-display text-5xl font-bold leading-[1.02] sm:text-6xl xl:text-7xl"
          >
            Your resume,
            <br />
            run by{" "}
            <span className="relative inline-block text-gradient">
              eight AI agents
            </span>
            .
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.32 }}
            className="mt-7 max-w-lg text-lg leading-8 text-paper-dim"
          >
            Upload your resume as a PDF. ResuApply extracts your profile,
            searches LinkedIn, ranks every role against your real
            experience, then rewrites your resume and drafts a cover letter
            for the top match — automatically. ATS scoring, interview prep,
            and applying are one click away when you're ready.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.46 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <MagneticButton onClick={() => router.push("/workflow")}>
              Start the pipeline
            </MagneticButton>
            <MagneticButton
              variant="ghost"
              onClick={() => {
                document
                  .getElementById("pipeline")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              See it run ↓
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-14 flex flex-wrap gap-x-10 gap-y-4 font-mono text-xs uppercase tracking-[0.2em] text-paper-dim/60"
          >
            <span>LangGraph orchestration</span>
            <span>Qdrant vector search</span>
            <span>FastAPI + Postgres/Mongo</span>
          </motion.div>
        </div>

        {/* Right — intake manifest, not a generic dashboard card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-surface glow-signal relative rounded-2xl p-7"
        >
          <div className="mb-6 flex items-center justify-between border-b border-line pb-5 font-mono text-xs uppercase tracking-[0.2em] text-paper-dim">
            <span>Intake Manifest</span>
            <span className="text-ok">● live</span>
          </div>

          <div className="space-y-3">
            {MANIFEST.map((row, index) => (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.07 }}
                className="flex items-center justify-between rounded-lg border border-line px-4 py-3 text-sm"
              >
                <span className="text-paper">{row.label}</span>
                <span className={`font-mono text-xs tracking-[0.15em] ${statusColor[row.status]}`}>
                  {row.status}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="mt-5 border-t border-line pt-5">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-paper-dim/40">
              On demand, one click away
            </p>
            <div className="flex flex-wrap gap-2">
              {ON_DEMAND.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-line-strong px-3 py-1 font-mono text-[11px] text-paper-dim"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <p className="mt-6 font-mono text-[11px] leading-relaxed text-paper-dim/50">
            resume_id: 8841-a // pipeline: linkedin search → fit ranking →
            tailor → letter
          </p>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.2 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 font-mono text-xs uppercase tracking-[0.3em] text-paper-dim/50 sm:block"
      >
        scroll to run pipeline
      </motion.div>
    </section>
  );
}
