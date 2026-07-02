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
    <div className="relative w-64 h-screen bg-[#0a0b10] border-r border-white/10 p-4 flex flex-col">

      {/* Logo */}
      <h1 className="text-xl font-semibold text-white mb-6">
        AI Job Agent
      </h1>

      {/* Home Button */}
      <button
        onClick={() => router.push("/")}
        className="mb-6 flex items-center gap-3 rounded-lg p-3 text-white/80 hover:bg-white/10 hover:text-white transition"
      >
        <House size={20} />
        <span>Home</span>
      </button>

      {/* Navigation */}
      <div className="space-y-2 flex-1">
        {items.map((item) => (
          <button
            key={item}
            onClick={() => setActive(item)}
            className={`w-full text-left rounded-lg p-3 transition ${
              active === item
                ? "bg-cyan-500 text-black font-semibold"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="text-xs text-white/40 pt-6 border-t border-white/10">
        AI Job Agent v1
      </div>
    </div>
  );
}
