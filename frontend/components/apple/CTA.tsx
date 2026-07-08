"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CTA() {
  const router = useRouter();

  return (
    <section className="max-w-7xl mx-auto px-8">

      <div
        className="
        relative
        overflow-hidden
        rounded-[40px]
        border
        border-cyan-500/20
        bg-gradient-to-br
        from-cyan-500/10
        via-white/5
        to-emerald-500/10
        backdrop-blur-3xl
        p-20
        "
      >

        {/* Glow */}

        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-cyan-500/20 blur-[140px]" />

        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-emerald-500/20 blur-[140px]" />

        <div className="relative z-10 text-center">

          <div className="inline-flex items-center gap-3 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-5 py-2 text-cyan-300">

            <Sparkles size={18} />

            Production Ready AI Job Platform

          </div>

          <h2 className="mt-10 text-6xl font-bold leading-tight">

            Your Next Career
            <br />
            Starts Here.

          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-white/60">

            Upload your resume once.

            <br />

            Let AI search jobs, optimize your resume,
            generate personalized cover letters,
            and prepare you for interviews automatically.

          </p>

          <div className="mt-14 flex flex-wrap justify-center gap-6">

            <button
              onClick={() => router.push("/workflow")}
              className="
              flex
              items-center
              gap-3
              rounded-2xl
              bg-gradient-to-r
              from-cyan-400
              to-emerald-400
              px-8
              py-4
              text-lg
              font-semibold
              text-black
              transition
              hover:scale-105
              "
            >

              Start Your Journey

              <ArrowRight size={20} />

            </button>

            <button
              onClick={() => router.push("/dashboard")}
              className="
              rounded-2xl
              border
              border-white/10
              bg-white/5
              px-8
              py-4
              text-lg
              transition
              hover:bg-white/10
              "
            >

              Explore Dashboard

            </button>

          </div>

          <div className="mt-16 grid grid-cols-2 gap-10 md:grid-cols-4">

            <Metric
              value="20+"
              label="Jobs / Search"
            />

            <Metric
              value="6"
              label="AI Agents"
            />

            <Metric
              value="94%"
              label="ATS Score"
            />

            <Metric
              value="<60s"
              label="Workflow Time"
            />

          </div>

        </div>

      </div>

    </section>
  );
}

function Metric({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div>

      <h3 className="text-4xl font-bold text-cyan-400">
        {value}
      </h3>

      <p className="mt-2 text-white/55">
        {label}
      </p>

    </div>
  );
}
