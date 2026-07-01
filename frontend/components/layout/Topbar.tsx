"use client";

interface TopbarProps {
  active: string;
}

export default function Topbar({ active }: TopbarProps) {
  return (
    <div className="h-14 border-b border-white/10 flex items-center px-6 bg-[#05060a]">
      <h2 className="text-white font-medium">{active}</h2>
    </div>
  );
}
