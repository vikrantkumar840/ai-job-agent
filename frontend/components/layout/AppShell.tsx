"use client";

import SmoothScroll from "./SmoothScroll";

import Preloader from "@/components/landing/Preloader";
import BackgroundField from "@/components/landing/BackgroundField";
import CustomCursor from "@/components/landing/CustomCursor";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Pipeline from "@/components/landing/Pipeline";
import Capabilities from "@/components/landing/Capabilities";
import Console from "@/components/landing/Console";
import Stack from "@/components/landing/Stack";
import Approval from "@/components/landing/Approval";
import Footer from "@/components/landing/Footer";

export default function AppShell() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-ink text-paper">
      <Preloader />
      <BackgroundField />
      <CustomCursor />
      <SmoothScroll />
      <Navbar />

      <Hero />
      <Pipeline />
      <Capabilities />
      <Console />
      <Stack />
      <Approval />
      <Footer />
    </main>
  );
}
