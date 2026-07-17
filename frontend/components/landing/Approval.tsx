"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import MagneticButton from "./MagneticButton";

const METRICS = [
  { value: 20, suffix: "+", label: "Jobs / search" },
  { value: 8, suffix: "", label: "AI agents" },
  { value: 94, suffix: "%", label: "ATS score" },
  { value: 60, suffix: "s", prefix: "<", label: "Workflow time" },
];

export default function Approval() {
  const router = useRouter();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.4 });

  return (
    <section className="py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="ticket-edge glass-surface glow-signal relative overflow-hidden rounded-3xl p-10 text-center sm:p-16"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-signal/[0.10] via-transparent to-violet/[0.10]" />

          <motion.span
            initial={{ opacity: 0, scale: 0.7, rotate: 0 }}
            whileInView={{ opacity: 1, scale: 1, rotate: -8 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5, ease: "backOut" }}
            className="absolute right-8 top-8 hidden rounded-md border-2 border-signal px-4 py-1.5 font-mono text-sm font-bold uppercase tracking-[0.2em] text-signal glow-signal sm:block"
          >
            Approved
          </motion.span>

          <p className="relative font-mono text-xs uppercase tracking-[0.35em] text-paper-dim/60">
            Manifest complete
          </p>

          <h2 className="relative mx-auto mt-6 max-w-2xl text-balance font-display text-4xl font-bold leading-tight sm:text-5xl">
            Your next role starts with{" "}
            <span className="text-gradient">one upload</span>.
          </h2>

          <p className="relative mx-auto mt-6 max-w-xl leading-8 text-paper-dim">
            Every stage you just watched runs the same way for your resume —
            search, rank, tailor, write, rehearse, apply.
          </p>

          <div className="relative mt-10 flex flex-wrap justify-center gap-5">
            <MagneticButton onClick={() => router.push("/workflow")}>
              Start your journey <ArrowRight size={18} />
            </MagneticButton>
            <MagneticButton
              variant="ghost"
              onClick={() => router.push("/dashboard")}
            >
              Explore the console
            </MagneticButton>
          </div>

          <div className="relative mt-16 grid grid-cols-2 gap-8 border-t border-line pt-10 sm:grid-cols-4">
            {METRICS.map((m) => (
              <div key={m.label}>
                <h3 className="font-display text-3xl font-bold text-gradient sm:text-4xl">
                  {m.prefix ?? ""}
                  <CountUp end={inView ? m.value : 0} duration={1.8} />
                  {m.suffix}
                </h3>
                <p className="mt-2 font-mono text-xs uppercase tracking-[0.15em] text-paper-dim/60">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
