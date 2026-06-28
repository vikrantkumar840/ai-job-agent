"use client";

export default function BackgroundGlow() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      
      {/* Glow 1 */}
      <div className="absolute w-[600px] h-[600px] bg-cyan-500/20 blur-[160px] rounded-full top-[-200px] left-[-150px]" />

      {/* Glow 2 */}
      <div className="absolute w-[600px] h-[600px] bg-emerald-500/20 blur-[160px] rounded-full bottom-[-200px] right-[-150px]" />

    </div>
  );
}
