"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { UploadCloud, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";

import {
  uploadResume,
  runOrchestrator,
} from "@/lib/api";

import { useAuth } from "@/hooks/useAuth";

const STEPS = ["Resume", "Preferences", "Review"];

export default function UploadResume() {
  const router = useRouter();
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(0);

  const [file, setFile] = useState<File | null>(null);
  const [location, setLocation] = useState("");
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("Entry Level");
  const [skills, setSkills] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("LinkedIn");
  const [jobsCount, setJobsCount] = useState(25);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  function canContinueFromStep(current: number) {
    if (current === 0) return !!file;
    if (current === 1) return role.trim() !== "" && location.trim() !== "";
    return true;
  }

  function goNext() {
    setError("");
    if (!canContinueFromStep(step)) {
      setError(
        step === 0
          ? "Please upload your resume (PDF) to continue."
          : "Please fill in preferred role and location.",
      );
      return;
    }
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  }

  function goBack() {
    setError("");
    setStep((s) => Math.max(0, s - 1));
  }

  async function handleUpload() {
    if (!user) {
      setError("Please login first.");
      return;
    }
    if (!file) {
      setError("Please upload your resume.");
      return;
    }
    if (!role.trim()) {
      setError("Please enter your preferred role.");
      return;
    }
    if (!location.trim()) {
      setError("Please enter your preferred location.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      setStatus("Uploading resume...");
      const upload = await uploadResume(file);
      localStorage.setItem("resume_text", upload.resume_text);

      setStatus("Running AI Job Agent...");
      const workflow = await runOrchestrator({
        user_id: user.id,
        resume_text: upload.resume_text,
        profile: {},
        preferences: {
          role,
          location,
          experience,
          skills,
          industry,
          website,
          jobs_count: jobsCount,
        },
      });

      localStorage.setItem("workflow_result", JSON.stringify(workflow));
      localStorage.setItem("resume_uploaded", "true");
      setStatus("Completed.");

      if (inputRef.current) inputRef.current.value = "";
      setFile(null);

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Workflow failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-surface glow-signal w-full max-w-2xl rounded-3xl p-8 sm:p-10">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-signal">
        Onboarding
      </p>
      <h1 className="mt-3 font-display text-3xl font-bold">
        Set up your AI agent
      </h1>
      <p className="mt-2 text-paper-dim">
        Three steps. Then the agent runs on its own.
      </p>

      {/* Progress */}
      <div className="mt-8 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-8 w-8 flex-none items-center justify-center rounded-full font-mono text-xs transition-colors duration-300 ${
                i <= step
                  ? "bg-signal text-ink"
                  : "border border-line-strong text-paper-dim/50"
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`hidden text-xs sm:block ${i <= step ? "text-paper" : "text-paper-dim/40"}`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className="h-px flex-1 bg-line" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 min-h-[260px]">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              <label className="mb-3 block text-sm text-paper-dim">
                Resume (PDF only)
              </label>
              <label
                htmlFor="resume-upload"
                className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
                  file
                    ? "border-signal/60 bg-signal/5"
                    : "border-line-strong hover:border-signal/40"
                }`}
              >
                <UploadCloud size={32} className="text-signal" />
                <span className="text-paper">
                  {file ? file.name : "Click to select a PDF"}
                </span>
                <span className="font-mono text-xs text-paper-dim/50">
                  .pdf only, text is extracted automatically
                </span>
              </label>
              <input
                id="resume-upload"
                ref={inputRef}
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
              className="grid gap-5 sm:grid-cols-2"
            >
              <Field label="Preferred role">
                <input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="DevOps Engineer"
                  className="input-field"
                />
              </Field>
              <Field label="Preferred location">
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Bangalore"
                  className="input-field"
                />
              </Field>
              <Field label="Experience level">
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="input-field"
                >
                  <option>Internship</option>
                  <option>Entry Level</option>
                  <option>Associate</option>
                  <option>Mid Level</option>
                  <option>Senior</option>
                </select>
              </Field>
              <Field label="Job website">
                <select
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="input-field"
                >
                  <option>LinkedIn</option>
                  <option>Naukri</option>
                  <option>Indeed</option>
                </select>
              </Field>
              <Field label="Skills" full>
                <textarea
                  rows={3}
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="AWS, Docker, Kubernetes, Terraform, Linux..."
                  className="input-field"
                />
              </Field>
              <Field label="Industry (optional)">
                <input
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="Cloud Computing"
                  className="input-field"
                />
              </Field>
              <Field label="Number of jobs">
                <input
                  type="number"
                  min={5}
                  max={100}
                  value={jobsCount}
                  onChange={(e) => setJobsCount(Number(e.target.value))}
                  className="input-field"
                />
              </Field>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              <SummaryRow label="Resume" value={file?.name || "—"} />
              <SummaryRow label="Role" value={role || "—"} />
              <SummaryRow label="Location" value={location || "—"} />
              <SummaryRow label="Experience" value={experience} />
              <SummaryRow label="Website" value={website} />
              <SummaryRow label="Jobs to fetch" value={String(jobsCount)} />

              {status && (
                <p className="flex items-center gap-2 pt-3 font-mono text-sm text-ok">
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  {status}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <p className="mt-4 font-mono text-sm text-red-400">{error}</p>
      )}

      <div className="mt-8 flex gap-3">
        {step > 0 && (
          <button
            onClick={goBack}
            disabled={loading}
            className="flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 text-sm transition hover:bg-white/5 disabled:opacity-40"
          >
            <ArrowLeft size={16} /> Back
          </button>
        )}

        {step < STEPS.length - 1 ? (
          <button
            onClick={goNext}
            className="glow-signal ml-auto flex items-center gap-2 rounded-full bg-signal px-7 py-3 font-semibold text-ink transition hover:bg-signal-2"
          >
            Continue <ArrowRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleUpload}
            disabled={loading}
            className="glow-signal ml-auto flex items-center gap-2 rounded-full bg-signal px-7 py-3 font-semibold text-ink transition hover:bg-signal-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Running agent…
              </>
            ) : (
              "Start AI agent"
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  full = false,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="mb-2 block text-sm text-paper-dim">{label}</label>
      {children}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-line px-4 py-3">
      <span className="text-sm text-paper-dim">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
