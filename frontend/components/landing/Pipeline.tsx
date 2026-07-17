"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Upload,
  UserSearch,
  Search,
  BarChart3,
  FileEdit,
  Mail,
  MessageSquare,
  Send,
  FileText,
} from "lucide-react";
import SectionLabel from "./SectionLabel";

gsap.registerPlugin(ScrollTrigger);

const STAGES = [
  {
    tag: "Intake",
    mode: "auto" as const,
    title: "Resume upload",
    stamp: "RECEIVED",
    desc: "Drop in a PDF. Text is pulled straight from the file — no re-typing your career by hand.",
    icon: Upload,
  },
  {
    tag: "Extract",
    mode: "auto" as const,
    title: "Profile extraction",
    stamp: "PROFILED",
    desc: "An LLM reads the resume and returns a structured profile: skills, experience, education, a suggested target role.",
    icon: UserSearch,
  },
  {
    tag: "Search",
    mode: "auto" as const,
    title: "LinkedIn search",
    stamp: "MATCHED",
    desc: "Open roles are pulled from LinkedIn, then re-ranked with a semantic (Qdrant) pass before anything reaches you.",
    icon: Search,
  },
  {
    tag: "Rank",
    mode: "auto" as const,
    title: "Fit ranking",
    stamp: "RANKED",
    desc: "Every role is scored against your target role, skills, location and experience — transparently, with the exact reasons shown for each match.",
    icon: BarChart3,
  },
  {
    tag: "Tailor",
    mode: "auto" as const,
    title: "Resume rewrite",
    stamp: "TAILORED",
    desc: "An LLM rewrites your resume around the top-ranked role, using only what's in your real profile — nothing invented.",
    icon: FileEdit,
  },
  {
    tag: "Letter",
    mode: "auto" as const,
    title: "Cover letter",
    stamp: "DRAFTED",
    desc: "A formal, one-page cover letter is generated from your profile, the job, and the resume that was just tailored.",
    icon: Mail,
  },
  {
    tag: "Prep",
    mode: "manual" as const,
    title: "Interview prep",
    stamp: "REHEARSED",
    desc: "On demand: generate likely questions, model answers and tips for any role you're applying to.",
    icon: MessageSquare,
  },
  {
    tag: "Apply",
    mode: "manual" as const,
    title: "Log & track",
    stamp: "TRACKED",
    desc: "Mark a role as applied and track its status — Applied, Interview, Offer — from your dashboard.",
    icon: Send,
  },
];

