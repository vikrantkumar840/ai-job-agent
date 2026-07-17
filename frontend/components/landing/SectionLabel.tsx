export default function SectionLabel({
  index,
  children,
}: {
  index?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 text-signal">
      {index && (
        <span className="font-mono text-xs tracking-[0.2em]">{index}</span>
      )}
      <span className="h-px w-8 bg-signal/50" />
      <span className="font-mono text-xs uppercase tracking-[0.35em]">
        {children}
      </span>
    </div>
  );
}
