"use client";

export default function JobsPage() {
  return (
    <div className="p-10 text-white">
      <h1 className="text-3xl font-semibold">Jobs Dashboard</h1>
    </div>
  );
}
const apply = async (selectedJobs: any[]) => {
  const res = await runAgent({
    resume_text: "",
    profile: {},
    jobs: [],
    selected_jobs: selectedJobs,
    preferences: {}
  });

  console.log("Applied:", res);
};
