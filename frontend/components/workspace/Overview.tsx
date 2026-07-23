"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import StatCard from "@/components/dashboard/StatCard";
import TiltCard from "@/components/landing/TiltCard";
import { useAuth } from "@/hooks/useAuth";
import { quickApply } from "@/lib/api";

interface OverviewProps {
  setActive: (tab: string) => void;
  data?: any;
}

type ApplyState = {
  loading: boolean;
  status?: string;
  warnings?: string;
};

export default function Overview({ setActive, data }: OverviewProps) {
  const { user } = useAuth();
  const rankedJobs = data?.ranked_jobs ?? [];
  const selectedJobs = data?.selected_jobs ?? [];

  const [applyStates, setApplyStates] = useState<Record<number, ApplyState>>({});

  async function handleApply(job: any, index: number) {
    if (!job.link) {
      setApplyStates((s) => ({
        ...s,
        [index]: { loading: false, status: "failed", warnings: "This job has no application link." },
      }));
      return;
    }

    setApplyStates((s) => ({ ...s, [index]: { loading: true } }));

    try {
      const res = await quickApply({
        job_url: job.link,
        job_title: job.title,
        job_company: job.company,
        full_name: user?.full_name || "",
        email: user?.email || "",
        resume_path: localStorage.getItem("resume_path") || "",
        location: job.location || "",
        notify_email: user?.email || undefined,
      });

      setApplyStates((s) => ({
        ...s,
        [index]: { loading: false, status: res.status, warnings: res.warnings },
      }));
    } catch (err: any) {
      setApplyStates((s) => ({
        ...s,
        [index]: { loading: false, status: "failed", warnings: err.message || "Apply failed." },
      }));
    }
  }

  function statusLabel(state?: ApplyState) {
    if (!state) return null;
    if (state.loading) return <span className="text-paper-dim">Applying…</span>;
    if (state.status === "submitted") return <span className="text-ok">Applied ✓</span>;
    if (state.status === "needs_manual_review")
      return <span className="text-amber-400">Needs manual review</span>;
    if (state.status === "blocked_domain")
      return <span className="text-amber-400">Apply manually (site blocks automation)</span>;
    return <span className="text-red-400">Failed</span>;
  }

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
            {selectedJobs.map((job: any, index: number) => {
              const state = applyStates[index];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TiltCard className="rounded-xl border border-line px-4 py-4 transition-colors duration-300 hover:border-signal/40">
                    <div className="relative flex items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold">
                          {job.title || "Untitled Job"}
                        </h3>
                        <p className="text-sm text-paper-dim">
                          {job.company || "Unknown Company"}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
			{job.posted_relative && (
				<p className="mt-1 font-mono text-[10px] text-paper-dim/40">
				{job.posted_relative}
				</p>
			)
			}                          {job.location && (
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

                        <div className="flex min-w-[7rem] flex-col items-end gap-1">
                          <button
                            onClick={() => handleApply(job, index)}
                            disabled={state?.loading || state?.status === "submitted"}
                            className="glow-signal rounded-full bg-signal px-4 py-2 text-xs font-semibold text-ink transition hover:bg-signal-2 disabled:opacity-50"
                          >
                            {state?.status === "submitted" ? "Applied" : "Apply"}
                          </button>
                          <div className="font-mono text-[10px]">{statusLabel(state)}</div>
                        </div>
                      </div>
                    </div>

                    {state?.warnings && (
                      <p className="mt-2 text-right font-mono text-[10px] text-paper-dim/60">
                        {state.warnings}
                      </p>
                    )}
                  </TiltCard>
                </motion.div>
              );
            })}
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
