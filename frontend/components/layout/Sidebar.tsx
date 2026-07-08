"use client";

import { useRouter } from "next/navigation";
import { House } from "lucide-react";

const items = [
  "Overview",
  "Search Jobs",
  "Resume",
  "Cover Letter",
  "Interview",
  "Results",
];

interface SidebarProps {
  active: string;
  setActive: (value: string) => void;
}

export default function Sidebar({
  active,
  setActive,
}: SidebarProps) {
  const router = useRouter();

  return (
    <aside className="sticky top-0 h-screen w-64 shrink-0 border-r border-white/10 bg-[#0a0b10]/90 backdrop-blur-xl">

      <div className="flex h-full flex-col p-5">

        {/* Logo */}
        <h1 className="mb-8 text-xl font-bold tracking-wide">
          AI Job Agent
        </h1>

        {/* Home */}
        <button
          onClick={() => router.push("/")}
          className="mb-6 flex items-center gap-3 rounded-xl p-3 text-white/70 transition hover:bg-white/5 hover:text-cyan-400"
        >
          <House size={20} />
          Home
        </button>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {items.map((item) => (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={`w-full rounded-xl px-4 py-3 text-left transition ${
                active === item
                  ? "bg-cyan-500 text-black font-semibold shadow-lg shadow-cyan-500/30"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="border-t border-white/10 pt-5 text-xs text-white/40">
          AI Job Agent v1
        </div>

      </div>

    </aside>
  );
}
