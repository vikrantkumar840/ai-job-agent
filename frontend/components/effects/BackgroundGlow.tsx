"use client";

export default function BackgroundGlow() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      
      {/* Base dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#05060a] via-[#070a12] to-[#05060a]" />

      {/* Animated glow blobs */}
      <div className="absolute w-[700px] h-[700px] bg-cyan-500/20 blur-[180px] rounded-full top-[-250px] left-[-200px] animate-pulse" />

      <div className="absolute w-[700px] h-[700px] bg-emerald-500/20 blur-[180px] rounded-full bottom-[-250px] right-[-200px] animate-pulse" />

      {/* Soft vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
    </div>
  );
}
