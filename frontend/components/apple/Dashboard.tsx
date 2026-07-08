"use client";

import {
  CheckCircle2,
  Briefcase,
  FileText,
  Mail,
  MessageSquare,
  Sparkles,
} from "lucide-react";

const jobs = [
  {
    title: "Senior DevOps Engineer",
    company: "Amazon",
    score: "96%",
  },
  {
    title: "Cloud Platform Engineer",
    company: "Google",
    score: "92%",
  },
  {
    title: "Platform Engineer",
    company: "Microsoft",
    score: "89%",
  },
];

export default function Dashboard() {
  return (
    <section className="max-w-7xl mx-auto px-8">

      <div className="mb-16">

        <p className="uppercase tracking-[0.35em] text-cyan-400 mb-4">
          AI Workspace
        </p>

        <h2 className="text-6xl font-bold">
          Everything
          <br />
          In One Place.
        </h2>

      </div>

      <div
        className="
        rounded-[36px]
        border
        border-white/10
        bg-white/5
        backdrop-blur-2xl
        p-10
        shadow-[0_0_80px_rgba(34,211,238,.12)]
        "
      >

        {/* Header */}

        <div className="flex items-center justify-between mb-10">

          <h3 className="text-3xl font-semibold">
            AI Dashboard
          </h3>

          <div className="flex items-center gap-3">

            <span className="h-3 w-3 rounded-full bg-green-400 animate-pulse" />

            <span className="text-green-400">
              AI Active
            </span>

          </div>

        </div>

        {/* Stats */}

        <div className="grid md:grid-cols-3 gap-6">

          <Card
            icon={<Briefcase />}
            title="Jobs Found"
            value="20"
          />

          <Card
            icon={<Sparkles />}
            title="ATS Score"
            value="94%"
          />

          <Card
            icon={<FileText />}
            title="Resume Version"
            value="v4"
          />

        </div>

        {/* Progress */}

        <div className="mt-12">

          <div className="flex justify-between mb-3">

            <span className="text-white/70">
              Resume Optimization
            </span>

            <span className="text-cyan-400">
              94%
            </span>

          </div>

          <div className="h-3 rounded-full bg-white/10 overflow-hidden">

            <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" />

          </div>

        </div>

        {/* Status */}

        <div className="grid md:grid-cols-3 gap-5 mt-12">

          <Status
            icon={<CheckCircle2 />}
            title="Resume"
            value="Optimized"
          />

          <Status
            icon={<Mail />}
            title="Cover Letter"
            value="Generated"
          />

          <Status
            icon={<MessageSquare />}
            title="Interview"
            value="Prepared"
          />

        </div>

        {/* Jobs */}

        <div className="mt-14">

          <h4 className="text-2xl font-semibold mb-6">
            Top AI Matches
          </h4>

          <div className="space-y-4">

            {jobs.map((job) => (

              <div
                key={job.title}
                className="
                rounded-2xl
                border
                border-white/10
                bg-black/30
                p-5
                transition-all
                duration-300
                hover:border-cyan-400/40
                hover:bg-cyan-500/5
                hover:-translate-y-1
                "
              >

                <div className="flex items-center justify-between">

                  <div>

                    <h5 className="font-semibold text-lg">
                      {job.title}
                    </h5>

                    <p className="text-white/50">
                      {job.company}
                    </p>

                  </div>

                  <div
                    className="
                    rounded-full
                    bg-cyan-500/15
                    border
                    border-cyan-400/30
                    px-4
                    py-2
                    text-cyan-400
                    font-semibold
                    "
                  >
                    {job.score}
                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </section>
  );
}

function Card({
  icon,
  title,
  value,
}: any) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-6">

      <div className="text-cyan-400 mb-4">
        {icon}
      </div>

      <p className="text-white/50">
        {title}
      </p>

      <h3 className="text-4xl font-bold mt-3">
        {value}
      </h3>

    </div>
  );
}

function Status({
  icon,
  title,
  value,
}: any) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-6">

      <div className="flex items-center gap-3 text-green-400">

        {icon}

        <span>{title}</span>

      </div>

      <h4 className="mt-4 text-xl font-semibold">
        {value}
      </h4>

    </div>
  );
}
