"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, Loader2, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import {
  previewAutoApply,
  confirmAutoApply,
  rejectAutoApply,
  autoApplyScreenshotUrl,
} from "@/lib/api";

type Preview = {
  auto_apply_id: number;
  status: string;
  ats_type: string;
  field_mapping: string | null;
  warnings: string | null;
  screenshot_url: string | null;
};

export default function AutoApply() {
  const { user } = useAuth();
  const [jobUrl, setJobUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [error, setError] = useState("");
  const [finalStatus, setFinalStatus] = useState<string | null>(null);

  function profilePayload() {
    return {
      full_name: user?.full_name || "",
      email: user?.email || "",
      resume_path: localStorage.getItem("resume_path") || "",
      location: "",
      linkedin_url: "",
    };
  }

  async function handlePreview() {
    setError("");
    setPreview(null);
    setFinalStatus(null);

    if (!jobUrl.trim()) {
      setError("Paste a job posting URL first.");
      return;
    }

    setLoading(true);
    try {
      const res = await previewAutoApply({
        job_url: jobUrl.trim(),
        ...profilePayload(),
      });
      setPreview(res);
    } catch (err: any) {
      setError(err.message || "Preview failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm() {
    if (!preview) return;
    setLoading(true);
    try {
      const res = await confirmAutoApply(preview.auto_apply_id, profilePayload());
      setFinalStatus(res.status);
    } catch (err: any) {
      setError(err.message || "Submit failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReject() {
    if (!preview) return;
    await rejectAutoApply(preview.auto_apply_id);
    setPreview(null);
    setFinalStatus("rejected");
  }

  let fieldMapping: Record<string, string> = {};
  try {
    fieldMapping = preview?.field_mapping ? JSON.parse(preview.field_mapping) : {};
  } catch {
    fieldMapping = {};
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Auto Apply</h1>
        <p className="mt-2 text-paper-dim">
          Paste a job posting URL. The agent fills the form and shows you
          exactly what it did — nothing is submitted until you confirm.
        </p>
      </div>

      <div className="glass-surface rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-line-strong bg-ink/40 px-4 py-3">
            <Link2 size={18} className="text-signal" />
            <input
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://boards.greenhouse.io/company/jobs/12345"
              className="w-full bg-transparent text-sm outline-none placeholder:text-paper-dim/40"
            />
          </div>
          <button
            onClick={handlePreview}
            disabled={loading}
            className="glow-signal flex items-center justify-center gap-2 rounded-xl bg-signal px-6 py-3 font-semibold text-ink transition hover:bg-signal-2 disabled:opacity-60"
          >
            {loading && !preview ? (
              <Loader2 size={16} className="animate-spin" />
            ) : null}
            Preview fill
          </button>
        </div>
        <p className="mt-3 font-mono text-[11px] text-paper-dim/40">
          LinkedIn and Indeed job URLs are intentionally not supported here —
          see why in the docs. Company career pages, Greenhouse and Lever
          links work best.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-400">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      <AnimatePresence>
        {preview && !finalStatus && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass-surface rounded-2xl p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">
                Review before submitting
              </h2>
              <span className="rounded-full border border-line-strong px-3 py-1 font-mono text-xs uppercase tracking-[0.15em] text-signal">
                {preview.ats_type}
              </span>
            </div>

            {preview.screenshot_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={autoApplyScreenshotUrl(preview.auto_apply_id)}
                alt="Filled application preview"
                className="mb-5 w-full rounded-xl border border-line"
              />
            )}

            <div className="space-y-2">
              {Object.entries(fieldMapping).map(([field, value]) => (
                <div
                  key={field}
                  className="flex items-center justify-between rounded-lg border border-line px-4 py-2.5 text-sm"
                >
                  <span className="font-mono text-paper-dim/60">{field}</span>
                  <span className="max-w-[60%] truncate text-paper">
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>

            {preview.warnings && (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-signal/30 bg-signal/5 p-3 text-sm text-paper-dim">
                <AlertTriangle size={16} className="mt-0.5 flex-none text-signal" />
                {preview.warnings}
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleReject}
                className="flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 text-sm transition hover:bg-white/5"
              >
                <XCircle size={16} /> Discard
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="glow-signal ml-auto flex items-center gap-2 rounded-full bg-signal px-7 py-3 font-semibold text-ink transition hover:bg-signal-2 disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={16} />
                )}
                Confirm & submit (1 credit)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {finalStatus && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`glass-surface rounded-2xl p-6 text-center ${
            finalStatus === "submitted" ? "text-ok" : "text-paper-dim"
          }`}
        >
          {finalStatus === "submitted"
            ? "Application submitted."
            : finalStatus === "rejected"
              ? "Discarded — nothing was sent."
              : `Status: ${finalStatus}`}
        </motion.div>
      )}
    </div>
  );
}
