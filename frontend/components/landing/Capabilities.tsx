"use client";

import { motion } from "framer-motion";
import {
  Search,
  FileCheck2,
  Sparkles,
  BrainCircuit,
  Network,
  MessageCircle,
} from "lucide-react";
import SectionLabel from "./SectionLabel";
import TiltCard from "./TiltCard";

const CARDS = [
  {
    tag: "Search",
    title: "Semantic job search",
    desc: "LinkedIn results get a Qdrant vector re-ranking pass, so what reaches you is closer to meaning than to keyword overlap.",
    icon: Search,
    large: true,
  },
  {
    tag: "ATS",
    title: "On-demand ATS check",
    desc: "Score any tailored resume against a job description — keyword match, formatting, missing skills — before you send it.",
    icon: FileCheck2,
  },
  {
    tag: "Letter",
    title: "Cover letter per role",
    desc: "Generated fresh from your actual resume and the specific job — not a fill-in-the-blank template.",
    icon: Sparkles,
  },
  {
    tag: "Prep",
    title: "Interview rehearsal",
    desc: "Likely questions, model answers and tips, generated on demand for the exact role you're prepping for.",
    icon: BrainCircuit,
  },
  {
    tag: "Graph",
    title: "LangGraph workflow",
    desc: "Profile extraction and job search run first, feeding a LangGraph state machine that chains ranking, resume rewriting, and cover-letter generation into one traceable run.",
    icon: Network,
    wide: true,
  },
  {
    tag: "Chat",
    title: "AI career coach",
    desc: "Ask questions about your resume, cover letter, or matched jobs — the assistant has full context of your session.",
    icon: MessageCircle,
  },
];

export default function Capabilities() {
  return (
    <section id="capabilities" className="py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-2xl"
        >
          <SectionLabel index="§ 02">Capabilities</SectionLabel>
          <h2 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
            Inside the agent stack.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:auto-rows-[220px]">
          {CARDS.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.5 }}
                className={`${card.large ? "md:row-span-2" : ""} ${card.wide ? "md:col-span-2" : ""}`}
              >
                <TiltCard className="glass-surface group h-full overflow-hidden rounded-2xl p-7 transition-[border-color,box-shadow] duration-300 hover:border-signal/40 hover:glow-signal">
                  <span className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-signal/0 transition-colors duration-300 group-hover:border-signal/60" />
                  <span className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-signal/0 transition-colors duration-300 group-hover:border-signal/60" />
                  <span className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-signal/0 transition-colors duration-300 group-hover:border-signal/60" />
                  <span className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-signal/0 transition-colors duration-300 group-hover:border-signal/60" />

                  <div className="relative flex items-start justify-between">
                    <div className="inline-flex rounded-xl bg-signal/10 p-3 text-signal">
                      <Icon size={26} />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper-dim/40">
                      {card.tag}
                    </span>
                  </div>

                  <h3 className="relative mt-8 font-display text-xl font-semibold">
                    {card.title}
                  </h3>
                  <p className="relative mt-3 leading-7 text-paper-dim">
                    {card.desc}
                  </p>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
