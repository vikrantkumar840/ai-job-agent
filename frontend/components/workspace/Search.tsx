"use client";

import { useEffect, useState } from "react";
import { searchJobs } from "@/lib/api";

export default function Search() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);

        const workflowRaw = localStorage.getItem("workflow_result");

        if (!workflowRaw) {
          throw new Error(
            "No workflow found. Please upload your resume first."
          );
        }

        const workflow = JSON.parse(workflowRaw);

        if (!workflow.session_id) {
          throw new Error("Missing session_id in workflow.");
        }

        const resumeText = localStorage.getItem("resume_text");

        if (!resumeText) {
          throw new Error("No resume text found.");
        }

        const data = await searchJobs(
          resumeText,
          workflow.session_id
        );

        setJobs(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  if (loading) {
    return (
      <div className="text-white/60">
        Searching jobs...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold">
          Job Search Results
        </h1>

        <p className="text-white/60 mt-2">
          Jobs discovered by the AI during workflow execution.
        </p>
      </div>

      {jobs.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <p className="text-white/60">
            No jobs found.
          </p>
        </div>
      ) : (
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
                <p className="mt-1 text-white/60">
                  📍 {job.location}
                </p>
              )}

              {job.experience && (
                <p className="mt-1 text-white/60">
                  💼 {job.experience}
                </p>
              )}

              {job.salary && (
                <p className="mt-1 text-green-400">
                  💰 {job.salary}
                </p>
              )}

              {job.description && (
                <p className="mt-4 text-white/70 line-clamp-4">
                  {job.description}
                </p>
              )}

              {job.url && (
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-5 rounded-lg bg-cyan-500 px-4 py-2 text-black font-semibold hover:bg-cyan-400 transition"
                >
                  View Job →
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
