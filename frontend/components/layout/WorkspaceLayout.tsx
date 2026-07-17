"use client";

import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

interface WorkspaceLayoutProps {
  children: ReactNode;
  active: string;
  setActive: (value: string) => void;
  credits?: number;
}

export default function WorkspaceLayout({
  children,
  active,
  setActive,
  credits,
}: WorkspaceLayoutProps) {
  return (
    <div className="relative flex min-h-screen bg-ink text-paper">
      {/* Ambient glow, quieter than the landing page — this is a workspace, not a hero */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-signal/[0.08] blur-[140px]" />
        <div className="absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-violet/[0.06] blur-[140px]" />
      </div>

      <Sidebar active={active} setActive={setActive} credits={credits} />

      <div className="flex flex-1 flex-col">
        <Topbar active={active} credits={credits} />

        <main className="flex-1 p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
