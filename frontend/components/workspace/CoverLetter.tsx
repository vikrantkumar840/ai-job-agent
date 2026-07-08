"use client";

import { useEffect, useState } from "react";

export default function CoverLetter() {
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const workflow = localStorage.getItem("workflow_result");

    if (workflow) {
      const data = JSON.parse(workflow);
      setCoverLetter(data.cover_letter || "");
    }

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="text-white">
        Loading Cover Letter...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            AI Cover Letter
          </h1>

          <p className="text-white/60 mt-2">
            Professionally generated cover letter tailored to your selected job.
          </p>
        </div>

        <button
          className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black hover:bg-cyan-400 transition"
          onClick={() => {
            alert("Regenerate Cover Letter - Coming Soon");
          }}
        >
          🔄 Regenerate
        </button>
      </div>

      {/* Content */}
      {!coverLetter ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <p className="text-white/50">
            No cover letter generated yet.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <div className="whitespace-pre-wrap leading-8 text-white/80">
            {coverLetter}
          </div>
        </div>
      )}

    </div>
  );
}
