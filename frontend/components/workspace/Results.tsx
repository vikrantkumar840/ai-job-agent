"use client";

import { useEffect, useState } from "react";

export default function Results() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const workflow = localStorage.getItem("workflow_result");

    if (workflow) {
      setData(JSON.parse(workflow));
    }
  }, []);

  if (!data) {
    return (
      <div className="text-white/50">
        No results found.
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold">
        Agent Results
      </h1>

      <div className="grid grid-cols-3 gap-6">

        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <p className="text-white/60">Jobs Found</p>
          <h2 className="text-3xl font-bold">
            {data.jobs?.length || 0}
          </h2>
        </div>

        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <p className="text-white/60">Ranked Jobs</p>
          <h2 className="text-3xl font-bold">
            {data.ranked_jobs?.length || 0}
          </h2>
        </div>

        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <p className="text-white/60">Selected Jobs</p>
          <h2 className="text-3xl font-bold">
            {data.selected_jobs?.length || 0}
          </h2>
        </div>

      </div>

    </div>
  );
}