export default function Pipeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const carriageRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.matchMedia("(min-width: 1024px)").matches);
  }, []);

  useLayoutEffect(() => {
    if (!isDesktop) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const n = STAGES.length;

      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${n * 480}`,
        scrub: 0.6,
        pin: true,
        onUpdate: (self) => {
          const idx = Math.min(n - 1, Math.floor(self.progress * n));
          setActive(idx);

          if (trackRef.current && carriageRef.current) {
            const trackWidth = trackRef.current.offsetWidth;
            const x = self.progress * (trackWidth - 72);
            carriageRef.current.style.transform = `translateX(${x}px)`;
          }
          if (fillRef.current) {
            fillRef.current.style.width = `${self.progress * 100}%`;
          }
        },
      });

      return () => st.kill();
    }, sectionRef);

    return () => ctx.revert();
  }, [isDesktop]);

  const Stage = STAGES[active];
  const Icon = Stage.icon;

  return (
    <section
      id="pipeline"
      ref={sectionRef}
      className="relative border-y border-line bg-gradient-to-b from-ink-2/60 via-ink-2/30 to-transparent py-24 lg:py-0"
    >
      <div className="mx-auto flex h-full max-w-7xl flex-col justify-center px-6 lg:h-screen lg:px-8">
        <SectionLabel index="§ 01">The pipeline</SectionLabel>

        <h2 className="mt-6 max-w-2xl font-display text-4xl font-bold leading-tight sm:text-5xl">
          One resume. <span className="text-gradient">Eight AI agents.</span>{" "}
          Six run automatically.
        </h2>

        {/* Desktop: pinned rail with traveling carriage */}
        {isDesktop && (
          <div className="mt-16">
            <div className="grid grid-cols-[1fr_1.2fr] gap-16 items-center">
              {/* Stage detail, crossfades as carriage passes stations */}
              <div className="min-h-[220px]">
                <div className="flex items-center gap-4">
                  <div className="glass-surface flex h-14 w-14 items-center justify-center rounded-xl text-signal">
                    <Icon size={26} />
                  </div>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-paper-dim/60">
                      Stage {active + 1} / {STAGES.length} — {Stage.tag} ·{" "}
                      <span className={Stage.mode === "auto" ? "text-ok" : "text-violet-2"}>
                        {Stage.mode === "auto" ? "automatic" : "on demand"}
                      </span>
                    </p>
                    <h3 className="font-display text-2xl font-bold">
                      {Stage.title}
                    </h3>
                  </div>
                </div>
                <p className="mt-6 max-w-md text-lg leading-8 text-paper-dim">
                  {Stage.desc}
                </p>
              </div>

              {/* Rail */}
              <div>
                <div className="mb-2 flex justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-paper-dim/30">
                  <span>◂ runs automatically</span>
                  <span>on demand ▸</span>
                </div>
                <div
                  ref={trackRef}
                  className="relative h-2 rounded-full bg-line"
                >
                  <div
                    ref={fillRef}
                    className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-signal to-violet"
                    style={{ width: "0%" }}
                  />
                  {/* Stations */}
                  <div className="absolute inset-0 flex items-center justify-between">
                    {STAGES.map((s, i) => (
                      <div key={s.stamp} className="relative">
                        {i === active && (
                          <span className="absolute inset-0 -m-1.5 animate-ping rounded-full bg-signal/50" />
                        )}
                        <div
                          className={`relative h-3.5 w-3.5 rounded-full border-2 transition-colors duration-300 ${
                            i <= active
                              ? "border-signal bg-signal"
                              : "border-line-strong bg-ink"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                  {/* Traveling carriage */}
                  <div
                    ref={carriageRef}
                    className="glow-signal absolute -top-6 left-0 flex h-14 w-[72px] items-center justify-center rounded-lg border border-signal bg-ink-3"
                  >
                    <FileText size={18} className="text-signal" />
                  </div>
                </div>

                {/* Station labels */}
                <div className="mt-5 flex justify-between font-mono text-[10px] uppercase tracking-[0.15em] text-paper-dim/40">
                  {STAGES.map((s, i) => (
                    <span
                      key={s.tag}
                      className={i === active ? "text-signal" : ""}
                    >
                      {s.tag}
                    </span>
                  ))}
                </div>

                <div className="mt-10 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em]">
                  <span className="text-paper-dim/50">Manifest stamp:</span>
                  <span className="glow-signal rotate-[-4deg] rounded border border-signal px-2 py-1 font-bold text-signal">
                    {Stage.stamp}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile / reduced-motion: simple stacked sequence, same content */}
        {!isDesktop && (
          <div className="mt-14 space-y-5">
            {STAGES.map((s, i) => {
              const SIcon = s.icon;
              return (
                <div
                  key={s.stamp}
                  className="glass-surface flex gap-4 rounded-xl p-5"
                >
                  <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-signal/10 text-signal">
                    <SIcon size={20} />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper-dim/50">
                      {i + 1} / {STAGES.length} · {s.tag} ·{" "}
                      <span className={s.mode === "auto" ? "text-ok" : "text-violet-2"}>
                        {s.mode === "auto" ? "automatic" : "on demand"}
                      </span>
                    </p>
                    <h3 className="font-display text-lg font-bold">
                      {s.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-6 text-paper-dim">
                      {s.desc}
                    </p>
                    <span className="mt-2 inline-block rounded border border-signal/40 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-signal">
                      {s.stamp}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
