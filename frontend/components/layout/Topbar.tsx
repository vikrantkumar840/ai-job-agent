"use client";

interface TopbarProps {
  active: string;
}

export default function Topbar({ active }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#05060a]/70 backdrop-blur-xl">

      <div className="flex h-16 items-center justify-between px-8">

        <div>
          <h2 className="text-xl font-semibold">
            {active}
          </h2>

          <p className="text-sm text-white/50">
            AI Powered Career Workspace
          </p>
        </div>

      </div>

    </header>
  );
}
