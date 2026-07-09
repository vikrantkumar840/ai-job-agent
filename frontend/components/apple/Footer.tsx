"use client";

import { Mail, ArrowUpRight } from "lucide-react";

const product = [
  "Resume Builder",
  "Job Search",
  "Cover Letter",
  "Interview AI",
];

const technologies = [
  "FastAPI",
  "Next.js",
  "LangGraph",
  "Qdrant",
];

const resources = [
  "Documentation",
  "API",
  "Roadmap",
  "Support",
];

export default function Footer() {
  return (
    <footer 
    	id="contact"    	
    	className="mt-10 border-t border-white/10 bg-black/20"
    
    >

      <div className="mx-auto max-w-7xl px-8 py-10">

        <div className="grid gap-12 lg:grid-cols-5">

          {/* Brand */}

          <div className="lg:col-span-2">

            <h2 className="text-3xl font-bold">
              Resu<span className="text-cyan-400">Apply</span>
            </h2>

            <p className="mt-6 max-w-md text-white/60 leading-8">
              AI-powered career platform that helps professionals
              discover jobs, optimize resumes, generate personalized
              cover letters and prepare for interviews using intelligent
              multi-agent workflows.
            </p>

            {/* Social Links */}

            <div className="mt-10 flex gap-4">

              <a
                href="https://github.com/vikrantkumar840"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconButton>
                  GH
                </IconButton>
              </a>

              <a
                href="https://www.linkedin.com/in/vikrant-kumar722/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconButton>
                  in
                </IconButton>
              </a>

              <a
                href="mailto:kumarvikrant722@gmail.com"
              >
                <IconButton>
                  <Mail size={18} />
                </IconButton>
              </a>

            </div>

          </div>

          <Column
            title="Product"
            items={product}
          />

          <Column
            title="Technology"
            items={technologies}
          />

          <Column
            title="Resources"
            items={resources}
          />

        </div>

        <div className="my-12 h-px bg-white/10" />

        <div className="flex flex-col items-center justify-between gap-5 md:flex-row">

          <p className="text-white/40">
            © 2026 AI Job Agent • Built with Next.js, FastAPI,
            LangGraph, Kubernetes and ❤️.
          </p>

          <div className="flex gap-8 text-white/50">

            <a
              href="/privacy"
              className="transition hover:text-cyan-400"
            >
              Privacy
            </a>

            <a
              href="/terms"
              className="transition hover:text-cyan-400"
            >
              Terms
            </a>

            <a
              href="https://status.yourdomain.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition hover:text-cyan-400"
            >
              Status
              <ArrowUpRight size={16} />
            </a>

          </div>

        </div>

      </div>

    </footer>
  );
}

function Column({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div>

      <h3 className="mb-6 text-lg font-semibold">
        {title}
      </h3>

      <div className="space-y-4">

        {items.map((item) => (
          <a
            key={item}
            href="#"
            className="block text-white/55 transition hover:text-cyan-400"
          >
            {item}
          </a>
        ))}

      </div>

    </div>
  );
}

function IconButton({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
      flex
      h-12
      w-12
      items-center
      justify-center
      rounded-xl
      border
      border-white/10
      bg-white/5
      font-semibold
      transition
      hover:border-cyan-400/40
      hover:bg-cyan-500/10
      hover:text-cyan-400
      "
    >
      {children}
    </div>
  );
}
