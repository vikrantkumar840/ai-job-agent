"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  House,
  LayoutDashboard,
  Search,
  FileText,
  Mail,
  MessageSquare,
  ListChecks,
} from "lucide-react";

const items = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Search Jobs", icon: Search },
  { label: "Resume", icon: FileText },
  { label: "Cover Letter", icon: Mail },
  { label: "Interview", icon: MessageSquare },
  { label: "Results", icon: ListChecks },
];

interface SidebarProps {
  active: string;
  setActive: (value: string) => void;
  credits?: number;
}

export default function Sidebar({
  active,
  setActive,
  credits = 0,
}: SidebarProps) {
  const router = useRouter();

  return (
    <aside className="sticky top-0 h-screen w-64 shrink-0 border-r border-line bg-ink-2/60 backdrop-blur-2xl">
      <div className="flex h-full flex-col p-5">
        <h1 className="mb-8 px-1 font-display text-lg font-bold tracking-tight">
          Resu<span className="text-signal">Apply</span>
        </h1>

        <button
          onClick={() => router.push("/")}
          className="mb-6 flex items-center gap-3 rounded-xl p-3 text-sm text-paper-dim transition hover:bg-white/5 hover:text-signal"
        >
          <House size={18} />
          Home
        </button>

        <nav className="flex-1 space-y-1.5">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.label;
            return (
              <button
                key={item.label}
                onClick={() => setActive(item.label)}
                className="relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition-colors duration-200"
              >
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="glow-signal absolute inset-0 rounded-xl bg-signal"
                  />
                )}
                <Icon
                  size={18}
                  className={`relative z-10 ${isActive ? "text-ink" : "text-paper-dim"}`}
                />
                <span
                  className={`relative z-10 font-medium ${isActive ? "text-ink" : "text-paper-dim"}`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="glass-surface flex items-center justify-between rounded-xl px-4 py-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper-dim/50">
              Credits
            </p>
            <p className="font-display text-lg font-bold text-signal">
              {credits}
            </p>
          </div>
          <button
            onClick={() => router.push("/billing")}
            className="rounded-full border border-line-strong px-3 py-1.5 text-xs transition hover:border-signal/50 hover:text-signal"
          >
            + Buy
          </button>
        </div>

        <div className="mt-4 border-t border-line pt-4 font-mono text-[10px] text-paper-dim/40">
          ResuApply v1 — agent pipeline
        </div>
      </div>
    </aside>
  );
}
