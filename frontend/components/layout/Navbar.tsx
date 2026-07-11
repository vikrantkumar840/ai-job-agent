"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const router = useRouter();

  const { user, logout } = useAuth();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 120);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function handleStart() {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header
      className={`fixed left-1/2 top-1 z-50 -translate-x-1/2 transition-all duration-500
      ${
        scrolled
          ? "translate-y-0 opacity-100 scale-100"
          : "-translate-y-16 opacity-0 scale-95 pointer-events-none"
      }
      w-[92%] max-w-7xl`}
    >
      <div
        className="
          flex
          h-16
          items-center
          justify-between
          rounded-full
          border
          border-white/10
          bg-black/35
          px-8
          backdrop-blur-2xl
          shadow-[0_0_40px_rgba(0,0,0,.35)]
        "
      >
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight"
        >
          Resume
          <span className="text-cyan-400">
            ApplyWorld
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-white/70">
          <a href="#workflow" className="hover:text-white transition">
            Workflow
          </a>

          <a href="#features" className="hover:text-white transition">
            Features
          </a>

          <a href="#technology" className="hover:text-white transition">
            Technology
          </a>

          <a href="#contact" className="hover:text-white transition">
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-white/70">
                {user.full_name}
              </span>

              <button
                onClick={handleLogout}
                className="
                  rounded-full
                  border
                  border-red-500/30
                  px-5
                  py-2.5
                  text-red-400
                  transition
                  hover:bg-red-500/10
                "
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="
                  rounded-full
                  border
                  border-white/15
                  px-5
                  py-2.5
                  text-white
                  transition
                  hover:bg-white/10
                "
              >
                Register
              </Link>

              <button
                onClick={handleStart}
                className="
                  rounded-full
                  bg-cyan-400
                  px-6
                  py-2.5
                  font-semibold
                  text-black
                  transition
                  hover:scale-105
                "
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
