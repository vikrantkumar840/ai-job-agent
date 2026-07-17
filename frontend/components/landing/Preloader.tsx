"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const LINES = [
  "mounting resume_parser…",
  "connecting to qdrant vector store…",
  "loading langgraph workflow: 8 agents…",
  "warming ranking model…",
  "handshake: ats_agent, cover_letter_agent, interview_agent…",
];

export default function Preloader() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("resuapply-booted");
    setMounted(true);
    if (seen) return;
    setVisible(true);
    sessionStorage.setItem("resuapply-booted", "1");
  }, []);

  useEffect(() => {
    if (!visible) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduced) {
      setVisible(false);
      return;
    }

    const progressTimer = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + Math.round(6 + Math.random() * 10));
        if (next >= 100) clearInterval(progressTimer);
        return next;
      });
    }, 90);

    const lineTimer = setInterval(() => {
      setLineIndex((i) => Math.min(LINES.length - 1, i + 1));
    }, 340);

    return () => {
      clearInterval(progressTimer);
      clearInterval(lineTimer);
    };
  }, [visible]);

  useEffect(() => {
    if (progress >= 100 && !done) {
      const t = setTimeout(() => setDone(true), 380);
      const t2 = setTimeout(() => setVisible(false), 950);
      return () => {
        clearTimeout(t);
        clearTimeout(t2);
      };
    }
  }, [progress, done]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[200] flex flex-col justify-between bg-ink px-8 py-8 font-mono text-paper-dim md:px-14 md:py-12"
        >
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-paper-dim/60">
            <span>ResuApply / boot</span>
            <span>agent pipeline v1</span>
          </div>

          <div className="space-y-2 text-sm">
            {LINES.slice(0, lineIndex + 1).map((line, i) => (
              <div key={line} className="flex items-center gap-3">
                <span className="text-ok">✓</span>
                <span className={i === lineIndex ? "text-paper" : ""}>
                  {line}
                </span>
              </div>
            ))}
          </div>

          <div>
            <div className="mb-4 flex items-end justify-between">
              <motion.span
                animate={{ opacity: done ? 1 : 0, scale: done ? 1 : 0.9 }}
                className="rotate-[-6deg] rounded border-2 border-signal px-3 py-1 font-display text-lg font-bold uppercase tracking-[0.15em] text-signal"
              >
                Ready
              </motion.span>
              <span className="font-display text-6xl font-bold text-paper md:text-8xl">
                {progress}
                <span className="text-2xl text-paper-dim md:text-3xl">%</span>
              </span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-line">
              <motion.div
                className="h-full bg-signal"
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
