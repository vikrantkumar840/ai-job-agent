"use client";

import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { ReactNode } from "react";

interface WorkspaceLayoutProps {
  children: ReactNode;
  active: string;
  setActive: (value: string) => void;
}

export default function WorkspaceLayout({
  children,
  active,
  setActive,
}: WorkspaceLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#05060a] via-[#0a0d14] to-[#05060a] text-white">

      <Sidebar
        active={active}
        setActive={setActive}
      />

      <div className="flex flex-1 flex-col">

        <Topbar active={active} />

        <main className="flex-1 p-8">
          {children}
        </main>

      </div>

    </div>
  );
}
