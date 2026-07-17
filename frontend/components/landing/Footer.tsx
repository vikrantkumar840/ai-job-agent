"use client";

import { Mail, ArrowUpRight } from "lucide-react";

const PRODUCT = ["Resume Builder", "Job Search", "Cover Letter", "Interview AI"];
const TECHNOLOGIES = ["FastAPI", "Next.js", "LangGraph", "Qdrant"];
const RESOURCES = ["Documentation", "API", "Roadmap", "Support"];

export default function Footer() {
  return (
    <footer id="contact" className="mt-10 border-t border-line bg-ink-2/40">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl font-bold">
              Resu<span className="text-signal">Apply</span>
            </h2>
            <p className="mt-5 max-w-md leading-7 text-paper-dim">
              An AI career pipeline that discovers roles, tailors your resume,
              writes cover letters, and preps you for interviews — through an
              orchestrated multi-agent workflow.
            </p>

            <div className="mt-8 flex gap-3">
              <a
                href="https://github.com/vikrantkumar840"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconButton>GH</IconButton>
              </a>
              <a
                href="https://www.linkedin.com/in/vikrant-kumar722/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconButton>in</IconButton>
              </a>
              <a href="mailto:kumarvikrant722@gmail.com">
                <IconButton>
                  <Mail size={16} />
                </IconButton>
              </a>
            </div>
          </div>

          <Column title="Product" items={PRODUCT} />
          <Column title="Technology" items={TECHNOLOGIES} />
          <Column title="Resources" items={RESOURCES} />
        </div>

        <div className="my-10 h-px bg-line" />

        <div className="flex flex-col items-center justify-between gap-5 font-mono text-xs text-paper-dim/50 md:flex-row">
          <p>© 2026 ResuApply — built with Next.js, FastAPI, LangGraph & Groq.</p>
          <div className="flex gap-7">
            <a href="/privacy" className="transition hover:text-signal">
              Privacy
            </a>
            <a href="/terms" className="transition hover:text-signal">
              Terms
            </a>
            <a
              href="https://status.yourdomain.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition hover:text-signal"
            >
              Status <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Column({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-paper-dim">
        {title}
      </h3>
      <div className="space-y-3">
        {items.map((item) => (
          <a
            key={item}
            href="#"
            className="block text-sm text-paper-dim/80 transition hover:text-signal"
          >
            {item}
          </a>
        ))}
      </div>
    </div>
  );
}

function IconButton({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-line-strong font-semibold text-sm transition hover:border-signal/40 hover:text-signal">
      {children}
    </div>
  );
}
