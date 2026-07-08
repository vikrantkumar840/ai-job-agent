"use client";

const steps = [
  "Resume Uploaded",
  "Profile Extracted",
  "Jobs Found",
  "Ranked",
  "Resume Generated",
  "Cover Letter Generated",
];

export default function WorkflowStatus() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">

      <h2 className="text-xl font-semibold mb-6">
        Workflow Status
      </h2>

      <div className="space-y-4">

        {steps.map((step) => (
          <div
            key={step}
            className="flex items-center gap-3"
          >
            <div className="h-3 w-3 rounded-full bg-green-400" />

            <span className="text-white/70">
              {step}
            </span>

          </div>
        ))}

      </div>

    </div>
  );
}
