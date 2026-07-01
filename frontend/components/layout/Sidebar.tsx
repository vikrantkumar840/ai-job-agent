"use client";

import { useRouter } from "next/navigation";

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

export default function Sidebar({ active, setActive }: SidebarProps) {
  const router = useRouter();

  return (
    <div className="w-64 h-full bg-[#0a0b10] border-r border-white/10 p-4">
      <h1 className="text-xl font-semibold mb-6">Workspace</h1>

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item}
            onClick={() => setActive(item)}
            className={`p-3 rounded-lg cursor-pointer transition ${
              active === item
                ? "bg-white/10 text-white"
                : "text-white/60 hover:bg-white/5"
            }`}
          >
            {item}
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 text-xs text-white/40">
        AI Job Agent v1
      </div>
    </div>
  );
}
