"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

const LINKS = [
  { href: "#pipeline", label: "Pipeline" },
  { href: "#capabilities", label: "Capabilities" },
  { href: "#stack", label: "Stack" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleStart() {
    router.push(user ? "/workflow" : "/login");
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header
      className={`fixed left-1/2 top-4 z-50 w-[92%] max-w-6xl -translate-x-1/2 transition-all duration-500 ${
        scrolled
          ? "translate-y-0 opacity-100"
          : "-translate-y-6 opacity-0 pointer-events-none"
      }`}
    >
      <div className="glass-surface flex h-16 items-center justify-between rounded-full px-6">
        <Link href="/" className="font-display text-lg font-bold tracking-tight">
          Resu<span className="text-signal">Apply</span>
        </Link>

        <nav className="hidden items-center gap-8 font-mono text-xs uppercase tracking-[0.2em] text-paper-dim md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="transition hover:text-signal">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-sm text-paper-dim sm:inline">
                {user.full_name}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-full border border-red-500/30 px-5 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="hidden rounded-full border border-line-strong px-5 py-2.5 text-sm transition hover:bg-white/5 sm:inline-block"
              >
                Register
              </Link>
              <button
                onClick={handleStart}
                className="glow-signal rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-signal-2"
              >
                Start Agent
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
