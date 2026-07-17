"use client";

import { motion } from "framer-motion";
import StatCard from "@/components/dashboard/StatCard";
import TiltCard from "@/components/landing/TiltCard";

interface OverviewProps {
  setActive: (tab: string) => void;
  data?: any;
}

export default function Overview({ setActive, data }: OverviewProps) {
  const rankedJobs = data?.ranked_jobs ?? [];
  const selectedJobs = data?.selected_jobs ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">
          AI application summary
        </h1>
        <p className="mt-2 text-paper-dim">
          Your resume has been analyzed and the automatic pipeline has
          completed.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatCard title="Ranked Jobs" value={rankedJobs.length} />
        <StatCard title="Selected Jobs" value={selectedJobs.length} />
        <StatCard title="Status" value="Completed" color="text-ok" />
      </div>

      <div className="glass-surface rounded-2xl p-6">
        <h2 className="mb-4 font-display text-xl font-semibold">
          Top matching jobs
        </h2>

        {selectedJobs.length === 0 ? (
          <p className="text-paper-dim/60">No jobs selected yet.</p>
        ) : (
          <div className="space-y-3">
            {selectedJobs.map((job: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <TiltCard className="rounded-xl border border-line px-4 py-4 transition-colors duration-300 hover:border-signal/40">
                  <div className="relative flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">
                        {job.title || "Untitled Job"}
                      </h3>
                      <p className="text-sm text-paper-dim">
                        {job.company || "Unknown Company"}
                      </p>
                    </div>
                    <div className="text-right">
                      {job.location && (
                        <p className="font-mono text-xs text-signal">
                          {job.location}
                        </p>
                      )}
                      {typeof job.score === "number" && (
                        <p className="mt-1 font-mono text-[10px] text-paper-dim/50">
                          score: {job.score}
                        </p>
                      )}
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => setActive("Resume")}
        className="glow-signal rounded-full bg-signal px-6 py-3 font-semibold text-ink transition hover:bg-signal-2"
      >
        View AI resume →
      </button>
    </div>
  );
}
