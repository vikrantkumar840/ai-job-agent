"use client";

import {
  Cloud,
  Database,
  Boxes,
  ShieldCheck,
  Workflow,
  BrainCircuit,
  Search,
  Server,
  Cpu,
} from "lucide-react";

const technologies = [
  {
    title: "AWS Cloud",
    desc: "EKS • EC2 • S3 • IAM • VPC",
    icon: Cloud,
  },
  {
    title: "Docker + Kubernetes",
    desc: "Production Container Platform",
    icon: Boxes,
  },
  {
    title: "LangGraph Agents",
    desc: "Multi-Agent AI Workflow",
    icon: Workflow,
  },
  {
    title: "FastAPI Backend",
    desc: "High Performance Python APIs",
    icon: Server,
  },
  {
    title: "Vector Search",
    desc: "Qdrant Semantic Matching",
    icon: Search,
  },
  {
    title: "MongoDB + PostgreSQL",
    desc: "Hybrid Storage Layer",
    icon: Database,
  },
  {
    title: "LLM Intelligence",
    desc: "Resume + Cover Letter AI",
    icon: BrainCircuit,
  },
  {
    title: "Enterprise Security",
    desc: "JWT • OAuth • HTTPS",
    icon: ShieldCheck,
  },
];

export default function Tech() {
  return (
    <section   
    	id="technology"
	className="max-w-7xl mx-auto px-8"
    >

      <div className="text-center mb-20">

        <p className="uppercase tracking-[0.35em] text-cyan-400 mb-4">
          Technology
        </p>

        <h2 className="text-6xl font-bold">
          Built for
          <br />
          Modern AI Applications
        </h2>

        <p className="text-white/60 mt-8 max-w-3xl mx-auto text-lg leading-8">
          Enterprise technologies powering intelligent job search,
          resume optimization, semantic matching and AI orchestration.
        </p>

      </div>

      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-7">

        {technologies.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="
              group
              rounded-[28px]
              border
              border-white/10
              bg-white/5
              backdrop-blur-xl
              p-8
              transition-all
              duration-500
              hover:border-cyan-400/30
              hover:bg-cyan-500/5
              hover:-translate-y-2
              "
            >

              <div
                className="
                mb-8
                inline-flex
                rounded-2xl
                bg-cyan-500/10
                p-4
                text-cyan-400
                group-hover:scale-110
                transition
                "
              >
                <Icon size={32} />
              </div>

              <h3 className="text-2xl font-semibold mb-3">
                {item.title}
              </h3>

              <p className="text-white/55 leading-7">
                {item.desc}
              </p>

            </div>
          );
        })}

      </div>

      <div
        className="
        mt-24
        rounded-[36px]
        border
        border-cyan-500/20
        bg-gradient-to-r
        from-cyan-500/10
        to-emerald-500/10
        p-12
        text-center
        "
      >

        <Cpu
          size={54}
          className="mx-auto text-cyan-400 mb-6"
        />

        <h3 className="text-4xl font-bold">
          AI Orchestration Engine
        </h3>

        <p className="text-white/60 max-w-4xl mx-auto mt-6 text-lg leading-8">
          Resume parsing, semantic retrieval, intelligent ranking,
          resume tailoring, cover letter generation and interview
          preparation are orchestrated through a production-ready
          multi-agent workflow.
        </p>

      </div>

    </section>
  );
}
