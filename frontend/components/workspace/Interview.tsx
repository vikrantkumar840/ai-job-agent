"use client";

import { useEffect, useState } from "react";

export default function Interview() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const workflow = localStorage.getItem("workflow_result");

    if (workflow) {
      setData(JSON.parse(workflow));
    }
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Interview Prep</h1>

      {!data ? (
        <p className="text-white/50">No data available.</p>
      ) : (
        <div className="space-y-4">
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <h2 className="font-semibold mb-2">Top Questions</h2>
            <p className="text-white/70">
              Ask backend later → generate interview questions per job
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
