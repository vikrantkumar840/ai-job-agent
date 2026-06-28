"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: .8 }}
      className="fixed top-0 w-full z-50 backdrop-blur-2xl bg-black/20 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-10 py-5">

        <h1 className="text-2xl font-bold">
          Resu<span className="text-cyan-400">Apply</span>
        </h1>

        <div className="flex gap-8 text-white/70">

          <Link href="/">Home</Link>

          <Link href="/search">Search</Link>

          <Link href="/dashboard">Dashboard</Link>

          <Link href="/analytics">Analytics</Link>

        </div>

      </div>
    </motion.nav>
  );
}
