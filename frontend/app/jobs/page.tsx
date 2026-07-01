"use client";

import { useState } from "react";
import { searchJobs } from "@/lib/api";

export default function JobsPage() {
  const [query, setQuery] = useState("devops aws");
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const res = await searchJobs(query);
    setJobs(res);
    setLoading(false);
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold">AI Job Search (Vector)</h1>

      <div className="flex gap-2 mt-4">
        <input
          className="p-2 text-black rounded w-80"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button
          onClick={handleSearch}
          className="bg-blue-600 px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {loading && <p className="mt-4">Searching vector DB...</p>}

      <div className="mt-6 space-y-4">
        {jobs.map((job, i) => (
          <div key={i} className="p-4 bg-gray-900 rounded">
            <h2 className="font-bold">{job.title}</h2>
            <p>{job.company}</p>
            <p className="text-sm text-gray-400">{job.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
