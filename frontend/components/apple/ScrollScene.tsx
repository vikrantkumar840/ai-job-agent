"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Upload,
  UserSearch,
  Search,
  Sparkles,
  FileText,
  Mail,
 MessageSquare,
  CheckCircle2,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { title: "Resume Upload", icon: Upload },
  { title: "Profile Extraction", icon: UserSearch },
  { title: "Semantic Job Search", icon: Search },
  { title: "AI Ranking", icon: Sparkles },
  { title: "Resume Optimization", icon: FileText },
  { title: "Cover Letter", icon: Mail },
  { title: "Interview Prep", icon: MessageSquare },
  { title: "Ready to Apply", icon: CheckCircle2 },
];

export default function ScrollScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=1200",          
	  scrub: 1,
          pin: true,
	  
	  pinSpacing: true,
        },
      })

      .fromTo(
        phoneRef.current,
        {
          scale: 0.75,
          y: 120,
          opacity: 0,
        },
        {
          scale: 1,
          y: 0,
          opacity: 1,
          ease: "power2.out",
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#05060a]  py-24 bg-[#05060a]"  
      >
      <div className="h-screen">
        <div className="max-w-7xl mx-auto h-full px-10 grid lg:grid-cols-2 gap-32 items-center">

          {/* LEFT */}

          <div>

            <p className="uppercase tracking-[0.35em] text-cyan-400 mb-6">
              AI Pipeline
            </p>

            <h2 className="text-6xl font-bold leading-tight">
              One Resume.
              <br />
              Eight AI Agents.
            </h2>

            <p className="mt-8 text-white/60 text-xl leading-9">
              Upload once and let AI search jobs, optimize your resume,
              generate personalized cover letters and prepare you for interviews.
            </p>

            <div className="mt-14 space-y-5">

              {steps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.title}
                    className="flex items-center gap-5"
                  >

                    <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center">

                      <Icon
                        size={22}
                        className="text-cyan-400"
                      />

                    </div>

                    <div>

                      <p className="font-semibold">
                        {step.title}
                      </p>

                      <p className="text-white/40 text-sm">
                        Stage {index + 1}
                      </p>

                    </div>

                  </div>
                );
              })}

            </div>

          </div>

          {/* RIGHT */}

          <div
            ref={phoneRef}
            className="
            rounded-[40px]
            border
            border-white/10
            bg-white/5
            backdrop-blur-xl
            p-8
            shadow-[0_30px_80px_rgba(0,0,0,.45)]
            "
          >

            <div className="flex justify-between items-center mb-10">

              <h3 className="text-2xl font-bold">
                AI Workflow
              </h3>

              <span className="text-green-400">
                ● Active
              </span>

            </div>

            <div className="space-y-4">

              {steps.map((step) => (

                <div
                  key={step.title}
                  className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-black/30
                  px-5
                  py-4
                  transition
                  hover:border-cyan-400/40
                  hover:bg-cyan-500/5
                  "
                >

                  {step.title}

                </div>

              ))}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
