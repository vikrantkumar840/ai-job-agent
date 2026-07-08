"use client";

interface Props {
  job: any;
}

export default function JobPreviewCard({ job }: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-cyan-500/30 hover:bg-white/[0.07]">

      <div className="flex justify-between">

        <div>

          <h2 className="font-semibold text-lg">
            {job.title}
          </h2>

          <p className="text-white/60 mt-1">
            {job.company}
          </p>

          <p className="text-cyan-400 mt-2 text-sm">
            {job.location}
          </p>

        </div>

        <div className="text-right">

          <div className="rounded-full bg-green-500/20 text-green-400 px-3 py-1 text-xs">
            Good Match
          </div>

        </div>

      </div>

    </div>
  );
}
