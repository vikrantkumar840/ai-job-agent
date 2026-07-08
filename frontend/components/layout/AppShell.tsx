"use client";

import Navbar from "./Navbar";
import SmoothScroll from "./SmoothScroll";
import BackgroundGlow from "../effects/BackgroundGlow";

import Hero from "@/components/apple/Hero";
import ScrollScene from "@/components/apple/ScrollScene";
import Bento from "@/components/apple/Bento";
import Dashboard from "@/components/apple/Dashboard";
import Tech from "@/components/apple/Tech";
import CTA from "@/components/apple/CTA";
import Footer from "@/components/apple/Footer";

export default function AppShell() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#05060a] text-white">

      {/* Animated Background */}
      <BackgroundGlow />

      {/* Smooth Scroll */}
      <SmoothScroll />

      {/* Navigation */}
      <Navbar />

      {/* Content */}
      <div className="relative z-10">

        <Hero />

        <div className="py-32">
          <ScrollScene />
        </div>

        <div className="py-32">
          <Bento />
        </div>

        <div className="py-32">
          <Dashboard />
        </div>

        <div className="py-32">
          <Tech />
        </div>

        <div className="py-32">
          <CTA />
        </div>

        <Footer />

      </div>

    </main>
  );
}
