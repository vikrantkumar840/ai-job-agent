"use client";

import { useState } from "react";
import { searchJobs } from "@/lib/api";

export default function Search() {
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError("");

      // get resume from localStorage (from upload step)
      const resumeText = localStorage.getItem("resume_text");

      if (!resumeText) {
        throw new Error("No resume found. Please upload resume first.");
      }

      const data = await searchJobs(resumeText);

      // backend likely returns array OR wrapped object
      setJobs(data.jobs || data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Search Jobs</h2>

      <button
        onClick={handleSearch}
        disabled={loading}
        className="bg-white text-black px-4 py-2 rounded-lg"
      >
        {loading ? "Searching..." : "Find Matching Jobs"}
      </button>

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      {/* Results */}
      <div className="space-y-3 mt-6">
        {jobs.length === 0 && !loading && (
          <p className="text-white/50">
            No jobs yet. Click search to fetch matches.
          </p>
        )}

        {jobs.map((job, index) => (
          <div
            key={index}
            className="p-4 border border-white/10 rounded-lg bg-white/5"
          >
            <h3 className="font-semibold">
              {job.title || "Untitled Role"}
            </h3>

            <p className="text-white/60 text-sm">
              {job.company || job.organization || "Unknown Company"}
            </p>

            {job.location && (
              <p className="text-white/40 text-xs">
                {job.location}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
