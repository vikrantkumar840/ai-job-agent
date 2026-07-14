"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  uploadResume,
  runOrchestrator,
} from "@/lib/api";

import { useAuth } from "@/hooks/useAuth";

export default function UploadResume() {
  const router = useRouter();

  const { user } = useAuth();

  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);

  const [location, setLocation] = useState("");

  const [role, setRole] = useState("");

  const [experience, setExperience] =
    useState("Entry Level");

  const [skills, setSkills] = useState("");

  const [industry, setIndustry] =
    useState("");

  const [website, setWebsite] =
    useState("LinkedIn");

  const [jobsCount, setJobsCount] =
    useState(25);

  const [loading, setLoading] =
    useState(false);

  const [status, setStatus] =
    useState("");

  const [error, setError] =
    useState("");

  async function handleUpload() {
    if (!user) {
      setError("Please login first.");
      return;
    }

    if (!file) {
      setError("Please upload your resume.");
      return;
    }

    if (!role.trim()) {
      setError("Please enter your preferred role.");
      return;
    }

    if (!location.trim()) {
      setError("Please enter your preferred location.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      setStatus("Uploading resume...");

      const upload = await uploadResume(file);

      localStorage.setItem(
        "resume_text",
        upload.resume_text
      );

      setStatus("Running AI Job Agent...");

      const workflow =
        await runOrchestrator({
          user_id: user.id,

          resume_text: upload.resume_text,

          profile: {},

          preferences: {
            role,
            location,
            experience,
            skills,
            industry,
            website,
            jobs_count: jobsCount,
          },
        });

      localStorage.setItem(
        "workflow_result",
        JSON.stringify(workflow)
      );

      localStorage.setItem(
        "resume_uploaded",
        "true"
      );

      setStatus("Completed.");

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      setFile(null);

      router.push("/dashboard");
    } catch (err: any) {
      setError(
        err.message || "Workflow failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="
        w-full
        max-w-3xl
        rounded-3xl
        border
        border-white/10
        bg-[#0b0d12]
        p-10
      "
    >
      <h1 className="text-3xl font-bold">
        Upload Resume & Configure AI Agent
      </h1>

      <p className="mt-2 text-white/60">
        Upload your resume and tell AI
        what kind of jobs you are
        looking for.
      </p>

      <div className="mt-10 space-y-6">
        {/* Resume */}
        <div>
          <label className="mb-2 block text-sm text-white/70">
            Resume (PDF)
          </label>

          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            onChange={(e) =>
              setFile(
                e.target.files?.[0] || null
              )
            }
            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-white/5
              p-3
            "
          />
        </div>

        {/* Role */}
        <div>
          <label className="mb-2 block text-sm text-white/70">
            Preferred Role
          </label>

          <input
            value={role}
            onChange={(e) =>
              setRole(e.target.value)
            }
            placeholder="DevOps Engineer"
            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-white/5
              p-3
            "
          />
        </div>

        {/* Location */}
        <div>
          <label className="mb-2 block text-sm text-white/70">
            Preferred Location
          </label>

          <input
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
            placeholder="Bangalore"
            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-white/5
              p-3
            "
          />
        </div>

        {/* Experience */}
        <div>
          <label className="mb-2 block text-sm text-white/70">
            Experience Level
          </label>

          <select
            value={experience}
            onChange={(e) =>
              setExperience(e.target.value)
            }
            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-white/5
              p-3
            "
          >
            <option>Internship</option>
            <option>Entry Level</option>
            <option>Associate</option>
            <option>Mid Level</option>
            <option>Senior</option>
          </select>
        </div>

        {/* Skills */}
        <div>
          <label className="mb-2 block text-sm text-white/70">
            Skills
          </label>

          <textarea
            rows={4}
            value={skills}
            onChange={(e) =>
              setSkills(e.target.value)
            }
            placeholder="AWS, Docker, Kubernetes, Terraform, Linux..."
            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-white/5
              p-3
            "
          />
        </div>

        {/* Industry */}
        <div>
          <label className="mb-2 block text-sm text-white/70">
            Industry (Optional)
          </label>

          <input
            value={industry}
            onChange={(e) =>
              setIndustry(e.target.value)
            }
            placeholder="Cloud Computing"
            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-white/5
              p-3
            "
          />
        </div>

        {/* Website */}
        <div>
          <label className="mb-2 block text-sm text-white/70">
            Job Website
          </label>

          <select
            value={website}
            onChange={(e) =>
              setWebsite(e.target.value)
            }
            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-white/5
              p-3
            "
          >
            <option>LinkedIn</option>
            <option>Naukri</option>
            <option>Indeed</option>
          </select>
        </div>

        {/* Number of Jobs */}
        <div>
          <label className="mb-2 block text-sm text-white/70">
            Number of Jobs
          </label>

          <input
            type="number"
            min={5}
            max={100}
            value={jobsCount}
            onChange={(e) =>
              setJobsCount(
                Number(e.target.value)
              )
            }
            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-white/5
              p-3
            "
          />
        </div>
      </div>

      {status && (
        <p className="mt-6 text-cyan-400">
          {status}
        </p>
      )}

      {error && (
        <p className="mt-4 text-red-400">
          {error}
        </p>
      )}

      <button
        onClick={handleUpload}
        disabled={loading}
        className="
          mt-8
          w-full
          rounded-xl
          bg-cyan-400
          py-4
          font-semibold
          text-black
          transition
          hover:scale-[1.01]
          disabled:opacity-50
        "
      >
        {loading
          ? "Running AI Agent..."
          : "🚀 Start AI Agent"}
      </button>
    </div>
  );
}
