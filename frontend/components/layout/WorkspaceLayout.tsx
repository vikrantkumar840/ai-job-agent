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
    <div className="h-screen w-full flex bg-[#05060a] text-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar active={active} setActive={setActive} />

      {/* Main Area */}
      <div className="flex flex-col flex-1">
        {/* Topbar */}
        <Topbar active={active} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
