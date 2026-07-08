"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  uploadResume,
  runOrchestrator,
} from "@/lib/api";

export default function UploadResume() {
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);

  const [location, setLocation] = useState("");
  const [department, setDepartment] = useState("");
  const [experience, setExperience] = useState("Entry Level");
  const [website, setWebsite] = useState("LinkedIn");
  const [jobsCount, setJobsCount] = useState(10);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function handleUpload() {
    if (!file) {
      setError("Please upload a resume.");
      return;
    }

    if (!location.trim()) {
      setError("Please enter preferred location.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      setStatus("Uploading Resume...");

      const upload = await uploadResume(file);

      localStorage.setItem(
        "resume_text",
        upload.resume_text
      );

      localStorage.removeItem("workflow_result");

      setStatus("Searching Jobs...");

      const workflow = await runOrchestrator({
	user_id: 2,        
	resume_text: upload.resume_text,
        profile: {},
        preferences: {
          location,
          department,
          experience,
          website,
          jobs_count: jobsCount,
        },
      });

      console.log("===== WORKFLOW RESPONSE =====");
      console.log(workflow);

      localStorage.setItem(
        "workflow_result",
        JSON.stringify(workflow)
      );

      localStorage.setItem(
        "resume_uploaded",
        "true"
      );

      setStatus("Completed");

      if (inputRef.current) {
        inputRef.current.value = "";
      }

      setFile(null);

      router.replace("/dashboard");
    } catch (err: any) {
      setError(err.message || "Workflow failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-[#0b0d12] p-10">

      <h1 className="text-3xl font-bold">
        Upload Resume & Configure Search
      </h1>

      <p className="mt-2 text-white/60">
        Upload your resume and tell the AI exactly what jobs you want.
      </p>

      <div className="mt-8 space-y-6">

        <div>
          <label className="text-sm text-white/70">
            Resume (PDF)
          </label>

          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            onChange={(e) =>
              setFile(e.target.files?.[0] || null)
            }
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 p-3"
          />
        </div>

        <div>
          <label className="text-sm text-white/70">
            Preferred Location
          </label>

          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Bangalore"
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 p-3"
          />
        </div>

        <div>
          <label className="text-sm text-white/70">
            Department / Role
          </label>

          <input
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
	    placeholder="Leave blank to auto detect from resume"            
	    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 p-3"
          />
        </div>

        <div>
          <label className="text-sm text-white/70">
            Experience
          </label>

          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 p-3"
          >
            <option>Internship</option>
            <option>Entry Level</option>
            <option>Associate</option>
            <option>Mid Level</option>
            <option>Senior</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-white/70">
            Preferred Website
          </label>

          <select
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 p-3"
          >
            <option>LinkedIn</option>
            <option>Naukri</option>
            <option>Indeed</option>
            <option>Foundit</option>
            <option>Glassdoor</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-white/70">
            Number of Jobs
          </label>

          <select
            value={jobsCount}
            onChange={(e) =>
              setJobsCount(Number(e.target.value))
            }
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 p-3"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>

      </div>

      {status && (
        <p className="mt-6 text-cyan-400">
          {status}
        </p>
      )}

      {error && (
        <p className="mt-6 text-red-400">
          {error}
        </p>
      )}

      <button
        onClick={handleUpload}
        disabled={loading}
        className="mt-8 w-full rounded-xl bg-cyan-500 py-4 text-lg font-semibold text-black hover:bg-cyan-400 transition"
      >
        {loading ? "AI Agent Running..." : "🚀 Start AI Agent"}
      </button>

    </div>
  );
}
