"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 w-full z-50"
    >
      <div className="mx-auto max-w-7xl px-10 py-5">
        
        <div className="flex justify-between items-center 
          rounded-2xl border border-white/10 
          bg-white/5 backdrop-blur-xl px-6 py-4">

          <h1 className="text-xl font-bold tracking-wide">
            Resu<span className="text-cyan-400">Apply</span>
          </h1>

          <div className="flex gap-10 text-sm text-white/70">
            <Link href="/">Home</Link>
            <Link href="/dashboard">Dashboard</Link>
	    <Link href="/workspace">Workspace</Link>
          </div>

        </div>

      </div>
    </motion.nav>
  );
}
