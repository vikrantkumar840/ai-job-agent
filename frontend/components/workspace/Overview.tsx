"use client";

interface OverviewProps {
  setActive: (tab: string) => void;
  data?: any;
}

export default function Overview({
  setActive,
  data,
}: OverviewProps) {
  const rankedJobs = data?.ranked_jobs ?? [];
  const selectedJobs = data?.selected_jobs ?? [];
  console.log("===== OVERVIEW DATA =====");
  console.log(data);
  console.log(selectedJobs);

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-white">
          AI Application Summary
        </h1>

        <p className="text-white/60 mt-2">
          Your resume has been analyzed and the AI workflow has completed.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">

        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <p className="text-white/60 text-sm">Ranked Jobs</p>

          <h2 className="text-4xl font-bold mt-3">
            {rankedJobs.length}
          </h2>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <p className="text-white/60 text-sm">Selected Jobs</p>

          <h2 className="text-4xl font-bold mt-3">
            {selectedJobs.length}
          </h2>
        </div>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <p className="text-white/60 text-sm">Status</p>

          <h2 className="text-green-400 text-xl mt-3">
            Completed
          </h2>
        </div>

      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

        <h2 className="text-xl font-semibold mb-4">
          Top Matching Jobs
        </h2>

        {selectedJobs.length === 0 ? (
          <p className="text-white/50">
            No jobs selected.
          </p>
        ) : (
          <div className="space-y-4">
            {selectedJobs.map((job: any, index: number) => (
              <div
                key={index}
                className="border border-white/10 rounded-xl p-4"
              >
                <h3 className="font-semibold text-lg">
                  {job.title || "Untitled Job"}
                </h3>

                <p className="text-white/60">
                  {job.company || "Unknown Company"}
                </p>

                <p className="text-sm text-cyan-400 mt-2">
                  {job.location || ""}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>

      <button
        onClick={() => setActive("Resume")}
        className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 transition"
      >
        View AI Resume →
      </button>

    </div>
  );
}
