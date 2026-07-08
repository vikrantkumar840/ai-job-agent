"use client";

import { useEffect, useState } from "react";
import { getResumeVersions } from "@/lib/api";

export default function Resume() {
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState<any>(null);
  const [error, setError] = useState("");
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    loadResume();
  }, []);

  async function loadResume() {
    try {
      setLoading(true);

      const workflow = localStorage.getItem("workflow_result");

      if (!workflow) {
        throw new Error("Workflow data not found.");
      }

      const data = JSON.parse(workflow);

      const userId = data.user_id;
      const sessionId = data.session_id;

      if (!userId || !sessionId) {
        throw new Error("Missing user or session information.");
      }

      const versions = await getResumeVersions(
        userId,
        sessionId
      );

      if (!versions.length) {
        throw new Error("No resume versions found.");
      }

      const latest = versions[versions.length - 1];

      setResume(JSON.parse(latest.resume));
      setError("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegenerate() {
    try {
      setRegenerating(true);

      alert(
        "Resume regeneration API will be connected in the next step."
      );

      // Next step:
      // await regenerateResume(...)
      // await loadResume();

    } finally {
      setRegenerating(false);
    }
  }

  if (loading) {
    return (
      <div className="text-white">
        Loading AI Resume...
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

      {/* Header */}
      <div className="flex items-start justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            AI Optimized Resume
          </h1>

          <p className="text-white/60 mt-2">
            Resume generated specifically for the selected job.
          </p>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black hover:bg-cyan-400 transition disabled:opacity-50"
        >
          {regenerating
            ? "Regenerating..."
            : "🔄 Regenerate Resume"}
        </button>

      </div>

      {/* Summary */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold mb-3">
          Professional Summary
        </h2>

        <p className="text-white/80 leading-7">
          {resume.summary}
        </p>
      </div>

      {/* Skills */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold mb-4">
          Skills
        </h2>

        <div className="flex flex-wrap gap-3">
          {resume.skills?.map(
            (skill: string, index: number) => (
              <span
                key={index}
                className="rounded-full border border-cyan-400/30 bg-cyan-500/20 px-4 py-2 text-sm"
              >
                {skill}
              </span>
            )
          )}
        </div>
      </div>

      {/* Tailored Points */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold mb-4">
          Tailored Resume Points
        </h2>

        <ul className="space-y-3">
          {resume.tailored_points?.map(
            (point: string, index: number) => (
              <li
                key={index}
                className="border-l-2 border-cyan-400 pl-4 text-white/80"
              >
                {point}
              </li>
            )
          )}
        </ul>
      </div>

      {/* Recommendation */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold mb-3">
          AI Recommendation
        </h2>

        <p className="text-white/80 leading-7">
          {resume.recommendation}
        </p>
      </div>

    </div>
  );
}
