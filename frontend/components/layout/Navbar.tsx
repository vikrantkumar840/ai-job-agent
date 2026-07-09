"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 120);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed left-1/2 top-1 z-50
      -translate-x-1/2
      transition-all duration-500
      ${
        scrolled
          ? "translate-y-0 opacity-100 scale-100"          
	  : "-translate-y-16 opacity-0 scale-95 pointer-events-none"      
      }
      w-[92%]
      max-w-7x1
      `}
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
            Apply World
          </span>
        </Link>

        <nav className="hidden gap-8 text-white/70 md:flex">

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

        <button
          onClick={() => router.push("/workflow")}
          className="
          rounded-full
          bg-cyan-400
          px-6
          py-3
          font-semibold
          text-black
          transition
          hover:scale-105
          "
        >
          Get Started
        </button>

      </div>
    </header>
  );
}
