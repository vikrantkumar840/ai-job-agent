"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import {
  CheckCircle2,
  Briefcase,
  FileText,
  Mail,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import SectionLabel from "./SectionLabel";
import TiltCard from "./TiltCard";

const JOBS = [
  { title: "Senior DevOps Engineer", company: "Amazon", score: 96 },
  { title: "Cloud Platform Engineer", company: "Google", score: 92 },
  { title: "Platform Engineer", company: "Microsoft", score: 89 },
];

export default function Console() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <section className="py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <SectionLabel index="§ 03">One console</SectionLabel>
          <h2 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
            Everything the agents did, in one place.
          </h2>
        </motion.div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass-surface glow-signal rounded-2xl p-6 sm:p-10"
        >
          <div className="mb-10 flex items-center justify-between border-b border-line pb-6">
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-violet/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-signal/60" />
              <span className="h-2.5 w-2.5 animate-pulse-glow rounded-full bg-ok" />
              <h3 className="ml-3 font-mono text-sm uppercase tracking-[0.2em] text-paper-dim">
                console — session 8841-a
              </h3>
            </div>
            <div className="hidden items-center gap-2 font-mono text-xs text-ok sm:flex">
              <span className="h-2 w-2 animate-pulse rounded-full bg-ok" />
              agents active
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Metric icon={<Briefcase size={20} />} label="Jobs found" value={20} inView={inView} />
            <Metric icon={<Sparkles size={20} />} label="ATS score" value={94} suffix="%" inView={inView} />
            <Metric icon={<FileText size={20} />} label="Resume version" value={4} prefix="v" inView={inView} />
          </div>

          <div className="mt-10">
            <div className="mb-3 flex justify-between font-mono text-xs uppercase tracking-[0.15em] text-paper-dim">
              <span>Resume optimization</span>
              <span className="text-signal">94%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-line">
              <motion.div
                initial={{ width: 0 }}
                animate={inView ? { width: "94%" } : { width: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-signal to-violet"
              />
            </div>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <Status icon={<CheckCircle2 size={18} />} label="Resume" value="Optimized" />
            <Status icon={<Mail size={18} />} label="Cover letter" value="Generated" />
            <Status icon={<MessageSquare size={18} />} label="Interview" value="Prepared" />
          </div>

          <div className="mt-12">
            <h4 className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-paper-dim">
              Top matches
            </h4>
            <div className="space-y-3">
              {JOBS.map((job) => (
                <TiltCard
                  key={job.title}
                  className="flex items-center justify-between overflow-hidden rounded-xl border border-line bg-ink/40 px-5 py-4 transition-colors duration-300 hover:border-signal/40"
                >
                  <div className="relative">
                    <p className="font-semibold">{job.title}</p>
                    <p className="text-sm text-paper-dim">{job.company}</p>
                  </div>
                  <div className="relative rounded-full border border-signal/30 bg-signal/10 px-4 py-1.5 font-mono text-sm font-semibold text-signal">
                    {job.score}%
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Metric({
  icon,
  label,
  value,
  prefix = "",
  suffix = "",
  inView,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  inView: boolean;
}) {
  return (
    <div className="rounded-xl border border-line bg-ink/40 p-6">
      <div className="text-signal">{icon}</div>
      <p className="mt-4 text-sm text-paper-dim">{label}</p>
      <h3 className="mt-2 font-display text-3xl font-bold">
        {prefix}
        <CountUp end={inView ? value : 0} duration={1.6} />
        {suffix}
      </h3>
    </div>
  );
}

function Status({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-line bg-ink/40 p-6">
      <div className="flex items-center gap-2 text-ok">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <h4 className="mt-3 font-semibold">{value}</h4>
    </div>
  );
}
