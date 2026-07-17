"use client";

import { motion } from "framer-motion";
import {
  Cloud,
  Database,
  Boxes,
  ShieldCheck,
  Workflow,
  BrainCircuit,
  Search,
  Server,
  Cpu,
} from "lucide-react";
import SectionLabel from "./SectionLabel";
import TiltCard from "./TiltCard";

const TECHS = [
  { title: "Groq · Llama 3.1 8B", desc: "The LLM behind every generation step", icon: BrainCircuit },
  { title: "LangGraph + LangChain", desc: "Ranking → resume → cover-letter workflow", icon: Workflow },
  { title: "FastAPI backend", desc: "Python API layer, one router per feature", icon: Server },
  { title: "Qdrant vector search", desc: "Semantic re-ranking over LinkedIn results", icon: Search },
  { title: "PostgreSQL + MongoDB", desc: "Structured data + resume/session documents", icon: Database },
  { title: "Docker Compose", desc: "Postgres, MongoDB & Qdrant, one command", icon: Boxes },
  { title: "Playwright", desc: "Automated LinkedIn job search", icon: Cloud },
  { title: "JWT + bcrypt", desc: "Access/refresh tokens, hashed passwords", icon: ShieldCheck },
];

export default function Stack() {
  return (
    <section id="stack" className="py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-2xl"
        >
          <SectionLabel index="§ 04">Under the hood</SectionLabel>
          <h2 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
            Built like production infrastructure, not a demo.
          </h2>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TECHS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04, duration: 0.5 }}
              >
                <TiltCard className="glass-surface h-full overflow-hidden rounded-xl p-6 transition-[border-color,box-shadow] duration-300 hover:border-signal/40 hover:glow-signal">
                  <div className="relative inline-flex rounded-lg bg-signal/10 p-3 text-signal">
                    <Icon size={22} />
                  </div>
                  <h3 className="relative mt-6 font-semibold">{item.title}</h3>
                  <p className="relative mt-2 font-mono text-xs leading-relaxed text-paper-dim/70">
                    {item.desc}
                  </p>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glow-signal mt-14 rounded-2xl border border-signal/25 bg-gradient-to-br from-signal/[0.12] via-ink-2/40 to-violet/[0.10] p-10 text-center sm:p-14"
        >
          <Cpu size={44} className="mx-auto text-signal" />
          <h3 className="mt-6 font-display text-3xl font-bold sm:text-4xl">
            One workflow, not a pile of scripts
          </h3>
          <p className="mx-auto mt-5 max-w-3xl leading-8 text-paper-dim">
            Profile extraction and job search run first, then hand off into a
            LangGraph state machine that chains ranking, resume tailoring
            and cover-letter generation into a single traceable run. ATS
            scoring, interview prep and applying are separate, on-demand
            steps you trigger when you're ready.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
