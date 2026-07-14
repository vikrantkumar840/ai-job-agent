"use client";

import { useEffect, useState } from "react";

import {
  searchJobs,
  regenerateJobs,
} from "@/lib/api";

import { useAuth } from "@/hooks/useAuth";

export default function Search() {
  const { user } = useAuth();

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState("");

  const [jobsCount, setJobsCount] = useState(25);

  async function loadJobs() {
    try {
      setLoading(true);
      setError("");

      const workflowRaw = localStorage.getItem("workflow_result");

      if (!workflowRaw) {
        throw new Error(
          "Workflow not found. Please upload your resume."
        );
      }

      const workflow = JSON.parse(workflowRaw);

      const resumeText = localStorage.getItem("resume_text");

      if (!resumeText) {
        throw new Error("Resume not found.");
      }

      const response = await searchJobs(
        resumeText,
        workflow.session_id
      );

      setJobs(response || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  async function handleMoreJobs() {
    try {
      if (!user) return;

      setRegenerating(true);
      setError("");

      const workflowRaw =
        localStorage.getItem("workflow_result");

      if (!workflowRaw) {
        throw new Error("Workflow not found.");
      }

      const workflow = JSON.parse(workflowRaw);

      const response = await regenerateJobs({
        user_id: user.id,
        session_id: workflow.session_id,
        jobs_count: jobsCount,
      });

      setJobs(response.jobs || response);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRegenerating(false);
    }
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold">
          Job Search Results
        </h1>

        <p className="mt-2 text-white/60">
          AI matched these jobs using your resume.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

        <h2 className="mb-4 text-xl font-semibold">
          Need More Jobs?
        </h2>

        <p className="mb-4 text-white/60">
          Ask the AI Agent to search for more matching jobs.
        </p>

        <div className="flex items-center gap-4">

          <input
            type="number"
            min={5}
            max={100}
            value={jobsCount}
            onChange={(e) =>
              setJobsCount(Number(e.target.value))
            }
            className="w-40 rounded-xl bg-black/30 p-3"
          />

          <button
            onClick={handleMoreJobs}
            disabled={regenerating}
            className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black hover:bg-cyan-400"
          >
            {regenerating
              ? "Searching..."
              : "Find More Jobs"}
          </button>

        </div>

      </div>

      {loading && (
        <p className="text-white/60">
          Searching jobs...
        </p>
      )}

      {error && (
        <p className="text-red-400">
          {error}
        </p>
      )}

      {!loading && jobs.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <p className="text-white/60">
            No jobs found.
          </p>
        </div>
      )}

      <div className="space-y-5">

        {jobs.map((job: any, index: number) => (

          <div
            key={index}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >

            <h2 className="text-xl font-semibold">
              {job.title || "Untitled Role"}
            </h2>

            <p className="mt-2 text-cyan-400">
              {job.company || "Unknown Company"}
            </p>

            {job.location && (
              <p className="mt-2 text-white/60">
                📍 {job.location}
              </p>
            )}

            {job.salary && (
              <p className="mt-2 text-green-400">
                💰 {job.salary}
              </p>
            )}

            {job.description && (
              <p className="mt-4 line-clamp-4 text-white/70">
                {job.description}
              </p>
            )}

            {job.url && (
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-block rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black hover:bg-cyan-400"
              >
                View Job →
              </a>
            )}

          </div>

        ))}

      </div>

    </div>
  );
}
